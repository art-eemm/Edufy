import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getUserFromToken } from "@/lib/auth"

export async function GET(request: Request, context: any) {
  try {
    const params = await context.params
    const id = params.id

    const { data, error } = await supabaseAdmin
      .from("cursos")
      .select("*")
      .eq("id_curso", id)
      .single() // single() asegura que devuelva un objeto y no un array

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: "Error al cargar la información del curso" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, context: any) {
  try {
    const user = await getUserFromToken(request)
    if (!user)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })

    const params = await context.params
    const id = params.id
    const body = await request.json()

    const { error } = await supabaseAdmin
      .from("cursos")
      .update({
        nombre: body.nombre,
        descripcion: body.descripcion,
        estatus: body.estatus,
      })
      .eq("id_curso", id)
      .eq("id_profesor", user.id) // Seguridad: solo quien lo creó puede editarlo

    if (error) throw error

    return NextResponse.json({ message: "Curso actualizado" })
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 })
  }
}
