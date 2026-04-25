import { NextResponse } from "next/server";
import { getUserFromToken, hasRole } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//*CREAR VIDEO
export async function POST(request:Request){
    try{
        const user = await getUserFromToken(request);
        if(!user){
            return NextResponse.json(
                { error: "Unauthorized" }, 
                { status: 401 }
            );
        }
        const isProfesor = await hasRole(user.id, "profesor");
        if(!isProfesor){
            return NextResponse.json(
                { error: "No Autorizado" }, 
                { status: 403 }
            );
        }

        const formData = await request.formData();
        //* OBTENEMOS LA INFORMACION DEL USUARIO
        const curso_id = formData.get("cursoId") as string
        const nombre = formData.get("nombre") as string
        const duracion = formData.get("duracion") as string
        const video = formData.get("video") as File

        if(!curso_id || !nombre || !duracion || !video){
            return NextResponse.json(
                { error: "Faltan campos obligatorios" },
                { status: 400 }
            );
        }

        //* OBTENER EL ULTIMO ORDEN DE LOS VIDEOS
        const { data: ultimoVideo } = await supabaseAdmin
        .from("videos")
        .select("orden")
        .eq("id_curso", curso_id)
        .eq("estatus", 1)
        .order("orden", { ascending: false })
        .limit(1)
        .maybeSingle();
        const nuevoOrden = ultimoVideo ? ultimoVideo.orden + 1 : 1;

        //* VALIDAR QUE EL ARCHIVO QUE SE SUBE ES VIDEO
        if(!video.type.startsWith("video/")){
            return NextResponse.json(
                { error: "El archivo debe ser un video" },
                { status: 400 }
            );
        }

        //* SUBIMOS EL VIDEO A SUPABASE
        const fileExt = video.name.split(".").pop();
        const fileName = `video/${user.id}-${Date.now()}-${video.name}`;
        const { error: uploadError } = await supabaseAdmin.storage
        .from("videos")
        .upload(fileName, video, {
            upsert: true,
        });

        if(uploadError){
            console.error("Error uploading video:", uploadError);
            return NextResponse.json(
                { error: "Error al subir el video" }, 
                { status: 500 }
            );
        }

        //* OBTENER LA URL PUBLICA DEL VIDEO
        const { data: publicUrl } = supabaseAdmin.storage
        .from("videos")
        .getPublicUrl(fileName);
        const videoUrl = publicUrl.publicUrl;

        //* GUARDAR EN BD
        const { error: insertError } = await supabaseAdmin
        .from("videos")
        .insert([
            {
            id_curso: curso_id,
            titulo: nombre,
            url_video: videoUrl,
            orden: nuevoOrden,
            duracion: duracion,
            },
        ]);

        if (insertError) {
            return NextResponse.json(
                { error: insertError.message },
                { status: 500 }
            );
        }

        //* RESPUESTA
        return NextResponse.json(
            { 
                message: "Video creado correctamente",
                orden: nuevoOrden,
                url_video: videoUrl,
            }
    );

    }catch(error){
        console.error("Error creating video:", error);
        return NextResponse.json(
            { error: "Failed to create video" }, 
            { status: 500 }
        );
    }
}