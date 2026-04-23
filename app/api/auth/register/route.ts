import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const DEFAULT_AVATAR = "https://ksyydmldmbbtcagbsovc.supabase.co/storage/v1/object/public/imagen_perfil/sin_perfil.jpg"

//* REGISTRO DE USUARIOS
export async function POST(request: Request){
    try{
        const formData = await request.formData();
        //* OBTENEMOS LA INFORMACION DEL USUARIO
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const nombre_completo = formData.get("nombre") as string
        const imagen_perfil = formData.get("imagen_perfil") as File | null

        if(!email || !password || !nombre_completo){
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        //* CREAMOS EL USUARIO EN SUPABASE
        const { data, error } = await supabaseAdmin.auth.signUp({
            email,
            password
        });
        if ( error || !data.user){
            return NextResponse.json(
                {error: error?.message || "Error al registrar usuario"},
                {status: 400}
            );
        }

        //* OBTENEMOS EL ID DEL USUARIO CREADO
        const userId = data.user.id;

        //* SUBIMOS IMAGEN DE PERFIL SI EXISTE
        let imagenUrl = DEFAULT_AVATAR;
        if(imagen_perfil && imagen_perfil.size > 0){
            const fileName = `imagen_perfil/${userId}-${Date.now()}`;

            //*
            const { error: uploadError } = await supabaseAdmin.storage
            .from("avatars")
            .upload(fileName, imagen_perfil);
            if(!uploadError){
                const { data: publicUrl } = supabaseAdmin.storage
                .from("avatars")
                .getPublicUrl(fileName);

                imagenUrl = publicUrl.publicUrl;
            }
        }

        //* GUARDAMOS LA INFORMACION DEL USUARIO EN LA TABLA "PERFILES"
        const { error: profileError } = await supabaseAdmin
        .from("perfiles")
        .insert({
            id: userId,
            nombre_completo,
            imagen_perfil: imagenUrl,
            rol: 2, //* alumno
        });
        if (profileError) {
            console.error("Error creando perfil:", profileError);
            return NextResponse.json(
                { error: "Error creando perfil" },
                { status: 500 }
            );
        }

        //* RESPUESTA EXITOSA
        return NextResponse.json(
            { message: "Usuario registrado correctamente" }
        );
    }catch(error){
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}