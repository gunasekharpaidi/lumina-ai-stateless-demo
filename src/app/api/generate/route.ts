import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { inngest } from "../../../inngest/client";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    // 1. Verify user is logged in
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // 3. Deduct User Credits
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user || user.credits <= 0) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });
    }

    await prisma.user.update({
      where: { clerkId: userId },
      data: { credits: { decrement: 1 } },
    });

    // 4. Create Generation Tracking Record
    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        category,
        prompt,
        inputUrl: imageUrl,
        status: "queued"
      }
    });

    // 5. Instantly push jobs to the Inngest Queue and return a response safely!
    // This entirely prevents the Vercel 10s Serverless Timeout limitation!
    await inngest.send({
      name: "studio/generate.requested",
      data: {
        generationId: generation.id,
        inputUrl: imageUrl,
        prompt: prompt || "",
        category,
      },
    });

    return NextResponse.json({ success: true, generationId: generation.id });

  } catch (error: any) {
    console.error("Generate API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
