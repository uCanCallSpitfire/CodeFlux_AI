import React from 'react';
import CodeEditor from './components/CodeEditor';
import ChatSidebar from './components/ChatSidebar'; // Yeni chat component
import './App.css';

function App() {
  return (
    <div className="editor-wrapper">
      
      <div className="left-column">
        <ChatSidebar />
      </div>

      
      <div className="App">
        <CodeEditor />
      </div>
    </div>
  );
}

export default App;