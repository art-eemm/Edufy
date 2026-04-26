import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getUserFromToken } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from("calificaciones")
      .select(
        `
                id,
                estrellas,
                comentario,
                fecha,
                perfiles ( nombre_completo )
            `
      )
      .eq("id_curso", id)
      .order("fecha", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al obtener calificaciones:", error)
    return NextResponse.json(
      { error: "Error al obtener calificaciones del curso" },
      { status: 500 }
    )
  }
}
