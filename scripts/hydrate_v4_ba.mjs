import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GOOGLE_GENAI_API_KEY;
if (!API_KEY) { console.error("No API key"); process.exit(1); }

const genAI = new GoogleGenAI({ apiKey: API_KEY });
const OUT = path.join(process.cwd(), 'public', 'assets', 'landing');

// Each pair is designed so both before & after fill the full frame with object-cover.
// The product must be IDENTICAL and recognizable in both shots.
const IMAGES = [
  // ─── APPAREL ───
  // The existing apparel pair (blazer flat-lay → blazer on model) already matches well.
  // Keeping those.

  // ─── JEWELLERY ───  
  // Before: A delicate gold pendant necklace product shot, centered, FILLING the frame
  {
    id: 'v4_jewel_before',
    prompt: 'Professional e-commerce product photography of a delicate gold pendant necklace with a small round diamond solitaire pendant on a thin gold chain. The necklace is arranged in an elegant curved shape on a clean white background. Close-up centered composition that fills most of the frame. Soft studio lighting, high-end jewelry catalog quality. Sharp focus on the pendant detail. Square 1:1 aspect ratio.',
  },
  // After: The SAME delicate gold pendant necklace worn by a model, filling the frame  
  {
    id: 'v4_jewel_after',
    prompt: 'Professional editorial jewelry photography. Close-up of a woman wearing a delicate gold pendant necklace with a small round diamond solitaire pendant on a thin gold chain around her neck. The pendant rests on her collarbone. Soft natural lighting, beautiful skin, elegant pose. The necklace is the clear focal point. Warm-toned, magazine-quality. Neutral blurred background. Square 1:1 aspect ratio.',
  },

  // ─── HOME ───
  // Before: A modern ceramic table vase product shot, filling frame
  {
    id: 'v4_home_before',
    prompt: 'Professional product photography of a modern minimalist white ceramic ribbed table vase, approximately 8 inches tall, with a narrow neck and wide body showing vertical ridges/fluting texture. Centered on a clean white background. The vase fills about 70% of the frame height. Soft studio lighting with subtle shadows. E-commerce catalog quality. Square 1:1 aspect ratio. No flowers, empty vase.',
  },
  // After: SAME vase staged in a luxury interior with flowers
  {
    id: 'v4_home_after',
    prompt: 'Interior design lifestyle photograph featuring the same modern minimalist white ceramic ribbed table vase with vertical ridges and fluting texture, now holding dried pampas grass and eucalyptus stems. The vase is placed on a wooden console table in a bright, airy Scandinavian-style living room with soft natural light streaming through sheer curtains. Warm, inviting atmosphere. Magazine-quality interior photography. Square 1:1 aspect ratio.',
  },

  // ─── PETS ───
  // Before: A stylish dog bandana product shot
  {
    id: 'v4_pets_before',
    prompt: 'Professional e-commerce product photography of a navy blue and white striped cotton dog bandana, neatly folded into a triangle shape and laid flat on a clean white background. The bandana has clean stitching and a classic nautical stripe pattern. Centered composition filling most of the frame. Soft studio lighting. Pet accessory catalog quality. Square 1:1 aspect ratio.',
  },
  // After: SAME bandana on a happy dog
  {
    id: 'v4_pets_after',
    prompt: 'Professional pet photography of a happy golden retriever wearing a navy blue and white striped cotton bandana tied around its neck. The dog is sitting in a bright, clean white photography studio, looking at the camera with a friendly expression. The striped bandana is clearly visible and is the focal point. Soft, even studio lighting. Commercial pet fashion photography quality. Square 1:1 aspect ratio.',
  },
];

async function generate(item) {
  const outPath = path.join(OUT, `${item.id}.png`);
  // Always overwrite for v4
  console.log(`  🎨 Generating: ${item.id}...`);
  try {
    const result = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-preview-05-20',
      contents: [{ role: 'user', parts: [{ text: item.prompt }] }],
      config: { responseModalities: ["IMAGE"] }
    });

    const part = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) {
      fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
      console.log(`  ✅ Saved: ${item.id}.png`);
    } else {
      console.log(`  ⚠️  No image for ${item.id}, trying fallback model...`);
      // Fallback to gemini-2.5-flash-image
      const result2 = await genAI.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ role: 'user', parts: [{ text: item.prompt }] }],
        config: { responseModalities: ["IMAGE"] }
      });
      const part2 = result2.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part2?.inlineData) {
        fs.writeFileSync(outPath, Buffer.from(part2.inlineData.data, 'base64'));
        console.log(`  ✅ Saved (fallback): ${item.id}.png`);
      } else {
        console.log(`  ❌ Both models failed for ${item.id}`);
      }
    }
  } catch (err) {
    console.error(`  ❌ Error ${item.id}:`, err.message?.substring(0, 200));
    // Try fallback
    try {
      console.log(`  🔄 Trying fallback model...`);
      const result2 = await genAI.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ role: 'user', parts: [{ text: item.prompt }] }],
        config: { responseModalities: ["IMAGE"] }
      });
      const part2 = result2.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part2?.inlineData) {
        fs.writeFileSync(outPath, Buffer.from(part2.inlineData.data, 'base64'));
        console.log(`  ✅ Saved (fallback): ${item.id}.png`);
      }
    } catch (e2) {
      console.error(`  ❌ Fallback also failed:`, e2.message?.substring(0, 100));
    }
  }
}

async function run() {
  console.log('\n🏗️  Generating v4 Before/After pairs...\n');
  
  for (let i = 0; i < IMAGES.length; i++) {
    await generate(IMAGES[i]);
    if (i < IMAGES.length - 1) {
      console.log('  ⏳ Cooling down (4s)...');
      await new Promise(r => setTimeout(r, 4000));
    }
  }
  
  console.log('\n✨ All v4 before/after pairs done!\n');
}

run();
