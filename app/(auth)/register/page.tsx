import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
        <CardDescription>
          Ingresa tus datos para crear tu cuenta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Nombre</Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre completo"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="usuario@edufy.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" type="password" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
          <Input id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full">Registrarse</Button>
        <div className="text-center text-sm text-slate-500">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href={"/login"}
            className="font-medium text-primary hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
