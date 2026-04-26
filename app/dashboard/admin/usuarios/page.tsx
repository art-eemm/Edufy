"use client"

import { useEffect, useState } from "react"
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Loader2,
  User as UserIcon,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { toast } from "sonner"

interface Usuario {
  id: string
  nombre_completo: string
  rol: number
  estatus?: number // 1 = Activo, 0 = Suspendido
}

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  async function fetchUsuarios() {
    const storedUser = localStorage.getItem("edufy_user")
    if (!storedUser) return
    const { token } = JSON.parse(storedUser)

    try {
      const response = await fetch("/api/admin/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (response.ok) {
        setUsuarios(data)
      } else {
        toast.error(data.error || "Error al cargar la lista de usuarios")
      }
    } catch (error) {
      toast.error("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  // Función maestra para actualizar el rol o el estado
  const actualizarUsuario = async (
    idUsuario: string,
    datosNuevos: { rol?: number; estatus?: number }
  ) => {
    setActionLoading(idUsuario)
    const storedUser = localStorage.getItem("edufy_user")
    const { token } = JSON.parse(storedUser!)

    try {
      const response = await fetch("/api/admin/usuarios", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: idUsuario, ...datosNuevos }),
      })

      if (response.ok) {
        toast.success("Usuario actualizado correctamente")
        // Actualizamos el estado local sin tener que recargar toda la tabla
        setUsuarios((prev) =>
          prev.map((u) => (u.id === idUsuario ? { ...u, ...datosNuevos } : u))
        )
      } else {
        const error = await response.json()
        toast.error(error.error || "Error al actualizar")
      }
    } catch (error) {
      toast.error("Error de conexión con el servidor")
    } finally {
      setActionLoading(null)
    }
  }

  const usuariosFiltrados = usuarios.filter((u) =>
    (u.nombre_completo || "").toLowerCase().includes(busqueda.toLowerCase())
  )

  const getBadgeVariant = (rolId: number) => {
    switch (rolId) {
      case 1:
        return "default"
      case 3:
        return "secondary"
      default:
        return "outline"
    }
  }

  const getNombreRol = (rolId: number) => {
    switch (rolId) {
      case 1:
        return "Administrador"
      case 3:
        return "Profesor"
      default:
        return "Estudiante"
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground">
            Administra los roles y accesos de todos los usuarios registrados.
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Usuarios Registrados</CardTitle>
              <CardDescription>
                Total de {usuarios.length} cuentas encontradas.
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre..."
                className="pl-8"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuario) => (
                  <TableRow
                    key={usuario.id}
                    className={
                      usuario.estatus === 0 ? "bg-muted/50 opacity-60" : ""
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <UserIcon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">
                          {usuario.nombre_completo || "Usuario sin nombre"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(usuario.rol)}>
                        {getNombreRol(usuario.rol)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {usuario.estatus === 0 ? (
                        <Badge
                          variant="destructive"
                          className="border-0 bg-red-500/10 text-red-500 shadow-none hover:bg-red-500/20"
                        >
                          Suspendido
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-600 shadow-none"
                        >
                          Activo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {actionLoading === usuario.id ? (
                        <Loader2 className="inline-block h-5 w-5 animate-spin text-primary" />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>
                              Cambiar Rol a...
                            </DropdownMenuLabel>
                            {usuario.rol !== 1 && (
                              <DropdownMenuItem
                                onClick={() =>
                                  actualizarUsuario(usuario.id, { rol: 1 })
                                }
                              >
                                Administrador
                              </DropdownMenuItem>
                            )}
                            {usuario.rol !== 3 && (
                              <DropdownMenuItem
                                onClick={() =>
                                  actualizarUsuario(usuario.id, { rol: 3 })
                                }
                              >
                                Profesor
                              </DropdownMenuItem>
                            )}
                            {usuario.rol !== 2 && (
                              <DropdownMenuItem
                                onClick={() =>
                                  actualizarUsuario(usuario.id, { rol: 2 })
                                }
                              >
                                Estudiante
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            {usuario.estatus === 0 ? (
                              <DropdownMenuItem
                                className="text-green-600 focus:text-green-600"
                                onClick={() =>
                                  actualizarUsuario(usuario.id, { estatus: 1 })
                                }
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />{" "}
                                Reactivar Cuenta
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() =>
                                  actualizarUsuario(usuario.id, { estatus: 0 })
                                }
                              >
                                <ShieldAlert className="mr-2 h-4 w-4" />{" "}
                                Suspender Cuenta
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No hay usuarios para mostrar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
