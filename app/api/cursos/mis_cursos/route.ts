import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";
import { getUserFromToken, hasRole } from "@/lib/auth";

//* OBTENER LOS CURSOS QUE EL PROFESOR TIENE
export async function GET(request: Request){
    try{
        const user = await getUserFromToken(request)
        if(!user){
            return NextResponse.json(
                { error: "Usuario no autenticado" },
                { status: 401 }
            )
        }
        //* VALIDAMOS QUE EL USUARIO SEA MAESTRO
        const esMaestro = await hasRole(user.id, "profesor")
        if(!esMaestro){
            return NextResponse.json(
                { error: "Solo los profesores pueden acceder a sus cursos" },
                { status: 403 }
            )
        }

        const { data, error } = await supabaseClient
        .from("cursos")
        .select(`
            id_curso,
            nombre,
            descripcion,
            fecha_creacion
        `)
        .eq("id_profesor", user.id)
        .eq("estatus", 1)
        .order("fecha_creacion", { ascending: false })

        if (error) {
            return NextResponse.json(
                { error: error.message }, 
                { status: 500 }
            )
        }
        
        //* RETORNAMOS LOS CURSOS DEL PROFESOR
        return NextResponse.json(data)
    }catch(error){
        return NextResponse.json(
            { error: "Error al obtener los cursos del profesor" },
            { status: 500 }
        )
    }
}