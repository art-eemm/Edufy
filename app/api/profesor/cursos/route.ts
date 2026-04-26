import { NextResponse } from "next/server"
import { getUserFromToken, hasRole } from "@/lib/auth"
import { supabaseClient } from "@/lib/supabaseClient"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

//* OBTENEMOS TODOS LOS CURSOS DISPONIBLES (VISTA PARA ALUMNOS)
export async function GET() {
  try {
    const { data, error } = await supabaseClient
      .from("cursos")
      .select(
        `
            id_curso,
            nombre,
            descripcion,
            fecha_creacion,
            perfiles (
                nombre_completo
            )
        `
      )
      .eq("estatus", 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

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

    // EXTRAEMOS LA DATA y agregamos .select()
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
      .select() // <-- MUY IMPORTANTE: Le dice a Supabase que te devuelva el registro creado
      .single()

    if (cursoError) {
      return NextResponse.json({ error: cursoError.message }, { status: 500 })
    }

    //* RESPUESTA EXITOSA (Devolvemos el curso completo en lugar de solo el mensaje)
    return NextResponse.json(cursoCreado, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el curso" },
      { status: 500 }
    )
  }
}
