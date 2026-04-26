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

    const isProfesor = await hasRole(user.id, "profesor")
    if (!isProfesor) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { data: misCursos, error: cursosError } = await supabaseAdmin
      .from("cursos")
      .select("id_curso, nombre")
      .eq("id_profesor", user.id)

    if (cursosError) throw cursosError

    if (!misCursos || misCursos.length === 0) {
      return NextResponse.json([])
    }

    const idsCursos = misCursos.map((c) => c.id_curso)

    const { data: inscripciones, error: insError } = await supabaseAdmin
      .from("inscripciones")
      .select(
        `
        id_inscripcion,
        fecha_inscripcion,
        id_curso,
        perfiles:id_usuario (
          id,
          nombre_completo,
          estatus
        )
      `
      )
      .in("id_curso", idsCursos)
      .order("fecha_inscripcion", { ascending: false })

    if (insError) throw insError

    const listaEstudiantes = (inscripciones || []).map((ins) => {
      const curso = misCursos.find((c) => c.id_curso === ins.id_curso)

      const perfil = Array.isArray(ins.perfiles)
        ? ins.perfiles[0]
        : ins.perfiles

      return {
        id_inscripcion: ins.id_inscripcion,
        fecha_inscripcion: ins.fecha_inscripcion,
        curso_nombre: curso?.nombre || "Curso desconocido",
        estudiante_id: perfil?.id,
        estudiante_nombre: perfil?.nombre_completo || "Usuario anónimo",
        estudiante_estatus: perfil?.estatus ?? 1,
      }
    })

    return NextResponse.json(listaEstudiantes, { status: 200 })
  } catch (error: any) {
    console.error(
      "Error al obtener estudiantes del profesor:",
      error.message || error
    )
    return NextResponse.json(
      { error: "Error en el servidor al cargar estudiantes" },
      { status: 500 }
    )
  }
}
