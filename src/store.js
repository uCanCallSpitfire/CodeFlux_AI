import { configureStore, createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "codeflux-workspace";

const defaultState = {
  messages: [
    {
      id: 1,
      role: "assistant",
      text: "Merhaba! Kodunu yaz, bir soru sor veya hızlı komutlardan birini seç.",
    },
  ],
  files: {
    "file1.js": `function greet(name) {
  return \`Merhaba, \${name}!\`;
}

console.log(greet("React Dünyası"));`,
  },
  activeFile: "file1.js",
};

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultState;

    const parsed = JSON.parse(saved);
    const files = parsed.files && Object.keys(parsed.files).length > 0
      ? parsed.files
      : defaultState.files;

    return {
      ...defaultState,
      ...parsed,
      files,
      activeFile:
        parsed.activeFile && files[parsed.activeFile]
          ? parsed.activeFile
          : Object.keys(files)[0],
    };
  } catch {
    return defaultState;
  }
}

const globalSlice = createSlice({
  name: "global",
  initialState: loadInitialState(),
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
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

store.subscribe(() => {
  const { messages, files, activeFile } = store.getState().global;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ messages, files, activeFile })
  );
});

export default store;
