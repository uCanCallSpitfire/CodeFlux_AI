const apiKey = "your gemini api key";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

export async function askGemini(userMessage, systemPrompt) {
  if (!userMessage.trim()) return { success: false, error: "Boş mesaj gönderemezsin." };

  const payload = {
    contents: [{ parts: [{ text: userMessage }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    tools: [{ "google_search": {} }],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      return { success: false, error: `API Hatası: ${response.status} - ${errorBody.error?.message || 'Bilinmeyen hata'}` };
    }

    const result = await response.json();
    const outputText = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!outputText) return { success: false, error: "API cevabından metin alınamadı." };

    return { success: true, text: outputText };

  } catch (err) {
    console.error("Gemini API Hatası:", err);
    return { success: false, error: "Yanıt alınırken bir hata oluştu. Konsolu kontrol et." };
  }
}
