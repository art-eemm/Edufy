import { NextResponse } from "next/server";
import { getUserFromToken, hasRole } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { request } from "https";

//* ACTUALIZAR VIDEO POR ID
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const user = await getUserFromToken(request);

        if (!user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const isProfesor = await hasRole(user.id, "profesor");

        if (!isProfesor) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 });
        }

        //* OBTENER VIDEO ACTUAL
        const { data: videoActual } = await supabaseAdmin
        .from("videos")
        .select("id_curso, url_video")
        .eq("id_video", id)
        .single();

        //* VALIDAR PROPIEDAD
        const { data: curso } = await supabaseAdmin
        .from("cursos")
        .select("id_profesor")
        .eq("id_curso", videoActual?.id_curso)
        .single();

        if (!curso || curso.id_profesor !== user.id) {
            return NextResponse.json(
                { error: "No puedes editar este video" },
                { status: 403 }
            );
        }

        const formData = await request.formData();
        const nombre = formData.get("nombre") as string;
        const duracion = formData.get("duracion") as string;
        const videoFile = formData.get("video") as File | null;

        let nuevaUrlVideo = videoActual?.url_video;

        //* SI EXISTE NUEVO VIDEO
        if (videoFile && videoFile.size > 0) {
            //* SUBIMOS EL NUEVO VIDEO
            const fileExt = videoFile.name.split(".").pop();
            const fileName = `video/${user.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabaseAdmin.storage
            .from("videos")
            .upload(fileName, videoFile, {
                upsert: true,
            });

            if (uploadError) {
                console.error(uploadError);
                return NextResponse.json(
                    { error: "Error al subir video" },
                    { status: 500 }
                );
            }

            //* OBTENEMOS LA URL
            const { data } = supabaseAdmin.storage
            .from("videos")
            .getPublicUrl(fileName);
            nuevaUrlVideo = data.publicUrl;

            //* ELIMINAMOS VIDEO ANTERIOR
            if (videoActual?.url_video) {
                const pathAnterior = videoActual.url_video.split("/").pop();
                if (pathAnterior) {
                    await supabaseAdmin.storage
                    .from("videos")
                    .remove([pathAnterior]);
                }
            }
        }

        //* ACTUALIZAMOS EL REGISTRO EN BASE DE DATOS
        const { error } = await supabaseAdmin
        .from("videos")
        .update({
            titulo: nombre,
            url_video: nuevaUrlVideo,
            duracion,
        })
        .eq("id_video", id);

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        //* MENSAJE EXITOSO
        return NextResponse.json(
            { message: "Video actualizado correctamente" },
            { status : 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error al actualizar video" },
            { status: 500 }
        );
    }
}

//* ELIMINAR VIDEO
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getUserFromToken(request);

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const esProfesor = await hasRole(user.id, "profesor");

    if (!esProfesor) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    //* OBTENER VIDEO
    const { data: video } = await supabaseAdmin
      .from("videos")
      .select("id_curso")
      .eq("id_video", id)
      .single();

    //* VALIDAR PROPIEDAD
    const { data: curso } = await supabaseAdmin
      .from("cursos")
      .select("id_profesor")
      .eq("id_curso", video?.id_curso)
      .single();

    if (!curso || curso.id_profesor !== user.id) {
      return NextResponse.json(
        { error: "No puedes eliminar este video" },
        { status: 403 }
      );
    }

    const { error } = await supabaseAdmin
      .from("videos")
      .update({ estatus: 0 })
      .eq("id_video", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Video eliminado" });

  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar video" },
      { status: 500 }
    );
  }
}