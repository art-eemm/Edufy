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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress" // Usaremos el componente de progreso
import { toast } from "sonner"
import Link from "next/link"

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

  // Nuevos estados para progreso
  const [progreso, setProgreso] = useState({
    total: 0,
    completados: 0,
    porcentaje: 0,
  })
  const [isCargandoVideo, setIsCargandoVideo] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

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
          setVideoActual(videosData[0]) // Por defecto cargamos el primero
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

        // Cargar el progreso inicial
        await fetchProgresoCurso(token)
      } catch (err: any) {
        setError("No pudimos cargar el contenido del curso.")
      } finally {
        setIsLoading(false)
      }
    }
    if (id) fetchContenido()
  }, [id, router])

  // Función para validar si se puede ver un video al hacer clic en la lista
  const handleSeleccionarVideo = async (video: Video) => {
    if (video.id_video === videoActual?.id_video) return

    setIsCargandoVideo(true)
    const { token } = JSON.parse(localStorage.getItem("edufy_user")!)

    try {
      const res = await fetch(`/api/progreso/video/${video.id_video}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()

      if (!res.ok || !data.permitido) {
        toast.error(
          "Debes completar el video anterior para desbloquear esta lección."
        )
        return
      }

      setVideoActual(video)
    } catch (error) {
      toast.error("Error al validar acceso al video")
    } finally {
      setIsCargandoVideo(false)
    }
  }

  // Función que se dispara cuando el video llega a su fin automáticamente
  const handleVideoTerminado = async () => {
    if (!videoActual) return
    const { token } = JSON.parse(localStorage.getItem("edufy_user")!)

    try {
      // 1. Marcar como visto
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

        // 2. Actualizar la barra de progreso
        await fetchProgresoCurso(token)

        // 3. Avanzar automáticamente al siguiente video si existe
        const indiceActual = videos.findIndex(
          (v) => v.id_video === videoActual.id_video
        )
        if (indiceActual < videos.length - 1) {
          const siguienteVideo = videos[indiceActual + 1]
          setVideoActual(siguienteVideo) // Lo liberamos automáticamente
          toast.info(`Reproduciendo siguiente: ${siguienteVideo.titulo}`)
        } else {
          toast.success(
            "¡Felicidades! Has completado todos los videos del curso.",
            {
              description: "Ya puedes descargar tu certificado en el panel.",
            }
          )
        }
      }
    } catch (error) {
      console.error("Error al marcar video", error)
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

          {/* Barra de progreso en el header */}
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
                    onEnded={handleVideoTerminado} // <--- MAGIA: Escucha el final del video
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
                  // Si su orden es menor o igual a las completadas + 1, asumimos que está desbloqueado visualmente
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
    </div>
  )
}
