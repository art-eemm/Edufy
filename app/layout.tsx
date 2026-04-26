import type { Metadata } from "next"
import { Montserrat } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { CapacitorWrapper } from "@/components/capacitor-wrapper"
import { Toaster } from "@/components/ui/sonner"

const montserrat = Montserrat({ subsets: ["latin"] })

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: "Edufy - Plataforma de Aprendizaje en Línea",
  description:
    "Edufy es una plataforma de aprendizaje en línea que ofrece cursos interactivos y personalizados para estudiantes de todas las edades. Nuestra misión es hacer que la educación sea accesible, atractiva y efectiva para todos.",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background" suppressHydrationWarning>
      <body className={cn(montserrat.className, "antialiased")}>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CapacitorWrapper>{children}</CapacitorWrapper>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
