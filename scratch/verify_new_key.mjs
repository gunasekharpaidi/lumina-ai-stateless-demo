const apiKey = 'AIzaSyAuEfkkIKF-DynJgEp6eYqiqunvUCatGRQ';

async function listModels() {
  console.log("Verifying NEW API key validity...");
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log("Status Code:", res.status);
    if (data.error) {
      console.log("Error Detail:", JSON.stringify(data.error, null, 2));
    } else {
      console.log("Key is VALID! Found", data.models?.length, "models.");
    }
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

listModels();
