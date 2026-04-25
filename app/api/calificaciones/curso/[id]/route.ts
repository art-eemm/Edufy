import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";

//* VER CALIFICACIONES DE UN CURSO
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await params;
        const { data, error } = await supabaseClient
        .from("calificaciones")
        .select(`
            estrellas,
            comentario,
            fecha,
            perfiles (
            nombre_completo
            )
        `)
        .eq("id_curso", id)
        .order("fecha", { ascending: false });

        if (error) {
            return NextResponse.json(
                { error: "Error al obtener calificaciones" },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "Error interno" },
            { status: 500 }
        );
    }
}