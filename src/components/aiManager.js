import store, { addMessage, setFiles } from "../store";
import { askGemini } from "./askGemini";

function getJsonFromText(text) {
  const fencedJson = text.match(/```json\s*([\s\S]*?)```/i);
  if (fencedJson?.[1]) {
    return JSON.parse(fencedJson[1]);
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Cevap içinde JSON bulunamadı.");
  }

  return JSON.parse(text.slice(firstBrace, lastBrace + 1));
}

export async function sendMessageToAI(userMessage) {
  const currentFiles = store.getState().global.files;
  const activeFile = store.getState().global.activeFile;
  const currentCode = currentFiles[activeFile] || "";
  const fileList = Object.keys(currentFiles)
    .map((fileName) => `- ${fileName}${fileName === activeFile ? " (active)" : ""}`)
    .join("\n");

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
Keep the answer concise and practical.

Open files:
${fileList}

File Name: ${activeFile}
Current Code:
\`\`\`javascript
${currentCode}
\`\`\`
`;

  const reply = await askGemini(userMessage, systemPrompt);

  if (!reply.success) {
    store.dispatch(
      addMessage({
        id: Date.now(),
        role: "assistant",
        text: `Hata: ${reply.error}`,
      })
    );
    return;
  }

  let parsed = null;
  try {
    parsed = getJsonFromText(reply.text);
  } catch (err) {
    store.dispatch(
      addMessage({
        id: Date.now(),
        role: "assistant",
        text: `JSON parse hatası: ${err.message}\nAI cevabı: ${reply.text}`,
      })
    );
    return;
  }

  if (parsed.chat) {
    store.dispatch(
      addMessage({
        id: Date.now(),
        role: "assistant",
        text: parsed.chat,
      })
    );
  }

  if (parsed.code) {
    store.dispatch(
      setFiles({
        ...currentFiles,
        [activeFile]: String(parsed.code).trimEnd(),
      })
    );
  }
}
