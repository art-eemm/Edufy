import { Montserrat } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Edufy - Plataforma de Aprendizaje en Línea",
  description:
    "Edufy es una plataforma de aprendizaje en línea que ofrece cursos interactivos y personalizados para estudiantes de todas las edades. Nuestra misión es hacer que la educación sea accesible, atractiva y efectiva para todos.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={cn("antialiased", montserrat.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
