const apiKey = 'AIzaSyA8AS4J-0xj3M25fP81wIK01ctqXHWBl8M';

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

  const imgRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt: "A red shoe" }],
      parameters: { sampleCount: 1 }
    })
  });
  const imgJson = await imgRes.json();
  if (imgJson.error) console.log("Image Error:", imgJson.error);
  else console.log("Image Success!");
}
test();
