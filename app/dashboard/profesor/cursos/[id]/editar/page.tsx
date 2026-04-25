"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Clock,
  Play,
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { courses, lessons as allLessons, categories } from "@/lib/mock-data"
import type { Lesson } from "@/lib/types"

export default function EditarCursoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const course = courses.find((c) => c.id === id)
  const courseLessons = allLessons.filter((l) => l.courseId === id)

  const [saving, setSaving] = useState(false)
  const [courseData, setCourseData] = useState({
    title: course?.title || "",
    description: course?.description || "",
    category: course?.category || "",
    level: course?.level || "principiante",
    price: course?.price || 0,
    duration: course?.duration || "",
  })

  const [lessons, setLessons] = useState<Lesson[]>(courseLessons)
  const [draggedLesson, setDraggedLesson] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Curso no encontrado</p>
        <Button
          variant="link"
          onClick={() => router.push("/dashboard/profesor/cursos")}
        >
          Volver a mis cursos
        </Button>
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const addLesson = () => {
    const newLesson: Lesson = {
      id: `new-${Date.now()}`,
      courseId: id,
      title: "Nueva Lección",
      description: "",
      videoUrl: "",
      duration: "00:00",
      order: lessons.length + 1,
    }
    setLessons([...lessons, newLesson])
  }

  const updateLesson = (
    index: number,
    field: keyof Lesson,
    value: string | number
  ) => {
    const updated = [...lessons]
    updated[index] = { ...updated[index], [field]: value }
    setLessons(updated)
  }

  const removeLesson = (index: number) => {
    const updated = lessons.filter((_, i) => i !== index)
    // Update order
    updated.forEach((lesson, i) => {
      lesson.order = i + 1
    })
    setLessons(updated)
  }

  const handleDragStart = (index: number) => {
    setDraggedLesson(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedLesson === null || draggedLesson === index) return

    const updated = [...lessons]
    const [draggedItem] = updated.splice(draggedLesson, 1)
    updated.splice(index, 0, draggedItem)

    // Update orders
    updated.forEach((lesson, i) => {
      lesson.order = i + 1
    })

    setLessons(updated)
    setDraggedLesson(index)
  }

  const handleDragEnd = () => {
    setDraggedLesson(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Editar Curso</h1>
          <p className="mt-1 text-muted-foreground">
            Modifica la información y lecciones del curso
          </p>
        </div>
        <Badge
          variant={course.status === "published" ? "default" : "secondary"}
        >
          {course.status === "published" ? "Publicado" : "Borrador"}
        </Badge>
      </div>

      {showSuccess && (
        <div className="rounded-lg border border-success/20 bg-success/10 p-4 text-success">
          Los cambios se han guardado correctamente.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Info */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Información del Curso</CardTitle>
              <CardDescription>Datos generales del curso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del curso</Label>
                <Input
                  id="title"
                  value={courseData.title}
                  onChange={(e) =>
                    setCourseData({ ...courseData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={courseData.description}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select
                    value={courseData.category}
                    onValueChange={(value) =>
                      setCourseData({ ...courseData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nivel</Label>
                  <Select
                    value={courseData.level}
                    onValueChange={(value) =>
                      setCourseData({
                        ...courseData,
                        level: value as
                          | "principiante"
                          | "intermedio"
                          | "avanzado",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="principiante">Principiante</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={courseData.price}
                    onChange={(e) =>
                      setCourseData({
                        ...courseData,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración</Label>
                  <Input
                    id="duration"
                    value={courseData.duration}
                    onChange={(e) =>
                      setCourseData({ ...courseData, duration: e.target.value })
                    }
                    placeholder="ej: 20 horas"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lessons */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lecciones</CardTitle>
                  <CardDescription>
                    Arrastra para reordenar las lecciones
                  </CardDescription>
                </div>
                <Button onClick={addLesson}>
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Lección
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lessons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Play className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">
                    No hay lecciones aún
                  </p>
                  <Button className="mt-4" onClick={addLesson}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear primera lección
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-start gap-3 rounded-lg border p-4 transition-colors ${
                        draggedLesson === index
                          ? "border-primary bg-primary/5"
                          : "bg-card"
                      }`}
                    >
                      <button className="mt-2 cursor-grab text-muted-foreground hover:text-foreground">
                        <GripVertical className="h-5 w-5" />
                      </button>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {lesson.order}
                      </div>
                      <div className="flex-1 space-y-3">
                        <Input
                          value={lesson.title}
                          onChange={(e) =>
                            updateLesson(index, "title", e.target.value)
                          }
                          placeholder="Título de la lección"
                          className="font-medium"
                        />
                        <Textarea
                          value={lesson.description}
                          onChange={(e) =>
                            updateLesson(index, "description", e.target.value)
                          }
                          placeholder="Descripción de la lección"
                          rows={2}
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            value={lesson.videoUrl}
                            onChange={(e) =>
                              updateLesson(index, "videoUrl", e.target.value)
                            }
                            placeholder="URL del video"
                          />
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <Input
                              value={lesson.duration}
                              onChange={(e) =>
                                updateLesson(index, "duration", e.target.value)
                              }
                              placeholder="Duración (ej: 15:30)"
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeLesson(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Total Lecciones</p>
                <p className="font-medium text-foreground">{lessons.length}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Estudiantes</p>
                <p className="font-medium text-foreground">
                  {course.studentsCount.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Calificación</p>
                <p className="font-medium text-foreground">
                  {course.rating} / 5.0
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Ingresos</p>
                <p className="font-medium text-foreground">
                  ${(course.studentsCount * course.price).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/curso/${id}`)}
              >
                Ver Curso
              </Button>
              <Button
                variant="outline"
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Curso
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
