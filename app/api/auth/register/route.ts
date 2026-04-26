import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

const DEFAULT_AVATAR =
  "https://ksyydmldmbbtcagbsovc.supabase.co/storage/v1/object/public/imagen_perfil/sin_perfil.jpg"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""
    let email, password, nombre_completo, rol, imagen_perfil

    // 1. Detectamos el tipo de envío para no romper la API
    if (contentType.includes("application/json")) {
      const body = await request.json()
      email = body.correo || body.email // Acepta ambos nombres
      password = body.password
      nombre_completo = body.nombre
      rol = body.rol ? Number(body.rol) : 2 // Usa el rol enviado o 2 por defecto
    } else {
      const formData = await request.formData()
      email = formData.get("email") as string
      password = formData.get("password") as string
      nombre_completo = formData.get("nombre") as string
      rol = formData.get("rol") ? Number(formData.get("rol")) : 2
      imagen_perfil = formData.get("imagen_perfil") as File | null
    }

    // Validación básica
    if (!email || !password || !nombre_completo) {
      return NextResponse.json(
        {
          error: "Faltan campos obligatorios (nombre, correo/email, password)",
        },
        { status: 400 }
      )
    }

    // 2. Registramos el usuario en Auth
    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
    })

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Error al registrar usuario" },
        { status: 400 }
      )
    }

    const userId = data.user.id

    // 3. Manejo de imagen de perfil (si viene por FormData)
    let imagenUrl = DEFAULT_AVATAR
    if (imagen_perfil && imagen_perfil.size > 0) {
      const fileName = `imagen_perfil/${userId}-${Date.now()}`
      const { error: uploadError } = await supabaseAdmin.storage
        .from("avatars")
        .upload(fileName, imagen_perfil)

      if (!uploadError) {
        const { data: publicUrl } = supabaseAdmin.storage
          .from("avatars")
          .getPublicUrl(fileName)
        imagenUrl = publicUrl.publicUrl
      }
    }

    // 4. Creamos el perfil con el ROL DINÁMICO
    const { error: profileError } = await supabaseAdmin
      .from("perfiles")
      .insert({
        id: userId,
        nombre_completo,
        imagen_perfil: imagenUrl,
        rol: rol, // <--- Aquí usamos la variable 'rol' que recibimos
      })

    if (profileError) {
      console.error("Error creando perfil:", profileError)
      return NextResponse.json(
        { error: "Error creando perfil en la base de datos" },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "Usuario registrado correctamente" })
  } catch (error) {
    console.error("Error en Registro:", error)
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la solicitud" },
      { status: 500 }
    )
  }
}
