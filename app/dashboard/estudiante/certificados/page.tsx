"use client"

import { useEffect, useState } from "react"
import { Award, Download, BookOpen, ExternalLink, Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// Estructuras de datos reales
interface CursoReal {
  id_curso: number
  nombre: string
  descripcion: string
}

interface CertificadoData {
  id_curso: number
  curso: CursoReal
  nombre_estudiante: string
  fecha_completado: string
}

export default function CertificadosPage() {
  const [certificados, setCertificados] = useState<CertificadoData[]>([])
  const [pendientes, setPendientes] = useState<CursoReal[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDatos = async () => {
      const storedUserStr = localStorage.getItem("edufy_user")
      if (!storedUserStr) return
      const { token, name } = JSON.parse(storedUserStr)

      try {
        // 1. Obtener los cursos a los que está inscrito
        const resMisCursos = await fetch("/api/inscripciones/mis_cursos", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const misInscripciones = await resMisCursos.json()

        if (!resMisCursos.ok) throw new Error("Error al cargar inscripciones")

        const terminados: CertificadoData[] = []
        const enProceso: CursoReal[] = []

        // 2. Por cada curso, verificar su progreso
        for (const inscripcion of misInscripciones) {
          const idCurso = inscripcion.cursos.id_curso

          const resProgreso = await fetch(`/api/progreso/curso/${idCurso}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          const progreso = await resProgreso.json()

          if (progreso.porcentaje === 100) {
            terminados.push({
              id_curso: idCurso,
              curso: inscripcion.cursos,
              nombre_estudiante: name, // Tomamos el nombre del perfil actual
              fecha_completado: new Date().toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            })
          } else {
            enProceso.push(inscripcion.cursos)
          }
        }

        setCertificados(terminados)
        setPendientes(enProceso)
      } catch (error) {
        toast.error("Ocurrió un error al cargar tus certificados")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDatos()
  }, [])

  // Función mágica para crear y descargar el PDF nativo
  const handleDownloadPDF = (cert: CertificadoData) => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      return toast.error(
        "Permite las ventanas emergentes para descargar el PDF"
      )
    }

    // Construimos un HTML limpio que se verá perfecto al imprimir/guardar como PDF
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificado - ${cert.curso.nombre}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              margin: 0; 
              background-color: #f3f4f6; 
              -webkit-print-color-adjust: exact;
            }
            .certificate-container {
              width: 900px;
              height: 650px;
              background: white;
              padding: 40px;
              box-sizing: border-box;
              border: 15px solid #2563eb;
              position: relative;
              text-align: center;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            .certificate-container::before {
              content: '';
              position: absolute;
              top: 10px; left: 10px; right: 10px; bottom: 10px;
              border: 2px solid #2563eb;
            }
            .header { color: #1e40af; font-size: 42px; margin-top: 40px; font-weight: 700; text-transform: uppercase; }
            .subtitle { font-size: 18px; color: #6b7280; margin-top: 20px; }
            .name { font-size: 36px; color: #111827; margin-top: 30px; font-weight: bold; border-bottom: 2px solid #e5e7eb; display: inline-block; padding-bottom: 5px; }
            .course-text { font-size: 18px; color: #6b7280; margin-top: 30px; }
            .course-name { font-size: 28px; color: #2563eb; margin-top: 10px; font-weight: bold; }
            .footer { position: absolute; bottom: 50px; width: calc(100% - 80px); display: flex; justify-content: space-between; align-items: flex-end; }
            .date { font-size: 14px; color: #4b5563; }
            .signature { border-top: 1px solid #9ca3af; padding-top: 5px; width: 200px; font-size: 14px; color: #4b5563; }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="header">Certificado de Finalización</div>
            <div class="subtitle">Este documento acredita que</div>
            <div class="name">${cert.nombre_estudiante}</div>
            <div class="course-text">ha completado satisfactoriamente el curso:</div>
            <div class="course-name">"${cert.curso.nombre}"</div>
            
            <div class="footer">
              <div class="date">
                <b>Fecha de finalización:</b><br/>
                ${cert.fecha_completado}
              </div>
              <div class="signature">
                <b>Plataforma Edufy</b><br/>
                Firma Autorizada
              </div>
            </div>
          </div>
          <script>
            // Abre el diálogo de impresión (Guardar como PDF) automáticamente
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mis Certificados</h1>
        <p className="mt-1 text-muted-foreground">
          Tus logros basados en el progreso de tus cursos.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <Award className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Certificados Ganados
              </p>
              <p className="text-2xl font-bold">{certificados.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cursos en Proceso</p>
              <p className="text-2xl font-bold">{pendientes.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {certificados.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Certificados Obtenidos</CardTitle>
            <CardDescription>
              Generados automáticamente al llegar al 100%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {certificados.map((cert) => (
                <Card
                  key={cert.id_curso}
                  className="overflow-hidden border-2 border-primary/20 transition-colors hover:border-primary"
                >
                  <div className="relative flex aspect-[4/3] flex-col items-center justify-center border-b bg-gradient-to-br from-primary/5 to-primary/20 p-6 text-center">
                    <Award className="mb-2 h-12 w-12 text-primary" />
                    <h3 className="line-clamp-2 font-bold text-foreground">
                      {cert.curso.nombre}
                    </h3>
                  </div>
                  <CardContent className="bg-card p-4">
                    <p className="mb-4 text-sm text-muted-foreground">
                      Completado: {cert.fecha_completado}
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => handleDownloadPDF(cert)}
                    >
                      <Download className="mr-2 h-4 w-4" /> Generar PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pendientes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cursos por terminar</CardTitle>
            <CardDescription>
              Aún te faltan videos por ver en estos cursos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendientes.map((curso) => (
              <div
                key={curso.id_curso}
                className="flex items-center justify-between rounded-lg border bg-muted/20 p-4"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <p className="font-medium">{curso.nombre}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/curso/${curso.id_curso}/aprender`}>
                    Continuar <ExternalLink className="ml-2 h-3 w-3" />
                  </a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {certificados.length === 0 && pendientes.length === 0 && (
        <Card className="border-dashed py-12 text-center">
          <CardContent>
            <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-medium">Sin progreso aún</h3>
            <p className="mt-1 text-muted-foreground">
              Inscríbete en un curso y complétalo para obtener tu primer
              certificado.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
