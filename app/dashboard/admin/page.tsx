"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Users,
  BookOpen,
  TrendingUp,
  Loader2,
  UserCheck,
  Settings,
  UsersRound,
  Star,
  ChevronRight,
  GraduationCap,
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
import { toast } from "sonner"

// Actualizamos la interfaz para incluir el top de cursos
interface AdminStats {
  totalUsuarios: number
  totalCursos: number
  totalInscripciones: number
  totalProfesores: number
  topCursos: {
    id_curso: number
    nombre: string
    total_inscripciones: number
  }[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const storedUser = localStorage.getItem("edufy_user")
      if (!storedUser) return
      const { token } = JSON.parse(storedUser)

      try {
        const response = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setStats(data)
        } else {
          toast.error("No se pudieron cargar las estadísticas reales")
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
          Panel de Administración
        </h1>
        <p className="text-muted-foreground">
          Vista general del estado actual de la plataforma Edufy.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Usuarios Totales"
          value={stats?.totalUsuarios.toString() || "0"}
          icon={Users}
          description="Estudiantes y profesores"
          iconClassName="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Cursos Activos"
          value={stats?.totalCursos.toString() || "0"}
          icon={BookOpen}
          description="Cursos publicados"
          iconClassName="bg-green-500/10 text-green-500"
        />
        <StatCard
          title="Inscripciones"
          value={stats?.totalInscripciones.toString() || "0"}
          icon={TrendingUp}
          description="Total de ventas/registros"
          iconClassName="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          title="Cuerpo Docente"
          value={stats?.totalProfesores.toString() || "0"}
          icon={UserCheck}
          description="Profesores verificados"
          iconClassName="bg-orange-500/10 text-orange-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* TOP CURSOS */}
        <Card className="col-span-4 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Cursos con mayor demanda
            </CardTitle>
            <CardDescription>
              Los cursos con mayor número de estudiantes inscritos actualmente.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {stats && stats.topCursos && stats.topCursos.length > 0 ? (
                stats.topCursos.map((curso, i) => (
                  <div
                    key={curso.id_curso}
                    className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium">{curso.nombre}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>{curso.total_inscripciones} alumnos</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-32 flex-col items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
                  <BookOpen className="mb-2 h-8 w-8 opacity-20" />
                  <p className="text-sm">
                    Aún no hay alumnos inscritos en los cursos.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ACCIONES RÁPIDAS */}
        <Card className="col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Atajos a las tareas más comunes de administración.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid flex-1 gap-3">
            <Button
              variant="outline"
              className="h-auto justify-start py-4"
              asChild
            >
              <Link href="/dashboard/admin/usuarios">
                <UsersRound className="mr-3 h-5 w-5 text-blue-500" />
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold">Gestionar Usuarios</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Modificar roles y suspender cuentas
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
              <Link href="/dashboard/admin/cursos">
                <BookOpen className="mr-3 h-5 w-5 text-green-500" />
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold">Catálogo de Cursos</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Activar o desactivar contenido
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
              <Link href="/dashboard/admin/estadisticas">
                <Star className="mr-3 h-5 w-5 text-yellow-500" />
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold">Revisar Calificaciones</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Ver feedback y rankings de cursos
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
              <Link href="/dashboard/admin/configuracion">
                <Settings className="mr-3 h-5 w-5 text-gray-500" />
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold">Configuración</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Ajustar credenciales del sistema
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
