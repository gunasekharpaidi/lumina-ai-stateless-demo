import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        credits: true,
        totalCredits: true,
        plan: true,
        creditsResetAt: true,
        email: true,
        _count: { select: { generations: true } }
      }
    });

    // SELF-HEALING: If user is in Clerk but not our DB, create them now
    if (!user) {
      const { currentUser } = await import("@clerk/nextjs/server");
      const clerkUser = await currentUser();
      
      if (!clerkUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
      
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const isAdmin = email === 'gunasekharpaidi@gmail.com';

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: email,
          credits: isAdmin ? 500 : 10,
          totalCredits: isAdmin ? 500 : 10,
          plan: isAdmin ? 'PRO' : 'FREE'
        },
        select: {
          credits: true,
          totalCredits: true,
          plan: true,
          creditsResetAt: true,
          _count: { select: { generations: true } }
        }
      }) as any;
    }

    if (!user) return NextResponse.json({ error: "Failed to create user session" }, { status: 500 });

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
