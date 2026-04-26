export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getUserFromToken, hasRole } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user || !(await hasRole(user.id, "profesor"))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await request.json()
    const { id_curso, titulo, duracion, url_video } = body

    if (!id_curso || !titulo || !url_video) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios para registrar el video" },
        { status: 400 }
      )
    }

    const { data: videosActuales } = await supabaseAdmin
      .from("videos")
      .select("orden")
      .eq("id_curso", id_curso)
      .order("orden", { ascending: false })
      .limit(1)

    const nuevoOrden =
      videosActuales && videosActuales.length > 0
        ? videosActuales[0].orden + 1
        : 1

    // 2. Guardamos el registro en la base de datos
    const { data: nuevoVideo, error: dbError } = await supabaseAdmin
      .from("videos")
      .insert({
        id_curso: parseInt(id_curso as string),
        titulo: titulo,
        url_video: url_video,
        duracion: duracion || 0,
        orden: nuevoOrden,
      })
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json(
      { message: "Registro exitoso", video: nuevoVideo },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error al registrar video:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
