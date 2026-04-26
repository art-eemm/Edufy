"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  PlayCircle,
  ArrowLeft,
  Loader2,
  ChevronRight,
  Clock,
  Info,
  Lock,
  CheckCircle,
  Star, // <-- Importamos el ícono de estrella
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import Link from "next/link"

// Nuevos componentes de UI importados para el Modal y Textarea
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Video {
  id_video: number
  titulo: string
  url_video: string
  orden: number
  duracion: number
}

interface CursoInfo {
  id_curso: number | string
  nombre: string
  descripcion: string
}

export default function AprenderCursoPage() {
  const { id } = useParams()
  const router = useRouter()

  const [curso, setCurso] = useState<CursoInfo | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [videoActual, setVideoActual] = useState<Video | null>(null)

  const [progreso, setProgreso] = useState({
    total: 0,
    completados: 0,
    porcentaje: 0,
  })
  const [isCargandoVideo, setIsCargandoVideo] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // --- NUEVOS ESTADOS PARA LA CALIFICACIÓN ---
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [estrellas, setEstrellas] = useState(0)
  const [comentario, setComentario] = useState("")
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)

  const fetchProgresoCurso = async (token: string) => {
    try {
      const res = await fetch(`/api/progreso/curso/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setProgreso(data)
      }
    } catch (e) {
      console.error("Error al cargar progreso", e)
    }
  }

  useEffect(() => {
    const fetchContenido = async () => {
      const storedUserStr = localStorage.getItem("edufy_user")
      if (!storedUserStr) {
        router.push("/login")
        return
      }
      const { token } = JSON.parse(storedUserStr)

      try {
        const [resVideos, resCursos] = await Promise.all([
          fetch(`/api/videos/curso/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`/api/cursos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const videosData = await resVideos.json()
        const cursosData = await resCursos.json()

        if (!resVideos.ok) throw new Error("Error al cargar los videos")

        if (Array.isArray(videosData) && videosData.length > 0) {
          setVideos(videosData)
          setVideoActual(videosData[0])
        }

        if (Array.isArray(cursosData)) {
          const info = cursosData.find((c) => String(c.id_curso) === String(id))
          if (info) {
            setCurso({
              id_curso: info.id_curso,
              nombre: info.nombre,
              descripcion: info.descripcion,
            })
          }
        }

        await fetchProgresoCurso(token)
      } catch (err: any) {
        setError("No pudimos cargar el contenido del curso.")
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchContenido()
  }, [id, router])

  const handleSeleccionarVideo = (video: Video) => {
    if (video.id_video === videoActual?.id_video) return

    const isDesbloqueado =
      video.orden <= progreso.completados + 1 || progreso.porcentaje === 100

    if (!isDesbloqueado) {
      toast.error(
        "Debes completar el video anterior para desbloquear esta lección."
      )
      return
    }

    setVideoActual(video)
  }

  const handleVideoTerminado = async () => {
    if (!videoActual) return
    const { token } = JSON.parse(localStorage.getItem("edufy_user")!)

    try {
      const res = await fetch("/api/progreso/visto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_video: videoActual.id_video }),
      })

      if (res.ok) {
        toast.success("¡Lección completada!")

        await fetchProgresoCurso(token)

        const indiceActual = videos.findIndex(
          (v) => v.id_video === videoActual.id_video
        )
        if (indiceActual < videos.length - 1) {
          const siguienteVideo = videos[indiceActual + 1]
          setVideoActual(siguienteVideo)
          toast.info(`Reproduciendo siguiente: ${siguienteVideo.titulo}`)
        } else {
          // --- AQUÍ ABRIMOS EL MODAL AL TERMINAR EL CURSO ---
          toast.success(
            "¡Felicidades! Has completado todos los videos del curso."
          )
          setIsRatingModalOpen(true)
        }
      }
    } catch (error) {
      console.error("Error al marcar video", error)
    }
  }

  // --- FUNCIÓN PARA ENVIAR LA CALIFICACIÓN ---
  const handleEnviarCalificacion = async () => {
    if (estrellas === 0) {
      toast.error("Por favor selecciona una calificación de estrellas.")
      return
    }

    setIsSubmittingRating(true)
    const { token } = JSON.parse(localStorage.getItem("edufy_user")!)

    try {
      const res = await fetch("/api/calificaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_curso: Number(id),
          estrellas,
          comentario,
        }),
      })

      if (res.ok) {
        toast.success("¡Gracias por tu opinión!", {
          description: "Ya puedes descargar tu certificado en el panel.",
        })
        setIsRatingModalOpen(false) // Cerramos el modal

        // Opcional: Podrías redirigirlo al dashboard de certificados aquí
        // router.push("/dashboard/estudiante/certificados")
      } else {
        const data = await res.json()
        toast.error(data.error || "Error al enviar la calificación")
      }
    } catch (error) {
      toast.error("Error de conexión")
    } finally {
      setIsSubmittingRating(false)
    }
  }

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  if (error || !curso)
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <Info className="mb-4 h-10 w-10 text-destructive" />
        <p>{error}</p>
        <Button onClick={() => router.back()} className="mt-4">
          Regresar
        </Button>
      </div>
    )

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="mr-4 hover:bg-primary/10"
            >
              <Link href="/dashboard/estudiante/cursos">
                <ArrowLeft className="mr-2 h-4 w-4" /> Mis Cursos
              </Link>
            </Button>
            <Separator orientation="vertical" className="mr-4 h-6" />
            <h1 className="truncate text-sm font-bold md:text-base">
              {curso.nombre}
            </h1>
          </div>

          <div className="hidden w-64 items-center gap-3 md:flex">
            <Progress value={progreso.porcentaje} className="h-2" />
            <span className="text-xs font-medium whitespace-nowrap text-muted-foreground">
              {Math.round(progreso.porcentaje)}%
            </span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col lg:flex-row">
        <div className="flex-1 overflow-y-auto bg-black/5 p-4 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {videoActual ? (
              <>
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
                  {isCargandoVideo && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                  <video
                    key={videoActual.id_video}
                    src={videoActual.url_video}
                    className="h-full w-full outline-none"
                    controls
                    autoPlay
                    controlsList="nodownload"
                    onEnded={handleVideoTerminado}
                  />
                </div>

                <div className="mt-8 flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-foreground">
                      {videoActual.titulo}
                    </h2>
                    <Badge variant="secondary" className="px-3 py-1">
                      Lección {videoActual.orden}
                    </Badge>
                  </div>
                  <Separator className="my-2" />
                  <p className="leading-relaxed text-muted-foreground">
                    {curso.descripcion}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex h-[500px] flex-col items-center justify-center rounded-xl border-2 border-dashed">
                <p>No hay contenido disponible.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full border-t bg-card lg:w-[400px] lg:border-t-0 lg:border-l">
          <div className="flex h-full flex-col">
            <div className="p-6">
              <h3 className="text-lg font-bold">Contenido del curso</h3>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>
                  {progreso.completados} de {progreso.total} lecciones
                  completadas
                </p>
                <Progress
                  value={progreso.porcentaje}
                  className="mt-2 h-1.5 md:hidden"
                />
              </div>
            </div>
            <Separator />
            <ScrollArea className="flex-1">
              <div className="flex flex-col">
                {videos.map((video, index) => {
                  const isActual = videoActual?.id_video === video.id_video
                  const isDesbloqueado =
                    video.orden <= progreso.completados + 1 ||
                    progreso.porcentaje === 100
                  const isCompletado = video.orden <= progreso.completados

                  return (
                    <button
                      key={video.id_video}
                      onClick={() => handleSeleccionarVideo(video)}
                      disabled={isCargandoVideo}
                      className={`group flex items-center gap-4 border-b p-5 text-left transition-all ${
                        isActual
                          ? "border-l-4 border-l-primary bg-primary/10"
                          : !isDesbloqueado
                            ? "cursor-not-allowed bg-muted/20 opacity-60"
                            : "hover:bg-primary/5"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                          isCompletado
                            ? "border-green-500 bg-green-500 text-white"
                            : isActual
                              ? "border-primary bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isCompletado ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <p
                          className={`truncate text-sm font-semibold ${isActual ? "text-primary" : "text-foreground"}`}
                        >
                          {video.titulo}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          {!isDesbloqueado && (
                            <Lock className="h-3 w-3 text-destructive" />
                          )}
                          <Clock className="h-3 w-3" />
                          <span>{video.duracion} seg</span>
                        </div>
                      </div>
                      {isActual && (
                        <ChevronRight className="h-5 w-5 animate-pulse text-primary" />
                      )}
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </aside>
      </main>

      {/* --- MODAL PARA CALIFICAR EL CURSO --- */}
      <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl text-primary">
              ¡Felicidades!
            </DialogTitle>
            <DialogDescription className="text-base">
              Has terminado el curso. Ayuda a la comunidad dejando tu opinión.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-6">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEstrellas(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      star <= estrellas
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground hover:text-yellow-200"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="comentario">Comentario (Opcional)</Label>
              <Textarea
                id="comentario"
                placeholder="¿Qué te pareció el curso? ¿Fue claro el profesor?"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="resize-none"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full"
              onClick={handleEnviarCalificacion}
              disabled={isSubmittingRating}
            >
              {isSubmittingRating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Calificación"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
