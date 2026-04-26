export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getUserFromToken, hasRole } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const isAdmin = await hasRole(user.id, "admin")
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { count: totalUsuarios } = await supabaseAdmin
      .from("perfiles")
      .select("*", { count: "exact", head: true })
    const { count: totalCursos } = await supabaseAdmin
      .from("cursos")
      .select("*", { count: "exact", head: true })
    const { count: totalInscripciones } = await supabaseAdmin
      .from("inscripciones")
      .select("*", { count: "exact", head: true })
    const { count: totalProfesores } = await supabaseAdmin
      .from("perfiles")
      .select("*", { count: "exact", head: true })
      .eq("rol", 3)

    const { data: cursosData } = await supabaseAdmin
      .from("cursos")
      .select("id_curso, nombre")
    const { data: inscripcionesData } = await supabaseAdmin
      .from("inscripciones")
      .select("id_curso")

    let topCursos: any[] = []

    if (cursosData && inscripcionesData) {
      const conteos: Record<number, number> = {}

      inscripcionesData.forEach((ins) => {
        conteos[ins.id_curso] = (conteos[ins.id_curso] || 0) + 1
      })

      topCursos = cursosData
        .map((curso) => ({
          id_curso: curso.id_curso,
          nombre: curso.nombre,
          total_inscripciones: conteos[curso.id_curso] || 0,
        }))
        .filter((c) => c.total_inscripciones > 0)
        .sort((a, b) => b.total_inscripciones - a.total_inscripciones)
        .slice(0, 5)
    }

    return NextResponse.json({
      totalUsuarios: totalUsuarios || 0,
      totalCursos: totalCursos || 0,
      totalInscripciones: totalInscripciones || 0,
      totalProfesores: totalProfesores || 0,
      topCursos: topCursos,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas de admin:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
