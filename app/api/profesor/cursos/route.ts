import { NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from("cursos")
      .select("*")
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
