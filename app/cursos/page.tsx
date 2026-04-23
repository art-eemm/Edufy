"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  BookOpen,
  Clock,
  Users,
  Star,
  SlidersHorizontal,
  ArrowLeft,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { courses, categories } from "@/lib/mock-data"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function CursosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("popular")

  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        categoryFilter === "all" || course.category === categoryFilter
      const matchesLevel = levelFilter === "all" || course.level === levelFilter
      return matchesSearch && matchesCategory && matchesLevel
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.studentsCount - a.studentsCount
        case "rating":
          return b.rating - a.rating
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        default:
          return 0
      }
    })

  const levelColors = {
    principiante: "bg-success/70 border-success/20",
    intermedio: "bg-warning/70 border-warning/20",
    avanzado: "bg-destructive/70 border-destructive/20",
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href={"/"}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-foreground">
            Explora Nuestros Cursos
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Descubre cursos de alta calidad impartidos por expertos en la
            industria
          </p>
        </div>

        <div className="mb-8 rounded-xl border bg-card p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Busca cursos por nombre o tema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  <SelectItem value="principiante">Principiante</SelectItem>
                  <SelectItem value="intermedio">Intermedio</SelectItem>
                  <SelectItem value="avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Más populares</SelectItem>
                  <SelectItem value="rating">Mejor valorados</SelectItem>
                  <SelectItem value="newest">Más recientes</SelectItem>
                  <SelectItem value="price-low">
                    Precio: menor a mayor
                  </SelectItem>
                  <SelectItem value="price-high">
                    Precio: mayor a menor
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {(categoryFilter !== "all" ||
            levelFilter !== "all" ||
            searchTerm) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Filtros activos:
              </span>
              {searchTerm && (
                <Badge variant={"secondary"} className="gap-1">
                  Búsqueda: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-destructive"
                  >
                    x
                  </button>
                </Badge>
              )}
              {categoryFilter !== "all" && (
                <Badge variant={"secondary"} className="gap-1">
                  {categoryFilter}
                  <button
                    onClick={() => setCategoryFilter("all")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {levelFilter !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {levelFilter.charAt(0).toUpperCase() + levelFilter.slice(1)}
                  <button
                    onClick={() => setLevelFilter("all")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("all")
                  setLevelFilter("all")
                }}
              >
                Limpiar todo
              </Button>
            </div>
          )}
        </div>

        <p className="mb-6 text-muted-foreground">
          {filteredCourses.length}{" "}
          {filteredCourses.length === 1
            ? "curso encontrado"
            : "cursos encontrados"}
        </p>

        {/* Cursos */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <Link href={`/curso/${course.id}`}>
                <div className="relative aspect-video bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
                    <BookOpen className="h-12 w-12 text-primary/50" />
                  </div>
                  <Badge
                    className={`absolute top-3 right-3 ${levelColors[course.level]}`}
                  >
                    {course.level.charAt(0).toUpperCase() +
                      course.level.slice(1)}
                  </Badge>
                </div>
              </Link>
              <CardContent className="p-5">
                <p className="text-xs font-medium text-primary">
                  {course.category}
                </p>
                <Link href={`/curso/${course.id}`}>
                  <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                    {course.title}
                  </h3>
                </Link>
                <p className="mt-2 text-sm text-muted-foreground">
                  {course.teacherName}
                </p>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.studentsCount.toLocaleString()}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-chart-5 text-chart-5" />
                    <span className="font-medium text-foreground">
                      {course.rating}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    ${course.price}
                  </p>
                </div>
                <Button className="mt-4 w-full" asChild>
                  <Link href={`/curso/${course.id}`}>Ver detalles</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-semibold text-foreground">
              No se encontraron cursos
            </h3>
            <p className="mt-2 text-muted-foreground">
              Intenta ajustar los filtros de búsqueda
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
                setLevelFilter("all")
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
