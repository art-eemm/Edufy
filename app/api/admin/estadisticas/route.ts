export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getUserFromToken, hasRole } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user || !(await hasRole(user.id, "admin"))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const { data: calificaciones, error } = await supabaseAdmin
      .from("calificaciones")
      .select(
        `
        id,
        estrellas,
        comentario,
        fecha,
        cursos ( id_curso, nombre ),
        perfiles ( nombre_completo )
      `
      )
      .order("fecha", { ascending: false })

    if (error) {
      console.error("Error al obtener calificaciones:", error.message)
      return NextResponse.json(
        { error: "Error al cargar datos" },
        { status: 500 }
      )
    }

    // PROCESAMIENTO DE DATOS EN EL SERVIDOR
    const reporteCursos: Record<number, any> = {}

    calificaciones?.forEach((cal) => {
      if (!cal.cursos) return

      const idCurso = (cal.cursos as any).id_curso
      const nombreCurso = (cal.cursos as any).nombre

      if (!reporteCursos[idCurso]) {
        reporteCursos[idCurso] = {
          id_curso: idCurso,
          nombre: nombreCurso,
          totalEstrellas: 0,
          cantidadResenas: 0,
          promedio: 0,
        }
      }

      reporteCursos[idCurso].totalEstrellas += cal.estrellas
      reporteCursos[idCurso].cantidadResenas += 1
    })

    const rankingCursos = Object.values(reporteCursos).map((curso: any) => ({
      ...curso,
      promedio: Number(
        (curso.totalEstrellas / curso.cantidadResenas).toFixed(1)
      ),
    }))

    rankingCursos.sort((a, b) => b.promedio - a.promedio)

    return NextResponse.json({
      resumenGlobal: {
        totalResenas: calificaciones?.length || 0,
        promedioGlobal:
          rankingCursos.length > 0
            ? Number(
                (
                  rankingCursos.reduce((acc, c) => acc + c.promedio, 0) /
                  rankingCursos.length
                ).toFixed(1)
              )
            : 0,
      },
      ranking: rankingCursos,
      comentariosRecientes: calificaciones?.slice(0, 20) || [],
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
