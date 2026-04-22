import { CourseCard } from "@/components/course-card"

const mockCursos = [
  {
    id: "1",
    title: "Master en React y Next.js con Tailwind",
    description:
      "Aprende a construir aplicaciones web modernas desde cero hasta el despliegue con las herramientas más demandadas.",
    teacherName: "Ing. Carlos Mendoza",
    rating: 4.9,
    totalReviews: 128,
    lessonCount: 45,
  },
  {
    id: "2",
    title: "Bases de Datos con PostgreSQL y Supabase",
    description:
      "Domina el modelado relacional, constraints y el uso de BaaS para acelerar el desarrollo de tu backend.",
    teacherName: "Mtra. Ana Torres",
    rating: 4.7,
    totalReviews: 85,
    lessonCount: 32,
  },
  {
    id: "3",
    title: "Fundamentos de UI/UX para Desarrolladores",
    description:
      "Mejora el aspecto visual de tus proyectos comprendiendo jerarquía, teoría del color y accesibilidad.",
    teacherName: "Lic. Roberto Díaz",
    rating: 4.8,
    totalReviews: 210,
    lessonCount: 28,
  },
]

export default function ExplorePage() {
  return (
    <div className="container mx-auto space-y-8 p-4 md:p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Explorar Cursos</h1>
        <p className="text-muted-foreground">
          Descubre tu próximo nivel. Aprende a tu ritmo.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {mockCursos.map((curso) => (
          <CourseCard
            key={curso.id}
            id={curso.id}
            title={curso.title}
            description={curso.description}
            teacherName={curso.teacherName}
            rating={curso.rating}
            totalReviews={curso.totalReviews}
            lessonCount={curso.lessonCount}
          />
        ))}
      </div>
    </div>
  )
}
