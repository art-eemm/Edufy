"use client"

import { useEffect, useState } from "react"
import {
  Star,
  MessageSquare,
  TrendingUp,
  Loader2,
  BookOpen,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

interface RankingCurso {
  id_curso: number
  nombre: string
  cantidadResenas: number
  promedio: number
}

interface Comentario {
  id: number
  estrellas: number
  comentario: string
  fecha: string
  cursos: { nombre: string } | any
  perfiles: { nombre_completo: string } | any
}

interface StatsData {
  resumenGlobal: { totalResenas: number; promedioGlobal: number }
  ranking: RankingCurso[]
  comentariosRecientes: Comentario[]
}

export default function AdminEstadisticasPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const storedUser = localStorage.getItem("edufy_user")
      if (!storedUser) return
      const { token } = JSON.parse(storedUser)

      try {
        const response = await fetch("/api/admin/estadisticas", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (response.ok) {
          setStats(data)
        } else {
          toast.error("Error al cargar las estadísticas")
        }
      } catch (error) {
        toast.error("Error de conexión")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const RenderStars = ({ calificacion }: { calificacion: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= Math.round(calificacion) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
          />
        ))}
      </div>
    )
  }

  if (isLoading)
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )

  if (!stats)
    return <div className="mt-10 text-center">No hay datos disponibles.</div>

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Reporte de Calidad
        </h1>
        <p className="text-muted-foreground">
          Analiza la recepción y comentarios de los cursos por parte de la
          comunidad.
        </p>
      </div>

      {/* Tarjetas de Resumen Rápido */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Reseñas</p>
              <p className="text-2xl font-bold">
                {stats.resumenGlobal.totalResenas}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-600">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Promedio Global</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {stats.resumenGlobal.promedioGlobal}
                </p>
                <span className="text-sm text-muted-foreground">/ 5.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* TOP CURSOS (Los más aceptados) */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> Cursos Más
              Aceptados
            </CardTitle>
            <CardDescription>
              Ranking basado en la calificación promedio otorgada por los
              estudiantes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-6">
              {stats.ranking.length > 0 ? (
                stats.ranking.slice(0, 5).map((curso, index) => (
                  <div
                    key={curso.id_curso}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm leading-tight font-semibold">
                          {curso.nombre}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {curso.cantidadResenas} valoraciones
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 font-bold">
                        {curso.promedio}{" "}
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <RenderStars calificacion={curso.promedio} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Aún no hay cursos calificados.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FEED DE COMENTARIOS RECIENTES */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Feedback
              Reciente
            </CardTitle>
            <CardDescription>
              Últimos comentarios recibidos en la plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[400px]">
              <div className="flex flex-col divide-y">
                {stats.comentariosRecientes.length > 0 ? (
                  stats.comentariosRecientes.map((comentario) => (
                    <div
                      key={comentario.id}
                      className="p-6 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold">
                            {comentario.perfiles?.nombre_completo ||
                              "Estudiante Anónimo"}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <BookOpen className="h-3 w-3" />
                            {comentario.cursos?.nombre || "Curso eliminado"}
                          </div>
                        </div>
                        <RenderStars calificacion={comentario.estrellas} />
                      </div>
                      <p className="mt-3 rounded-lg border-l-2 border-l-primary/50 bg-muted/50 p-3 text-sm text-foreground/80 italic">
                        `{comentario.comentario}`
                      </p>
                      <p className="mt-2 text-right text-xs text-muted-foreground">
                        {new Date(comentario.fecha).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No hay comentarios para mostrar.
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
