export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getUserFromToken } from "@/lib/auth"

export async function POST(request: Request, context: any) {
  try {
    // 1. Resolución segura de parámetros (evita errores en Next.js 14/15)
    const params = await Promise.resolve(context.params)
    const id_video = params.id

    const user = await getUserFromToken(request)
    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    // 2. Obtener la información del video para saber a qué curso pertenece
    const { data: video, error: videoError } = await supabaseAdmin
      .from("videos")
      .select("id_curso")
      .eq("id_video", id_video)
      .single()

    // --- SOLUCIÓN AL ERROR DE BUILD ---
    // Si el video no existe, detenemos la ejecución aquí
    if (videoError || !video) {
      return NextResponse.json(
        { error: "Video no encontrado" },
        { status: 404 }
      )
    }

    // 3. Verificar si el usuario realmente está inscrito en el curso de ese video
    // Ahora TypeScript sabe que 'video' NO es null
    const { data: inscripcion, error: insError } = await supabaseAdmin
      .from("inscripciones")
      .select("id_inscripcion")
      .eq("id_usuario", user.id)
      .eq("id_curso", video.id_curso)
      .maybeSingle()

    if (insError || !inscripcion) {
      return NextResponse.json(
        { error: "No estás inscrito en este curso" },
        { status: 403 }
      )
    }

    // 4. Marcar el video como visto (o actualizar progreso)
    const { error: upsertError } = await supabaseAdmin
      .from("progreso_videos")
      .upsert(
        {
          id_usuario: user.id,
          id_video: parseInt(id_video as string),
          visto: true,
          fecha_visto: new Date().toISOString(),
        },
        {
          onConflict: "id_usuario, id_video",
        }
      )

    if (upsertError) throw upsertError

    return NextResponse.json(
      { message: "Progreso actualizado" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error(
      "Error al actualizar progreso del video:",
      error.message || error
    )
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
