import { configureStore, createSlice } from "@reduxjs/toolkit";

// Global 
const globalSlice = createSlice({
  name: "global",
  initialState: {
    messages: [
      { id: 1, role: "assistant", text: "Merhaba! Soru yaz ve Send'e bas." },
    ],
    files: { "file1.js": `console.log("Merhaba, React Dünyası!");` },
    activeFile: "file1.js",
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.unshift(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    setActiveFile: (state, action) => {
      state.activeFile = action.payload;
    },
  },
});

export const { addMessage, clearMessages, setFiles, setActiveFile } =
  globalSlice.actions;

const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
  },
});

export default store;
