import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, clearMessages } from "../store";
import { sendMessageToAI } from "./aiManager";
import "./ChatSidebar.css";

const quickPrompts = [
  "Bu kodu düzelt ve temizle",
  "Hataları bul",
  "Daha okunabilir hale getir",
];

export default function ChatSidebar() {
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messages = useSelector((state) => state.global.messages);
  const dispatch = useDispatch();
  const listRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!listRef.current) return;
      listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  }, [messages, isSending]);

  const handleSend = async (presetText = "") => {
    const text = (presetText || input).trim();
    if (!text || isSending) return;

    setInput("");
    dispatch(addMessage({ id: Date.now(), role: "user", text }));

    try {
      setIsSending(true);
      await sendMessageToAI(text);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="chat-sidebar">
      <div className="brand-row">
        <div>
          <strong>CodeFlux AI</strong>
          <span>React kod asistanı</span>
        </div>
      </div>

      <div className="chat-topbar">
        <input
          className="chat-input-top"
          placeholder="Sorunu veya isteğini yaz..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
        />
        <button
          className="send-btn"
          onClick={() => handleSend()}
          disabled={isSending}
        >
          {isSending ? "..." : "Gönder"}
        </button>
      </div>

      <div className="quick-prompts">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSend(prompt)}
            disabled={isSending}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="messages" ref={listRef}>
        {messages.length === 0 && (
          <div className="empty-note">Henüz bir sohbet yok.</div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.role === "user" ? "msg-user" : "msg-assistant"
            }`}
          >
            <div className="bubble">{message.text}</div>
          </div>
        ))}
        {isSending && (
          <div className="message msg-assistant">
            <div className="bubble typing">Yanıt hazırlanıyor...</div>
          </div>
        )}
      </div>

      <div className="chat-footer">
        <button
          className="tiny"
          onClick={() => dispatch(clearMessages())}
          disabled={messages.length === 0 || isSending}
        >
          Sohbeti temizle
        </button>
      </div>
    </aside>
  );
}
