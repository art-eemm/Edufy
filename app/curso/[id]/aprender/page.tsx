"use client"

import { useState, use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Lock,
  Menu,
  X,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { courses, lessons } from "@/lib/mock-data"

export default function CoursePlayerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState<string[]>(["1", "2"])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const course = courses.find((c) => c.id === resolvedParams.id)
  const courseLessons = lessons.filter((l) => l.courseId === resolvedParams.id)
  const currentLesson = courseLessons[currentLessonIndex]

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Curso no encontrado
          </h1>
          <Button asChild className="mt-4">
            <Link href="/dashboard/estudiante">Volver al Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const progress =
    courseLessons.length > 0
      ? Math.round((completedLessons.length / courseLessons.length) * 100)
      : 0

  const handleLessonComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id])
    }
  }

  const handleNextLesson = () => {
    if (currentLessonIndex < courseLessons.length - 1) {
      handleLessonComplete()
      setCurrentLessonIndex(currentLessonIndex + 1)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-lg lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-80 flex-col border-r border-border bg-card transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-border px-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/estudiante">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {course.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {course.teacherName}
            </p>
          </div>
        </div>

        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progreso del curso</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-2 h-2" />
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Contenido del Curso
            </h3>
            <div className="flex flex-col gap-1">
              {courseLessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id)
                const isCurrent = index === currentLessonIndex
                const isLocked = index > completedLessons.length

                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      if (!isLocked) {
                        setCurrentLessonIndex(index)
                        setIsSidebarOpen(false)
                      }
                    }}
                    disabled={isLocked}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors",
                      isCurrent
                        ? "bg-primary/10 text-primary"
                        : isLocked
                          ? "cursor-not-allowed opacity-50"
                          : "text-foreground hover:bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
                        isCompleted
                          ? "bg-success text-success-foreground"
                          : isCurrent
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : isLocked ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lesson.duration}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:pl-80">
        <div className="flex min-h-screen flex-col">
          {/* Video player area */}
          <div className="relative aspect-video w-full bg-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-white">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                  <Play className="h-10 w-10 fill-white" />
                </div>
                <p className="text-lg font-medium">
                  {currentLesson?.title || "Selecciona una lección"}
                </p>
              </div>
            </div>
          </div>

          {/* Lesson info */}
          <div className="flex-1 p-6 pt-20 lg:p-8 lg:pt-8">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-primary">
                    Lección {currentLessonIndex + 1} de {courseLessons.length}
                  </p>
                  <h1 className="mt-2 text-2xl font-bold text-foreground">
                    {currentLesson?.title || "Sin título"}
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    {currentLesson?.description || "Sin descripción"}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={handleLessonComplete}
                  disabled={completedLessons.includes(currentLesson?.id || "")}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {completedLessons.includes(currentLesson?.id || "")
                    ? "Completada"
                    : "Marcar como completada"}
                </Button>
                {currentLessonIndex < courseLessons.length - 1 && (
                  <Button onClick={handleNextLesson}>
                    Siguiente Lección
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="mt-8 rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Sobre esta lección
                </h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {currentLesson?.description ||
                    "No hay descripción disponible para esta lección."}{" "}
                  Esta lección forma parte del curso &quot;{course.title}&quot;
                  impartido por {course.teacherName}. Al completar todas las
                  lecciones recibirás un certificado de finalización.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
