// @ts-nocheck
import { inngest } from "./client";
import prisma from "@/lib/db";

// @ts-ignore - Inngest types can be tricky depending on version installed
export const processAIGeneration = inngest.createFunction(
  { id: "process-ai-generation" },
  { event: "studio/generate.requested" },
  async ({ event, step }: { event: any, step: any }) => {
    const { generationId, inputUrl, prompt, category } = event.data;

    // 1. Update the database to show it's processing
    await step.run("update-status-processing", async () => {
      await prisma.generation.update({
        where: { id: generationId },
        data: { status: "processing" },
      });
    });

    // 2. Step.sleep gracefully suspends the function and wakes it up later,
    // completely bypassing Vercel 10s serverless timeout restrictions!
    await step.sleep("simulate-gpu-computing", "15s");

    const generatedUrl = await step.run("run-ai-model", async () => {
       // For testing, just return a dummy successful image 
       // We will hook this up to the real AI models later
       return "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=1000";
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
