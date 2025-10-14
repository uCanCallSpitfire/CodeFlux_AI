import store, { addMessage, setFiles } from "../store";
import { askGemini } from "./askGemini";


export async function sendMessageToAI(userMessage) {
    const currentFiles = store.getState().global.files;
    const activeFile = store.getState().global.activeFile;
    const currentCode = currentFiles[activeFile] || ""; 

    const systemPrompt = `
Lütfen cevabı AŞAĞIDAKİ TEPKİ FORMATINDA ver. SADECE JSON çıktısı üret.

Format:
{
  "chat": "...kullanıcıya gösterilecek mesaj...",
  "code": "...KOD DÜZELTİLDİYSE veya YENİ KOD ÜRETİLDİYSE, DOSYANIN TAM VE SON HALİ BURAYA YAZILMALIDIR. Aksi halde bu alan BOŞ BIRAKILMALIDIR. (Null olmalı) "
}

---
Kullanıcının isteği, aşağıdaki mevcut kod ile ilgilidir.
Lütfen isteği yerine getirirken bu mevcut kodu dikkate al.
EĞER KODU DÜZELTİYORSAN, DÜZELTİLMİŞ KODUN TAMAMINI 'code' alanına yerleştirmek ZORUNDASIN.

Dosya Adı: ${activeFile}
Mevcut Kod:
\`\`\`javascript
${currentCode}
\`\`\`
`;

    const reply = await askGemini(userMessage, systemPrompt);

    if (!reply.success) {
        store.dispatch(addMessage({
            id: Date.now(),
            role: "assistant",
            text: `Hata: ${reply.error}`
        }));
        return;
    }

    let parsed = null;
    try {
        const match = reply.text.match(/\{[\s\S]*\}/m);
        if (match) {
            parsed = JSON.parse(match[0]);
        } else {
            throw new Error("Cevap içinde JSON bulunamadı.");
        }
    } catch (err) {
        //JSON
        store.dispatch(addMessage({
            id: Date.now(),
            role: "assistant",
            text: `JSON parse hatası: ${err.message}\nAI cevabı: ${reply.text}`
        }));
        return;
    }

    // Chat mesaj
    if (parsed.chat) {
        store.dispatch(addMessage({
            id: Date.now(),
            role: "assistant",
            text: parsed.chat
        }));
    }

    if (parsed.code) { 
        store.dispatch(setFiles({
            ...currentFiles,
            [activeFile]: parsed.code 
        }));
    }
}