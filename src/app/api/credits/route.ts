import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      credits: 500,
      totalCredits: 500,
      plan: "PRO",
    });
  } catch (err: any) {
    console.error("[CREDITS] Error:", err.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
