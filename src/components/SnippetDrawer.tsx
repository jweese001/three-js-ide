import React, { useState } from 'react';
import { snippets, snippetCategories } from '../data/snippets';
import styles from './SnippetDrawer.module.css';

const SnippetDrawer = ({ onSnippetInsert, isOpen, onClose }) => {
  // Use an object to track the open state of each category, allowing multiple to be open.
  const [openSections, setOpenSections] = useState({});

  const handleToggleSection = (category) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category],
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
    <div className={`${styles.snippetDrawer} ${isOpen ? styles.open : ''}`}>
      <h3 className={styles.drawerTitle}>Snippets</h3>
      <div className={styles.accordionContainer}>
        {Object.entries(snippetCategories).map(([category, snippetKeys]) => (
          <div key={category} className={styles.snippetSection}>
            <button
              className={styles.snippetSectionHeader}
              onClick={() => handleToggleSection(category)}
            >
              {category}
              <span className={styles.icon}>
                {openSections[category] ? '▼' : '▶'}
              </span>
            </button>
            <div
              className={`${styles.collapsibleContent} ${openSections[category] ? styles.open : ''}`}
            >
              {snippetKeys.map((snippetKey) => (
                <button
                  key={snippetKey}
                  className={styles.snippetButton}
                  onClick={() => handleSnippetClick(snippetKey)}
                >
                  {snippetKey
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
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
