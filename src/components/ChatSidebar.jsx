import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, clearMessages } from "../store";
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
      listRef.current.scrollTop = 0; // yeni mesaj başa
    });
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    dispatch(addMessage({ id: Date.now(), role: "user", text }));
    setInput("");

    setTimeout(() => {
      dispatch(
        addMessage({
          id: Date.now() + 1,
          role: "assistant",
          text: `Bunu anladım: "${text}" — burada gerçek AI çağrısı yapabilirsin.`,
        })
      );
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <aside className="chat-sidebar">
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

      <div className="chat-footer">
        <button className="tiny" onClick={() => dispatch(clearMessages())}>
          Clear
        </button>
      </div>
    </aside>
  );
}
