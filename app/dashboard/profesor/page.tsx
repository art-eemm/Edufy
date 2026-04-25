"use client"

import {
  Users,
  BookOpen,
  DollarSign,
  Star,
  TrendingUp,
  Award,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StatCard } from "@/components/dashboard/sat-card"
import { teacherStats, courses, enrollments } from "@/lib/mock-data"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const studentsPerMonth = [
  { month: "Ene", students: 85 },
  { month: "Feb", students: 120 },
  { month: "Mar", students: 180 },
  { month: "Abr", students: 220 },
  { month: "May", students: 195 },
  { month: "Jun", students: 280 },
]

export default function TeacherDashboardPage() {
  // Filter courses for the current teacher (María García, id: 2)
  const teacherCourses = courses.filter((c) => c.teacherId === "2")
  const recentEnrollments = enrollments.slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Panel del Profesor
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenida, María. Aquí está el resumen de tus cursos.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          title="Total Estudiantes"
          value={teacherStats.totalStudents.toLocaleString()}
          icon={Users}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Mis Cursos"
          value={teacherStats.totalCourses.toString()}
          icon={BookOpen}
          iconClassName="bg-chart-2/20 text-chart-2"
        />
        <StatCard
          title="Ingresos Totales"
          value={`$${(teacherStats.totalRevenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          iconClassName="bg-success/20 text-success"
          trend={{ value: 22, isPositive: true }}
        />
        <StatCard
          title="Calificación"
          value={teacherStats.averageRating.toFixed(1)}
          icon={Star}
          iconClassName="bg-chart-5/20 text-chart-5"
        />
        <StatCard
          title="Tasa Completación"
          value={`${teacherStats.completionRate}%`}
          icon={Award}
          iconClassName="bg-chart-4/20 text-chart-4"
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Nuevos Estudiantes</CardTitle>
          <CardDescription>
            Evolución de inscripciones en los últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={studentsPerMonth}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="month"
                  className="fill-muted-foreground text-xs"
                />
                <YAxis className="fill-muted-foreground text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [value, "Estudiantes"]}
                />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Courses and Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mis Cursos</CardTitle>
            <CardDescription>Rendimiento de tus cursos activos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {teacherCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">
                        {course.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {course.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-chart-5">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {course.studentsCount} estudiantes
                    </span>
                    <span className="font-medium text-primary">
                      ${course.price}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progreso promedio</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inscripciones Recientes</CardTitle>
            <CardDescription>
              Últimos estudiantes inscritos en tus cursos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {recentEnrollments.map((enrollment) => {
                const course = courses.find((c) => c.id === enrollment.courseId)
                return (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {course?.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Nuevo estudiante inscrito
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {enrollment.enrolledAt}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
