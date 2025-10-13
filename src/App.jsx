import React from 'react';
import CodeEditor from './components/CodeEditor';
import ChatSidebar from './components/ChatSidebar'; // Yeni chat component
import './App.css';

function App() {
  return (
    <div className="editor-wrapper">
      {/* Sol taraf: ChatSidebar (sohbet paneli) */}
      <div className="left-column">
        <ChatSidebar />
      </div>

      {/* Sağ taraf: CodeEditor (kod editörü) */}
      <div className="App">
        <CodeEditor />
      </div>
    </div>
  );
}

export default App;