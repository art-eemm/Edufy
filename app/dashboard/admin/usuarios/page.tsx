"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Mail,
  Ban,
  CheckCircle,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { users } from "@/lib/mock-data"

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const roleColors = {
    admin: "bg-destructive/70",
    teacher: "bg-chart-2/70",
    student: "bg-primary/70",
  }

  const statusColors = {
    active: "bg-success/70",
    inactive: "bg-muted text-muted-foreground",
    suspended: "bg-destructive/70",
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestión de Usuarios
          </h1>
          <p className="mt-1 text-muted-foreground">
            Administra todos los usuarios
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Añadir Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>
            Total: {users.length} usuarios registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {roleFilter === "all"
                    ? "Todos los roles"
                    : roleFilter === "admin"
                      ? "Admin"
                      : roleFilter === "teacher"
                        ? "Profesor"
                        : "Estudiante"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setRoleFilter("all")}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("admin")}>
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("teacher")}>
                  Profesor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("student")}>
                  Estudiante
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[user.role]}>
                        {user.role === "admin"
                          ? "Admin"
                          : user.role === "teacher"
                            ? "Profesor"
                            : "Estudiante"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[user.status]}>
                        {user.status === "active"
                          ? "Activo"
                          : user.status === "inactive"
                            ? "Inactivo"
                            : "Suspendido"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.createdAt}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Ban className="mr-2 h-4 w-4" />
                            Suspender
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
