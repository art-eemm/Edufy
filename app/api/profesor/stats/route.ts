export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getUserFromToken, hasRole } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user)
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })

    const isProfesor = await hasRole(user.id, "profesor")
    if (!isProfesor)
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })

    const { data: misCursos } = await supabaseAdmin
      .from("cursos")
      .select("id_curso, nombre, estatus, fecha_creacion")
      .eq("id_profesor", user.id)

    const totalCursos = misCursos?.length || 0
    const idsCursos = misCursos?.map((c) => c.id_curso) || []

    let totalEstudiantes = 0
    let inscripcionesData: any[] = []
    let promedioGlobal = 0

    if (idsCursos.length > 0) {
      const { data: insc } = await supabaseAdmin
        .from("inscripciones")
        .select("id_curso")
        .in("id_curso", idsCursos)

      inscripcionesData = insc || []
      totalEstudiantes = inscripcionesData.length

      const { data: calif } = await supabaseAdmin
        .from("calificaciones")
        .select("estrellas")
        .in("id_curso", idsCursos)

      if (calif && calif.length > 0) {
        const suma = calif.reduce((acc, curr) => acc + curr.estrellas, 0)
        promedioGlobal = Number((suma / calif.length).toFixed(1))
      }
    }

    const conteosInscripciones: Record<number, number> = {}
    inscripcionesData.forEach((ins) => {
      conteosInscripciones[ins.id_curso] =
        (conteosInscripciones[ins.id_curso] || 0) + 1
    })

    const cursosRecientes = (misCursos || [])
      .map((c) => ({
        id_curso: c.id_curso,
        nombre: c.nombre,
        estatus: c.estatus,
        total_inscripciones: conteosInscripciones[c.id_curso] || 0,
      }))
      .sort((a, b) => b.total_inscripciones - a.total_inscripciones)
      .slice(0, 5)

    return NextResponse.json({
      totalCursos,
      totalEstudiantes,
      promedioGlobal,
      cursosRecientes,
    })
  } catch (error) {
    console.error("Error en stats de profesor:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
