import { createClient } from "@supabase/supabase-js"
import { supabaseClient } from "./supabaseClient"

//* OBTENEMOS EL USUARIO A PARTIR DEL TOKEN DE AUTENTICACIÓN
export async function getUserFromToken(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    if (!token) return null

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )
    const { data, error } = await supabase.auth.getUser()
    if (error) return null

    return data.user
  } catch (error) {
    return null
  }
}

//* OBTENEMOS EL PERFIL DEL USUARIO
export async function getUserProfile(userId: string) {
  const { data, error } = await supabaseClient
    .from("perfiles")
    .select(
      `
        id,
        nombre_completo,
        rol,
        roles (
        nombre
        )
    `
    )
    .eq("id", userId)
    .single()

  if (error) return null

  return data
}

export async function hasRole(userId: string, role: string) {
  const perfil = await getUserProfile(userId)
  if (!perfil || !perfil.roles) return false

  // Verificamos si es un array o un objeto directamente
  const rolName = Array.isArray(perfil.roles)
    ? perfil.roles[0]?.nombre
    : (perfil.roles as any)?.nombre

  return rolName?.toLowerCase() === role.toLowerCase()
}
