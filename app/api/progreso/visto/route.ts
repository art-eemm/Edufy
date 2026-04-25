import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//* PONEMOS UN VIDEO EN VISTO CUANDO SE HAYA VISUALIZADO
export async function POST(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json(
                { error: "No autenticado" },
                { status: 401 }
            );
        }

        const { id_video } = await request.json();
        //* OBTENEMOS EL VIDEO
        const { data: video } = await supabaseAdmin
        .from("videos")
        .select("id_curso, orden")
        .eq("id_video", id_video)
        .single();
        if (!video) {
            return NextResponse.json(
                { error: "Video no encontrado" }, 
                { status: 404 }
            );
        }

        //* VALIDAR INSCRIPCIÓN
        const { data: inscripcion } = await supabaseAdmin
        .from("inscripciones")
        .select("id_inscripcion")
        .eq("id_usuario", user.id)
        .eq("id_curso", video.id_curso)
        .maybeSingle();

        if (!inscripcion) {
        return NextResponse.json(
            { error: "No estás inscrito en este curso" },
            { status: 403 }
        );
        }

        //* VALIDAR QUE NO SE SALTE VIDEOS
        const { data: anterior } = await supabaseAdmin
        .from("videos")
        .select("id_video")
        .eq("id_curso", video.id_curso)
        .eq("orden", video.orden - 1)
        .maybeSingle();

        if (anterior) {
        const { data: progresoAnterior } = await supabaseAdmin
            .from("progreso_videos")
            .select("visto")
            .eq("id_usuario", user.id)
            .eq("id_video", anterior.id_video)
            .maybeSingle();

        if (!progresoAnterior || !progresoAnterior.visto) {
            return NextResponse.json(
                { error: "Debes ver el video anterior primero" },
                { status: 400 }
            );
        }
        }

        //* GUARDAR PROGRESO
        const { error } = await supabaseAdmin
        .from("progreso_videos")
        .upsert({
            id_usuario: user.id,
            id_video,
            visto: true,
            fecha_visto: new Date()
        });
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Video marcado como visto" });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al guardar progreso" },
            { status: 500 }
        );
    }
}