import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const VALID_CATEGORIES = ["Apparel", "Jewellery", "Home", "Pets"];
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });
const MODEL_TIERS = ["gemini-3.1-flash-image-preview", "gemini-3-pro-image-preview", "gemini-2.5-flash-preview-05-20"];

async function generateImageWithFallback(prompt: string): Promise<Buffer> {
  let lastError: any = null;
  for (const modelId of MODEL_TIERS) {
    try {
      console.log(`[AI] Trying model: ${modelId}`);
      const result = await genAI.models.generateContent({
        model: modelId,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseModalities: ["IMAGE"] },
      });
      
      const part = result.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData?.data);
      if (part?.inlineData?.data) {
        console.log(`[AI] ✅ Success with ${modelId}`);
        return Buffer.from(part.inlineData.data, "base64");
      }
      throw new Error("No image data in response");
    } catch (err: any) {
      lastError = err;
      console.warn(`[AI] ⚠️ ${modelId} failed: ${err.message}`);
    }
  }
  throw new Error(`All models exhausted. Last: ${lastError?.message}`);
}

export async function POST(req: Request) {
  try {
    const { category, prompt } = await req.json();

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const enhancedPrompt = `High quality professional product photograph of ${category}: ${prompt ?? ""}. Cinematic lighting, 4k resolution, sharp focus, editorial style, clean white background.`;
    
    const imageBuffer = await generateImageWithFallback(enhancedPrompt);
    const finalUrl = `data:image/png;base64,${imageBuffer.toString("base64")}`;

    return NextResponse.json({ success: true, generationId: Date.now().toString(), outputUrl: finalUrl });
  } catch (err: any) {
    console.error("[GENERATE] Critical error:", err.message);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
