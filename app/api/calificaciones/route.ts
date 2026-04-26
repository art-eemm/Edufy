import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No autorizado. Falta el token." },
        { status: 401 }
      )
    }

    const token = authHeader.split(" ")[1]

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json(
        { error: "Token inválido o expirado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id_curso, estrellas, comentario } = body

    if (!id_curso || !estrellas || estrellas < 1 || estrellas > 5) {
      return NextResponse.json(
        { error: "Datos inválidos. Verifica el curso y las estrellas (1-5)." },
        { status: 400 }
      )
    }

    const { error: insertError } = await supabaseAdmin
      .from("calificaciones")
      .insert({
        id_curso: id_curso,
        id_usuario: user.id,
        estrellas: estrellas,
        comentario: comentario || "",
      })

    if (insertError) {
      console.error("Error al insertar calificación:", insertError)
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Ya has calificado este curso anteriormente." },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: "Error al guardar la calificación en la base de datos." },
        { status: 500 }
      )
    }

    // 5. Respuesta de éxito
    return NextResponse.json(
      { message: "Calificación guardada exitosamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error crítico en la API de calificaciones:", error)
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la calificación." },
      { status: 500 }
    )
  }
}
