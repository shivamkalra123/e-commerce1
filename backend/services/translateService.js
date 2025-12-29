import fetch from "node-fetch";

export async function translateText(text, target) {
  try {
    const res = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target,
        format: "text"
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Translate API error:", errorText);
      return null;
    }

    const data = await res.json();
    return data.translatedText;
  } catch (err) {
    console.error("Translate fetch failed:", err);
    return null;
  }
}
