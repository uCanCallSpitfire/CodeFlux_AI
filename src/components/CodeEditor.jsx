import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFiles, setActiveFile } from "../store";
import "./CodeEditor.css";

let fileCounter = 1;

const CodeEditor = () => {
  const files = useSelector((state) => state.global.files);
  const activeFile = useSelector((state) => state.global.activeFile);
  const dispatch = useDispatch();
  const [editingFile, setEditingFile] = useState(null);
  const textareaRef = useRef(null);

  const code = files[activeFile] || "";
  const codeLines = code.split("\n");
  const lineNumbers = Array.from({ length: codeLines.length }, (_, i) => i + 1);

  const handleChange = (e) => {
    dispatch(setFiles({ ...files, [activeFile]: e.target.value }));
  };

  const addFile = () => {
    fileCounter += 1;
    const newFile = `file${fileCounter}.js`;
    dispatch(setFiles({ [newFile]: "", ...files }));
    dispatch(setActiveFile(newFile));
    setEditingFile(newFile);
  };

  const renameFile = (oldName, newName) => {
    if (!newName || files[newName]) return;
    const { [oldName]: content, ...rest } = files;
    dispatch(setFiles({ [newName]: content, ...rest }));
    if (activeFile === oldName) dispatch(setActiveFile(newName));
  };

  const deleteFile = (fileName) => {
    if (Object.keys(files).length === 1) return;
    const { [fileName]: _, ...rest } = files;
    dispatch(setFiles(rest));
    if (activeFile === fileName) dispatch(setActiveFile(Object.keys(rest)[0]));
  };

  return (
    <div className="code-editor-wrapper">
      <div className="file-tabs">
        {Object.keys(files).map((fileName) =>
          editingFile === fileName ? (
            <input
              key={fileName}
              className="file-edit-input"
              autoFocus
              defaultValue={fileName}
              onBlur={(e) => {
                renameFile(fileName, e.target.value);
                setEditingFile(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  renameFile(fileName, e.target.value);
                  setEditingFile(null);
                }
              }}
            />
          ) : (
            <div
              key={fileName}
              className={`file-tab ${fileName === activeFile ? "active" : ""}`}
              onClick={() => dispatch(setActiveFile(fileName))}
              onDoubleClick={() => setEditingFile(fileName)}
            >
              {fileName}{" "}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(fileName);
                }}
              >
                ×
              </span>
            </div>
          )
        )}
        <button onClick={addFile} className="add-file-btn">
          +
        </button>
      </div>

      <div className="code-editor-container">
        <div className="line-numbers">
          {lineNumbers.map((num, idx) => (
            <div key={idx} style={{ color: "grey" }}>
              {num}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={code}
          onChange={handleChange}
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
