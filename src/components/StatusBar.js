import React from 'react';
import './StatusBar.css';

const StatusBar = ({ onToggleSnippets, isSnippetDrawerOpen }) => {
  return (
    <div className="status-bar">
      <button
        className={`status-bar-button ${isSnippetDrawerOpen ? 'open' : ''}`}
        onClick={onToggleSnippets}
      >
        ☰ Snippets
      </button>
      <div className="shortcut-reminder-text">
        Cmd/Ctrl+Shift+N to reset
      </div>
    </div>
  );
};

export default StatusBar;