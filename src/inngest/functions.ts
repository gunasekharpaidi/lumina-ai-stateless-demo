// @ts-nocheck
import { inngest } from "./client";
import prisma from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import { uploadResultImage } from "@/lib/storage";

// Initialize AI Client once using the correct environment variable
const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });

// @ts-ignore - Inngest types can be tricky depending on version installed
export const processAIGeneration = inngest.createFunction(
  { id: "process-ai-generation", triggers: [{ event: "studio/generate.requested" }] },
  async ({ event, step }: { event: any, step: any }) => {
    const { generationId, inputUrl, prompt, category } = event.data;

    // 1. Update the database to show it's processing
    await step.run("update-status-processing", async () => {
      await prisma.generation.update({
        where: { id: generationId },
        data: { status: "processing" },
      });
    });

    // 2. Fetch input image as buffer if it's already on Supabase or web 
    // We need to pass data to Gemini as a proper part for multimodal.
    // If the model is pure generation from text, we only pass prompt.
    // But since this is a Product Studio, we likely want the garment to be reference.
    const generatedUrl = await step.run("run-ai-model", async () => {
      try {
        const model = genAI.models.get("gemini-2.5-flash-image"); // Using the model from your tests
        
        // Enhance the prompt automatically to be higher quality
        const enhancedPrompt = `High quality product photograph of ${category}: ${prompt}. Cinematic lighting, 4k resolution, editorial style.`;

        // CALL REAL AI MODEL
        const response = await model.generateContent({
          contents: [{ 
            role: "user", 
            parts: [{ text: enhancedPrompt }] 
            // Note: If you want to use the product image as a reference, 
            // you'd need to fetch and pass it as an inlineData part here.
          }],
          config: { responseModalities: ["IMAGE"] }
        });

        const part = response.candidates[0].content.parts[0];
        
        if (part.inlineData) {
          // Convert base64 data to Buffer
          const buffer = Buffer.from(part.inlineData.data, "base64");
          const filename = `${generationId}-output.png`;
          
          // Upload result directly to Supabase storage!
          const publicUrl = await uploadResultImage(buffer, filename, part.inlineData.mimeType);
          return publicUrl;
        }

        throw new Error("No image data returned from Gemini");
      } catch (err: any) {
        console.error("Gemini Generation Failed:", err);
        throw err; // Allow Inngest to retry or fail the step
      }
    });

    // 3. Mark the generation as completed in the DB with the new url
    await step.run("update-status-completed", async () => {
      await prisma.generation.update({
        where: { id: generationId },
        data: { 
          status: "completed",
          outputUrl: generatedUrl
        },
      });
    });

    return { success: true, generationId, url: generatedUrl };
  }
);
