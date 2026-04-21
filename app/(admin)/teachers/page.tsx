import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import { AddTeacherDialog } from "@/components/add-teacher-dialog"

const profesoresMock = [
  {
    id: "a1b2c3d4-...",
    nombre_completo: "Ing. Ada Lovelace",
    correo: "ada@edufy.com",
    fecha_creacion: "2026-04-15",
    estatus: 1,
  },
  {
    id: "e5f6g7h8-...",
    nombre_completo: "Dr. Alan Turing",
    correo: "alan@edufy.com",
    fecha_creacion: "2026-04-18",
    estatus: 1,
  },
  {
    id: "i9j0k1l2-...",
    nombre_completo: "Mtra. Margaret Hamilton",
    correo: "margaret@edufy.com",
    fecha_creacion: "2026-04-20",
    estatus: 0,
  },
]

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profesores</h1>
          <p className="text-muted-foreground">
            Gestiona el personal docente de la plataforma
          </p>
        </div>
        <AddTeacherDialog />
      </div>

      <div className="overflow-x-auto rounded-md border bg-card">
        <Table className="min-w-150">
          <TableCaption>Lista de Profesores</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead className="hidden md:table-cell">
                Fecha de Alta
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profesoresMock.map((profesor) => (
              <TableRow key={profesor.id}>
                <TableCell className="font-medium">
                  {profesor.nombre_completo}
                </TableCell>
                <TableCell>{profesor.correo}</TableCell>

                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {new Date(profesor.fecha_creacion).toLocaleDateString(
                    "es-MX"
                  )}
                </TableCell>

                <TableCell>
                  {profesor.estatus === 1 ? (
                    <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400">
                      Activo
                    </Badge>
                  ) : (
                    <Badge
                      variant={"secondary"}
                      className="text-muted-foreground"
                    >
                      Inactivo
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <Button variant={"ghost"} size={"icon"}>
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Abrir menú</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
