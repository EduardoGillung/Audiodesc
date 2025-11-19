import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return NextResponse.json({
    supabase_url: url ? "✓ configured" : "✗ missing",
    supabase_key: key ? "✓ configured" : "✗ missing",
    status: url && key ? "ready" : "not configured",
  });
}
