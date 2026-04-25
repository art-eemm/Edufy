import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//* PROGRASO DEL CURSO
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await params;
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        }

        //* TOTAL VIDEOS
        const { data: videos } = await supabaseAdmin
        .from("videos")
        .select("id_video")
        .eq("id_curso", id)
        .eq("estatus", 1);

        //* VIDEOS VISTOS
        const { data: vistos } = await supabaseAdmin
        .from("progreso_videos")
        .select("id_video")
        .eq("id_usuario", user.id)
        .in("id_video", videos.map(v => v.id_video));

        const total = videos.length;
        const completados = vistos.length;

        const porcentaje = total === 0 ? 0 : (completados / total) * 100;

        return NextResponse.json({
        total,
        completados,
        porcentaje
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener progreso" },
            { status: 500 }
        );
    }
}