"use client"

import { useState } from "react"
import { Search, Filter, BookOpen, TrendingUp, Mail } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { courses, enrollments, users } from "@/lib/mock-data"

// Get students enrolled in teacher's courses (teacher ID = 2)
const teacherCourses = courses.filter((c) => c.teacherId === "2")
const teacherCourseIds = teacherCourses.map((c) => c.id)

const enrolledStudents = enrollments
  .filter((e) => teacherCourseIds.includes(e.courseId))
  .map((e) => {
    const student = users.find((u) => u.id === e.userId)
    const course = courses.find((c) => c.id === e.courseId)
    return {
      ...e,
      studentName: student?.name || "Desconocido",
      studentEmail: student?.email || "",
      studentAvatar: student?.avatar || "",
      courseName: course?.title || "Curso no encontrado",
    }
  })

export default function EstudiantesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState<string>("all")

  const filteredStudents = enrolledStudents.filter((student) => {
    const matchesSearch =
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse =
      courseFilter === "all" || student.courseId === courseFilter
    return matchesSearch && matchesCourse
  })

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-success"
    if (progress >= 50) return "text-warning-foreground"
    return "text-muted-foreground"
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mis Estudiantes</h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona y monitorea el progreso de tus estudiantes
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
                  Total Estudiantes
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {enrolledStudents.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Progreso Promedio
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(
                    enrolledStudents.reduce((acc, s) => acc + s.progress, 0) /
                      enrolledStudents.length || 0
                  )}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cursos Activos</p>
                <p className="text-2xl font-bold text-foreground">
                  {teacherCourses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
          <CardDescription>Estudiantes inscritos en tus cursos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar estudiantes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {courseFilter === "all"
                    ? "Todos los cursos"
                    : teacherCourses.find((c) => c.id === courseFilter)?.title}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setCourseFilter("all")}>
                  Todos los cursos
                </DropdownMenuItem>
                {teacherCourses.map((course) => (
                  <DropdownMenuItem
                    key={course.id}
                    onClick={() => setCourseFilter(course.id)}
                  >
                    {course.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Progreso</TableHead>
                  <TableHead>Última Actividad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No se encontraron estudiantes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {student.studentName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">
                              {student.studentName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {student.studentEmail}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{student.courseName}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={student.progress} className="w-20" />
                          <span
                            className={`text-sm font-medium ${getProgressColor(student.progress)}`}
                          >
                            {student.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(student.lastAccessedAt).toLocaleDateString(
                          "es-ES"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
