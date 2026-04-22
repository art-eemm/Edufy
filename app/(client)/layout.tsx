import { ClientHeader } from "@/components/client-header"
import { ClientFooter } from "@/components/client-footer"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <ClientHeader />

      <main className="flex-1">{children}</main>

      <ClientFooter />
    </div>
  )
}
