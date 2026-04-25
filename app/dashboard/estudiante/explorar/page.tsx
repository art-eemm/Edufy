"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Search, ArrowRight, Loader2, FilterX } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface CursoAPI {
  id_curso: number
  nombre: string
  descripcion: string
  fecha_creacion: string
  perfiles?: {
    nombre_completo: string
  }
}

export default function ExplorarCursosPage() {
  const [cursos, setCursos] = useState<CursoAPI[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCatalogo = async () => {
      const storedUser = localStorage.getItem("edufy_user")
      if (!storedUser) return

      const { token } = JSON.parse(storedUser)

      try {
        const response = await fetch("/api/cursos", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (!response.ok)
          throw new Error(data.error || "Error al cargar el catálogo")

        if (Array.isArray(data)) {
          setCursos(data)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCatalogo()
  }, [])

  // Filtrado en tiempo real por nombre o descripción
  const cursosFiltrados = cursos.filter(
    (curso) =>
      curso.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      curso.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Explorar Cursos
          </h1>
          <p className="text-muted-foreground">
            Descubre nuevas habilidades entre todos nuestros cursos disponibles.
          </p>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre del curso o descripción..."
          className="pl-10"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cursosFiltrados.length > 0 ? (
            cursosFiltrados.map((curso) => (
              <Card
                key={curso.id_curso}
                className="group flex h-full flex-col overflow-hidden border-muted transition-all hover:shadow-md"
              >
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="bg-background">
                      Nuevo
                    </Badge>
                  </div>
                  <CardTitle className="mt-4 line-clamp-1 transition-colors group-hover:text-primary">
                    {curso.nombre}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    Prof.{" "}
                    {curso.perfiles?.nombre_completo || "Instructor Edufy"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col p-6">
                  <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
                    {curso.descripcion}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <span className="text-xs text-muted-foreground">
                      Publicado:{" "}
                      {new Date(curso.fecha_creacion).toLocaleDateString()}
                    </span>
                    <Link
                      href={`/curso/${curso.id_curso}/aprender`}
                      className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                    >
                      Empezar
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center">
              <FilterX className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold text-foreground">
                No se encontraron cursos
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Intenta con otros términos de búsqueda.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
