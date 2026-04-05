import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const API_KEY = process.env.GOOGLE_GENAI_API_KEY;
const genAI = new GoogleGenAI({ apiKey: API_KEY });
const OUT = path.join(process.cwd(), 'public', 'assets', 'landing');

async function run() {
  console.log('Retrying ba_pets_before...');
  const result = await genAI.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: [{ role: 'user', parts: [{ text: 'Product photography of a red plaid fabric pet collar with a small bow tie attached, displayed on a clean white background. The collar is arranged in a circular shape showing the full design. Professional e-commerce product photo, studio lighting, isolated on white.' }] }],
    config: { responseModalities: ["IMAGE"] }
  });
  const part = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (part?.inlineData) {
    fs.writeFileSync(path.join(OUT, 'ba_pets_before.png'), Buffer.from(part.inlineData.data, 'base64'));
    console.log('✅ Saved ba_pets_before.png');
  } else {
    console.log('⚠️ No image data');
  }
}

run();
