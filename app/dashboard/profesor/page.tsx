"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  Users,
  Star,
  PlusCircle,
  Video,
  Settings,
  Loader2,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/sat-card"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface ProfesorStats {
  totalCursos: number
  totalEstudiantes: number
  promedioGlobal: number
  cursosRecientes: {
    id_curso: number
    nombre: string
    estatus: number
    total_inscripciones: number
  }[]
}

export default function ProfesorDashboardPage() {
  const [stats, setStats] = useState<ProfesorStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [nombreProfe, setNombreProfe] = useState("")

  useEffect(() => {
    async function fetchStats() {
      const storedUser = localStorage.getItem("edufy_user")
      if (!storedUser) return
      const { token, name } = JSON.parse(storedUser)

      setNombreProfe(name)

      try {
        const response = await fetch("/api/profesor/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (response.ok) {
          setStats(data)
        } else {
          toast.error("Error al cargar tus métricas")
        }
      } catch (error) {
        toast.error("Error de conexión")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          ¡Hola, {nombreProfe}!
        </h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de instructor. Aquí está el resumen de tu
          rendimiento.
        </p>
      </div>

      {/* MÉTRICAS PRINCIPALES */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Mis Cursos"
          value={stats?.totalCursos.toString() || "0"}
          icon={BookOpen}
          description="Cursos que has creado"
          iconClassName="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Total de Estudiantes"
          value={stats?.totalEstudiantes.toString() || "0"}
          icon={Users}
          description="Alumnos inscritos a tus cursos"
          iconClassName="bg-green-500/10 text-green-500"
        />
        <StatCard
          title="Calificación Promedio"
          value={
            stats && stats.promedioGlobal > 0
              ? `${stats.promedioGlobal}/5.0`
              : "0"
          }
          icon={Star}
          description="Basado en reseñas de alumnos"
          iconClassName="bg-yellow-500/10 text-yellow-600"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* TOP CURSOS DEL PROFESOR */}
        <Card className="col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle>Rendimiento de tus cursos</CardTitle>
            <CardDescription>
              Tus cursos más populares ordenados por cantidad de alumnos.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {stats && stats.cursosRecientes.length > 0 ? (
                stats.cursosRecientes.map((curso) => (
                  <div
                    key={curso.id_curso}
                    className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {curso.nombre}
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          {curso.estatus === 1 ? (
                            <Badge
                              variant="outline"
                              className="h-4 border-0 bg-green-500/10 text-[10px] text-green-600 shadow-none"
                            >
                              <CheckCircle2 className="mr-1 h-3 w-3" /> Activo
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="h-4 border-0 bg-red-500/10 text-[10px] text-red-500 shadow-none"
                            >
                              <XCircle className="mr-1 h-3 w-3" /> Inactivo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {curso.total_inscripciones}
                      </p>
                      <p className="text-xs text-muted-foreground">alumnos</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 text-center">
                  <Video className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="font-medium">Aún no tienes cursos.</p>
                  <p className="text-sm text-muted-foreground">
                    Crea tu primer curso para empezar a enseñar.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ACCIONES RÁPIDAS PARA EL PROFESOR */}
        <Card className="col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Accesos directos para gestionar tu contenido.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid flex-1 gap-3">
            <Button
              variant="outline"
              className="h-auto justify-start border-primary/20 py-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
              asChild
            >
              <Link href="/dashboard/profesor/crear">
                <PlusCircle className="mr-3 h-5 w-5 text-primary" />
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-primary">
                    Crear Nuevo Curso
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Añade información y sube tus lecciones
                  </span>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto justify-start py-4"
              asChild
            >
              <Link href="/dashboard/profesor/cursos">
                <Video className="mr-3 h-5 w-5 text-purple-500" />
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold">Gestionar mis cursos</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Edita el temario de tus cursos existentes
                  </span>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto justify-start py-4"
              asChild
            >
              <Link href="/dashboard/estudiante/perfil">
                <Settings className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold">Configuración de Perfil</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Actualiza tu foto y biografía pública
                  </span>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
