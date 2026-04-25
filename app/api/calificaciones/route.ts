import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//* GUARDAR CALIFICACION DEL CURSO
export async function POST(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        }

        const { id_curso, estrellas, comentario } = await request.json();
        if (!id_curso || !estrellas || !comentario) {
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
            { error: "Debes completar el curso antes de calificar" },
            { status: 400 }
        );
        }

        const { error } = await supabaseAdmin
        .from("calificaciones")
        .insert([
            {
            id_usuario: user.id,
            id_curso,
            estrellas,
            comentario,
            },
        ]);

        if (error) {
            return NextResponse.json(
                { error: error.message }, 
                { status: 500 }
            );
        }

        return NextResponse.json({
        message: "Calificación guardada correctamente",
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Error al calificar" },
            { status: 500 }
        );
    }
}