// @ts-nocheck
import { inngest } from "./client";
import prisma from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import { uploadResultImage } from "@/lib/storage";

// Initialize AI Client once
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });

// Model fallback chain - most advanced first
const MODEL_TIERS = [
  "gemini-3.1-flash-image-preview",
  "gemini-3-pro-image-preview",
  "gemini-2.5-flash-preview-05-20", // Known working stable model
];

async function generateWithFallback(prompt: string): Promise<Buffer> {
  let lastError: any = null;

  for (const modelId of MODEL_TIERS) {
    try {
      console.log(`[AI] Attempting synthesis with ${modelId}...`);

      const result = await genAI.models.generateContent({
        model: modelId,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { responseModalities: ["IMAGE"] },
      });

      const part = result.candidates?.[0]?.content?.parts?.find(
        (p: any) => p.inlineData
      );

      if (part?.inlineData?.data) {
        console.log(`[AI] ✅ Success with ${modelId}`);
        return Buffer.from(part.inlineData.data, "base64");
      }

      throw new Error("No image data in response");
    } catch (err: any) {
      lastError = err;
      console.warn(`[AI] ⚠️ Model ${modelId} failed: ${err.message}`);
      // Continue to next tier
    }
  }

  throw new Error(
    `Synthesis Failed: All models exhausted. Last error: ${lastError?.message}`
  );
}

// @ts-ignore
export const processAIGeneration = inngest.createFunction(
  { id: "process-ai-generation", triggers: [{ event: "studio/generate.requested" }] },
  async ({ event, step }: { event: any; step: any }) => {
    const { generationId, inputUrl, prompt, category } = event.data;

    try {
      // 1. Mark as processing
      await step.run("update-status-processing", async () => {
        await prisma.generation.update({
          where: { id: generationId },
          data: { status: "processing" },
        });
      });

      // 2. Run AI with fallback chain
      const generatedUrl = await step.run("run-ai-model", async () => {
        const enhancedPrompt = `High quality professional product photograph of ${category}: ${prompt}. Cinematic lighting, 4k resolution, sharp focus, editorial style, white background.`;
        const imageBuffer = await generateWithFallback(enhancedPrompt);
        const filename = `${generationId}-output.png`;
        const publicUrl = await uploadResultImage(imageBuffer, filename, "image/png");
        return publicUrl;
      });

      // 3. Mark as completed
      await step.run("update-status-completed", async () => {
        await prisma.generation.update({
          where: { id: generationId },
          data: {
            status: "completed",
            outputUrl: generatedUrl,
          },
        });
      });

      return { success: true, generationId, url: generatedUrl };
    } catch (error: any) {
      console.error("[AI] Critical Generation Failure:", error.message);

      // Mark as failed so the UI shows "Synthesis Failed"
      await step.run("update-status-failed", async () => {
        await prisma.generation.update({
          where: { id: generationId },
          data: { status: "failed" },
        });
      });

      throw error; // Re-throw for Inngest visibility/retry
    }
  }
);
