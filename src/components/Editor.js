import * as monaco from 'monaco-editor';

// This worker script is needed by monaco-editor to load syntax highlighting and other features
// For a production Vite app, we typically configure vite-plugin-monaco-editor,
// But a simple alternative in vanilla Vite is defining the environment manually:
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
      self.MonacoEnvironment = {
        baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/'
      };
      importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.41.0/min/vs/base/worker/workerMain.js');
    `)}`;
  }
};

let editorInstance = null;

export function initEditor(containerId, initialValue, onRun) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Cleanup if navigating back
  if (editorInstance) {
    editorInstance.dispose();
  }

  // Monaco requires the container to have a specific height
  container.innerHTML = '';
  
  editorInstance = monaco.editor.create(container, {
    value: initialValue || 'SELECT * FROM Customers;',
    language: 'sql',
    theme: 'vs-dark',
    minimap: { enabled: false },
    automaticLayout: true,
    fontSize: 14,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    padding: { top: 16, bottom: 16 }
  });

  // Add Ctrl/Cmd + Enter binding
  editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
    if (onRun) {
      onRun(editorInstance.getValue());
    }
  });

  return editorInstance;
}

export function getEditorValue() {
  return editorInstance ? editorInstance.getValue() : '';
}

export function setEditorValue(val) {
  if (editorInstance) {
    editorInstance.setValue(val);
  }
}
