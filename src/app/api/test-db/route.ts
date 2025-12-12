import { createClient } from "@/lib/database/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Teste simples de conexão
    const { data, error } = await supabase
      .from("transcriptions")
      .select("count")
      .limit(1);

    if (error) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Database connection failed",
          error: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        status: "error", 
        message: "Database test failed",
        error: error.message 
      },
      { status: 500 }
    );
  }
}