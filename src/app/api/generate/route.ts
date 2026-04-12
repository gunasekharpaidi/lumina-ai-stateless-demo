import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    // 1. Auth Check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("[GENERATE] Auth OK:", userId);

    // 2. Parse request
    const body = await request.json();
    const { imageUrl, prompt, category } = body;

    const VALID_CATEGORIES = ['Apparel', 'Jewellery', 'Home', 'Pets'];

    if (!imageUrl || !category) {
      return NextResponse.json({ error: "Image URL and category are required" }, { status: 400 });
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    if (prompt && prompt.length > 500) {
      return NextResponse.json({ error: "Prompt too long (max 500 chars)" }, { status: 400 });
    }

    // 3. Self-Healing: Find or create user record
    let user = await prisma.user.findUnique({ where: { clerkId: userId } });
    console.log("[GENERATE] DB user lookup:", user ? "FOUND" : "NOT FOUND");

    if (!user) {
      // Create the user record automatically (handles webhook delays)
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return NextResponse.json({ error: "User session not found" }, { status: 404 });
      }

      const email = clerkUser.emailAddresses[0]?.emailAddress;
      const isAdmin = email === "gunasekharpaidi@gmail.com";

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: email,
          credits: isAdmin ? 500 : 10,
          totalCredits: isAdmin ? 500 : 10,
          plan: isAdmin ? "PRO" : "FREE",
        },
      });
      console.log("[GENERATE] Self-healed: Created new user for", email);
    }

    // 4. Credit Check
    if (user.credits <= 0) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });
    }

    // 5. Deduct Credit
    await prisma.user.update({
      where: { clerkId: userId },
      data: { credits: { decrement: 1 } },
    });
    console.log("[GENERATE] Credit deducted. Remaining:", user.credits - 1);

    // 6. Create Generation Tracking Record
    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        category,
        prompt: prompt || "",
        inputUrl: imageUrl,
        status: "queued",
      },
    });
    console.log("[GENERATE] DB record created:", generation.id);

    // 7. Dispatch to Inngest queue
    await inngest.send({
      name: "studio/generate.requested",
      data: {
        generationId: generation.id,
        inputUrl: imageUrl,
        prompt: prompt || "",
        category,
      },
    });
    console.log("[GENERATE] Inngest event dispatched for:", generation.id);

    return NextResponse.json({ success: true, generationId: generation.id });

  } catch (error: any) {
    console.error("CRITICAL [GENERATE]:", {
      message: error.message,
      code: error.code,
      stack: error.stack?.split("\n").slice(0, 5).join("\n"),
      db_url_present: !!process.env.DATABASE_URL,
      inngest_key_present: !!process.env.INNGEST_EVENT_KEY,
      google_key_present: !!process.env.GOOGLE_GENAI_API_KEY,
    });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
