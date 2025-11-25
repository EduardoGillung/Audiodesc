import { createClient } from "@/lib/database/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Você precisa estar logado para editar prompts" },
        { status: 401 }
      );
    }

    const { title, prompt, icon, color } = await req.json();

    if (!title || !prompt) {
      return NextResponse.json(
        { error: "Título e prompt são obrigatórios" },
        { status: 400 }
      );
    }

    if (title.length > 30) {
      return NextResponse.json(
        { error: "Título deve ter no máximo 30 caracteres" },
        { status: 400 }
      );
    }

    if (prompt.length > 500) {
      return NextResponse.json(
        { error: "Prompt deve ter no máximo 500 caracteres" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("custom_prompts")
      .update({
        title,
        prompt,
        icon: icon || "sparkles",
        color: color || "yellow",
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Database error updating prompt:", error);
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: "Prompt não encontrado ou você não tem permissão" },
        { status: 404 }
      );
    }

    return NextResponse.json({ prompt: data });
  } catch (error) {
    console.error("Error updating prompt:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar prompt" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Você precisa estar logado para deletar prompts" },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from("custom_prompts")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Database error deleting prompt:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return NextResponse.json(
      { error: "Erro ao deletar prompt" },
      { status: 500 }
    );
  }
}
