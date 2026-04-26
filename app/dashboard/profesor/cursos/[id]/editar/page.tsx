"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Save,
  Loader2,
  Video,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  FileVideo,
  Clock,
  GripVertical,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { createClient } from "@supabase/supabase-js"
import { toast } from "sonner"
import Link from "next/link"

interface VideoType {
  id_video: number
  titulo: string
  url_video: string
  orden: number
  duracion: number
}

export default function EditarCursoPage() {
  const { id } = useParams()
  const router = useRouter()

  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [isSavingCurso, setIsSavingCurso] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [videos, setVideos] = useState<VideoType[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [nuevoVideoTitulo, setNuevoVideoTitulo] = useState("")
  const [nuevoVideoFile, setNuevoVideoFile] = useState<File | null>(null)
  const [nuevoVideoDuracion, setNuevoVideoDuracion] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados para la Edición de un Video Existente
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null)
  const [editingVideoTitle, setEditingVideoTitle] = useState("")

  useEffect(() => {
    async function fetchDatos() {
      const storedUser = localStorage.getItem("edufy_user")
      if (!storedUser) return router.push("/login")
      const { token } = JSON.parse(storedUser)

      try {
        const resCurso = await fetch(`/api/cursos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const dataCurso = await resCurso.json()
        if (resCurso.ok) {
          setNombre(dataCurso.nombre || "")
          setDescripcion(dataCurso.descripcion || "")
        }

        const resVideos = await fetch(`/api/videos/curso/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (resVideos.ok) setVideos((await resVideos.json()) || [])
      } catch (error) {
        toast.error("Error al cargar los datos del curso")
      } finally {
        setIsLoading(false)
      }
    }
    fetchDatos()
  }, [id, router])

  const handleActualizarCurso = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingCurso(true)
    const { token } = JSON.parse(localStorage.getItem("edufy_user")!)

    try {
      const response = await fetch(`/api/cursos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, descripcion }),
      })
      if (response.ok) toast.success("Información del curso actualizada")
      else toast.error("Error al actualizar el curso")
    } catch (error) {
      toast.error("Error de conexión")
    } finally {
      setIsSavingCurso(false)
    }
  }

  const handleGuardarTituloVideo = async (id_video: number) => {
    if (!editingVideoTitle.trim())
      return toast.error("El título no puede estar vacío")

    const { token } = JSON.parse(localStorage.getItem("edufy_user")!)

    try {
      const res = await fetch(`/api/videos/${id_video}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo: editingVideoTitle }),
      })

      if (res.ok) {
        toast.success("Lección renombrada")
        setVideos(
          videos.map((v) =>
            v.id_video === id_video ? { ...v, titulo: editingVideoTitle } : v
          )
        )
        setEditingVideoId(null)
      } else {
        toast.error("Error al renombrar")
      }
    } catch (e) {
      toast.error("Error de conexión")
    }
  }

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNuevoVideoFile(file)
      const videoNode = document.createElement("video")
      videoNode.preload = "metadata"
      videoNode.onloadedmetadata = () =>
        setNuevoVideoDuracion(Math.round(videoNode.duration))
      videoNode.src = URL.createObjectURL(file)
    }
  }

  const handleSubirVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nuevoVideoFile || !nuevoVideoTitulo)
      return toast.error("Faltan datos del video")

    setIsUploading(true)
    const storedUser = localStorage.getItem("edufy_user")
    const { token } = JSON.parse(storedUser!)

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

      const supabaseUploadClient = createClient(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })

      const fileExt = nuevoVideoFile.name.split(".").pop()
      const fileName = `curso_${id}_${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabaseUploadClient.storage
        .from("videos")
        .upload(fileName, nuevoVideoFile, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Error detallado de Storage:", uploadError)
        toast.error("No se pudo subir el archivo. Revisa la consola.")
        setIsUploading(false)
        return
      }

      const { data: urlData } = supabaseUploadClient.storage
        .from("videos")
        .getPublicUrl(fileName)

      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_curso: id,
          titulo: nuevoVideoTitulo,
          duracion: nuevoVideoDuracion,
          url_video: urlData.publicUrl,
        }),
      })

      if (response.ok) {
        toast.success("Lección publicada correctamente")
        const nuevoVideo = await response.json()
        setVideos([...videos, nuevoVideo.video])

        setNuevoVideoTitulo("")
        setNuevoVideoFile(null)
        setNuevoVideoDuracion(0)
        if (fileInputRef.current) fileInputRef.current.value = ""
      } else {
        const errorData = await response.json()
        console.error("Error de la API:", errorData)
        toast.error(errorData.error || "Error al registrar el video")
      }
    } catch (error) {
      console.error("Error general en la subida:", error)
      toast.error("Fallo inesperado durante la subida.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleEliminarVideo = async (id_video: number) => {
    if (!confirm("¿Estás seguro de eliminar este video?")) return
    const { token } = JSON.parse(localStorage.getItem("edufy_user")!)

    try {
      const response = await fetch(`/api/videos/${id_video}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success("Video eliminado")
        setVideos(videos.filter((v) => v.id_video !== id_video))
      } else {
        toast.error("Error al eliminar el video")
      }
    } catch (error) {
      toast.error("Error de conexión")
    }
  }

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )

  return (
    // CAMBIO AQUÍ: de max-w-5xl a max-w-7xl para hacerla mucho más ancha y espaciosa
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/profesor/cursos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Editor del Curso
          </h1>
          <p className="text-muted-foreground">
            Modifica la información general y gestiona el temario.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <form onSubmit={handleActualizarCurso}>
            <Card>
              <CardHeader>
                <CardTitle>Información General</CardTitle>
                <CardDescription>Datos públicos del curso.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nombre del Curso</Label>
                  <Input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={6}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSavingCurso}
                  className="w-full"
                >
                  {isSavingCurso ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        <div className="space-y-6 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" /> Temario (
                {videos.length} lecciones)
              </CardTitle>
              <CardDescription>
                Sube tus videos y renombra las lecciones haciendo clic en el
                lápiz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {videos.length > 0 ? (
                  videos.map((video, index) => (
                    <div
                      key={video.id_video}
                      className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex flex-1 items-center gap-3 overflow-hidden">
                        <div className="cursor-grab text-muted-foreground">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                          {index + 1}
                        </div>

                        <div className="mr-4 flex flex-1 flex-col overflow-hidden">
                          {editingVideoId === video.id_video ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editingVideoTitle}
                                onChange={(e) =>
                                  setEditingVideoTitle(e.target.value)
                                }
                                className="h-8 max-w-sm text-sm"
                                autoFocus
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-green-600 hover:bg-green-100 hover:text-green-700"
                                onClick={() =>
                                  handleGuardarTituloVideo(video.id_video)
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground"
                                onClick={() => setEditingVideoId(null)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span className="truncate text-sm font-medium">
                                {video.titulo}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />{" "}
                                {Math.floor(video.duracion / 60)}:
                                {(video.duracion % 60)
                                  .toString()
                                  .padStart(2, "0")}{" "}
                                min
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => {
                            setEditingVideoId(video.id_video)
                            setEditingVideoTitle(video.titulo)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEliminarVideo(video.id_video)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
                    Aún no has subido ningún video a este curso.
                  </div>
                )}
              </div>

              <hr />

              <form
                onSubmit={handleSubirVideo}
                className="space-y-4 rounded-xl border bg-muted/30 p-4"
              >
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <Plus className="h-4 w-4" /> Agregar nueva lección
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Título de la lección</Label>
                    <Input
                      placeholder="Ej: 1. Introducción..."
                      value={nuevoVideoTitulo}
                      onChange={(e) => setNuevoVideoTitulo(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Archivo de Video (.mp4)</Label>
                    <Input
                      type="file"
                      accept="video/mp4,video/x-m4v,video/*"
                      ref={fileInputRef}
                      onChange={handleVideoSelect}
                      required
                      className="cursor-pointer file:font-semibold file:text-primary"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isUploading || !nuevoVideoFile}
                  className="w-full sm:w-auto"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subiendo
                      y procesando...
                    </>
                  ) : (
                    <>
                      <FileVideo className="mr-2 h-4 w-4" /> Subir Lección
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
