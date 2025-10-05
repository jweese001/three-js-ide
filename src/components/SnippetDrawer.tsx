import React, { useState, useEffect } from 'react';
import styles from './SnippetDrawer.module.css';

const SnippetDrawer = ({ onSnippetInsert, isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    fetch('/snippets/manifest.json')
      .then(response => response.json())
      .then(data => setCategories(data.categories))
      .catch(error => console.error('Error loading snippet manifest:', error));
  }, []);

  const handleToggleSection = (category) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSnippetClick = (snippetFile) => {
    fetch(`/snippets/${snippetFile}`)
      .then(response => response.text())
      .then(code => {
        if (code && onSnippetInsert) {
          onSnippetInsert(code);
        }
        onClose(); // Close drawer after inserting
      })
      .catch(error => console.error(`Error loading snippet: ${snippetFile}`, error));
  };

  return (
    <div className={`${styles.snippetDrawer} ${isOpen ? styles.open : ''}`}>
      <h3 className={styles.drawerTitle}>Snippets</h3>
      <div className={styles.accordionContainer}>
        {categories.map((category) => (
          <div key={category.name} className={styles.snippetSection}>
            <button
              className={styles.snippetSectionHeader}
              onClick={() => handleToggleSection(category.name)}
            >
              {category.name}
              <span className={styles.icon}>
                {openSections[category.name] ? '▼' : '▶'}
              </span>
            </button>
            <div
              className={`${styles.collapsibleContent} ${openSections[category.name] ? styles.open : ''}`}
            >
              {category.items.map((item) => (
                <button
                  key={item.name}
                  className={styles.snippetButton}
                  onClick={() => handleSnippetClick(item.file)}
                >
                  {item.name}
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