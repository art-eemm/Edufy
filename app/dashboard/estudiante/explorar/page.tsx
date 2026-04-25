"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, BookOpen, Clock, Users, Star } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { courses, categories } from "@/lib/mock-data"

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter
    const matchesLevel = levelFilter === "all" || course.level === levelFilter
    return matchesSearch && matchesCategory && matchesLevel
  })

  const levelColors = {
    principiante: "bg-success/70 border-success/20",
    intermedio: "bg-warning/70 border-warning/20",
    avanzado: "bg-destructive/70 border-destructive/20",
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Explorar Cursos</h1>
        <p className="mt-1 text-muted-foreground">
          Descubre nuevos cursos para continuar aprendiendo
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Cursos</CardTitle>
          <CardDescription>
            {filteredCourses.length} cursos disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {categoryFilter === "all" ? "Categoría" : categoryFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                  Todas
                </DropdownMenuItem>
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {levelFilter === "all"
                    ? "Nivel"
                    : levelFilter.charAt(0).toUpperCase() +
                      levelFilter.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLevelFilter("all")}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLevelFilter("principiante")}
                >
                  Principiante
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLevelFilter("intermedio")}>
                  Intermedio
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLevelFilter("avanzado")}>
                  Avanzado
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <Link href={`/curso/${course.id}`}>
                  <div className="relative aspect-video bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
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
                    <Link href={`/curso/${course.id}`}>Ver Detalles</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
