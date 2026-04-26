"use client"

import { useEffect, useState } from "react"
import {
  Search,
  MoreHorizontal,
  Plus,
  Loader2,
  BookOpen,
  ExternalLink,
  Trash2,
  Edit,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

interface Curso {
  id_curso: number
  nombre: string
  descripcion: string
  fecha_creacion: string
  perfiles: {
    nombre_completo: string
  }
}

export default function AdminCursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCursos() {
      const storedUser = localStorage.getItem("edufy_user")
      if (!storedUser) return
      const { token } = JSON.parse(storedUser)

      try {
        const response = await fetch("/api/admin/cursos", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (response.ok) {
          setCursos(data)
        } else {
          toast.error(data.error || "Error al cargar los cursos")
        }
      } catch (error) {
        toast.error("Error de conexión")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCursos()
  }, [])

  const cursosFiltrados = cursos.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.perfiles?.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
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
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Cursos
          </h1>
          <p className="text-muted-foreground">
            Visualiza y administra todos los cursos disponibles en la
            plataforma.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/profesor/crear">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Curso
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle>Catálogo General</CardTitle>
              <CardDescription>
                Hay {cursos.length} cursos registrados en total.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar curso o profesor..."
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
                <TableHead>Instructor</TableHead>
                <TableHead className="hidden md:table-cell">
                  Fecha de Creación
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cursosFiltrados.length > 0 ? (
                cursosFiltrados.map((curso) => (
                  <TableRow key={curso.id_curso} className="group">
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
                    <TableCell>
                      <span className="text-sm">
                        {curso.perfiles?.nombre_completo || "Sin asignar"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {new Date(curso.fecha_creacion).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/curso/${curso.id_curso}/aprender`}>
                              <ExternalLink className="mr-2 h-4 w-4" /> Ver
                              contenido
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar curso
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No se encontraron cursos en la base de datos.
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
