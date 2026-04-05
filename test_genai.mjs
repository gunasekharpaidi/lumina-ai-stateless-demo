import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'AIzaSyA8AS4J-0xj3M25fP81wIK01ctqXHWBl8M' });

async function test() {
  try {
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ role: 'user', parts: [{ text: "Create an image of an apple." }] }],
        config: { responseModalities: ["IMAGE"] }
     });

     const part = response.candidates[0].content.parts[0];
     console.log("Keys in part:", Object.keys(part));
     if (part.inlineData) {
         console.log("Keys in inlineData:", Object.keys(part.inlineData));
         console.log("Data sample:", part.inlineData.data.substring(0, 50));
     }
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
test();
