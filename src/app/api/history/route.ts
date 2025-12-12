import { createClient } from "@/lib/database/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Você precisa estar logado para ver o histórico" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("transcription_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Database error fetching history:", error);
      throw error;
    }

    return NextResponse.json({ history: data || [] });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "Erro ao buscar histórico" },
      { status: 500 }
    );
  }
}
