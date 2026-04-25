import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabaseClient";

//* OBTENER VIDEOS DE UN CURSO
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }){
    try{
        const { id } = await params;

        const { data, error } = await supabaseClient
        .from("videos")
        .select("*")
        .eq("id_curso", id)
        .eq("estatus", 1)
        .order("orden", { ascending: true });
        
        if(error){
            return NextResponse.json(
                { error: "Error al obtener videos" },
                { status: 500 }
            );
        }

        return NextResponse.json(data);

    }catch(error){
        return NextResponse.json(
            { error: "Error al obtener videos" },
            { status: 500 }
        );
    }
}