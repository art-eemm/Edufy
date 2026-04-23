import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";
import { getUserFromToken } from "@/lib/auth";

//* OBTENER EL PERFIL DEL USUARIO
export async function GET(request: Request){
    try{
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json(
                { error: "Usuario no autenticado" }, 
                { status: 401 });
        }

        const { data, error } = await supabaseClient
        .from("perfiles")
        .select(`
            id,
            nombre_completo,
            imagen_perfil`
        )
        .eq("id", user.id)
        .single()

        if (error) {
            console.error("Error al obtener el perfil del usuario:", error);
            return NextResponse.json(
                { error: "Error al obtener el perfil del usuario" }, 
                { status: 500 });
        }

        return NextResponse.json(data);

    }catch(error){
        console.error("Error al obtener el perfil del usuario:", error);
        return NextResponse.json(
            { error: "Error al obtener el perfil del usuario" }, 
            { status: 500 });
    }
}