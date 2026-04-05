import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GOOGLE_GENAI_API_KEY;
if (!API_KEY) { console.error("No API key"); process.exit(1); }

const genAI = new GoogleGenAI({ apiKey: API_KEY });
const OUT = path.join(process.cwd(), 'public', 'assets', 'landing');

const IMAGES = {
  // FIX #4: Replace showcase_apparel — 3 FEMALE models, one in saree (no male)
  'showcase_apparel': 'Professional fashion editorial photography in a clean white studio. Three diverse female models standing together: a Black woman in a flowing red satin gown, an Indian woman wearing a navy blue and gold silk saree elegantly draped, and a Caucasian woman in a cropped denim jacket with high-waisted jeans. Full body shot, commercial studio lighting, white seamless background. High-end e-commerce catalog quality. No text.',

  // FIX #2: New unique images for 3-step workflow (not reusing before/after images)
  'step_upload': 'A clean, minimal e-commerce product photography flat lay showing a folded cream cashmere sweater, a pair of sunglasses, and a leather watch, neatly arranged on a pure white background. Top-down view, soft studio lighting, commercial product photography style. No model, no mannequin.',

  'step_generate': 'Screenshot-style image of a modern AI fashion platform interface on a clean white background. Shows a split view: on the left, a product photo of a cream cashmere sweater; on the right, a generated image of a female model wearing the same cream sweater. Clean UI with minimal controls. Soft studio aesthetic.',

  'step_export': 'A grid of four professional fashion photographs showing the same female model wearing a cream cashmere sweater, each from a different angle: front view, side profile, three-quarter pose, and a close-up detail of the fabric texture. Clean white studio background, commercial e-commerce quality. Product catalog multi-angle view.',

  // FIX #5: Better matched before/after for Jewellery — SAME specific piece
  'ba_jewellery_before': 'Product photography of a chunky gold chain bracelet laid flat on a clean white background. The bracelet has thick interlocking gold links with a lobster clasp. Isolated product shot, top-down view, soft studio lighting. Professional e-commerce jewelry photography. No model.',

  'ba_jewellery_after': 'Close-up photograph of a woman\'s wrist wearing a chunky gold chain bracelet with thick interlocking gold links. The hand is resting elegantly on a marble surface. Soft natural lighting, shallow depth of field. High-end jewelry editorial photography style.',

  // FIX #5: Better matched before/after for Home — SAME lamp visible
  'ba_home_before': 'Product photography of a modern brass arc floor lamp with a white linen drum shade, shown against a pure white background. Full lamp visible, from base to shade. Clean isolated product shot, studio lighting, e-commerce style. No environment.',

  'ba_home_after': 'Interior design lifestyle photograph featuring a modern brass arc floor lamp with a white linen drum shade, placed next to a plush velvet sofa in a luxurious living room. The lamp is arching over the sofa. Warm evening ambient lighting, tasteful bookshelf and artwork in background. Magazine-quality interior photography.',

  // FIX #5: NEW — Pets before/after pair  
  'ba_pets_before': 'Product photography of a red tartan plaid dog bow-tie collar, laid flat on a clean white background. The collar shows a gold buckle and an attached plaid bow tie. Isolated product shot, top-down angle, soft studio lighting. Pet accessory e-commerce photography.',

  'ba_pets_after': 'Professional pet photography of a golden retriever puppy wearing a red tartan plaid bow-tie collar, sitting elegantly in a minimal white photography studio. The bow tie is clearly visible and matches the product. Soft studio lighting, clean background, commercial pet fashion quality.',
};

async function generate(id, prompt) {
  const outPath = path.join(OUT, `${id}.png`);
  if (fs.existsSync(outPath)) {
    console.log(`  ⏭  Skipping ${id} (exists)`);
    return;
  }

  console.log(`  🎨 Generating: ${id}...`);
  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseModalities: ["IMAGE"] }
    });

    const part = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) {
      fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
      console.log(`  ✅ Saved: ${id}.png`);
    } else {
      console.log(`  ⚠️  No image data for ${id}`);
    }
  } catch (err) {
    console.error(`  ❌ Failed ${id}:`, err.message?.substring(0, 200));
  }
}

async function run() {
  console.log('\n🏗️  Generating v3 landing images...\n');
  const entries = Object.entries(IMAGES);
  
  for (let i = 0; i < entries.length; i++) {
    const [id, prompt] = entries[i];
    await generate(id, prompt);
    if (i < entries.length - 1) {
      console.log('  ⏳ Cooling down (3s)...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  console.log('\n✨ All v3 images generated!\n');
}

run();
