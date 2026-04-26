export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getUserFromToken, hasRole } from "@/lib/auth"

// 1. OBTENER USUARIOS
export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user || !(await hasRole(user.id, "admin"))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Agregamos 'estatus' a la consulta
    const { data: usuarios, error } = await supabaseAdmin
      .from("perfiles")
      .select("id, nombre_completo, rol, estatus")
      .order("nombre_completo", { ascending: true })

    if (error) throw error

    return NextResponse.json(usuarios)
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

// 2. ACTUALIZAR ROL O ESTATUS
export async function PUT(request: Request) {
  try {
    // Seguridad estricta: Solo un admin real puede hacer esto
    const adminUser = await getUserFromToken(request)
    if (!adminUser || !(await hasRole(adminUser.id, "admin"))) {
      return NextResponse.json(
        { error: "No autorizado para realizar esta acción" },
        { status: 403 }
      )
    }

    // Extraemos la información que el frontend nos envía
    const body = await request.json()
    const { id, rol, estatus } = body

    if (!id) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      )
    }

    // Preparamos los datos a actualizar dinámicamente
    const datosActualizar: any = {}
    if (rol !== undefined) datosActualizar.rol = rol
    if (estatus !== undefined) datosActualizar.estatus = estatus

    // Ejecutamos la actualización directamente con supabaseAdmin
    const { error } = await supabaseAdmin
      .from("perfiles")
      .update(datosActualizar)
      .eq("id", id)

    if (error) {
      console.error("Error al actualizar usuario en BD:", error.message)
      return NextResponse.json(
        { error: "No se pudo actualizar el usuario" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Usuario actualizado correctamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error general en PUT usuarios:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
