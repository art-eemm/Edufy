import Link from "next/link"
import {
  Code,
  BarChart3,
  Palette,
  Brain,
  Database,
  Megaphone,
  Briefcase,
  Languages,
} from "lucide-react"
import { Card, CardContent } from "../ui/card"

const categoriesData = [
  {
    name: "Desarrollo Web",
    icon: Code,
    count: 45,
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Ciencia de Datos",
    icon: BarChart3,
    count: 32,
    color: "bg-chart-2/20 text-chart-2",
  },
  {
    name: "Diseño",
    icon: Palette,
    count: 28,
    color: "bg-chart-4/20 text-chart-4",
  },
  {
    name: "Inteligencia Artificial",
    icon: Brain,
    count: 18,
    color: "bg-chart-3/20 text-chart-3",
  },
  {
    name: "Base de Datos",
    icon: Database,
    count: 15,
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    name: "Marketing Digital",
    icon: Megaphone,
    count: 22,
    color: "bg-destructive/10 text-destructive",
  },
  {
    name: "Negocios",
    icon: Briefcase,
    count: 20,
    color: "bg-chart-5/20 text-chart-5",
  },
  {
    name: "Idiomas",
    icon: Languages,
    count: 12,
    color: "bg-primary/10 text-primary",
  },
]

export function Categories() {
  return (
    <section id="categorias" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Explorar por Categoría
          </h2>
          <p className="mt-2 text-muted-foreground">
            Encuentra el curso perfecto para tus objetivos
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoriesData.map((category) => (
            <Link
              key={category.name}
              href={`/cursos?categoria=${encodeURIComponent(category.name)}`}
            >
              <Card className="group h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.color}`}
                  >
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} cursos
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
