import { NextResponse } from "next/server"
import { getUserFromToken, hasRole } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

//* OBTENEMOS TODOS LOS CURSOS DEL PROFESOR LOGUEADO (Activos e Inactivos)
export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("cursos")
      .select(
        `
          id_curso,
          nombre,
          descripcion,
          fecha_creacion,
          estatus
      `
      )
      .eq("id_profesor", user.id)
      .order("fecha_creacion", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los cursos" },
      { status: 500 }
    )
  }
}

//* CREAR UN NUEVO CURSO (VISTA PARA PROFESORES)
export async function POST(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      )
    }

    const esMaestro = await hasRole(user.id, "profesor")
    if (!esMaestro) {
      return NextResponse.json(
        { error: "Solo los profesores pueden crear cursos" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { nombre, descripcion, estatus } = body

    if (!nombre || !descripcion) {
      return NextResponse.json(
        { error: "Nombre y descripción son obligatorios" },
        { status: 400 }
      )
    }

    const { data: cursoCreado, error: cursoError } = await supabaseAdmin
      .from("cursos")
      .insert([
        {
          nombre: nombre,
          descripcion: descripcion,
          id_profesor: user.id,
          estatus: estatus !== undefined ? estatus : 1,
        },
      ])
      .select()
      .single()

    if (cursoError) throw cursoError

    return NextResponse.json(cursoCreado, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el curso" },
      { status: 500 }
    )
  }
}
