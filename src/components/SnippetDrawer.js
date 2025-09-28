import React, { useState } from 'react';
import { snippets, snippetCategories } from '../data/snippets';

const SnippetDrawer = ({ onSnippetInsert, isOpen, onClose }) => {
  // Use an object to track the open state of each category, allowing multiple to be open.
  const [openSections, setOpenSections] = useState({});

  const handleToggleSection = (category) => {
    setOpenSections(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSnippetClick = (snippetKey) => {
    const code = snippets[snippetKey];
    if (code && onSnippetInsert) {
      onSnippetInsert(code);
    }
    onClose(); // Close drawer after inserting
  };

  return (
    <div id="snippet-drawer" className={isOpen ? 'open' : ''}>
      <h3 className="drawer-title">Snippets</h3>
      <div className="accordion-container">
        {Object.entries(snippetCategories).map(([category, snippetKeys]) => (
          <div key={category} className="snippet-section">
            <button className="snippet-section-header" onClick={() => handleToggleSection(category)}>
              {category}
              <span className="icon">{openSections[category] ? '▼' : '▶'}</span>
            </button>
            <div className={`collapsible-content ${openSections[category] ? 'open' : ''}`}>
              {snippetKeys.map(snippetKey => (
                <button
                  key={snippetKey}
                  className="snippet-button"
                  onClick={() => handleSnippetClick(snippetKey)}
                >
                  {snippetKey.split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SnippetDrawer;