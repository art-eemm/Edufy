"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  Users,
  BookOpen,
} from "lucide-react"
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

export default function AdminCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const statusColors = {
    published: "bg-success/70",
    draft: "bg-warning/70",
    archived: "bg-muted text-muted-foreground",
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Gestión de Cursos
        </h1>
        <p className="mt-1 text-muted-foreground">
          Administra todos los cursos de la plataforma
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cursos</CardTitle>
          <CardDescription>
            Total: {courses.length} cursos en la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título o instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {categoryFilter === "all"
                    ? "Todas las categorías"
                    : categoryFilter}
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="relative aspect-video bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
                    <BookOpen className="h-12 w-12 text-primary/50" />
                  </div>
                  <Badge
                    className={`absolute top-3 right-3 ${statusColors[course.status]}`}
                  >
                    {course.status === "published"
                      ? "Publicado"
                      : course.status === "draft"
                        ? "Borrador"
                        : "Archivado"}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-primary">
                    {course.category}
                  </p>
                  <h3 className="mt-1 line-clamp-1 font-semibold text-foreground">
                    {course.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {course.teacherName}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.studentsCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-chart-5 text-chart-5" />
                        {course.rating}
                      </span>
                    </div>
                    <p className="font-bold text-primary">${course.price}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <Button variant={"outline"} size={"sm"} className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      Ver
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
