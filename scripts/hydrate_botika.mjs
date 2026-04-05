import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GOOGLE_GENAI_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: GOOGLE_GENAI_API_KEY not found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });

const BOTIKA_ASSETS = {
  'botika_hero_model': 'High-end fashion editorial photography for a global SaaS brand (Botika style). A professional Caucasian model in a luxury beige structured trench coat, dynamic editorial pose (turning slightly, motion blur on the coat). Background: Ultra-minimalist off-white studio with natural high-key lighting. Focus: Premium fabric texture, photorealistic, 8K, commercial masterpiece.',
  'botika_catalog_western': 'World-class e-commerce catalog photography. A model in a minimalist black knit sweater and tailored grey trousers. Perfect white background, high-fashion studio lighting, clean sharp focus on garment details. Zero regional or local elements. Neutral global appeal.',
  'botika_lifestyle_grey': 'Editorial lifestyle photography. A model seated elegantly on a concrete grey studio floor, wearing a luxury avant-garde white dress. Minimalist architectural lighting, professional fashion magazine quality.',
  'botika_mannequin_transformation': 'A high-fidelity editorial shot of a luxury outfit being worn by a model. Background: A minimalist grey studio. Lighting: Professional commercial grade. The focus is on the flawless drape and texture of a high-end designer piece.',
  'botika_product_grid': 'A clean minimalist grid of 4 small luxury fashion items (sunglasses, leather bag, jewelry, minimal heels) on off-white pedestals. High-end product photography.'
};

async function hydrateBotika(id, prompt) {
  const outputDir = path.join(process.cwd(), 'public', 'assets', 'landing');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${id}.png`);
  if (fs.existsSync(outputPath)) {
    console.log(`- Skipping ${id} (Existing)`);
    return;
  }

  console.log(`🚀 Generating Botika Elite ${id}...`);
  
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
      console.log(`✅ ${id} saved to ${outputPath}`);
    }
  } catch (err) {
    console.error(`❌ FAILED ${id}:`, err.message);
  }
}

async function run() {
  console.log("🏙️ Hydrating Global Botika Elite Gallery...");
  const entries = Object.entries(BOTIKA_ASSETS);
  
  for (const [id, prompt] of entries) {
    await hydrateBotika(id, prompt);
    // 2s delay
    await new Promise(r => setTimeout(r, 2000));
  }
  
  console.log("✨ Botika Elite Gallery Ready.");
}

run();
