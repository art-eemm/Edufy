import { NextResponse } from "next/server";
import { getUserFromToken, hasRole } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//* VER ALUMNOS QUE ESTAN REGISTRADOS EN UN CURSO
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await params;
        
        const user = await getUserFromToken(request);
        if (!user) {
        return NextResponse.json(
            { error: "No autenticado" },
            { status: 401 }
        );
        }

        //* VALIDAR QUE ES PROFESOR
        const esProfesor = await hasRole(user.id, "profesor");
        if (!esProfesor) {
        return NextResponse.json(
            { error: "No autorizado" },
            { status: 403 }
        );
        }

        //* VALIDAR QUE EL CURSO ES SUYO
        const { data: curso } = await supabaseAdmin
        .from("cursos")
        .select("id_profesor")
        .eq("id_curso", id)
        .single();

        if (!curso || curso.id_profesor !== user.id) {
        return NextResponse.json(
            { error: "No puedes ver estos datos" },
            { status: 403 }
        );
        }

        const { data, error } = await supabaseAdmin
        .from("inscripciones")
        .select(`
            fecha_inscripcion,
            perfiles (
            nombre_completo
            )
        `)
        .eq("id_curso", id);

        if (error) {
        return NextResponse.json(
            { error: error.message },
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