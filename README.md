<h1 align="center">⚡ CodeFlux AI (Beta)</h1>

<p align="center">
  <b>Next-generation React-based coding assistant for developers who demand speed, precision, and intelligence.</b><br>
  <i>“If code flows, bugs can’t hold on.”</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Build-FEAE2D?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Beta-orange" />
  <img src="https://img.shields.io/badge/License-All%20rights%20reserved-blue" />
</p>

---

## 🧠 Overview

**CodeFlux AI** is a next-generation **React-based coding assistant** built for developers who want **speed, precision, and intelligence** in one place.  

It reads your code, understands your intent, and instantly provides **solutions, fixes, and clear explanations**.  
Unlike ordinary assistants, CodeFlux AI can process and keep **context across multiple files simultaneously**, allowing you to work seamlessly on full projects without losing focus.

> “It doesn’t just fix your mistakes — it teaches you how to stop making them.”

---

## 🚀 Features

- 🧩 **Context-Aware Understanding** – Reads and reasons across multiple files  
- ⚙️ **Real-Time Assistance** – Writes, explains, and debugs code instantly  
- 💬 **JSON-Based AI Responses** – Structured and predictable replies  
- 🪶 **Lightweight UI** – Built with React + Vite for fast performance  
- 🌓 **Dark Theme** – Modern, developer-friendly interface  
- 🔄 **Adaptive Learning** – Improves with every interaction  

---

## 🧰 Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Frontend** | React 18+, Vite |
| **Language** | JavaScript (ES6+) |
| **Backend** | Google Gemini API |
| **State Management** | Custom global store |
| **Environment** | Node.js 18+ |

---

## ⚡ Getting Started

Clone the repository:

git clone https://github.com/yourusername/codeflux-ai.git
cd codeflux-ai
npm install


Then open the file:

src/components/askGemini.js


Add your Gemini API key at the top:

const GEMINI_API_KEY = "YOUR_API_KEY_HERE";


(In this beta version, the key is stored directly inside the component.
Future releases will use secure environment variables.)

Start the development server:

npm run dev


Your app will be available at:
👉 http://localhost:5173

💡 How It Works

Every message you send is processed through the Gemini API, interpreted by the CodeFlux Engine, and rendered instantly inside the editor.
The AI delivers contextual, real-time assistance with structured JSON responses — ensuring precision, consistency, and reliability.

With CodeFlux AI, you can:

Chat directly with the AI

Write or debug code collaboratively

Open and manage multiple tabs

Request intelligent refactoring suggestions

⚠️ Disclaimer

CodeFlux AI uses Google’s Gemini API as its intelligence backbone.
The Gemini API is currently free under specific usage limits, but terms may change at any time.

The developer of CodeFlux AI is not responsible for:

API downtime or service interruptions

Pricing or policy changes

Usage limits or quota issues

Data handling or billing problems

This tool is provided as-is, for educational and development purposes, and remains in Beta.

🧑‍💻 Author

Efe – Creator of CodeFlux AI

“If code flows, bugs can’t hold on.” ⚡
