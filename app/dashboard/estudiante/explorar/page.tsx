"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  Search,
  Loader2,
  CheckCircle,
  PlusCircle,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface Curso {
  id_curso: number
  nombre: string
  descripcion: string
  perfiles: { nombre_completo: string }
}

export default function ExplorarCursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [inscritosIds, setInscritosIds] = useState<number[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = localStorage.getItem("edufy_user")
      if (!storedUser) return
      const { token } = JSON.parse(storedUser)

      try {
        // 1. Traer todos los cursos
        // 2. Traer mis inscripciones actuales para comparar
        const [resCursos, resInscripciones] = await Promise.all([
          fetch("/api/cursos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/inscripciones/mis_cursos", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const dataCursos = await resCursos.json()
        const dataIns = await resInscripciones.json()

        if (resCursos.ok) setCursos(dataCursos)
        if (resInscripciones.ok) {
          // Guardamos solo los IDs de los cursos donde ya estamos inscritos
          setInscritosIds(dataIns.map((ins: any) => ins.cursos.id_curso))
        }
      } catch (error) {
        toast.error("Error al cargar datos")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleInscripcion = async (id_curso: number) => {
    setIsActionLoading(id_curso)
    const storedUser = localStorage.getItem("edufy_user")
    const { token } = JSON.parse(storedUser!)

    try {
      const response = await fetch("/api/inscripciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_curso }),
      })

      if (response.ok) {
        toast.success("¡Inscripción exitosa!")
        setInscritosIds([...inscritosIds, id_curso])
      } else {
        const error = await response.json()
        toast.error(error.error || "No se pudo completar la inscripción")
      }
    } catch (err) {
      toast.error("Error de conexión")
    } finally {
      setIsActionLoading(null)
    }
  }

  const cursosFiltrados = cursos.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Explorar Catálogo</h1>
        <div className="relative w-full md:w-80">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            className="pl-10"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cursosFiltrados.map((curso) => {
          const yaInscrito = inscritosIds.includes(curso.id_curso)

          return (
            <Card key={curso.id_curso} className="flex flex-col">
              <CardHeader>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="line-clamp-1">{curso.nombre}</CardTitle>
                <CardDescription>
                  Instructor: {curso.perfiles?.nombre_completo}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between">
                <p className="mb-6 line-clamp-2 text-sm text-muted-foreground">
                  {curso.descripcion}
                </p>

                {yaInscrito ? (
                  <Button
                    variant="outline"
                    className="w-full border-green-500 text-green-600 hover:bg-green-50"
                    asChild
                  >
                    <Link href={`/curso/${curso.id_curso}/aprender`}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Ya inscrito - Ver curso
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleInscripcion(curso.id_curso)}
                    disabled={isActionLoading === curso.id_curso}
                  >
                    {isActionLoading === curso.id_curso ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Inscribirme ahora
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
