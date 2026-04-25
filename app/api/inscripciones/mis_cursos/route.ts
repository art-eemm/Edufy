import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { supabaseClient } from "@/lib/supabaseClient";

//* OBTENER LOS CURSOS AL QUE ESTA INSCRITO EL USUARIO
export async function GET(request: Request) {
    try {
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json(
                { error: "Usuario no autenticado" },
                { status: 401 }
            );
        }

        const { data, error } = await supabaseClient
        .from("inscripciones")
        .select(`
            id_inscripcion,
            fecha_inscripcion,
            cursos (
                id_curso,
                nombre,
                descripcion,
                perfiles (
                    nombre_completo
                )
            )
        `)
        .eq("id_usuario", user.id);

        if (error) {
            return NextResponse.json(
                { error: "Error al obtener cursos" },
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