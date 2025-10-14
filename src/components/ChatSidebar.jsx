import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, clearMessages } from "../store";
import { sendMessageToAI } from "./aiManager"; // AI entegrasyonu
import "./ChatSidebar.css";

export default function ChatSidebar() {
  const [input, setInput] = useState("");
  const messages = useSelector((state) => state.global.messages);
  const dispatch = useDispatch();

  const listRef = useRef(null);

  useEffect(() => {
    scrollToTop();
  }, [messages]);

  const scrollToTop = () => {
    requestAnimationFrame(() => {
      if (!listRef.current) return;
      listRef.current.scrollTop = 0;
    });
  };


  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setInput(""); 


    dispatch(addMessage({ id: Date.now(), role: "user", text }));


    await sendMessageToAI(text, "Friendly AI that answers in Turkish.");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="chat-sidebar">
      {/* Input */}
      <div className="chat-topbar">
        <input
          className="chat-input-top"
          placeholder="Type your question here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="send-btn" onClick={handleSend}>
          Send
        </button>
      </div>

      {/* Mesajlar */}
      <div className="messages" ref={listRef}>
        {messages.length === 0 && (
          <div className="empty-note">Henüz bir sohbet yok :)</div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`message ${m.role === "user" ? "msg-user" : "msg-assistant"}`}
          >
            <div className="bubble">{m.text}</div>
          </div>
        ))}
      </div>

      {/* Clear*/}
      <div className="chat-footer">
        <button className="tiny" onClick={() => dispatch(clearMessages())}>
          Clear
        </button>
      </div>
    </aside>
  );
}
