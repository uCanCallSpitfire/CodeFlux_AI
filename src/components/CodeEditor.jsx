import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveFile, setFiles } from "../store";
import "./CodeEditor.css";

let fileCounter = 1;

const starterCode = `function yeniOzellik() {
  return "Hazır";
}

console.log(yeniOzellik());`;

function normalizeFileName(value) {
  const name = value.trim().replace(/\s+/g, "-");
  if (!name) return "";
  return name.includes(".") ? name : `${name}.js`;
}

const CodeEditor = () => {
  const files = useSelector((state) => state.global.files);
  const activeFile = useSelector((state) => state.global.activeFile);
  const dispatch = useDispatch();
  const [editingFile, setEditingFile] = useState(null);
  const [status, setStatus] = useState("Hazır");
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const code = files[activeFile] || "";
  const lineNumbers = Array.from(
    { length: Math.max(code.split("\n").length, 1) },
    (_, index) => index + 1
  );

  const handleChange = (e) => {
    dispatch(setFiles({ ...files, [activeFile]: e.target.value }));
    setStatus("Kaydedildi");
  };

  const addFile = () => {
    fileCounter += 1;
    const newFile = `file${fileCounter}.js`;
    dispatch(setFiles({ ...files, [newFile]: starterCode }));
    dispatch(setActiveFile(newFile));
    setEditingFile(newFile);
    setStatus(`${newFile} eklendi`);
  };

  const renameFile = (oldName, newName) => {
    const nextName = normalizeFileName(newName);
    if (!nextName || nextName === oldName) return;

    if (files[nextName]) {
      setStatus("Bu dosya adı zaten var");
      return;
    }

    const { [oldName]: content, ...rest } = files;
    dispatch(setFiles({ [nextName]: content, ...rest }));

    if (activeFile === oldName) {
      dispatch(setActiveFile(nextName));
    }

    setStatus(`${oldName} yeniden adlandırıldı`);
  };

  const deleteFile = (fileName) => {
    if (Object.keys(files).length === 1) {
      setStatus("Son dosya silinemez");
      return;
    }

    const { [fileName]: _deletedFile, ...rest } = files;
    dispatch(setFiles(rest));

    if (activeFile === fileName) {
      dispatch(setActiveFile(Object.keys(rest)[0]));
    }

    setStatus(`${fileName} silindi`);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Kod panoya kopyalandı");
    } catch {
      setStatus("Kopyalama başarısız oldu");
    }
  };

  const clearActiveFile = () => {
    dispatch(setFiles({ ...files, [activeFile]: "" }));
    setStatus(`${activeFile} temizlendi`);
  };

  const handleEditorScroll = (event) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = event.currentTarget.scrollTop;
    }
  };

  return (
    <div className="code-editor-wrapper">
      <div className="editor-header">
        <div className="file-tabs" aria-label="Dosyalar">
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

                  if (e.key === "Escape") {
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    dispatch(setActiveFile(fileName));
                  }
                }}
                role="button"
                tabIndex={0}
                title="Çift tıkla ve yeniden adlandır"
              >
                <span className="file-name">{fileName}</span>
                <button
                  type="button"
                  className="close-tab"
                  title="Dosyayı sil"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(fileName);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      deleteFile(fileName);
                    }
                  }}
                >
                  ×
                </button>
              </div>
            )
          )}
          <button
            type="button"
            onClick={addFile}
            className="add-file-btn"
            title="Yeni dosya"
            aria-label="Yeni dosya"
          >
            +
          </button>
        </div>

        <div className="editor-actions">
          <button type="button" onClick={copyCode} title="Kodu kopyala">
            Kopyala
          </button>
          <button type="button" onClick={clearActiveFile} title="Dosyayı temizle">
            Temizle
          </button>
        </div>
      </div>

      <div className="editor-title-row">
        <div>
          <strong>{activeFile}</strong>
          <span>
            {lineNumbers.length} satır · {code.length} karakter
          </span>
        </div>
        <span className="editor-status">{status}</span>
      </div>

      <div className="code-editor-container">
        <div className="line-numbers" ref={lineNumbersRef}>
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          value={code}
          onChange={handleChange}
          onScroll={handleEditorScroll}
          spellCheck="false"
          aria-label={`${activeFile} kod editörü`}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
