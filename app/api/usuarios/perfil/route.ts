export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import { supabaseClient } from "@/lib/supabaseClient"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { getUserFromToken } from "@/lib/auth"

//* OBTENER EL PERFIL DEL USUARIO
export async function GET(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      )
    }

    const { data, error } = await supabaseClient
      .from("perfiles")
      .select(
        `
            id,
            nombre_completo,
            imagen_perfil`
      )
      .eq("id", user.id)
      .single()

    if (error) {
      console.error("Error al obtener el perfil del usuario:", error)
      return NextResponse.json(
        { error: "Error al obtener el perfil del usuario" },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error)
    return NextResponse.json(
      { error: "Error al obtener el perfil del usuario" },
      { status: 500 }
    )
  }
}

//* ACTUALIZAR EL PERFIL DEL USUARIO
export async function PUT(request: Request) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no autenticado" },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const nombre_completo = formData.get("nombre") as string
    const password = formData.get("password") as string | null
    const imagen_perfil = formData.get("imagen_perfil") as File | null

    //* OBTENEMOS LA IMAGEN ACTUAL DEL PERFIL
    const { data: perfilActual } = await supabaseClient
      .from("perfiles")
      .select("imagen_perfil")
      .eq("id", user.id)
      .single()

    let nuevaImagen = perfilActual?.imagen_perfil || null

    //* SI EXISTE IMAGEN NUEVA
    if (imagen_perfil && imagen_perfil.size > 0) {
      //* ELIMINAMOS IMAGEN ANTERIOR
      if (perfilActual?.imagen_perfil) {
        const pathAnterior = perfilActual.imagen_perfil.split("/").pop()

        const ES_IMAGEN_DEFAULT = pathAnterior === "sin_perfil.jpg"

        if (pathAnterior && !ES_IMAGEN_DEFAULT) {
          await supabaseAdmin.storage
            .from("imagen_perfil")
            .remove([pathAnterior])
        }
      }

      //* SUBIMOS NUEVA IMAGEN
      const fileExt = imagen_perfil.name.split(".").pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const arrayBuffer = await imagen_perfil.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const { error: uploadError } = await supabaseAdmin.storage
        .from("imagen_perfil")
        .upload(fileName, buffer, {
          contentType: imagen_perfil.type,
          upsert: true,
        })

      if (uploadError) {
        return NextResponse.json(
          { error: uploadError.message },
          { status: 500 }
        )
      }

      //* OBTENER URL PUBLICA
      const { data } = supabaseAdmin.storage
        .from("imagen_perfil")
        .getPublicUrl(fileName)

      nuevaImagen = data.publicUrl
    }

    //* ACTUALIZAMOS EL PERFIL
    const { error: updateError } = await supabaseAdmin
      .from("perfiles")
      .update({
        nombre_completo,
        imagen_perfil: nuevaImagen,
      })
      .eq("id", user.id)

    if (updateError) {
      return NextResponse.json(
        { error: "Error al actualizar perfil" },
        { status: 500 }
      )
    }

    //* ACTUALIZAMOS CONTRASEÑA
    if (password && password.length >= 6) {
      const { error: passwordError } =
        await supabaseAdmin.auth.admin.updateUserById(user.id, {
          password: password,
        })

      if (passwordError) {
        return NextResponse.json(
          { error: passwordError.message },
          { status: 500 }
        )
      }
    }

    //* RESPUESTA EXITOSA
    return NextResponse.json(
      { message: "Perfil actualizado correctamente" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error al actualizar el perfil del usuario:", error)
    return NextResponse.json(
      { error: "Error al actualizar el perfil del usuario" },
      { status: 500 }
    )
  }
}
