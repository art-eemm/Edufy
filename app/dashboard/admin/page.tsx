"use client"

import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  UserCheck,
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
import {
  adminStats,
  monthlyRevenueData,
  courseEnrollmentData,
  users,
  courses,
} from "@/lib/mock-data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

export default function AdminDashboardPage() {
  const recentUsers = users.slice(0, 5)
  const recentCourses = courses.slice(0, 4)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Panel de Administración
        </h1>
        <p className="mt-1 text-muted-foreground">
          Bienvenido al panel de control de Edufy
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Usuarios"
          value={adminStats.totalUsers.toLocaleString()}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Cursos"
          value={adminStats.totalCourses.toLocaleString()}
          icon={BookOpen}
          iconClassName="bg-chart-2/20 text-chart-2"
        />
        <StatCard
          title="Inscripciones"
          value={adminStats.totalEnrollments.toLocaleString()}
          icon={UserCheck}
          iconClassName="bg-chart-3/20 text-chart-3"
        />
        <StatCard
          title="Ingresos"
          value={`$${(adminStats.revenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          iconClassName="bg-success/20 text-success"
          trend={{ value: 18, isPositive: true }}
        />
        <StatCard
          title="Estudiantes Activos"
          value={adminStats.activeStudents.toLocaleString()}
          icon={TrendingUp}
          iconClassName="bg-chart-4/20 text-chart-4"
        />
        <StatCard
          title="Tasa Completación"
          value={`${adminStats.completionRate}%`}
          icon={Award}
          iconClassName="bg-chart-5/20 text-chart-5"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Mensuales</CardTitle>
            <CardDescription>
              Evolución de ingresos en los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width={"100%"} height={"100%"}>
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid
                    strokeDasharray={"3 3"}
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey={"month"}
                    className="fill-muted-foreground text-xs"
                  />
                  <YAxis
                    className="fill-muted-foreground text-xs"
                    tickFormatter={(v) => `$${v / 1000}k`}
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
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Curso</CardTitle>
            <CardDescription>Número de estudiantes por curso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width={"100%"} height={"100%"}>
                <PieChart>
                  <Pie
                    data={courseEnrollmentData}
                    cx={"50%"}
                    cy={"50%"}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey={"value"}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
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
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Recientes</CardTitle>
            <CardDescription>
              Últimos usuarios registrados en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-destructive/10 text-destructive"
                        : user.role === "teacher"
                          ? "bg-chart-2/20 text-chart-2"
                          : "bg-primary/10 text-primary"
                    }`}
                  >
                    {user.role === "admin"
                      ? "Admin"
                      : user.role === "teacher"
                        ? "Profesor"
                        : "Estudiante"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos Populares</CardTitle>
            <CardDescription>Los cursos con más inscripciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {course.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {course.teacherName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {course.studentsCount.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">estudiantes</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
