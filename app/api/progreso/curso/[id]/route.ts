export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getUserFromToken } from "@/lib/auth"

export async function GET(request: Request, context: any) {
  try {
    const params = await Promise.resolve(context.params)
    const id_curso = params.id

    const user = await getUserFromToken(request)
    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const { data: videos, error: videosError } = await supabaseAdmin
      .from("videos")
      .select("id_video")
      .eq("id_curso", id_curso)

    if (videosError) throw videosError

    if (!videos || videos.length === 0) {
      return NextResponse.json({
        total: 0,
        completados: 0,
        porcentaje: 0,
      })
    }

    const idsVideosCurso = videos.map((v) => v.id_video)

    const { data: vistos, error: vistosError } = await supabaseAdmin
      .from("progreso_videos")
      .select("id_video")
      .eq("id_usuario", user.id)
      .eq("visto", true)
      .in("id_video", idsVideosCurso)

    if (vistosError) throw vistosError

    const total = videos.length
    const completados = vistos ? vistos.length : 0
    const porcentaje = Math.round((completados / total) * 100)

    return NextResponse.json({
      total,
      completados,
      porcentaje,
    })
  } catch (error: any) {
    console.error("Error al calcular progreso:", error.message || error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
