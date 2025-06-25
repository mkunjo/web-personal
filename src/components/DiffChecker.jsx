import React, { useState, useMemo } from 'react';
import { diffLines } from 'diff';
import '../styles/index.css'; 
import '../styles/tech.css'; 

const DiffChecker = () => {
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => darkMode ? 'dark' : 'light', [darkMode]);

  const calculateDiff = useMemo(() => {
    const diffs = diffLines(code1, code2);

    const leftLines = [];
    const rightLines = [];
    let leftLineNumber = 1;
    let rightLineNumber = 1;

    diffs.forEach((part) => {
      const lines = part.value.split('\n');
      if (lines[lines.length - 1] === '') lines.pop();

      lines.forEach((line) => {
        if (part.added) {
          leftLines.push({ line: '', type: 'empty', number: null });
          rightLines.push({ line, type: 'added', number: rightLineNumber++ });
        } else if (part.removed) {
          leftLines.push({ line, type: 'removed', number: leftLineNumber++ });
          rightLines.push({ line: '', type: 'empty', number: null });
        } else {
          leftLines.push({ line, type: 'same', number: leftLineNumber++ });
          rightLines.push({ line, type: 'same', number: rightLineNumber++ });
        }
      });
    });

    return { leftLines, rightLines };
  }, [code1, code2]);

  const { leftLines, rightLines } = calculateDiff;

  const stats = {
    total: Math.max(leftLines.length, rightLines.length),
    added: rightLines.filter((l) => l.type === 'added').length,
    removed: leftLines.filter((l) => l.type === 'removed').length,
    same: leftLines.filter((l) => l.type === 'same').length,
  };

  return (
    <div className={`diff-container ${theme}`}>
      <div className="header">
        <h1 className="title">Code Difference Checker</h1>
        <label className="theme-toggle">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
          <span>Dark Mode</span>
        </label>
      </div>

      <div className="textarea-wrapper">
        <div>
          <div className="textarea-header">Original Code</div>
          <textarea
            className="code-input"
            placeholder="Paste your original code here..."
            value={code1}
            onChange={(e) => setCode1(e.target.value)}
          />
        </div>
        <div>
          <div className="textarea-header">Modified Code</div>
          <textarea
            className="code-input"
            placeholder="Paste your modified code here..."
            value={code2}
            onChange={(e) => setCode2(e.target.value)}
          />
        </div>
      </div>

      {code1 || code2 ? (
        <>
          <div className="diff-grid">
            <div className="diff-column">
              <div className="diff-header">Original</div>
              {leftLines.map((item, idx) => (
                <div key={idx} className={`diff-line ${item.type}`}>
                  <div className="line-number">{item.number || ''}</div>
                  <div className="line-content">{item.line}</div>
                </div>
              ))}
            </div>
            <div className="diff-column">
              <div className="diff-header">Modified</div>
              {rightLines.map((item, idx) => (
                <div key={idx} className={`diff-line ${item.type}`}>
                  <div className="line-number">{item.number || ''}</div>
                  <div className="line-content">{item.line}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="stats">
            <div className="stat">
              <span className="dot same"></span>
              Unchanged: {stats.same}
            </div>
            <div className="stat">
              <span className="dot added"></span>
              Added: {stats.added}
            </div>
            <div className="stat">
              <span className="dot removed"></span>
              Removed: {stats.removed}
            </div>
            <div className="stat">Total Lines: {stats.total}</div>
          </div>
        </>
      ) : (
        <div className="empty-state">Enter code in both text areas to see the differences</div>
      )}
    </div>
  );
};

export default DiffChecker;
