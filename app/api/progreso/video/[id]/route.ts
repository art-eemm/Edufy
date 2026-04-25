import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//* VALIDARCION SI SE PUEDE VER UN VIDEO
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params;
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { data: video } = await supabaseAdmin
      .from("videos")
      .select("id_curso, orden")
      .eq("id_video", id)
      .single();

    //* VALIDAR INSCRIPCIÓN
    const { data: inscripcion } = await supabaseAdmin
      .from("inscripciones")
      .select("id_inscripcion")
      .eq("id_usuario", user.id)
      .eq("id_curso", video.id_curso)
      .maybeSingle();

    if (!inscripcion) {
      return NextResponse.json({ permitido: false });
    }

    //* PRIMER VIDEO SIEMPRE PERMITIDO
    if (video.orden === 1) {
      return NextResponse.json({ permitido: true });
    }

    //* VALIDAR VIDEO ANTERIOR
    const { data: anterior } = await supabaseAdmin
      .from("videos")
      .select("id_video")
      .eq("id_curso", video.id_curso)
      .eq("orden", video.orden - 1)
      .maybeSingle();

    const { data: progreso } = await supabaseAdmin
      .from("progreso_videos")
      .select("visto")
      .eq("id_usuario", user.id)
      .eq("id_video", anterior?.id_video)
      .maybeSingle();

    return NextResponse.json({
      permitido: progreso?.visto === true
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Error validando acceso" },
      { status: 500 }
    );
  }
}