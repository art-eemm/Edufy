import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//* GENERAMOS EL CERTIFICADO DEL CURSO
export async function POST(request: Request) {
    try {
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        }

        const formData = await request.formData();
        const id_curso = formData.get("cursoId") as string;
        const certificado = formData.get("certificado") as File | null;

        if (!id_curso || !certificado) {
            return NextResponse.json(
                { error: "Datos incompletos" },
                { status: 400 }
            );
        }

        //* VALIDAR QUE TERMINÓ EL CURSO
        const { data: videos } = await supabaseAdmin
        .from("videos")
        .select("id_video")
        .eq("id_curso", id_curso)
        .eq("estatus", 1);

        const { data: vistos } = await supabaseAdmin
        .from("progreso_videos")
        .select("id_video")
        .eq("id_usuario", user.id)
        .in("id_video", videos.map(v => v.id_video));

        if (vistos.length !== videos.length) {
            return NextResponse.json(
                { error: "No has terminado el curso" },
                { status: 400 }
            );
        }

        //* VALIDAR QUE NO EXISTA CERTIFICADO
        const { data: existente } = await supabaseAdmin
        .from("certificados")
        .select("id")
        .eq("id_usuario", user.id)
        .eq("id_curso", id_curso)
        .maybeSingle();

        if (existente) {
            return NextResponse.json(
                { error: "Ya tienes certificado" },
                { status: 400 }
            );
        }

        //* VALIDAR TIPO DE ARCHIVO
        if (!certificado.type.includes("pdf") && !certificado.type.includes("image")) {
            return NextResponse.json(
                { error: "Formato inválido (solo PDF o imagen)" },
                { status: 400 }
            );
        }

        //* SUBIR ARCHIVO AL BUCKET
        const fileExt = certificado.name.split(".").pop();
        const fileName = `certificado/${user.id}/${id_curso}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabaseAdmin.storage
        .from("certificados")
        .upload(fileName, certificado, {
            upsert: true,
        });

        if (uploadError) {
        console.error(uploadError);
            return NextResponse.json(
                { error: uploadError.message },
                { status: 500 }
            );
        }

        //* OBTENER URL PUBLICA
        const { data } = supabaseAdmin.storage
        .from("certificados")
        .getPublicUrl(fileName);

        const url = data.publicUrl;

        //* GUARDAR EN BD
        const { error } = await supabaseAdmin
        .from("certificados")
        .insert([
            {
            id_usuario: user.id,
            id_curso,
            url_archivo: url,
            },
        ]);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            message: "Certificado generado correctamente",
            url,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error al generar certificado" },
            { status: 500 }
        );
    }
}