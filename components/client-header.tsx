import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Search, Menu, BookOpen } from "lucide-react"

export function ClientHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo y Enlaces de Escritorio */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/explore" className="flex items-center space-x-2">
            <div className="rounded-lg bg-primary p-1.5 text-primary-foreground">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="hidden text-xl font-bold tracking-tight sm:inline-block">
              Edufy
            </span>
          </Link>

          <nav className="hidden gap-6 md:flex">
            <Link
              href="/explore"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Catálogo
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Rutas de Aprendizaje
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Comunidad
            </Link>
          </nav>
        </div>

        {/* Buscador y Botones (Escritorio) */}
        <div className="hidden items-center gap-4 md:flex">
          <div className="relative w-full max-w-sm">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cursos..."
              className="w-full bg-muted/50 pl-8 focus-visible:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Regístrate</Link>
            </Button>
          </div>
        </div>

        {/* Menú Móvil (Hamburguesa) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="mt-8 flex flex-col gap-4">
              <Link href="/explore" className="text-lg font-medium">
                Catálogo
              </Link>
              <Link
                href="#"
                className="text-lg font-medium text-muted-foreground"
              >
                Rutas de Aprendizaje
              </Link>
              <Link
                href="#"
                className="text-lg font-medium text-muted-foreground"
              >
                Comunidad
              </Link>
              <div className="my-4 border-t" />
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button className="w-full justify-start" asChild>
                <Link href="/register">Regístrate</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
