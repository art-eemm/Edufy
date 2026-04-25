"use client"

import Link from "next/link"
import {
  Plus,
  Edit,
  Eye,
  Users,
  Star,
  BookOpen,
  MoreHorizontal,
  Trash2,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { courses } from "@/lib/mock-data"

export default function TeacherCoursesPage() {
  // Filter courses for the current teacher (María García, id: 2)
  const teacherCourses = courses.filter((c) => c.teacherId === "2")

  const statusColors = {
    published: "bg-success/70",
    draft: "bg-warning/70",
    archived: "bg-muted text-muted-foreground",
  }

  const levelColors = {
    principiante: "bg-chart-2/70 ",
    intermedio: "bg-chart-5/70",
    avanzado: "bg-chart-3/70",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Cursos</h1>
          <p className="mt-1 text-muted-foreground">
            Gestiona y edita tus cursos
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/profesor/crear">
            <Plus className="mr-2 h-4 w-4" />
            Crear Curso
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {teacherCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <BookOpen className="h-12 w-12 text-primary/50" />
              </div>
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className={statusColors[course.status]}>
                  {course.status === "published"
                    ? "Publicado"
                    : course.status === "draft"
                      ? "Borrador"
                      : "Archivado"}
                </Badge>
                <Badge className={levelColors[course.level]}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="line-clamp-1 text-lg">
                {course.title}
              </CardTitle>
              <CardDescription>{course.category}</CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {course.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.studentsCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-chart-5 text-chart-5" />
                    {course.rating}
                  </span>
                </div>
                <p className="text-lg font-bold text-primary">
                  ${course.price}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/dashboard/profesor/cursos/${course.id}`}>
                    <Eye className="mr-1 h-3 w-3" />
                    Ver
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/dashboard/profesor/cursos/${course.id}/editar`}>
                    <Edit className="mr-1 h-3 w-3" />
                    Editar
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
    </div>
  )
}
