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
} from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

export default function StudentProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [rol, setRol] = useState("")

  const [previewUrl, setPreviewUrl] = useState("")
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null)

  const [showPass, setShowPass] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      const storedUserStr = localStorage.getItem("edufy_user")
      if (!storedUserStr) {
        router.push("/login")
        return
      }

      const { token, email, role } = JSON.parse(storedUserStr)
      setEmail(email)
      setRol(role)

      try {
        const response = await fetch("/api/usuarios/perfil", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store", // <-- GARANTIZA DATOS FRESCOS SIEMPRE
        })
        const data = await response.json()

        if (response.ok) {
          setNombre(data.nombre_completo || "")
          setPreviewUrl(data.imagen_perfil || "")
        }
      } catch (error) {
        toast.error("Error al cargar el perfil")
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
        toast.success(result.message)
        setNewPassword("")
        setConfirmPassword("")
        setArchivoImagen(null) // Reseteamos el archivo tras subirlo

        // ACTUALIZAMOS LOCALSTORAGE CON LA NUEVA IMAGEN QUE ENVIÓ LA API
        const updatedUser = {
          ...JSON.parse(storedUserStr!),
          name: nombre,
          imagen_perfil: result.imagen_perfil, // <-- Guardamos la URL pública
        }
        localStorage.setItem("edufy_user", JSON.stringify(updatedUser))
        window.dispatchEvent(new Event("storage")) // Avisa al sidebar
      } else {
        toast.error(result.error || "Error al guardar los cambios")
      }
    } catch (error) {
      toast.error("Error de conexión al guardar")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    )

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal e imagen de perfil.
        </p>
      </div>

      <form
        onSubmit={handleSaveAll}
        className="grid gap-8 lg:grid-cols-[280px_1fr]"
      >
        <aside className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center pt-8">
              <div className="group relative">
                <Avatar className="h-40 w-40 border-4 border-background shadow-xl">
                  <AvatarImage src={previewUrl} className="object-cover" />
                  <AvatarFallback className="bg-primary/10 text-3xl text-primary">
                    {nombre.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute right-2 bottom-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 active:scale-95">
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
                <h2 className="text-lg font-bold">{nombre || "Usuario"}</h2>
                <p className="mt-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  {rol}
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Datos Personales</CardTitle>
              <CardDescription>
                Esta información será visible en tus certificados y cursos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
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
                <Label>Correo Electrónico (No editable)</Label>
                <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-2.5 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <KeyRound className="h-5 w-5" />
                Seguridad
              </CardTitle>
              <CardDescription>
                Deja estos campos en blanco si no deseas cambiar tu contraseña.
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
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Guardar Todos los Cambios
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
