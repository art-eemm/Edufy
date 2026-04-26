export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getUserFromToken, hasRole } from "@/lib/auth"

//* OBTENER TODOS LOS CURSOS
export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user || !(await hasRole(user.id, "admin"))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { data: cursos, error } = await supabaseAdmin
      .from("cursos")
      .select(
        `
        id_curso,
        nombre,
        descripcion,
        fecha_creacion,
        estatus,
        perfiles:id_profesor (
          nombre_completo
        )
      `
      )
      .order("fecha_creacion", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(cursos)
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

//* ACTIVAR O DESACTIVAR CURSO
export async function PUT(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user || !(await hasRole(user.id, "admin"))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { id_curso, estatus } = await request.json()

    const { error } = await supabaseAdmin
      .from("cursos")
      .update({ estatus })
      .eq("id_curso", id_curso)

    if (error) throw error

    return NextResponse.json({ message: "Curso actualizado correctamente" })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar curso" },
      { status: 500 }
    )
  }
}
