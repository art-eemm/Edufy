import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "./ui/sidebar"
import Link from "next/link"

const items = [
  { title: "Escritorio", url: "/dashboard", icon: LayoutDashboard },
  { title: "Profesores", url: "/teachers", icon: Users },
  { title: "Cursos", url: "/courses", icon: BookOpen },
  { title: "Reportes", url: "/reports", icon: BarChart3 },
]

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center py-4">
        <h1 className="text-xl font-bold tracking-tight text-primary group-data-[collapsible=icon]:hidden">
          Edufy{" "}
          <span className="text-xs font-normal text-foreground">Admin</span>
        </h1>
        <div className="hidden font-bold text-primary group-data-[collapsible=icon]:block">
          E
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestión</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="cursor-pointer text-destructive hover:text-destructive">
              <LogOut />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
