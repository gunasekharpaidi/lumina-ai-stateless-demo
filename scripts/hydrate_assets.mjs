import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Environmental variables loaded via Node --env-file=.env.local
const API_KEY = process.env.GOOGLE_GENAI_API_KEY;

if (!API_KEY) {
  console.error("❌ ERROR: GOOGLE_GENAI_API_KEY not found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });

const MODEL_DETAILS = {
    leo: 'Caucasian male, 22. Square jaw, high cheekbones. Toned athletic build, broad shoulders, lean frame.',
    kenji: 'Asian male, 24, Japanese. Defined jawline, high-bridged nose. Lean athletic build, slender frame.',
    aaliyah: 'Black female, 21, African. Heart-shaped face, high forehead, rich dark skin. Lean lithe physique, long elegant limbs.',
    priya: 'South Asian female, 23, Indian. Large almond eyes, sharp nose, honey skin. Slender high-fashion build, graceful neck.',
    mateo: 'Hispanic male, 35, Latino. Rugged heart-shaped face. Natural average build, realistic proportions, non-muscular natural frame.',
    omar: 'Middle Eastern male, 38, Arab. Strong brow, groomed beard. Solid, sturdy, slightly stocky build, broad-chested.',
    elena: 'Caucasian female, 32, European. Sculpted cheekbones, fair glowing skin. Average slender build, realistic woman proportions, not overly thin.',
    mei: 'Asian female, 34, Chinese. Elegant jawline, porcelain skin. Average rectangular build, natural proportions, graceful symmetry.',
    arthur: 'Caucasian male, 62, British. Silver hair, refined wrinkles. Sturdy mature frame, average height, slightly softened shoulders.',
    raj: 'South Asian male, 65, Indian. Salt-and-pepper mustache, wise features. Average-to-sturdy mature frame, natural realistic grandfatherly silhouette.',
    zora: 'Black female, 60, African American. Silver curly hair, warm smile. Graceful fuller mature figure, natural curvy proportions, elegant and wise.',
    sofia: 'Hispanic female, 58, Spanish. Brunette with silver streaks. Softened average build, realistic mature woman proportions.',
    toby: 'Caucasian boy, 8. Bright blue eyes, fair skin. Energetic slender boyish build.',
    wei: 'Asian boy, 7. Round face, dark eyes, fair skin. Energetic average boyish build.',
    ananya: 'South Asian girl, 9. Long dark hair, big eyes, honey skin tone. Graceful slender girl build.',
    imani: 'Black girl, 8. Braided hair, brown skin tone. Energetic average girl build.',
    noah: 'Mixed heritage infant, 1. Round chubby cheeks, fair skin. Healthy chubby infant build.',
    chloe: 'Caucasian infant, 1. Soft blonde hair, blue eyes. Soft healthy infant build.',
    arjun: 'Indian male, 24. Sharp jaw, athletic build, intense eyes. Toned athletic frame, lean musculature.',
    isha: 'Indian female, 22. Modern heart-shaped face, high cheekbones. Slender urban physique, graceful proportions.',
    vikram: 'Indian male, 36. Heart-shaped face, groomed beard. Average professional Indian build, slightly softened waistline, natural proportions.',
    kavya: 'Indian female, 32. Anatomical features: Sharp heart-shaped face, high-bridged nose. Graceful curvy build, realistic hourglass for mid-age, fuller figure, elegant and mature.',
    dev: 'Indian male, 60. Distinguished silver hair, wise lined features. Average-to-sturdy mature Indian build, dignified posture.',
    sia: 'Indian girl, 9. Traditional Indian features, long braided hair. Graceful slender girl proportions.'
};

async function hydrateModel(id, dna) {
  const outputDir = path.join(process.cwd(), 'public', 'assets', 'models');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${id}.png`);
  
  // Skip if already exists unless forced
  if (fs.existsSync(outputPath)) {
    console.log(`- Skipping ${id} (Existing)`);
    return;
  }

  console.log(`🚀 Generating ${id}...`);
  
  const prompt = `UHD 8K professional studio headshot of a person: ${dna}. 
  The person is looking directly at the camera with a neutral-to-slight-friendly professional expression. 
  Lighting: Soft clamshell lighting, professional editorial photography. 
  Background: Solid flat neutral grey studio background. 
  Framing: Center-framed portrait focus. 
  Quality: Photorealistic, extreme detail, 8K resolution, sharp focus.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseModalities: ["IMAGE"] }
    });

    const part = result.response.candidates[0].content.parts[0];
    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, 'base64');
      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ ${id} saved to ${outputPath}`);
    } else {
      console.error(`❌ FAILED ${id}: No image data in response`);
    }
  } catch (err) {
    console.error(`❌ FAILED ${id}:`, err.message);
  }
}

const GUIDE_ASSETS = {
  'saree_guide_good': 'A high-end professional flat-lay photograph of a beautiful Indian silk saree spread broad and flat on a clean white floor. The intricate gold Pallu (decorative end) is fully visible, showing complex patterns. The Zari border is sharp and metallic. Daylight studio lighting, 8K editorial quality.',
  'saree_guide_bad': 'A photo of a folded saree inside a narrow plastic retail pack. The patterns are bunched up, the pallu is hidden, and the fabric is compressed. Low detail, dimly lit room.'
};

async function hydrateAsset(id, prompt, dir = 'models') {
  const outputDir = path.join(process.cwd(), 'public', 'assets', dir);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${id}.png`);
  if (fs.existsSync(outputPath)) {
    console.log(`- Skipping ${id} (Existing)`);
    return;
  }

  console.log(`🚀 Generating ${id} (${dir})...`);
  
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
  console.log("🌊 Starting Neural Asset Hydration...");
  
  // 1. Models
  for (const [id, dna] of Object.entries(MODEL_DETAILS)) {
    const prompt = `UHD 8K professional studio headshot: ${dna}. Neutral expression, grey background, editorial lighting.`;
    await hydrateAsset(id, prompt, 'models');
    await new Promise(r => setTimeout(r, 1000));
  }

  // 2. Guides
  console.log("📚 Generating Educational Guides...");
  for (const [id, prompt] of Object.entries(GUIDE_ASSETS)) {
    await hydrateAsset(id, prompt, 'guides');
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log("✨ Hydration Complete.");
}

run();
