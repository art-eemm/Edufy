"use client"

import Link from "next/link"
import { Play, Clock, BookOpen, Award, TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { courses, enrollments } from "@/lib/mock-data"

export default function MisCursosPage() {
  // Get enrolled courses for student (Ana Martínez, id: 4)
  const studentEnrollments = enrollments.filter((e) => e.userId === "4")
  const enrolledCourses = studentEnrollments
    .map((enrollment) => {
      const course = courses.find((c) => c.id === enrollment.courseId)
      return {
        ...enrollment,
        course,
      }
    })
    .filter((e) => e.course)

  const completedCourses = enrolledCourses.filter((e) => e.progress === 100)
  const inProgressCourses = enrolledCourses.filter((e) => e.progress < 100)

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-success"
    if (progress >= 50) return "bg-chart-5"
    return "bg-primary"
  }

  const levelColors = {
    principiante: "bg-success/70 border-success/20",
    intermedio: "bg-warning/70 border-warning/20",
    avanzado: "bg-destructive/70 border-destructive/20",
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mis Cursos</h1>
        <p className="mt-1 text-muted-foreground">
          Continúa aprendiendo donde lo dejaste
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Cursos Inscritos
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {enrolledCourses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <Award className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold text-foreground">
                  {completedCourses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-5/10">
                <TrendingUp className="h-6 w-6 text-chart-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En Progreso</p>
                <p className="text-2xl font-bold text-foreground">
                  {inProgressCourses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* In Progress */}
      {inProgressCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>En Progreso</CardTitle>
            <CardDescription>Continúa donde lo dejaste</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inProgressCourses.map((enrollment) => (
                <Card key={enrollment.id} className="group overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                      <BookOpen className="h-12 w-12 text-primary/50" />
                    </div>
                    <Badge
                      className={`absolute top-3 right-3 ${levelColors[enrollment.course!.level]}`}
                    >
                      {enrollment.course!.level.charAt(0).toUpperCase() +
                        enrollment.course!.level.slice(1)}
                    </Badge>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button asChild>
                        <Link href={`/curso/${enrollment.courseId}/aprender`}>
                          <Play className="mr-2 h-4 w-4" />
                          Continuar
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-primary">
                      {enrollment.course!.category}
                    </p>
                    <h3 className="mt-1 line-clamp-2 font-semibold text-foreground">
                      {enrollment.course!.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {enrollment.course!.teacherName}
                    </p>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium text-foreground">
                          {enrollment.progress}%
                        </span>
                      </div>
                      <Progress
                        value={enrollment.progress}
                        className={getProgressColor(enrollment.progress)}
                      />
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {enrollment.course!.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {enrollment.course!.lessonsCount} lecciones
                      </span>
                    </div>

                    <Button className="mt-4 w-full" asChild>
                      <Link href={`/curso/${enrollment.courseId}/aprender`}>
                        <Play className="mr-2 h-4 w-4" />
                        Continuar Aprendiendo
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed */}
      {completedCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completados</CardTitle>
            <CardDescription>Cursos que has terminado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedCourses.map((enrollment) => (
                <Card key={enrollment.id} className="overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-success/20 to-accent/20">
                      <Award className="h-12 w-12 text-success/50" />
                    </div>
                    <Badge className="absolute top-3 right-3 bg-success/10 text-success">
                      Completado
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-primary">
                      {enrollment.course!.category}
                    </p>
                    <h3 className="mt-1 line-clamp-2 font-semibold text-foreground">
                      {enrollment.course!.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {enrollment.course!.teacherName}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/curso/${enrollment.courseId}/aprender`}>
                          <Play className="mr-1 h-3 w-3" />
                          Repasar
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <Link href="/dashboard/estudiante/certificados">
                          <Award className="mr-1 h-3 w-3" />
                          Certificado
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {enrolledCourses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No tienes cursos inscritos
            </h3>
            <p className="mt-2 text-muted-foreground">
              Explora nuestro catálogo y comienza a aprender
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/estudiante/explorar">Explorar Cursos</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
