import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GOOGLE_GENAI_API_KEY;
if (!API_KEY) { console.error("No API key"); process.exit(1); }

const genAI = new GoogleGenAI({ apiKey: API_KEY });
const OUT = path.join(process.cwd(), 'public', 'assets', 'landing');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const IMAGES = {
  // Hero — flagship editorial shot
  'hero': 'Professional fashion e-commerce photography. A young woman in a tailored camel wool coat walking confidently in a minimal white photography studio. Full body shot, high-key studio lighting, soft shadows on white seamless background. Shot on medium format camera, shallow depth of field. Clean, commercial, editorial quality. No text overlays.',

  // Before/After: Apparel — flat lay to on-model
  'before_flatlay': 'Top-down flat lay product photography of a navy blue blazer and white t-shirt neatly arranged on a clean white background. No model, no mannequin. Perfectly pressed, commercial e-commerce style. Studio lighting, no shadows. Shot from directly above.',
  
  'after_onmodel': 'Professional fashion editorial photograph of a young male model wearing a navy blue blazer over a white t-shirt. Standing in a minimal white studio. Three-quarter pose, confident expression, natural lighting. High-end e-commerce catalog quality. Clean white background.',

  // Before/After: Jewellery — product to styled
  'before_jewellery': 'Product photography of a gold chain necklace with a small pendant, laid flat on a plain white background. No model, no neck. Clean commercial e-commerce jewelry photography. Top-down angle, soft studio lighting.',
  
  'after_jewellery': 'Close-up portrait of an elegant woman wearing a delicate gold chain necklace with pendant. Focus on the necklace and collarbone area. Soft natural lighting, clean minimal background. High-end jewelry e-commerce editorial style.',

  // Before/After: Home — product to staged
  'before_home': 'Product photography of a modern minimalist ceramic table lamp on a plain white background. Clean e-commerce style, no environment, isolated product shot with soft studio lighting.',
  
  'after_home': 'Interior design photography showing a modern minimalist ceramic table lamp placed on a wooden side table in a luxurious living room. Warm ambient lighting, styled bookshelf in background. Magazine-quality interior styling photograph.',

  // Category showcase: Apparel variety  
  'showcase_apparel': 'Fashion e-commerce editorial. A diverse group of three models - one in a red dress, one in a denim jacket with jeans, one in an Indian silk saree - standing together in a clean white photography studio. High-end catalog quality, commercial lighting. Shows range of fashion categories.',

  // Category showcase: Pets
  'showcase_pets': 'Professional pet fashion photography. A golden retriever wearing a stylish plaid bandana, sitting elegantly in a minimal white studio setting. High-quality commercial pet photography, soft lighting, clean background.',
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
      model: 'gemini-2.0-flash-exp',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseModalities: ["IMAGE"] }
    });

    const part = result.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData) {
      fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
      console.log(`  ✅ Saved: ${id}.png`);
    } else {
      console.log(`  ⚠️  No image data for ${id}, trying text response...`);
      // Retry with different model
      const result2 = await genAI.models.generateContent({
        model: 'gemini-2.5-flash-preview-05-20',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseModalities: ["IMAGE"] }
      });
      const part2 = result2.candidates?.[0]?.content?.parts?.[0];
      if (part2?.inlineData) {
        fs.writeFileSync(outPath, Buffer.from(part2.inlineData.data, 'base64'));
        console.log(`  ✅ Saved (fallback): ${id}.png`);
      }
    }
  } catch (err) {
    console.error(`  ❌ Failed ${id}:`, err.message);
    // Try fallback model
    try {
      console.log(`  🔄 Retrying ${id} with flash...`);
      const result = await genAI.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseModalities: ["IMAGE"] }
      });
      const part = result.candidates?.[0]?.content?.parts?.[0];
      if (part?.inlineData) {
        fs.writeFileSync(outPath, Buffer.from(part.inlineData.data, 'base64'));
        console.log(`  ✅ Saved (flash fallback): ${id}.png`);
      }
    } catch (err2) {
      console.error(`  ❌ All attempts failed for ${id}:`, err2.message);
    }
  }
}

async function run() {
  console.log('\n🏗️  Generating landing page images...\n');
  const entries = Object.entries(IMAGES);
  
  for (let i = 0; i < entries.length; i++) {
    const [id, prompt] = entries[i];
    await generate(id, prompt);
    // Rate limit pause
    if (i < entries.length - 1) {
      console.log('  ⏳ Cooling down (3s)...');
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  console.log('\n✨ All images generated!\n');
}

run();
