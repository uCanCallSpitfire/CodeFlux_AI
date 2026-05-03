const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const model = import.meta.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

export async function askGemini(userMessage, systemPrompt) {
  if (!userMessage.trim()) {
    return { success: false, error: "Boş mesaj gönderemezsin." };
  }

  if (!apiKey) {
    return {
      success: false,
      error:
        "Gemini API anahtarı eksik. Proje köküne .env dosyası ekleyip VITE_GEMINI_API_KEY değerini gir.",
    };
  }

  const payload = {
    contents: [{ parts: [{ text: userMessage }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `API hatası: ${response.status} - ${
          errorBody.error?.message || "Bilinmeyen hata"
        }`,
      };
    }

    const result = await response.json();
    const outputText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!outputText) {
      return { success: false, error: "API cevabından metin alınamadı." };
    }

    return { success: true, text: outputText };
  } catch (err) {
    console.error("Gemini API hatası:", err);
    return {
      success: false,
      error: "Yanıt alınırken bir hata oluştu. Konsolu kontrol et.",
    };
  }
}
