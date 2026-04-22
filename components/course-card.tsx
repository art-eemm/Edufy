import Image from "next/link"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Badge } from "lucide-react"
import { Button } from "./ui/button"
import { Star, Clock, BookOpen } from "lucide-react"

interface CourseCardProps {
  id: string
  title: string
  description: string
  teacherName: string
  rating: number
  totalReviews: number
  lessonCount: number
  imageUrl?: string
}

export function CourseCard({
  id,
  title,
  description,
  teacherName,
  rating,
  totalReviews,
  lessonCount,
  imageUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
}: CourseCardProps) {
  return (
    <Card className="group flex h-full flex-col overflow-y-auto border-border/50 transition-all hover:shadow-md">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={`Portada del curso ${title}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute top-3 right-3 border-none bg-background/90 text-foreground backdrop-blur-sm hover:bg-background/90">
          Nuevo
        </Badge>
      </div>

      <CardHeader className="space-y-1 p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-lg leading-tight font-bold">
            {title}
          </h3>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>
      </CardHeader>

      <CardContent className="flex-1 p-4 pt-2">
        <div className="flex flex-col gap-3 text-sm text-muted-foreground">
          {/* Profesor */}
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {teacherName.charAt(0)}
            </div>
            <span className="truncate font-medium text-foreground">
              {teacherName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-amber-500" />
              <span className="font-medium text-foreground">
                {rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({totalReviews})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs">{lessonCount} lecciones</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto p-4 pt-0">
        <Button asChild className="w-full group-hover:bg-primary/90">
          <Link href={`/courses/${id}`}>Ver detalles del curso</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
