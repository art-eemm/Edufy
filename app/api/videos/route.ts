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

    const contentType = request.headers.get("content-type") || ""
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "El formato de envío debe ser multipart/form-data" },
        { status: 400 }
      )
    }

    const formData = await request.formData()

    const id_curso = formData.get("id_curso")
    const titulo = formData.get("titulo")
    const duracionStr = formData.get("duracion")
    const videoFile = formData.get("video") as File | null

    if (!id_curso || id_curso === "undefined") {
      return NextResponse.json(
        { error: "Error interno: El ID del curso no llegó a la API" },
        { status: 400 }
      )
    }
    if (!titulo) {
      return NextResponse.json(
        { error: "Falta el título de la lección" },
        { status: 400 }
      )
    }
    if (!videoFile || videoFile.size === 0) {
      return NextResponse.json(
        { error: "El archivo de video está vacío o no se adjuntó" },
        { status: 400 }
      )
    }

    const duracion = parseInt(duracionStr as string) || 0

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

    const fileExt = videoFile.name.split(".").pop()
    const fileName = `curso_${id_curso}_${Date.now()}.${fileExt}`

    const arrayBuffer = await videoFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabaseAdmin.storage
      .from("videos")
      .upload(fileName, buffer, {
        contentType: videoFile.type,
        upsert: true,
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabaseAdmin.storage
      .from("videos")
      .getPublicUrl(fileName)

    const { data: nuevoVideo, error: dbError } = await supabaseAdmin
      .from("videos")
      .insert({
        id_curso: parseInt(id_curso as string),
        titulo: titulo as string,
        url_video: urlData.publicUrl,
        duracion,
        orden: nuevoOrden,
      })
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json(
      { message: "Video subido", video: nuevoVideo },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error catastrófico al subir video:", error)
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el archivo" },
      { status: 500 }
    )
  }
}
