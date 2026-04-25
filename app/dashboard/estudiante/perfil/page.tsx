"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import {
  Save,
  User,
  Lock,
  Camera,
  Palette,
  Bell,
  Award,
  BookOpen,
  Clock,
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { studentStats, enrollments, certificates } from "@/lib/mock-data"

export default function PerfilPage() {
  const { theme, setTheme } = useTheme()
  const [saving, setSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [profile, setProfile] = useState({
    name: "Ana Martínez",
    email: "ana@edufy.com",
    bio: "Apasionada por el desarrollo web y la tecnología.",
  })
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    courseUpdates: true,
    newCourses: false,
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleAvatarUpload = () => {
    // Simulate avatar upload
    alert("Subir avatar (simulado)")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
        <p className="mt-1 text-muted-foreground">
          Administra tu información personal y preferencias
        </p>
      </div>

      {showSuccess && (
        <div className="rounded-lg border border-success/20 bg-success/10 p-4 text-success">
          Los cambios se han guardado correctamente.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarUpload}
                  className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-bold text-foreground">
                {profile.name}
              </h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {profile.bio}
              </p>

              <div className="mt-6 grid w-full grid-cols-3 gap-4 border-t pt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {studentStats.enrolledCourses}
                  </p>
                  <p className="text-xs text-muted-foreground">Cursos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {studentStats.certificates}
                  </p>
                  <p className="text-xs text-muted-foreground">Certificados</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {studentStats.hoursLearned}h
                  </p>
                  <p className="text-xs text-muted-foreground">Aprendidas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Cards */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Información Personal</CardTitle>
              </div>
              <CardDescription>
                Actualiza tu información de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Input
                  id="bio"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Password */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Cambiar Contraseña</CardTitle>
              </div>
              <CardDescription>
                Actualiza tu contraseña de acceso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña actual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <CardTitle>Apariencia</CardTitle>
              </div>
              <CardDescription>
                Personaliza el aspecto de la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema de la interfaz</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notificaciones</CardTitle>
              </div>
              <CardDescription>
                Configura cómo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones por email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones por correo
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones push</Label>
                  <p className="text-sm text-muted-foreground">
                    Alertas en el navegador
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, push: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Actualizaciones de cursos</Label>
                  <p className="text-sm text-muted-foreground">
                    Nuevas lecciones y contenido
                  </p>
                </div>
                <Switch
                  checked={notifications.courseUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications({
                      ...notifications,
                      courseUpdates: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nuevos cursos</Label>
                  <p className="text-sm text-muted-foreground">
                    Recomendaciones de cursos
                  </p>
                </div>
                <Switch
                  checked={notifications.newCourses}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, newCourses: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
