import Link from "next/link"
import { ArrowRight, Play, Users, BookOpen, Award, Section } from "lucide-react"
import { Button } from "../ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 h-125 w-125 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-100 w-100 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            Más de 10,000 estudiantes activos
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Aprende las habilidades del{" "}
            <span className="text-primary">futuro</span> hoy
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
            Accede a cientos de cursos impartidos por expertos de la industria.
            Desarrollo web, ciencia de datos, diseño UX y mucho más.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size={"lg"} asChild className="w-full sm:w-auto">
              <Link href={"/registro"}>
                Comenzar Gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="#cursos">
                <Play className="mr-2 h-4 w-4" />
                Ver Cursos
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
