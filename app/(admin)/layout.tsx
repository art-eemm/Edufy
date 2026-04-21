import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-background">
          <header className="flex h-16 items-center border-b bg-background/95 px-6 backdrop-blur">
            <SidebarTrigger className="mr-4 ml-1" />
            <div className="flex-1">
              <h2 className="text-sm font-medium text-muted-foreground">
                Panel de Administrador
              </h2>
            </div>
          </header>
          <div className="p-6 md:p-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
