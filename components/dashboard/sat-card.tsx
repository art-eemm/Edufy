import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | null
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  iconClassName?: string
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  iconClassName,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
            {trend && (
              <p
                className={cn(
                  "mt-2 text-sm font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}% vs mes anterior
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl",
              iconClassName || "bg-primary/10"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6",
                iconClassName ? "text-inherit" : "text-primary"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
