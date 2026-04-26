"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Loader2,
  Save,
  Camera,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

export default function AdminConfigPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")

  const [previewUrl, setPreviewUrl] = useState("")
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null)

  const [showPass, setShowPass] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      const storedUserStr = localStorage.getItem("edufy_user")
      if (!storedUserStr) {
        router.push("/login")
        return
      }

      const { token, email: userEmail } = JSON.parse(storedUserStr)
      setEmail(userEmail)

      try {
        const response = await fetch("/api/usuarios/perfil", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        })
        const data = await response.json()

        if (response.ok) {
          setNombre(data.nombre_completo || "")
          setPreviewUrl(data.imagen_perfil || "")
        }
      } catch (error) {
        toast.error("Error al cargar los datos de configuración")
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [router])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArchivoImagen(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword && newPassword !== confirmPassword) {
      return toast.error("Las contraseñas no coinciden")
    }
    if (newPassword && newPassword.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres")
    }

    setIsSaving(true)
    const storedUserStr = localStorage.getItem("edufy_user")
    const { token } = JSON.parse(storedUserStr!)

    try {
      const formData = new FormData()
      formData.append("nombre", nombre)
      if (archivoImagen) formData.append("imagen_perfil", archivoImagen)
      if (newPassword) formData.append("password", newPassword)

      const response = await fetch("/api/usuarios/perfil", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Configuración de administrador actualizada")
        setNewPassword("")
        setConfirmPassword("")
        setArchivoImagen(null)

        // Actualizamos el storage local para que los cambios se vean en el Sidebar
        const updatedUser = {
          ...JSON.parse(storedUserStr!),
          name: nombre,
          imagen_perfil: result.imagen_perfil,
        }
        localStorage.setItem("edufy_user", JSON.stringify(updatedUser))
        window.dispatchEvent(new Event("storage"))
      } else {
        toast.error(result.error || "Error al guardar los cambios")
      }
    } catch (error) {
      toast.error("Fallo de conexión al servidor")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    )

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Configuración del Sistema
        </h1>
        <p className="text-muted-foreground">
          Gestiona tus credenciales de administrador y apariencia de perfil.
        </p>
      </div>

      <form
        onSubmit={handleSaveAll}
        className="grid gap-8 lg:grid-cols-[280px_1fr]"
      >
        {/* Lado Izquierdo: Foto */}
        <aside className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center pt-8">
              <div className="group relative">
                <Avatar className="h-40 w-40 border-4 border-primary/10 shadow-xl">
                  <AvatarImage src={previewUrl} className="object-cover" />
                  <AvatarFallback className="bg-primary/5 text-3xl text-primary">
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <label className="absolute right-2 bottom-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95">
                  <Camera className="h-5 w-5" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              <div className="mt-6 text-center">
                <Badge
                  variant="default"
                  className="mb-2 border-0 bg-primary/10 text-primary hover:bg-primary/10"
                >
                  <ShieldCheck className="mr-1 h-3 w-3" /> Administrador
                </Badge>
                <h2 className="line-clamp-1 text-lg font-bold">
                  {nombre || "Admin"}
                </h2>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Lado Derecho: Formularios */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Cuenta</CardTitle>
              <CardDescription>
                Datos básicos de identificación en la plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de Administrador</Label>
                <div className="relative">
                  <User className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nombre"
                    className="pl-10"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Correo Electrónico Corporativo</Label>
                <div className="flex items-center gap-3 rounded-md border bg-muted/50 px-4 py-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-primary" />
                Seguridad de Acceso
              </CardTitle>
              <CardDescription>
                Actualiza tu contraseña periódicamente para mantener la
                seguridad.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nueva Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPass ? "text" : "password"}
                      className="pr-10 pl-10"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Confirmar Contraseña</Label>
                  <Input
                    type={showPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t bg-muted/20 py-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="min-w-[150px]"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
