import { NextResponse } from "next/server"
import { supabaseClient } from "@/lib/supabaseClient"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // 1. INTENTO DE INICIO DE SESIÓN
    const { data, error: authError } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

    if (authError) {
      return NextResponse.json(
        { error: "Credenciales inválidas. Revisa tu correo y contraseña." },
        { status: 401 }
      )
    }

    const user = data.user
    if (!user) {
      return NextResponse.json(
        { error: "No se pudo obtener el usuario" },
        { status: 400 }
      )
    }

    // 2. OBTENER INFORMACIÓN DEL PERFIL Y EL ROL ASOCIADO
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("perfiles")
      .select(
        `
        nombre_completo,
        rol:roles ( nombre )
      `
      )
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      console.error("Error al obtener perfil:", profileError)
      return NextResponse.json(
        {
          error:
            "El usuario no tiene un perfil configurado en la base de datos.",
        },
        { status: 404 }
      )
    }

    // 3. SOLUCIÓN AL ERROR DE TYPESCRIPT
    const rawRole = profile.rol as any
    const roleName = Array.isArray(rawRole)
      ? rawRole[0]?.nombre
      : rawRole?.nombre

    // 4. RESPUESTA EXITOSA
    return NextResponse.json(
      {
        user: user.email,
        name: profile.nombre_completo,
        role: roleName || "estudiante",
        token: data.session?.access_token,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error catastrófico en el servidor:", error.message || error)
    return NextResponse.json(
      { error: "Ocurrió un error inesperado en el servidor." },
      { status: 500 }
    )
  }
}
