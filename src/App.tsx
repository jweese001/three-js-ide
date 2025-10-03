import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import Editor from './components/Editor.tsx';
import Preview from './components/Preview.tsx';
import SnippetDrawer from './components/SnippetDrawer.tsx';
import Resizer from './components/Resizer.tsx';
import StatusBar from './components/StatusBar.tsx';
import ErrorOverlay from './components/ErrorOverlay.tsx'; // Import ErrorOverlay
import { defaultCode } from './data/snippets';

function App() {
  const [code, setCode] = useState(defaultCode);
  const [editorWidth, setEditorWidth] = useState(50);
  const [isEditorStowed, setIsEditorStowed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnippetDrawerOpen, setIsSnippetDrawerOpen] = useState(false); // State for snippet drawer
  const [error, setError] = useState(null); // Add error state
  const editorRef = useRef(null);
  const iframeRef = useRef(null);
  const [isIframeReady, setIsIframeReady] = useState(false);

  // Load saved code on startup
  useEffect(() => {
    const savedCode = localStorage.getItem('threejs-ide-code');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  // Auto-save code changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('threejs-ide-code', code);
    }, 1000); // Save after 1 second of no changes

    return () => clearTimeout(timeoutId);
  }, [code]);

  const runCode = useCallback(() => {
    if (iframeRef.current && isIframeReady) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'executeCode', code },
        window.location.origin
      );
    }
  }, [code, isIframeReady]);

  // Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      const { type, payload } = event.data;
      if (type === 'error') {
        setError(payload);
      } else if (type === 'ready') {
        setIsIframeReady(true);
      } else if (type === 'reset') {
        runCode();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [runCode]);

  // Run code on initial load and on subsequent changes
  useEffect(() => {
    runCode();
  }, [runCode]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    setError(null); // Clear error on code change
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;

    // Cmd/Ctrl+R to run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, runCode);

    // Cmd/Ctrl+Shift+R to reset to default code
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyR,
      () => {
        if (
          window.confirm(
            'Are you sure you want to reset the code to the default?'
          )
        ) {
          setCode(defaultCode);
          localStorage.removeItem('threejs-ide-code');
        }
      }
    );
  };

  const handleSnippetInsert = (snippetCode) => {
    if (editorRef.current) {
      const position = editorRef.current.getPosition();
      editorRef.current.executeEdits('snippet-inserter', [
        {
          range: new window.monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
          ),
          text: snippetCode,
        },
      ]);
      editorRef.current.focus();
    }
  };

  const handleResize = (newWidthPercentage) => {
    setEditorWidth(newWidthPercentage);
  };

  const handleStow = () => {
    setIsEditorStowed(!isEditorStowed);
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow.postMessage({ type: 'resize' }, '*');
      }
    }, 300);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({ type: 'resize' }, '*');
    }
  };

  const toggleSnippetDrawer = () => {
    setIsSnippetDrawerOpen(!isSnippetDrawerOpen);
  };

  return (
    <div className="App">
      <div className="ide-container">
        <SnippetDrawer
          isOpen={isSnippetDrawerOpen}
          onClose={() => setIsSnippetDrawerOpen(false)}
          onSnippetInsert={handleSnippetInsert}
        />
        <div
          id="editor-container"
          className={isEditorStowed ? 'stowed' : ''}
          style={{ flexBasis: isEditorStowed ? '0%' : `${editorWidth}%` }}
        >
          <Editor
            value={code}
            onChange={handleCodeChange}
            onMount={handleEditorMount}
          />
        </div>

        <Resizer
          onResize={handleResize}
          onStow={handleStow}
          editorWidth={editorWidth}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        />

        <div id="preview-container">
          <Preview ref={iframeRef} isDragging={isDragging} />
          <ErrorOverlay error={error} onClose={() => setError(null)} />
        </div>
      </div>
      <StatusBar
        onToggleSnippets={toggleSnippetDrawer}
        isSnippetDrawerOpen={isSnippetDrawerOpen}
      />
    </div>
  );
}

export default App;
