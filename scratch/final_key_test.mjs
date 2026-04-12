const apiKey = 'AIzaSyA8AS4J-0xj3M25fP81wIK01ctqXHWBl8M';

async function testKey() {
  console.log("Testing Key Sensitivity...");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
      })
    });
    
    const data = await res.json();
    console.log("Status Code:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

testKey();
