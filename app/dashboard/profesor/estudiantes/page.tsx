"use client"

import { useEffect, useState } from "react"
import { Search, Loader2, Users, BookOpen, GraduationCap } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface EstudianteInscrito {
  id_inscripcion: number
  fecha_inscripcion: string
  curso_nombre: string
  estudiante_id: string
  estudiante_nombre: string
  estudiante_estatus: number
}

export default function ProfesorEstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState<EstudianteInscrito[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchEstudiantes() {
      const storedUser = localStorage.getItem("edufy_user")
      if (!storedUser) return
      const { token } = JSON.parse(storedUser)

      try {
        const response = await fetch("/api/profesor/estudiantes", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (response.ok) {
          setEstudiantes(data)
        } else {
          toast.error(data.error || "Error al cargar la lista de estudiantes")
        }
      } catch (error) {
        toast.error("Error de conexión")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEstudiantes()
  }, [])

  // Filtrado inteligente: busca tanto por el nombre del estudiante como por el nombre del curso
  const estudiantesFiltrados = estudiantes.filter(
    (e) =>
      (e.estudiante_nombre || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      (e.curso_nombre || "").toLowerCase().includes(busqueda.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-4 py-6 lg:px-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Estudiantes</h1>
          <p className="text-muted-foreground">
            Visualiza a todas las personas inscritas en tus diferentes cursos.
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Matrícula Actual
              </CardTitle>
              <CardDescription>
                Tienes {estudiantes.length} inscripciones totales.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o curso..."
                className="bg-muted/50 pl-8 transition-colors focus:bg-background"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Estudiante</TableHead>
                <TableHead>Curso Inscrito</TableHead>
                <TableHead>Fecha de Inscripción</TableHead>
                <TableHead className="text-right">Estado de Cuenta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estudiantesFiltrados.length > 0 ? (
                estudiantesFiltrados.map((registro) => (
                  <TableRow
                    key={registro.id_inscripcion}
                    className={
                      registro.estudiante_estatus === 0 ? "opacity-60" : ""
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <GraduationCap className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">
                          {registro.estudiante_nombre}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpen className="h-3 w-3" />
                        {registro.curso_nombre}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(
                        registro.fecha_inscripcion
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {registro.estudiante_estatus === 1 ? (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-600 shadow-none"
                        >
                          Activo
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="border-0 bg-red-500/10 text-red-500 shadow-none hover:bg-red-500/20"
                        >
                          Suspendido
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Users className="mb-3 h-10 w-10 opacity-20" />
                      <p>No se encontraron estudiantes.</p>
                      {estudiantes.length === 0 && (
                        <p className="mt-1 text-xs">
                          ¡Pronto tendrás tus primeras inscripciones!
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
