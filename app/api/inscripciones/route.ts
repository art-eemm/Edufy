import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//* INSCRIBIRSE A UN CURSO
export async function POST(request: Request){
    try{
        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json(
                { error: "Usuario no autenticado" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { id_curso } = body;
        if (!id_curso) {
            return NextResponse.json(
                { error: "El id del curso es obligatorio" },
                { status: 400 }
            );
        }

        //* VALIDAMOS QUE EL CURSO EXISTE
        const { data: curso } = await supabaseAdmin
        .from("cursos")
        .select("id_profesor, estatus")
        .eq("id_curso", id_curso)
        .single();
        if (!curso || curso.estatus !== 1) {
            return NextResponse.json(
                { error: "Curso no disponible" },
                { status: 404 }
            );
        }

        //* EVITAMOS QUE EL PROFESOR SE INSCRIBA A SU PROPIO CURSO
        if (curso.id_profesor === user.id) {
            return NextResponse.json(
                { error: "No puedes inscribirte a tu propio curso" },
                { status: 400 }
            );
        }

        //* VALIDAR QUE EL USUARIO NO ESTÉ INSCRITO
        const { data: existente } = await supabaseAdmin
        .from("inscripciones")
        .select("id_inscripcion")
        .eq("id_usuario", user.id)
        .eq("id_curso", id_curso)
        .maybeSingle();
        if (existente) {
            return NextResponse.json(
                { error: "Ya estás inscrito en este curso" },
                { status: 400 }
            );
        }

        //* INSCRIBIR USUARIO AL CURSO
        const { error } = await supabaseAdmin
        .from("inscripciones")
        .insert([
            {
            id_usuario: user.id,
            id_curso: id_curso
            }
        ]);
        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Inscripción exitosa" },
            {status: 200}
        );
    }catch(error){
        return NextResponse.json(
            { error: "Error al inscribirse" },
            { status: 500 }
        );
    }
}