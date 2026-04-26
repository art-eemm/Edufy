"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Search,
  MoreHorizontal,
  Plus,
  Loader2,
  BookOpen,
  Video,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { toast } from "sonner"

interface MiCurso {
  id_curso: number
  nombre: string
  descripcion: string
  fecha_creacion: string
  estatus: number
}

interface Calificacion {
  id: string
  estrellas: number
  comentario: string
  created_at: string
  perfiles: { nombre_completo: string }
}

export default function ProfesorMisCursosPage() {
  const [cursos, setCursos] = useState<MiCurso[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Estados del Modal de Calificaciones
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([])
  const [isLoadingCalificaciones, setIsLoadingCalificaciones] = useState(false)

  useEffect(() => {
    fetchMisCursos()
  }, [])

  async function fetchMisCursos() {
    const storedUser = localStorage.getItem("edufy_user")
    if (!storedUser) return
    const { token } = JSON.parse(storedUser)

    try {
      const response = await fetch("/api/profesor/cursos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (response.ok) {
        setCursos(data)
      } else {
        toast.error(data.error || "Error al cargar tus cursos")
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor")
    } finally {
      setIsLoading(false)
    }
  }

  // FUNCIÓN PARA DESACTIVAR (ELIMINAR LOGICAMENTE) EL CURSO
  const handleEliminarCurso = async (id: number) => {
    if (
      !confirm(
        "¿Estás seguro que deseas desactivar este curso? Los alumnos ya no podrán verlo."
      )
    )
      return

    const { token } = JSON.parse(localStorage.getItem("edufy_user")!)

    try {
      const response = await fetch(`/api/cursos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success("Curso desactivado exitosamente")
        // Actualizamos la tabla visualmente sin recargar la página
        setCursos((prev) =>
          prev.map((curso) =>
            curso.id_curso === id ? { ...curso, estatus: 0 } : curso
          )
        )
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Error al eliminar")
      }
    } catch (error) {
      toast.error("Error de conexión")
    }
  }

  // FUNCIÓN PARA ABRIR MODAL Y VER RESEÑAS
  const handleVerCalificaciones = async (id: number) => {
    setIsModalOpen(true)
    setIsLoadingCalificaciones(true)
    setCalificaciones([])

    const { token } = JSON.parse(localStorage.getItem("edufy_user")!)

    try {
      const response = await fetch(`/api/calificaciones/curso/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (response.ok) {
        setCalificaciones(data)
      } else {
        toast.error("Error al cargar calificaciones")
      }
    } catch (error) {
      toast.error("Error de conexión")
    } finally {
      setIsLoadingCalificaciones(false)
    }
  }

  const cursosFiltrados = cursos.filter((c) =>
    (c.nombre || "").toLowerCase().includes(busqueda.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Cursos</h1>
          <p className="text-muted-foreground">
            Gestiona el contenido, los videos y la información de los cursos que
            impartes.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/profesor/crear">
            <Plus className="mr-2 h-4 w-4" />
            Crear Nuevo Curso
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle>Tu Catálogo</CardTitle>
              <CardDescription>
                Tienes un total de {cursos.length} cursos creados.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en mis cursos..."
                className="pl-8"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead className="hidden md:table-cell">
                  Fecha de Creación
                </TableHead>
                {/* <TableHead>Estado</TableHead> */}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cursosFiltrados.length > 0 ? (
                cursosFiltrados.map((curso) => (
                  <TableRow key={curso.id_curso}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate font-semibold">
                            {curso.nombre}
                          </span>
                          <span className="line-clamp-1 text-xs text-muted-foreground">
                            {curso.descripcion}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {new Date(curso.fecha_creacion).toLocaleDateString()}
                    </TableCell>
                    {/* <TableCell>
                      {curso.estatus === 0 ? (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-600 shadow-none"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Público
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="border-0 bg-red-500/10 text-red-500 shadow-none hover:bg-red-500/20"
                        >
                          <XCircle className="mr-1 h-3 w-3" /> Inactivo
                        </Badge>
                      )}
                    </TableCell> */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Gestionar Curso</DropdownMenuLabel>

                          <DropdownMenuItem
                            onClick={() =>
                              handleVerCalificaciones(curso.id_curso)
                            }
                            className="cursor-pointer"
                          >
                            <Star className="mr-2 h-4 w-4 text-yellow-500" />{" "}
                            Ver Calificaciones
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            asChild
                            className="cursor-pointer font-medium text-primary focus:text-primary"
                          >
                            {/* <Link
                              href={`/dashboard/profesor/cursos/${curso.id_curso}/videos`}
                            >
                              <Video className="mr-2 h-4 w-4" /> Temario y
                              Videos
                            </Link> */}
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link
                              href={`/dashboard/profesor/cursos/${curso.id_curso}/editar`}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Editar
                              Información
                            </Link>
                          </DropdownMenuItem>

                          {curso.estatus === 1 && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleEliminarCurso(curso.id_curso)
                              }
                              className="cursor-pointer text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Desactivar
                              Curso
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No se encontraron cursos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MODAL DE CALIFICACIONES */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reseñas del Curso</DialogTitle>
            <DialogDescription>
              Comentarios y calificaciones otorgadas por tus alumnos.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex max-h-[400px] flex-col gap-4 overflow-y-auto pr-2">
            {isLoadingCalificaciones ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : calificaciones.length > 0 ? (
              calificaciones.map((cal) => (
                <div key={cal.id} className="rounded-lg border bg-muted/50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      {cal.perfiles?.nombre_completo || "Usuario Anónimo"}
                    </span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= cal.estrellas
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {cal.comentario ? (
                    <p className="text-sm text-muted-foreground">
                      {cal.comentario}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground/50 italic">
                      Sin comentario
                    </p>
                  )}
                  {/* <span className="mt-3 block text-[10px] text-muted-foreground/60">
                    {(() => {
                      const d = new Date(cal.created_at)
                      return isNaN(d.getTime())
                        ? "Fecha no disponible"
                        : d.toLocaleDateString()
                    })()}
                  </span> */}
                </div>
              ))
            ) : (
              <div className="flex h-32 flex-col items-center justify-center text-center text-muted-foreground">
                <MessageSquare className="mb-2 h-8 w-8 opacity-20" />
                <p>Aún no hay reseñas para este curso.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
