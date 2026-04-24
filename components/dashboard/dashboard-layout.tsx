"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "./sidebar"
import type { User, UserRole } from "@/lib/types"

interface DashboardLayoutProps {
  children: React.ReactNode
  requiredRole: UserRole
}

export function DashboardLayout({
  children,
  requiredRole,
}: DashboardLayoutProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("edufy_user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(storedUser) as User

    if (parsedUser.role !== requiredRole) {
      if (parsedUser.role === "admin") {
        router.push("/dashboard/admin")
      } else if (parsedUser.role === "teacher") {
        router.push("/dashboard/profesor")
      } else {
        router.push("/dashboard/estudiante")
      }
      return
    }

    setUser(parsedUser)
    setIsLoading(false)
  }, [router, requiredRole])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar user={user} />
      <main className="lg:pl-64">
        <div className="min-h-screen p-4 pt-20 lg:p-8 lg:pt-8">{children}</div>
      </main>
    </div>
  )
}
