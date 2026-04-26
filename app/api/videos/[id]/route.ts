export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getUserFromToken, hasRole } from "@/lib/auth"

// ACTUALIZAR TÍTULO DEL VIDEO
export async function PUT(request: Request, context: any) {
  try {
    const params = await Promise.resolve(context.params)
    const id_video = params.id

    const user = await getUserFromToken(request)
    if (!user)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const isAdmin = await hasRole(user.id, "admin")
    const isProfesor = await hasRole(user.id, "profesor")

    if (!isAdmin && !isProfesor) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const body = await request.json()
    const { titulo } = body

    if (!titulo)
      return NextResponse.json(
        { error: "El título es requerido" },
        { status: 400 }
      )

    const { error } = await supabaseAdmin
      .from("videos")
      .update({ titulo: titulo })
      .eq("id_video", id_video)

    if (error) {
      console.error("Error de Supabase:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { message: "Lección actualizada" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error(
      "Error catastrófico en PUT /api/videos/[id]:",
      error.message || error
    )
    return NextResponse.json(
      { error: "Error interno del servidor al actualizar" },
      { status: 500 }
    )
  }
}

// ELIMINAR VIDEO
export async function DELETE(request: Request, context: any) {
  try {
    const params = await Promise.resolve(context.params)
    const id_video = params.id

    const user = await getUserFromToken(request)
    if (!user)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const isAdmin = await hasRole(user.id, "admin")
    const isProfesor = await hasRole(user.id, "profesor")

    if (!isAdmin && !isProfesor)
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })

    const { data: video } = await supabaseAdmin
      .from("videos")
      .select("url_video")
      .eq("id_video", id_video)
      .single()
    if (video) {
      const fileName = video.url_video.split("/").pop()
      if (fileName)
        await supabaseAdmin.storage.from("videos").remove([fileName])
    }

    const { error } = await supabaseAdmin
      .from("videos")
      .delete()
      .eq("id_video", id_video)

    if (error) {
      console.error("Error al borrar de Supabase:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "Video eliminado" }, { status: 200 })
  } catch (error: any) {
    console.error(
      "Error catastrófico en DELETE /api/videos/[id]:",
      error.message || error
    )
    return NextResponse.json(
      { error: "Error al eliminar el video" },
      { status: 500 }
    )
  }
}
