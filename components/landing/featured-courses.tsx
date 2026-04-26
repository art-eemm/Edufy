"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { CourseCard } from "./course-card"

export function FeaturedCourses() {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/cursos")
        const data = await res.json()

        if (res.ok) {
          const mappedCourses = data.map((c: any) => ({
            id: c.id_curso,
            title: c.nombre,
            description: c.descripcion,
            teacherName: c.perfiles?.nombre_completo || "Profesor",
            createdAt: c.fecha_creacion,
            category: "General",
            level: "principiante",
            duration: "Por definir",
            studentsCount: 0,
            rating: 5.0,
            price: 0,
          }))
          setFeaturedCourses(mappedCourses.slice(0, 6))
        }
      } catch (error) {
        console.error("Error al obtener cursos destacados:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    <section id="cursos" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Cursos Destacados
            </h2>
            <p className="mt-2 text-muted-foreground">
              Los cursos más populares
            </p>
          </div>
          <Button variant={"outline"} asChild>
            <Link href={"/cursos"}>
              Ver todos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}
