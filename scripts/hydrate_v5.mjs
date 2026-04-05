import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GOOGLE_GENAI_API_KEY;
if (!API_KEY) { console.error("No API key"); process.exit(1); }

const genAI = new GoogleGenAI({ apiKey: API_KEY });
const OUT = path.join(process.cwd(), 'public', 'assets', 'landing');

const IMAGES = [
  // 1. More realistic personas
  {
    id: 'showcase_apparel',
    prompt: 'Extremely realistic, candid editorial fashion photography. Three diverse female models standing together in a natural, relaxed pose in a professional white photography studio. Left: Black woman in a sleek dark red slip dress. Center: South Asian woman wearing an authentic, beautifully draped navy blue and gold silk saree, smiling naturally. Right: Caucasian woman wearing casual chic denim jeans and a slightly cropped white top. Shot on 35mm film, natural studio lighting, highly detailed skin textures, unretouched look, authentic expressions, beautiful natural movements. They look like real people, not mannequins. Wide shot showing their bodies. Square aspect ratio.',
  },
  
  // 2. Scale-matched Home Before/After
  // Force both vases to be centered and relatively small with lots of negative space.
  {
    id: 'v5_home_before',
    prompt: 'Professional e-commerce product photography of a modern minimalist white ceramic ribbed table vase. IMPORTANT: The vase must be positioned in the EXACT center of the frame, and must be relatively small, taking up only 30% of the image height. It MUST be surrounded by a massive amount of empty pure white background on all sides. Soft studio lighting. Square 1:1 aspect ratio. E-commerce catalog shot.',
  },
  {
    id: 'v5_home_after',
    prompt: 'Interior design lifestyle photograph featuring the identical modern minimalist white ceramic ribbed table vase holding some dried eucalyptus. IMPORTANT: The vase must be positioned in the EXACT center of the frame, taking up only 30% of the image height. The vase is sitting on a wooden coffee table. The massive space around the vase shows a beautifully lit, bright, airy Scandinavian living room with large windows. The overall scale must be wide, showing the room, with the vase small in the center. Square 1:1 aspect ratio.',
  }
];

async function generate(item) {
  const outPath = path.join(OUT, `${item.id}.png`);
  console.log(`  🎨 Generating: ${item.id}...`);
  try {
    const result = await genAI.models.generateContent({
      // We know gemini-2.5-flash-image works well
      model: 'gemini-2.5-flash-image',
      contents: [{ role: 'user', parts: [{ text: item.prompt }] }],
      config: { responseModalities: ["IMAGE"] }
    });

    const part = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) {
      fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
      console.log(`  ✅ Saved: ${item.id}.png`);
    } else {
      console.log(`  ❌ Failed to get image data for ${item.id}`);
    }
  } catch (err) {
    console.error(`  ❌ Error ${item.id}:`, err.message?.substring(0, 200));
  }
}

async function run() {
  console.log('\n🏗️  Generating v5 images...\n');
  
  for (let i = 0; i < IMAGES.length; i++) {
    await generate(IMAGES[i]);
    if (i < IMAGES.length - 1) {
      console.log('  ⏳ Cooling down (4s)...');
      await new Promise(r => setTimeout(r, 4000));
    }
  }
  
  console.log('\n✨ All v5 images done!\n');
}

run();
