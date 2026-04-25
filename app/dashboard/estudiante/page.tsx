"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  ArrowRight,
  Loader2,
  Award,
  Flame,
  Clock,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/dashboard/sat-card"

interface CursoAPI {
  id_curso: string
  nombre: string
  descripcion: string
  fecha_creacion: string
  perfiles?: {
    nombre_completo: string
  }
}

interface UserData {
  name: string
  email: string
  role: string
  token: string
}

export default function StudentDashboardPage() {
  const [cursos, setCursos] = useState<CursoAPI[]>([])
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("edufy_user")
    let parsedUser: UserData | null = null

    if (storedUser) {
      parsedUser = JSON.parse(storedUser)
      setUserData(parsedUser)
    }

    const fetchCursos = async () => {
      try {
        const response = await fetch("/api/cursos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedUser?.token || ""}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Error al cargar los cursos")
        }

        if (Array.isArray(data)) {
          const cursosOrdenados = data.sort(
            (a, b) =>
              new Date(b.fecha_creacion).getTime() -
              new Date(a.fecha_creacion).getTime()
          )
          setCursos(cursosOrdenados)
        } else {
          setCursos([])
        }
      } catch (err) {
        console.error("Error fetching cursos:", err)
        setError(
          "No pudimos cargar los cursos. Verifica tu conexión o intenta iniciar sesión nuevamente."
        )
      } finally {
        setIsLoading(false)
      }
    }

    if (parsedUser?.token) {
      fetchCursos()
    } else {
      setIsLoading(false)
      setError(
        "No se encontró sesión activa. Por favor, inicia sesión de nuevo."
      )
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const totalCursos = cursos.length
  const cursoDestacado = cursos[0]

  const hace30Dias = new Date()
  hace30Dias.setDate(hace30Dias.getDate() - 30)
  const cursosNuevos = cursos.filter(
    (c) => new Date(c.fecha_creacion) >= hace30Dias
  ).length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Panel del Estudiante
        </h1>
        <p className="mt-1 text-muted-foreground">
          {userData?.name
            ? `¡Hola de nuevo, ${userData.name.split(" ")[0]}!`
            : "Bienvenido."}{" "}
          Explora el contenido disponible para ti.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {error}
        </div>
      )}

      {/* 1. Tarjetas de Estadísticas Reales */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Cursos Disponibles"
          value={totalCursos.toString()}
          icon={BookOpen}
          iconClassName="bg-primary/20 text-primary"
        />
        <StatCard
          title="Lanzamientos Recientes"
          value={cursosNuevos.toString()}
          icon={Flame}
          iconClassName="bg-chart-2/20 text-chart-2"
        />
        <StatCard
          title="Nivel Actual"
          value="Principiante"
          icon={Award}
          iconClassName="bg-chart-5/20 text-chart-5"
        />
      </div>

      {cursoDestacado && !error && (
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="hidden h-20 w-20 items-center justify-center rounded-xl bg-primary/10 sm:flex">
                  <Flame className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-primary">
                      Nuevo Curso Destacado
                    </p>
                    <span className="flex h-2 w-2 animate-pulse rounded-full bg-primary"></span>
                  </div>
                  <h2 className="mt-1 text-xl font-bold text-foreground">
                    {cursoDestacado.nombre}
                  </h2>
                  <p className="mt-1 line-clamp-2 max-w-2xl text-sm text-muted-foreground">
                    {cursoDestacado.descripcion}
                  </p>
                </div>
              </div>
              <Button size="lg" asChild>
                <Link href={`/curso/${cursoDestacado.id_curso}`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Ver Curso
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Catálogo Completo</CardTitle>
            <CardDescription>
              Encuentra tu próximo tema de aprendizaje
            </CardDescription>
          </CardHeader>
          <CardContent>
            {cursos.length === 0 && !error ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Clock className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <p className="font-medium text-foreground">
                  No hay cursos publicados aún
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cursos.map((curso) => (
                  <Link
                    key={curso.id_curso}
                    href={`/curso/${curso.id_curso}`}
                    className="group flex flex-col justify-between rounded-lg border border-border p-5 transition-all hover:border-primary/50 hover:bg-muted/50"
                  >
                    <div>
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                        {curso.nombre}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Prof: {curso.perfiles?.nombre_completo || "No asignado"}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center text-sm font-medium text-primary">
                      Explorar
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
