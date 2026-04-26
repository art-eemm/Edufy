"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, PlayCircle, Loader2, GraduationCap } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Inscripcion {
  id_inscripcion: number
  cursos: {
    id_curso: number
    nombre: string
    descripcion: string
    perfiles: {
      nombre_completo: string
    }
  }
}

export default function MisCursosEstudiantePage() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMisCursos = async () => {
      const storedUser = localStorage.getItem("edufy_user")
      if (!storedUser) return
      const { token } = JSON.parse(storedUser)

      try {
        const response = await fetch("/api/inscripciones/mis_cursos", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()

        if (response.ok) {
          setInscripciones(data)
        } else {
          toast.error("Error al cargar tus cursos")
        }
      } catch (error) {
        toast.error("Error de conexión")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMisCursos()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mis Cursos</h1>
        <p className="text-muted-foreground">
          Continúa aprendiendo donde lo dejaste.
        </p>
      </div>

      {inscripciones.length === 0 ? (
        <Card className="border-dashed py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <GraduationCap className="mb-4 h-12 w-12 text-muted-foreground/20" />
            <h3 className="text-lg font-semibold">
              Aún no estás inscrito en ningún curso
            </h3>
            <p className="mb-6 text-sm text-muted-foreground">
              Explora el catálogo y comienza tu aventura hoy mismo.
            </p>
            <Button asChild>
              <Link href="/dashboard/estudiante/explorar">Explorar Cursos</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inscripciones.map((ins) => (
            <Card
              key={ins.id_inscripcion}
              className="flex flex-col overflow-hidden transition-shadow hover:shadow-md"
            >
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="line-clamp-1 text-xl">
                  {ins.cursos.nombre}
                </CardTitle>
                <CardDescription>
                  Prof. {ins.cursos.perfiles?.nombre_completo}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between p-6">
                <p className="mb-6 line-clamp-3 text-sm text-muted-foreground">
                  {ins.cursos.descripcion}
                </p>
                <Button className="w-full" asChild>
                  <Link href={`/curso/${ins.cursos.id_curso}/aprender`}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Continuar Curso
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
