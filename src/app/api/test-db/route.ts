import { createClient } from "@/lib/database/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error, count } = await supabase
      .from("transcriptions")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({
        status: "error",
        message: error.message,
        hint: error.hint,
      });
    }

    return NextResponse.json({
      status: "connected",
      table: "transcriptions",
      count: count || 0,
    });
  } catch (err) {
    return NextResponse.json({
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
