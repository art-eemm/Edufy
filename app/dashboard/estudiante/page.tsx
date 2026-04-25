"use client"

import Link from "next/link"
import { BookOpen, Clock, Award, Flame, Play, ArrowRight } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { StatCard } from "@/components/dashboard/sat-card"
import {
  studentStats,
  courses,
  enrollments,
  certificates,
} from "@/lib/mock-data"

export default function StudentDashboardPage() {
  // Get enrolled courses for this student (id: 4)
  const studentEnrollments = enrollments.filter((e) => e.userId === "4")
  const enrolledCourses = studentEnrollments.map((e) => ({
    ...courses.find((c) => c.id === e.courseId)!,
    progress: e.progress,
    lastAccessed: e.lastAccessedAt,
  }))

  // Get in-progress course
  const inProgressCourse = enrolledCourses.find((c) => c.progress < 100)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Panel del Estudiante
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenida, Ana. Continúa donde lo dejaste.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Cursos Inscritos"
          value={studentStats.enrolledCourses.toString()}
          icon={BookOpen}
        />
        <StatCard
          title="Cursos Completados"
          value={studentStats.completedCourses.toString()}
          icon={Award}
          iconClassName="bg-success/20 text-success"
        />
        <StatCard
          title="Horas Aprendidas"
          value={studentStats.hoursLearned.toString()}
          icon={Clock}
          iconClassName="bg-chart-2/20 text-chart-2"
        />
        <StatCard
          title="Certificados"
          value={studentStats.certificates.toString()}
          icon={Award}
          iconClassName="bg-chart-5/20 text-chart-5"
        />
        <StatCard
          title="Racha Actual"
          value={`${studentStats.currentStreak} días`}
          icon={Flame}
          iconClassName="bg-chart-3/20 text-chart-3"
        />
      </div>

      {/* Continue Learning */}
      {inProgressCourse && (
        <Card className="overflow-hidden bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="hidden h-20 w-20 items-center justify-center rounded-xl bg-primary/10 sm:flex">
                  <Play className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">
                    Continuar Aprendiendo
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-foreground">
                    {inProgressCourse.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {inProgressCourse.teacherName} - {inProgressCourse.category}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Progress
                      value={inProgressCourse.progress}
                      className="h-2 w-48"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {inProgressCourse.progress}%
                    </span>
                  </div>
                </div>
              </div>
              <Button size="lg" asChild>
                <Link href={`/curso/${inProgressCourse.id}/aprender`}>
                  <Play className="mr-2 h-4 w-4" />
                  Continuar
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mis Cursos</CardTitle>
            <CardDescription>
              Tu progreso en los cursos inscritos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {enrolledCourses.map((course) => (
                <Link
                  key={course.id}
                  href={`/curso/${course.id}/aprender`}
                  className="group flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground transition-colors group-hover:text-primary">
                        {course.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {course.teacherName}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Progress
                          value={course.progress}
                          className="h-1.5 w-24"
                        />
                        <span className="text-xs text-muted-foreground">
                          {course.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </Link>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/dashboard/estudiante/explorar">
                Explorar más cursos
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis Certificados</CardTitle>
            <CardDescription>
              Certificados obtenidos por completar cursos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {certificates.length > 0 ? (
              <div className="flex flex-col gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-5/20">
                        <Award className="h-6 w-6 text-chart-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {cert.courseName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Emitido: {cert.issuedAt}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Descargar
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Award className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 font-medium text-foreground">
                  Sin certificados aún
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Completa un curso para obtener tu primer certificado
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
