"use client"

import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Award,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  adminStats,
  monthlyRevenueData,
  courseEnrollmentData,
} from "@/lib/mock-data"
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
  Area,
  AreaChart,
} from "recharts"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

const weeklyData = [
  { day: "Lun", users: 45, courses: 12, revenue: 2800 },
  { day: "Mar", users: 52, courses: 18, revenue: 3200 },
  { day: "Mié", users: 38, courses: 15, revenue: 2500 },
  { day: "Jue", users: 65, courses: 22, revenue: 4100 },
  { day: "Vie", users: 72, courses: 28, revenue: 4800 },
  { day: "Sáb", users: 58, courses: 20, revenue: 3600 },
  { day: "Dom", users: 42, courses: 14, revenue: 2400 },
]

const categoryStats = [
  { name: "Desarrollo Web", students: 3200, courses: 45 },
  { name: "Ciencia de Datos", students: 2800, courses: 38 },
  { name: "Diseño", students: 1500, courses: 28 },
  { name: "IA", students: 1200, courses: 22 },
  { name: "Base de Datos", students: 900, courses: 18 },
]

export default function EstadisticasPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Estadísticas</h1>
        <p className="mt-1 text-muted-foreground">
          Análisis detallado de la plataforma
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Usuarios Totales
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {adminStats.totalUsers.toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-success">+12% este mes</p>
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
                  {adminStats.totalCourses}
                </p>
                <p className="mt-1 text-sm text-success">+8 nuevos</p>
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
                  ${(adminStats.revenue / 1000).toFixed(0)}k
                </p>
                <p className="mt-1 text-sm text-success">+18% este mes</p>
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
                  Tasa Completación
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {adminStats.completionRate}%
                </p>
                <p className="mt-1 text-sm text-success">+5% vs anterior</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-4/10">
                <Award className="h-6 w-6 text-chart-4" />
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
              Ingresos Mensuales
            </CardTitle>
            <CardDescription>
              Evolución de ingresos en los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData}>
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
                    formatter={(value) => [
                      `$${Number(value).toLocaleString()}`,
                      "Ingresos",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
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
              <BarChart3 className="h-5 w-5 text-primary" />
              Inscripciones por Curso
            </CardTitle>
            <CardDescription>
              Distribución de estudiantes por curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseEnrollmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {courseEnrollmentData.map((_, index) => (
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
                    formatter={(value) => [
                      Number(value).toLocaleString(),
                      "Estudiantes",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Semanal</CardTitle>
            <CardDescription>Registros y actividad por día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="users"
                    name="Usuarios"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="courses"
                    name="Cursos"
                    fill="hsl(var(--accent))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Estudiantes</CardTitle>
            <CardDescription>Nuevos estudiantes por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData}>
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
                  />
                  <Line
                    type="monotone"
                    dataKey="students"
                    name="Estudiantes"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--accent))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas por Categoría</CardTitle>
          <CardDescription>
            Desglose de estudiantes y cursos por categoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryStats.map((cat, index) => (
              <div key={cat.name} className="flex items-center gap-4">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="font-medium text-foreground">{cat.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {cat.students.toLocaleString()} estudiantes
                    </p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(cat.students / 3200) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                </div>
                <p className="w-20 text-right text-sm font-medium text-muted-foreground">
                  {cat.courses} cursos
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
