const apiKey = process.env.GOOGLE_GENAI_API_KEY;

async function test() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       contents: [{ parts: [{ text: "reply hi" }]}]
     })
  });
  const textJson = await res.json();
  if (textJson.error) console.log("Text Error:", textJson.error);
  else console.log("Text Success!");

  const imgRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: "A high quality product photograph of a red leather shoe, 4k resolution" }] }],
      generationConfig: { responseModalities: ["IMAGE"] }
    })
  });
  const imgJson = await imgRes.json();
  if (imgJson.error) console.log("Image Error:", imgJson.error);
  else console.log("Image Success!");
}
test();
