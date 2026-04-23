import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "../ui/button"

const benefits = [
  "Acceso ilimitado a todos los cursos",
  "Certificados verificables",
  "Soporte de instructores expertos",
  "Comunidad de estudiantes activa",
]

export function CTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 sm:px-16 sm:py-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance text-primary-foreground sm:text-4xl">
              Aprende hoy
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Únete a miles de estudiantes que ya están transformando sus
              carreras con Edufy
            </p>

            <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 text-primary-foreground"
                >
                  <CheckCircle className="h-5 w-5 text-primary-foreground/80" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/registro">
                  Registrarse Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/cursos">Explorar Cursos</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
