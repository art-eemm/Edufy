import Link from "next/link"
import { BookOpen } from "lucide-react"

export function ClientFooter() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Marca */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="rounded-md bg-primary p-1 text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">Edufy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              La plataforma de educación en línea diseñada para llevar tus
              habilidades al siguiente nivel, a tu propio ritmo.
            </p>
          </div>

          {/* Enlaces: Plataforma */}
          <div>
            <h3 className="mb-4 font-semibold">Plataforma</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/explore" className="hover:text-primary">
                  Explorar Cursos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Planes y Precios
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Profesores
                </Link>
              </li>
            </ul>
          </div>

          {/* Enlaces: Soporte */}
          <div>
            <h3 className="mb-4 font-semibold">Soporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Enlaces: Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Aviso de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center text-sm text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} Edufy. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">
              Twitter
            </Link>
            <Link href="#" className="hover:text-foreground">
              LinkedIn
            </Link>
            <Link href="#" className="hover:text-foreground">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
