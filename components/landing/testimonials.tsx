import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { Avatar, AvatarFallback } from "../ui/avatar"

const testimonials = [
  {
    name: "Sofía Rodríguez",
    role: "Desarrolladora Frontend",
    content:
      "Los cursos de Edufy me ayudaron a conseguir mi primer trabajo como desarrolladora. La calidad del contenido y el soporte de los instructores es excepcional.",
    rating: 5,
  },
  {
    name: "Miguel Torres",
    role: "Data Scientist",
    content:
      "Gracias al curso de Python para Ciencia de Datos pude hacer una transición de carrera exitosa. Los proyectos prácticos fueron clave.",
    rating: 5,
  },
  {
    name: "Carmen Vega",
    role: "Diseñadora UX",
    content:
      "El curso de UX/UI superó mis expectativas. Aprendí metodologías actuales y herramientas que uso diariamente en mi trabajo.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonios" className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Lo que opinan nuestros estudiantes
          </h2>
          <p className="mt-2 text-muted-foreground">Historias de éxito</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="relative overflow-hidden">
              <CardContent className="p-6">
                <Quote className="absolute -top-2 -right-2 h-16 w-16 text-primary/5" />
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-chart-5 text-chart-5"
                    />
                  ))}
                </div>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 font-medium text-primary">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
