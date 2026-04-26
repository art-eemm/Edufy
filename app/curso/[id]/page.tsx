"use client"

import { use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  BookOpen,
  Play,
  CheckCircle,
  Award,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { courses, lessons } from "@/lib/mock-data"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const course = courses.find((c) => c.id === resolvedParams.id)
  const courseLessons = lessons.filter((l) => l.courseId === resolvedParams.id)

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Curso no encontrado
            </h1>
            <Button asChild className="mt-4">
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const levelColors = {
    principiante: "bg-success/70 border-success/20",
    intermedio: "bg-warning/70 border-warning/20",
    avanzado: "bg-destructive/70 border-destructive/20",
  }

  const features = [
    "Acceso de por vida al curso",
    "Certificado de finalización",
    "Proyectos prácticos",
    "Soporte del instructor",
    "Actualizaciones gratuitas",
    "Acceso en dispositivos móviles",
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="bg-muted/30 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/cursos"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a cursos
            </Link>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Badge className={levelColors[course.level]}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </Badge>
                <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
                  {course.title}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {course.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">
                        {course.teacherName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground">
                      {course.teacherName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Star className="h-4 w-4 fill-chart-5 text-chart-5" />
                    <span className="font-medium text-foreground">
                      {course.rating}
                    </span>
                    <span>
                      ({course.studentsCount.toLocaleString()} estudiantes)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    {course.lessonsCount} lecciones
                  </div>
                </div>
              </div>

              <div>
                <Card className="sticky top-24">
                  <div className="relative aspect-video overflow-hidden rounded-t-xl bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                        <Play className="h-8 w-8 fill-white text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">
                        ${course.price}
                      </span>
                    </div>
                    <Button className="mt-4 w-full" size={"lg"} asChild>
                      <Link href={`/curso/${course.id}/aprender`}>
                        Inscribirse Ahora
                      </Link>
                    </Button>
                    <Button variant="outline" className="mt-3 w-full" size="lg">
                      Agregar al Carrito
                    </Button>

                    <ul className="mt-6 flex flex-col gap-2.5">
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="h-4 w-4 text-success" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="lg:px8 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Contenido del Curso</CardTitle>
                    <CardDescription>
                      {courseLessons.length} lecciones - {course.duration} de
                      contenido
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      {courseLessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between rounded-lg border border-border p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {lesson.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {lesson.description}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {lesson.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Sobre el Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-primary/10 text-lg text-primary">
                          {course.teacherName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {course.teacherName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Instructor Profesional
                        </p>
                        <p className="mt-3 leading-relaxed text-muted-foreground">
                          Profesional con más de 10 años de experiencia en la
                          industria tecnológica. Apasionado por la enseñanza y
                          el desarrollo de nuevos talentos.
                        </p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-chart-5 text-chart-5" />
                            4.8 calificación
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            5,000+ estudiantes
                          </span>
                          <span className="flex items-center gap-1">
                            <Award className="h-4 w-4" />3 cursos
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Lo que aprenderás</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col gap-3">
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        Dominar los conceptos fundamentales de {course.category}
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        Crear proyectos prácticos aplicables al mundo real
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        Implementar las mejores prácticas de la industria
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        Prepararte para entrevistas técnicas
                      </li>
                      <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        Obtener un certificado verificable
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Requisitos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-foreground">-</span>
                        Computadora con acceso a internet
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground">-</span>
                        Conocimientos básicos de programación (para nivel
                        intermedio/avanzado)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-foreground">-</span>
                        Ganas de aprender y practicar
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
