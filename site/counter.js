const API_URL = "https://func-crc-86960.azurewebsites.net/api/visitors";

async function updateCounter() {
  const el = document.getElementById("counter");
  try {
    const res = await fetch(API_URL, { method: "POST" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    el.textContent = data.count;
  } catch (err) {
    console.error("visitor counter failed:", err);
    el.textContent = "unavailable";
  }
}

updateCounter();
