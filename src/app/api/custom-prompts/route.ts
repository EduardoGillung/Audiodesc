import { createClient } from "@/lib/database/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("custom_prompts")
      .select("*")
      .eq("user_id", user.id)
      .order("order_index", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ prompts: data });
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, prompt, icon, color } = await req.json();

    if (!title || !prompt) {
      return NextResponse.json(
        { error: "Title and prompt are required" },
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

    if (error) throw error;

    return NextResponse.json({ prompt: data });
  } catch (error) {
    console.error("Error creating prompt:", error);
    return NextResponse.json(
      { error: "Failed to create prompt" },
      { status: 500 }
    );
  }
}
