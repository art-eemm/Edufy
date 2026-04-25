"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Shield, Loader2, Save, UserCircle } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner" // Asumiendo que usas sonner por tu package.json

export default function StudentProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Estados para los datos del formulario
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [rol, setRol] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUser = localStorage.getItem("edufy_user")
      if (!storedUser) {
        router.push("/login")
        return
      }

      const { token } = JSON.parse(storedUser)

      try {
        const response = await fetch("/api/usuarios/perfil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (response.ok) {
          setNombre(data.nombre_completo || "")
          setEmail(data.email || "")
          setRol(data.rol || "Estudiante")
        } else {
          toast.error("No se pudo cargar la información del perfil")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const storedUser = localStorage.getItem("edufy_user")
    if (!storedUser) return
    const { token } = JSON.parse(storedUser)

    try {
      const response = await fetch("/api/usuarios/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre_completo: nombre }),
      })

      if (response.ok) {
        // Actualizar también el nombre en el localStorage para que el sidebar se refresque
        const userData = JSON.parse(storedUser)
        userData.name = nombre
        localStorage.setItem("edufy_user", JSON.stringify(userData))

        toast.success("Perfil actualizado correctamente")
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Error al actualizar el perfil")
      }
    } catch (error) {
      toast.error("Ocurrió un error al conectar con el servidor")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y cuenta.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Columna de Avatar/Resumen */}
        <Card className="md:col-span-1">
          <CardContent className="flex flex-col items-center pt-8">
            <div className="relative mb-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                <UserCircle className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-bold">{nombre}</h2>
            <p className="text-sm text-muted-foreground capitalize">{rol}</p>
          </CardContent>
        </Card>

        {/* Columna de Formulario */}
        <Card className="md:col-span-2">
          <form onSubmit={handleUpdateProfile}>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>
                Actualiza tus datos de contacto básicos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="pl-10"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-muted pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  El correo electrónico no se puede cambiar por seguridad.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Rol asignado</Label>
                <div className="relative">
                  <Shield className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="role"
                    value={rol}
                    disabled
                    className="bg-muted pl-10 capitalize"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t bg-muted/30 px-6 py-4">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
