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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchContenido = async () => {
      const storedUser = localStorage.getItem("edufy_user")
      if (!storedUser) {
        router.push("/login")
        return
      }

      const { token } = JSON.parse(storedUser)

      try {
        // Ejecutamos ambas peticiones al mismo tiempo para ahorrar tiempo
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

        // 1. Procesar Videos
        if (Array.isArray(videosData) && videosData.length > 0) {
          // Ya vienen filtrados por estatus: 1 desde tu API
          setVideos(videosData)
          setVideoActual(videosData[0])
        }

        // 2. Procesar Información del Curso
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
      } catch (err: any) {
        console.error(err)
        setError("No pudimos cargar el contenido del curso.")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchContenido()
  }, [id, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="animate-pulse text-sm text-muted-foreground">
            Preparando tus lecciones...
          </p>
        </div>
      </div>
    )
  }

  if (error || !curso) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="mb-4 rounded-full bg-destructive/10 p-4">
          <Info className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold">Ups, algo salió mal</h2>
        <p className="mt-2 max-w-xs text-center text-muted-foreground">
          {error || "El curso no está disponible."}
        </p>
        <Button
          className="mt-6"
          onClick={() => router.push("/dashboard/estudiante")}
        >
          Volver al catálogo
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Barra Superior */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center px-4 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="mr-4 hover:bg-primary/10"
          >
            <Link href="/dashboard/estudiante">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Salir del curso
            </Link>
          </Button>
          <Separator orientation="vertical" className="mr-4 h-6" />
          <div className="flex flex-col overflow-hidden">
            <h1 className="truncate text-sm font-bold md:text-base">
              {curso.nombre}
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              Estás viendo: {videoActual?.titulo || "Cargando..."}
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col lg:flex-row">
        {/* Reproductor y Detalles */}
        <div className="flex-1 overflow-y-auto bg-black/5 p-4 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {videoActual ? (
              <>
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
                  <video
                    key={videoActual.id_video} // Importante para que React reinicie el reproductor al cambiar de video
                    src={videoActual.url_video}
                    className="h-full w-full outline-none"
                    controls
                    autoPlay
                    controlsList="nodownload"
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

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {Math.floor(videoActual.duracion / 60)} min{" "}
                        {videoActual.duracion % 60} seg
                      </span>
                    </div>
                  </div>

                  <Separator className="my-2" />

                  <div>
                    <h3 className="mb-2 font-semibold">Acerca de este curso</h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {curso.descripcion}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-[500px] flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card/50">
                <PlayCircle className="mb-4 h-16 w-16 text-muted-foreground/20" />
                <p className="text-lg font-medium text-muted-foreground">
                  Este curso aún no tiene lecciones publicadas.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Lecciones (Sidebar derecha) */}
        <aside className="w-full border-t bg-card lg:w-[400px] lg:border-t-0 lg:border-l">
          <div className="flex h-full flex-col">
            <div className="p-6">
              <h3 className="text-lg font-bold">Contenido del curso</h3>
              <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                <span>{videos.length} lecciones</span>
                <span>
                  {Math.round(
                    videos.reduce((acc, v) => acc + v.duracion, 0) / 60
                  )}{" "}
                  min total
                </span>
              </div>
            </div>

            <Separator />

            <ScrollArea className="flex-1">
              <div className="flex flex-col">
                {videos.map((video, index) => (
                  <button
                    key={video.id_video}
                    onClick={() => setVideoActual(video)}
                    className={`group flex items-center gap-4 border-b p-5 text-left transition-all hover:bg-primary/5 ${
                      videoActual?.id_video === video.id_video
                        ? "border-l-4 border-l-primary bg-primary/10"
                        : "border-l-4 border-l-transparent"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                        videoActual?.id_video === video.id_video
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <p
                        className={`truncate text-sm font-semibold transition-colors ${
                          videoActual?.id_video === video.id_video
                            ? "text-primary"
                            : "text-foreground group-hover:text-primary"
                        }`}
                      >
                        {video.titulo}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 italic">
                          <PlayCircle className="h-3 w-3" />
                          Video
                        </span>
                        <span>•</span>
                        <span>
                          {Math.floor(video.duracion / 60)}:
                          {String(video.duracion % 60).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    {videoActual?.id_video === video.id_video && (
                      <ChevronRight className="h-5 w-5 animate-pulse text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </aside>
      </main>
    </div>
  )
}
