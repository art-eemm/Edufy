import Link from "next/link"

const footerLinks = {
  producto: [
    { name: "Cursos", href: "/cursos" },
    { name: "Categorías", href: "#categorias" },
    { name: "Instructores", href: "#instructores" },
    { name: "Precios", href: "/precios" },
  ],
  empresa: [
    { name: "Sobre Nosotros", href: "/sobre-nosotros" },
    { name: "Blog", href: "/blog" },
    { name: "Carreras", href: "/carreras" },
    { name: "Contacto", href: "/contacto" },
  ],
  soporte: [
    { name: "Centro de Ayuda", href: "/ayuda" },
    { name: "Términos de Servicio", href: "/terminos" },
    { name: "Política de Privacidad", href: "/privacidad" },
    { name: "FAQ", href: "/faq" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          <div>
            <Link href={"/"} className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">Edufy</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Plataforma de aprendizaje online líder en español. Transforma tu
              carrera con cursos de calidad.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Producto</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.producto.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Empresa</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Soporte</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.soporte.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Edufy. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
