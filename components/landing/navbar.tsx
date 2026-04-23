"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "../ui/button"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={"/"} className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">Edufy</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#cursos"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Cursos
          </Link>
          <Link
            href="#categorias"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Categorías
          </Link>
          <Link
            href="#instructores"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Instructores
          </Link>
          <Link
            href="#testimonios"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Testimonios
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button asChild>
            <Link href="/registro">Registrarse</Link>
          </Button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border md:hidden">
          <nav className="flex flex-col gap-2 p-4">
            <Link
              href="#cursos"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Cursos
            </Link>
            <Link
              href="#categorias"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Categorías
            </Link>
            <Link
              href="#instructores"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Instructores
            </Link>
            <Link
              href="#testimonios"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Testimonios
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/registro">Registrarse</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
