import React from 'react';

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
        Cmd/Ctrl+Shift+R to reset
      </div>
    </div>
  );
};

export default StatusBar;
