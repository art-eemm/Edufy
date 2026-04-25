import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUserFromToken, hasRole } from "@/lib/auth";

//* OBTENER CURSO POR ID (PARA VER MÁS INFORMACION)
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try{
        const { id } = await params;

        const { data, error } = await supabaseClient
            .from("cursos")
            .select(`
                id_curso,
                nombre,
                descripcion,
                videos (
                id_video,
                titulo,
                url_video,
                orden,
                duracion,
                estatus
                )
            `)
            /* .select(`
                id_curso,
                nombre,
                descripcion,
                fecha_creacion,
                perfiles (
                nombre_completo
                )
            `) */
            .eq("id_curso", id)
            .single();

            if (error) {
      return NextResponse.json(
            { error: "Curso no encontrado" },
            { status: 404 }
        );
        }

        return NextResponse.json(data);
    }catch(error){
        console.error("Error al obtener el curso por ID:", error);
        return NextResponse.json(
            { error: "Error al obtener el curso por ID" }, 
            { status: 500 }
        );
    }
}

//* ACTUALIZAR CURSO POR ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }){
    try{
        const { id } = await params;

        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const isProfesor = await hasRole(user.id, "profesor");
        if (!isProfesor) {
            return NextResponse.json(
                { error: "Acceso denegado" },
                { status: 403 }
            );
        }

        ///* VALIDACION DE QUE EL CURSO LE PERTENECE AL PROFESOR
        const { data: curso } = await supabaseAdmin
            .from("cursos")
            .select("id_profesor")
            .eq("id_curso", id)
            .single();
        if( !curso || curso.id_profesor !== user.id){
            return NextResponse.json(
                { error: "Acceso denegado" },
                { status: 403 }
            );  
        }

        const { nombre, descripcion } = await request.json();
        const { error } = await supabaseAdmin
            .from("cursos")
            .update(
                { nombre, descripcion }
            )
            .eq("id_curso", id);

        if (error) {
            console.error("Error al actualizar el curso:", error);
            return NextResponse.json(
                { error: "Error al actualizar el curso" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Curso actualizado correctamente" },
            { status: 200 }
        );
    }catch(error){
        console.error("Error al actualizar el curso por ID:", error);
        return NextResponse.json(
            { error: "Error al actualizar el curso por ID" }, 
            { status: 500 }
        );
    }
}

//* ELIMINAR CURSO POR ID
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }){
    try{
        const { id } = await params;

        const user = await getUserFromToken(request);
        if (!user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }
        const isProfesor = await hasRole(user.id, "profesor");
        if (!isProfesor) {
            return NextResponse.json(
                { error: "Acceso denegado" },
                { status: 403 }
            );
        }

        //* VALIDOMOS QUE EL CURSO LE PERTENECE AL PROFESOR
        const { data: curso } = await supabaseAdmin
            .from("cursos")
            .select("id_profesor")
            .eq("id_curso", id)
            .single();
        if( !curso || curso.id_profesor !== user.id){
            return NextResponse.json(
                { error: "Acceso denegado" },
                { status: 403 }
            );  
        }

        //* ACTUALIZAMOS EL ESTADO DEL CURSO A INACTIVO
        const { error } = await supabaseAdmin
            .from("cursos")
            .update({ estatus: "0" })
            .eq("id_curso", id);
        if(error){
            console.error("Error al eliminar el curso:", error);
            return NextResponse.json(
                { error: "Error al eliminar el curso" },
                { status: 500 }
            );
        }

        //* MENSAJE DE EXITO
        return NextResponse.json(
            { message: "Curso eliminado correctamente" },
            { status: 200 }
        );
    }catch(error){
        console.error("Error al eliminar el curso por ID:", error);
        return NextResponse.json(
            { error: "Error al eliminar el curso por ID" }, 
            { status: 500 }
        );
    }
}