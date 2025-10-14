import store, { addMessage, setFiles } from "../store";
import { askGemini } from "./askGemini";


export async function sendMessageToAI(userMessage) {
    const currentFiles = store.getState().global.files;
    const activeFile = store.getState().global.activeFile;
    const currentCode = currentFiles[activeFile] || ""; 

     const systemPrompt = `
Please respond ONLY in the FOLLOWING RESPONSE FORMAT. Produce ONLY a pure JSON output. 
Also, reply in the same language as the user.

Format:
{
  "chat": "...message to display to the user...",
  "code": "...IF THE CODE WAS FIXED OR NEW CODE WAS GENERATED, WRITE THE COMPLETE AND FINAL CODE HERE. Otherwise, leave this field EMPTY (null)..."
}

---
The user's request is related to the code below.
Please take this existing code into account when fulfilling the request.
IF YOU FIX THE CODE, YOU MUST PLACE THE FULL FIXED VERSION OF THE CODE IN THE 'code' FIELD.

File Name: ${activeFile}
Current Code:
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