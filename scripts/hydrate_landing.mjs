import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GOOGLE_GENAI_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: GOOGLE_GENAI_API_KEY not found in env");
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });

const ASSETS = {
  'hero_saree': 'Ultra-UHD professional high-fashion editorial shot of a stunning Indian model (Priya-style) in a luxury deep-gold silk saree with intricate Zari borders. The saree is draped perfectly in a modern editorial style. Background: Soft-lit professional high-end studio with ambient luxury purple-glow accents. Clamshell lighting, 8K resolution, photorealistic fashion photography.',
  'hero_studio': 'Cinematic mockup of a high-tech AI fashion studio interface on a large OLED monitor, glowing with purple and indigo data streams. Professional e-commerce setting, sleek workspace, elegant ambient lighting.',
  'feature_dna': 'Triptych (3-part) collage of a consistent Indian female model headshot, showing her from 3 different angles while retaining 100% facial identity. 8K resolution, sharp focus, consistent studio lighting.',
  'cta_background': 'Abstract soft-focus silk texture in deep zinc and indigo hues, luxury gold metallic weave particles floating, professional studio Bokeh background.'
};

async function hydrateAsset(id, prompt) {
  const outputDir = path.join(process.cwd(), 'public', 'assets', 'landing');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${id}.png`);
  if (fs.existsSync(outputPath)) {
    console.log(`- Skipping ${id} (Existing)`);
    return;
  }

  console.log(`🚀 Generating ${id}...`);
  
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
  console.log("🌊 Hydrating Landing Page Visuals...");
  for (const [id, prompt] of Object.entries(ASSETS)) {
    await hydrateAsset(id, prompt);
    await new Promise(r => setTimeout(r, 2000));
  }
  console.log("✨ Landing Assets Ready.");
}

run();
