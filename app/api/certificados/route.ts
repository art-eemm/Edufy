import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { supabaseClient } from "@/lib/supabaseClient";

//* VER LOS CERTIFICADOS
export async function GET(request: Request) {
    try {
        const user = await getUserFromToken(request);

        if (!user) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
        }

        const { data, error } = await supabaseClient
        .from("certificados")
        .select(`
            url_archivo,
            fecha_emision,
            cursos (
            nombre
            )
        `)
        .eq("id_usuario", user.id);

        if (error) {
        return NextResponse.json(
            { error: "Error al obtener certificados" },
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