import Link from "next/link"
import { Clock, Users, Star, BookOpen } from "lucide-react"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Badge } from "../ui/badge"
import type { Course } from "@/lib/types"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const levelColors = {
    principiante: "bg-success/70 border-success/20",
    intermedio: "bg-warning/70 border-warning/20",
    avanzado: "bg-destructive/70 border-destructive/20",
  }

  return (
    <Link href={`/curso/${course.id}`}>
      <Card className="group h-full overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/20 to-accent/20">
            <BookOpen className="h-12 w-12 text-primary/50" />
          </div>
          <Badge
            className={`absolute top-3 right-3 ${levelColors[course.level]}`}
          >
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </Badge>
        </div>
        <CardContent className="p-5">
          <p className="text-xs font-medium text-primary">{course.category}</p>
          <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {course.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {course.description}
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {course.duration}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {course.studentsCount.toLocaleString()}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-border bg-muted/30 px-5 py-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-chart-5 text-chart-5" />
            <span className="font-medium text-foreground">{course.rating}</span>
          </div>
          <p className="text-lg font-bold text-primary">${course.price}</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
