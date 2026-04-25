"use client"

import {
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Star,
  Award,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { teacherStats, courses, enrollments, users } from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

// Teacher's courses (ID = 2)
const teacherCourses = courses.filter((c) => c.teacherId === "2")

const monthlyStudents = [
  { month: "Ene", students: 120, revenue: 4800 },
  { month: "Feb", students: 150, revenue: 6000 },
  { month: "Mar", students: 180, revenue: 7200 },
  { month: "Abr", students: 220, revenue: 8800 },
  { month: "May", students: 195, revenue: 7800 },
  { month: "Jun", students: 250, revenue: 10000 },
]

const coursePerformance = teacherCourses.map((course) => ({
  name: course.title.split(" ").slice(0, 2).join(" "),
  students: course.studentsCount,
  rating: course.rating,
  revenue: Math.round(course.studentsCount * course.price),
}))

const studentProgress = [
  { range: "0-25%", count: 15 },
  { range: "26-50%", count: 25 },
  { range: "51-75%", count: 35 },
  { range: "76-100%", count: 45 },
]

export default function EstadisticasProfesorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Estadísticas</h1>
        <p className="mt-1 text-muted-foreground">
          Análisis de rendimiento de tus cursos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Estudiantes
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {teacherStats.totalStudents.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-success">+15% este mes</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Cursos Activos
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {teacherStats.totalCourses}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Publicados</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ingresos Totales
                </p>
                <p className="text-3xl font-bold text-foreground">
                  ${(teacherStats.totalRevenue / 1000).toFixed(0)}k
                </p>
                <p className="mt-1 text-sm text-success">+22% este mes</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Calificación Promedio
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {teacherStats.averageRating}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">de 5.0</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-5/10">
                <Star className="h-6 w-6 text-chart-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Evolución de Estudiantes
            </CardTitle>
            <CardDescription>Nuevos estudiantes por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyStudents}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number | undefined) =>
                      value !== undefined
                        ? [value, "Estudiantes"]
                        : ["N/A", "Estudiantes"]
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Ingresos Mensuales
            </CardTitle>
            <CardDescription>Ganancias por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStudents}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis
                    className="text-xs"
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number | undefined) => [
                      value !== undefined ? `$${value.toLocaleString()}` : "$0",
                      "Ingresos",
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Progreso</CardTitle>
            <CardDescription>
              Progreso de estudiantes en tus cursos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentProgress}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    label={(props) =>
                      `${studentProgress[props.index].range}: ${studentProgress[props.index].count}`
                    }
                  >
                    {studentProgress.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value, "Estudiantes"]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Curso</CardTitle>
            <CardDescription>Comparativa de tus cursos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {coursePerformance.map((course, index) => (
                <div key={course.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{course.name}</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-chart-5 text-chart-5" />
                      <span className="text-sm font-medium">
                        {course.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(course.students / 2000) * 100}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                    <p className="w-24 text-sm text-muted-foreground">
                      {course.students.toLocaleString()} est.
                    </p>
                    <p className="w-20 text-right text-sm font-medium text-foreground">
                      ${(course.revenue / 1000).toFixed(1)}k
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Tasa de Completación
          </CardTitle>
          <CardDescription>
            Porcentaje de estudiantes que completan tus cursos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="relative h-32 w-32">
              <svg className="h-32 w-32 -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="12"
                  strokeDasharray={`${teacherStats.completionRate * 3.51} 351`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">
                  {teacherStats.completionRate}%
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  Estudiantes que completaron
                </p>
                <p className="font-medium text-foreground">2,981</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Estudiantes en progreso</p>
                <p className="font-medium text-foreground">1,159</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Certificados emitidos</p>
                <p className="font-medium text-foreground">2,654</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
