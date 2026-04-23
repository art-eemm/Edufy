import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";

//* INICIO DE SESION
export async function POST(request: Request){
    try{
        const body = await request.json();
        const { email, password } = body;

        //* VALIDACION DE INFORMACION
        if( !email || !password ){
            return NextResponse.json(
                { error: "email y password son obligatorios" },
                { status: 400 }
            )
        }

        //* LOGIN
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        if(error){
            console.log("Error al iniciar sesión:", error);
            return NextResponse.json(
                { error: "Crendenciales incorrectas"},
                { status: 401 }
            );
        }

        //* OBTENER INFORMACION DEL USUARIO LOGUEADO
        const user = data.user;
        const token = data.session?.access_token;
        const { data: profile, error: profileError } = await supabaseClient
        .from("perfiles")
        .select("nombre_completo, rol:roles(nombre)")
        .eq("id", user.id)
        .single();

        if(profileError){
            return NextResponse.json(
                { error: "Error al obtener el perfil del usuario" },
                { status: 500 }
            )
        }

        //* RESPUESTA EXITOSA
        return NextResponse.json(
            {
                message: "Usuario logueado correctamente",
                user: user.email,
                nombre: profile.nombre_completo,
                role: profile.rol?.[0]?.nombre,
                token: token,
            },
            { status: 200 }
        )
    }catch(error){
        return NextResponse.json({ error: "Error en el registro" }, { status: 500 });
    }
}