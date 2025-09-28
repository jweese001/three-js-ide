import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';

const Editor = forwardRef(({ value, onChange, onMount }, ref) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Set up Monaco Editor options
    editor.updateOptions({
      theme: 'vs-dark',
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      minimap: { enabled: false },
    });

    // Call parent onMount if provided
    if (onMount) {
      onMount(editor, monaco);
    }
  };

  // Expose a function to the parent component via the ref
  useImperativeHandle(ref, () => ({
    insertText(text) {
      if (editorRef.current) {
        const position = editorRef.current.getPosition();
        editorRef.current.executeEdits('snippet-inserter', [{
          range: new window.monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
          text: text
        }]);
        editorRef.current.focus();
      }
    }
  }));

  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="javascript"
      value={value}
      onChange={onChange}
      onMount={handleEditorDidMount}
      options={{
        theme: 'vs-dark',
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        minimap: { enabled: false },
      }}
    />
  );
});

export default Editor;