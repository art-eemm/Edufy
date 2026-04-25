import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

//* CAMBIO DE ROL DE ALUMNO A MAESTRO SI EL USUARIO LO SOLICITA
export async function POST(request: Request){
    try{
        const body = await request.json();
        const { userId } = body;
        if(!userId){
            return NextResponse.json(
                {message: "Faltan datos para el cambio a profesor"},
                {status: 400}
            );
        }

        //* CAMBIO DE ROL
        const { error } = await supabaseAdmin
            .from("perfiles")
            .update({rol: 3})
            .eq("id", userId);
        if( error ){
            return NextResponse.json(
                {message: "Error al cambiar el rol a profesor"},
                {status: 500}
            );
        }

        //* RESPUESTA EXITOSA
        return NextResponse.json(
            {message: "Cambio a profesor exitoso"},
            {status: 200}
        );
    }catch(error){
        console.log("Error en el cambio a profesor: ", error);
        return NextResponse.json(
            {message: "Error en el cambio a profesor"},
            {status: 500}
        );
    }
}