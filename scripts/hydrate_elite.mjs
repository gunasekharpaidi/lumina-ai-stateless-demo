import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GOOGLE_GENAI_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: GOOGLE_GENAI_API_KEY not found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });

const ELITE_ASSETS = {
  'hero_editorial': 'Ultra-high-end fashion editorial photography. A stunning Indian model (Priya-style) in a luxury deep-gold silk saree with intricate Zari borders. The lighting is cinematic, professional studio grade. Background: Sleek minimal black studio with soft purple ambient glows. Focus: Extreme detail, photorealistic, 8K resolution, editorial masterpiece.',
  'category_western': 'Professional fashion catalog shot. A Caucasian model (Elena-style) in a high-end tailored beige trench coat, looking confident directly at the camera. Clean white studio background, professional high-fashion lighting, sharp focus on fabric texture.',
  'category_jewellery': 'Macro photography. A close-up of a model wearing a luxury gold diamond necklace. Extremely sharp detail on the gems and metallic sheen. Soft skin texture, high-end commercial jewellery lighting.',
  'category_home': 'High-end interior design photography. A luxury modern living room with atmospheric warm lighting. Background: Sleek minimal furniture, soft silk curtains, professional architectural photography style.',
  'category_pets': 'Luxury pet fashion photography. A small elegant dog (Golden Retriever puppy or similar) wearing a miniature high-end fashion coat. Professional studio setting, playful but professional fashion editorial style.',
  'feature_dna_lockdown': 'A triptych collage of the same model (Aaliyah-style) in 3 different outfits, showing 100% facial identity consistency. High-end fashion editorial compilation.'
};

async function hydrateElite(id, prompt) {
  const outputDir = path.join(process.cwd(), 'public', 'assets', 'landing');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${id}.png`);
  if (fs.existsSync(outputPath)) {
    console.log(`- Skipping ${id} (Existing)`);
    return;
  }

  console.log(`🚀 Generating Elite ${id}...`);
  
  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseModalities: ["IMAGE"] }
    });

    const part = result.candidates[0].content.parts[0];
    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, 'base64');
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ Elite ${id} saved to ${outputPath}`);
    }
  } catch (err) {
    console.error(`❌ FAILED Elite ${id}:`, err.message);
  }
}

async function run() {
  console.log("🏙️ Hydrating Elite Gallery Logic...");
  const entries = Object.entries(ELITE_ASSETS);
  
  for (const [id, prompt] of entries) {
    await hydrateElite(id, prompt);
    // 2s delay between generations
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log("✨ Elite Gallery Ready.");
}

run();
