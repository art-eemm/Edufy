"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, BookOpen, Loader2, Save, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function CreateCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estatus: "1", // 1 = Público, 0 = Borrador
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const storedUser = localStorage.getItem("edufy_user")
    if (!storedUser) {
      toast.error("Debes iniciar sesión")
      router.push("/login")
      return
    }

    const { token } = JSON.parse(storedUser)

    try {
      const response = await fetch("/api/profesor/cursos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          estatus: parseInt(formData.estatus),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("¡Curso creado! Ahora añade tus lecciones.")
        // Redirigimos al editor panorámico para subir los videos
        router.push(`/dashboard/profesor/cursos/${data.id_curso}/editar`)
      } else {
        toast.error(data.error || "No se pudo crear el curso")
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-4 py-6 lg:px-10">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/profesor/cursos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Crear Nuevo Curso
          </h1>
          <p className="mt-1 text-muted-foreground">
            Establece la información base de tu próxima clase
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-6 lg:grid-cols-3"
      >
        {/* COLUMNA IZQUIERDA: Info Básica */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Información Básica
              </CardTitle>
              <CardDescription>
                Los detalles principales con los que los alumnos encontrarán tu
                curso.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="nombre">Título del Curso</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Desarrollo Web Avanzado con Next.js"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                  className="py-6 text-lg"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="descripcion">Descripción detallada</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe lo que los estudiantes aprenderán en este curso..."
                  rows={10}
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* COLUMNA DERECHA: Configuración y Acción */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Visibilidad</CardTitle>
              <CardDescription>
                Controla quién puede ver el curso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Label htmlFor="estatus">Estado de Publicación</Label>
                <Select
                  value={formData.estatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, estatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-green-600" /> Público
                        (Activo)
                      </div>
                    </SelectItem>
                    <SelectItem value="0">
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4 text-muted-foreground" />{" "}
                        Borrador (Oculto)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando
                      entorno...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Crear y Continuar al
                      Temario
                    </>
                  )}
                </Button>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Podrás subir tus videos en el siguiente paso.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
