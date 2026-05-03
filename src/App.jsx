import React from "react";
import ChatSidebar from "./components/ChatSidebar";
import CodeEditor from "./components/CodeEditor";
import "./App.css";

function App() {
  return (
    <main className="editor-wrapper">
      <section className="left-column" aria-label="AI sohbet paneli">
        <ChatSidebar />
      </section>

      <section className="App" aria-label="Kod editörü">
        <CodeEditor />
      </section>
    </main>
  );
}

export default App;
