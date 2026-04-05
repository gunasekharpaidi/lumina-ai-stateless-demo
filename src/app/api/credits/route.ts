import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        credits: true,
        totalCredits: true,
        plan: true,
        creditsResetAt: true,
        _count: { select: { generations: true } }
      }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      credits: user.credits,
      totalCredits: user.totalCredits,
      plan: user.plan,
      creditsResetAt: user.creditsResetAt,
      totalGenerations: user._count.generations,
      percentUsed: Math.round(((user.totalCredits - user.credits) / user.totalCredits) * 100)
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
