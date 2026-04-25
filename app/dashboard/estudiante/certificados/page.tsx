"use client"

import { useState } from "react"
import {
  Award,
  Download,
  Eye,
  Calendar,
  BookOpen,
  ExternalLink,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { certificates, courses, enrollments } from "@/lib/mock-data"

export default function CertificadosPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<
    (typeof certificates)[0] | null
  >(null)

  // Get certificates for student (Ana Martínez would have Pedro's certificate for demo - id: 5)
  // For demo, we'll show the available certificate
  const studentCertificates = certificates.filter((c) => c.userId === "5")

  // Get completed courses for student (progress = 100)
  const completedEnrollments = enrollments.filter((e) => e.progress === 100)
  const pendingCertificates = completedEnrollments
    .filter((e) => !studentCertificates.some((c) => c.courseId === e.courseId))
    .map((e) => {
      const course = courses.find((c) => c.id === e.courseId)
      return { ...e, course }
    })
    .filter((e) => e.course)

  const handleDownload = (certificate: (typeof certificates)[0]) => {
    // Simulate download
    const link = document.createElement("a")
    link.href = "#"
    link.download = `certificado-${certificate.courseName.toLowerCase().replace(/\s+/g, "-")}.pdf`
    // In real app, this would download the actual PDF
    alert("Descargando certificado... (simulado)")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mis Certificados</h1>
        <p className="mt-1 text-muted-foreground">
          Tus logros y certificaciones obtenidas
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <Award className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Certificados Obtenidos
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {studentCertificates.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Cursos Completados
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {completedEnrollments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates */}
      {studentCertificates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Certificados Obtenidos</CardTitle>
            <CardDescription>
              Descarga y comparte tus certificados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {studentCertificates.map((certificate) => (
                <Card key={certificate.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 via-accent/10 to-success/10">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Award className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-foreground">
                        Certificado
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {certificate.courseName}
                      </p>
                    </div>
                    <Badge className="absolute top-3 right-3 bg-success/10 text-success">
                      Verificado
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Emitido el{" "}
                      {new Date(certificate.issuedAt).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setSelectedCertificate(certificate)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Ver
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              Certificado de Finalización
                            </DialogTitle>
                            <DialogDescription>
                              Certificado verificado por Edufy
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 rounded-lg border bg-gradient-to-br from-primary/5 via-accent/5 to-success/5 p-8 text-center">
                            <div className="flex justify-center">
                              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                                <Award className="h-10 w-10 text-primary" />
                              </div>
                            </div>
                            <h2 className="mt-6 text-2xl font-bold text-foreground">
                              Certificado de Finalización
                            </h2>
                            <p className="mt-2 text-muted-foreground">
                              Este certificado acredita que
                            </p>
                            <p className="mt-4 text-xl font-semibold text-foreground">
                              Pedro Sánchez
                            </p>
                            <p className="mt-2 text-muted-foreground">
                              ha completado satisfactoriamente el curso
                            </p>
                            <p className="mt-4 text-lg font-semibold text-primary">
                              {certificate.courseName}
                            </p>
                            <p className="mt-6 text-sm text-muted-foreground">
                              Emitido el{" "}
                              {new Date(
                                certificate.issuedAt
                              ).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                              <span>ID: {certificate.id}</span>
                              <span>•</span>
                              <span>Verificado por Edufy</span>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => handleDownload(certificate)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Descargar PDF
                            </Button>
                            <Button>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Compartir
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDownload(certificate)}
                      >
                        <Download className="mr-1 h-3 w-3" />
                        Descargar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Certificates */}
      {pendingCertificates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Certificados Pendientes</CardTitle>
            <CardDescription>
              Completa estos cursos para obtener tu certificado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingCertificates.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Award className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {enrollment.course!.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Completado el{" "}
                      {new Date(
                        enrollment.completedAt || enrollment.lastAccessedAt
                      ).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                  <Button>Solicitar Certificado</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {studentCertificates.length === 0 && pendingCertificates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Award className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No tienes certificados aún
            </h3>
            <p className="mt-2 text-muted-foreground">
              Completa tus cursos para obtener certificados
            </p>
            <Button className="mt-4" asChild>
              <a href="/dashboard/estudiante/cursos">Ver Mis Cursos</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
