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

export default function ProfesorMisCursosPage() {
  const [cursos, setCursos] = useState<MiCurso[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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

    fetchMisCursos()
  }, [])

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
                      {curso.estatus === 1 ? (
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
                          <XCircle className="mr-1 h-3 w-3" /> Oculto/Inactivo
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
                            asChild
                            className="cursor-pointer font-medium text-primary focus:text-primary"
                          >
                            <Link
                              href={`/dashboard/profesor/cursos/${curso.id_curso}/videos`}
                            >
                              <Video className="mr-2 h-4 w-4" /> Temario y
                              Videos
                            </Link>
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
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar Curso
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No se encontraron cursos con ese nombre.
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
