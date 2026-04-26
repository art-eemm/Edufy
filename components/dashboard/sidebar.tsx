"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Award,
  Play,
  PlusCircle,
  UserCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import type { User } from "@/lib/types"

interface SidebarProps {
  user: User
}

interface SidebarContentProps {
  links: any[]
  user: User
  roleLabel: string
  setIsMobileOpen: (open: boolean) => void
  handleLogout: () => void
  pathname: string
}

const SidebarContent = ({
  links,
  user,
  roleLabel,
  setIsMobileOpen,
  handleLogout,
  pathname,
}: SidebarContentProps) => (
  <>
    <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-lg font-bold text-sidebar-foreground">Edufy</span>
      </Link>
    </div>

    <div className="flex-1 overflow-y-auto p-4">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
    </div>

    <div className="border-t border-sidebar-border p-4">
      <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/30 p-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-sidebar-primary text-sm text-sidebar-primary-foreground">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            {user.name}
          </p>
          <p className="text-xs text-sidebar-foreground/60">{roleLabel}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          className="flex-1 justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  </>
)

const adminLinks = [
  { href: "/dashboard/admin", label: "Panel Principal", icon: LayoutDashboard },
  { href: "/dashboard/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/dashboard/admin/cursos", label: "Cursos", icon: BookOpen },
  {
    href: "/dashboard/admin/estadisticas",
    label: "Estadísticas",
    icon: BarChart3,
  },
  {
    href: "/dashboard/admin/configuracion",
    label: "Configuración",
    icon: Settings,
  },
]

const teacherLinks = [
  {
    href: "/dashboard/profesor",
    label: "Panel Principal",
    icon: LayoutDashboard,
  },
  { href: "/dashboard/profesor/cursos", label: "Mis Cursos", icon: BookOpen },
  { href: "/dashboard/profesor/crear", label: "Crear Curso", icon: PlusCircle },
  {
    href: "/dashboard/profesor/estudiantes",
    label: "Estudiantes",
    icon: Users,
  },
  // {
  //   href: "/dashboard/profesor/estadisticas",
  //   label: "Estadísticas",
  //   icon: BarChart3,
  // },
]

const studentLinks = [
  {
    href: "/dashboard/estudiante",
    label: "Panel Principal",
    icon: LayoutDashboard,
  },
  { href: "/dashboard/estudiante/cursos", label: "Mis Cursos", icon: Play },
  { href: "/dashboard/estudiante/explorar", label: "Explorar", icon: BookOpen },
  {
    href: "/dashboard/estudiante/certificados",
    label: "Certificados",
    icon: Award,
  },
  {
    href: "/dashboard/estudiante/perfil",
    label: "Mi Perfil",
    icon: UserCircle,
  },
]

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const links =
    user.role === "admin"
      ? adminLinks
      : user.role === "profesor"
        ? teacherLinks
        : studentLinks

  const roleLabel =
    user.role === "admin"
      ? "Administrador"
      : user.role === "profesor"
        ? "Profesor"
        : "Estudiante"

  const handleLogout = () => {
    localStorage.removeItem("edufy_user")
    router.push("/")
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar text-sidebar-foreground shadow-lg lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar transition-transform lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          links={links}
          user={user}
          roleLabel={roleLabel}
          setIsMobileOpen={setIsMobileOpen}
          handleLogout={handleLogout}
          pathname={pathname}
        />
      </aside>
    </>
  )
}
