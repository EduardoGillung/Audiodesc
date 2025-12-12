import { createClient } from "@/lib/database/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Você precisa estar logado para acessar seus prompts" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("custom_prompts")
      .select("*")
      .eq("user_id", user.id)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Database error fetching prompts:", error);
      throw error;
    }

    return NextResponse.json({ prompts: data || [] });
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      { error: "Erro ao buscar prompts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Você precisa estar logado para criar prompts" },
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
      .insert({
        user_id: user.id,
        title,
        prompt,
        icon: icon || "sparkles",
        color: color || "yellow",
      })
      .select()
      .single();

    if (error) {
      console.error("Database error creating prompt:", error);
      throw error;
    }

    return NextResponse.json({ prompt: data });
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json(
      { error: "Erro ao criar prompt" },
      { status: 500 }
    );
  }
}
