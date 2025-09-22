import React, { useState, useEffect, useCallback } from 'react';
import './styles.css';

export const FigmaEasterEggSimple: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasDiscovered, setHasDiscovered] = useState(false);

  // Check if user has discovered before
  useEffect(() => {
    const discovered = localStorage.getItem('figma-easter-egg-discovered');
    if (discovered) setHasDiscovered(true);
  }, []);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isRevealed) {
        setIsRevealed(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isRevealed]);

  const handleReveal = useCallback(() => {
    setIsRevealed(true);
    if (!hasDiscovered) {
      localStorage.setItem('figma-easter-egg-discovered', 'true');
      setHasDiscovered(true);
    }
  }, [hasDiscovered]);

  const handleClose = useCallback(() => {
    setIsRevealed(false);
  }, []);

  return (
    <>
      {!isRevealed && (
        <button
          className="fold-corner"
          onClick={handleReveal}
          aria-label="Reveal easter egg"
        />
      )}

      {isRevealed && (
        <>
          <div className="figma-workspace">
            <div className="app">
              {/* Simple Figma-like interface */}
              <div className="window-bar">
                <div className="window-controls">
                  <div className="window-control close"></div>
                  <div className="window-control minimize"></div>
                  <div className="window-control maximize"></div>
                </div>
              </div>

              <div className="tab-bar">
                <div className="tabs-section">
                  <div className="figma-logo">
                    <svg width="12" height="18" viewBox="0 0 12 18" fill="none">
                      <path d="M3 18C4.65 18 6 16.65 6 15V12H3C1.35 12 0 13.35 0 15C0 16.65 1.35 18 3 18Z" fill="#0ACF83"/>
                      <path d="M0 9C0 7.35 1.35 6 3 6H6V12H3C1.35 12 0 10.65 0 9Z" fill="#A259FF"/>
                      <path d="M0 3C0 1.35 1.35 0 3 0H6V6H3C1.35 6 0 4.65 0 3Z" fill="#F24E1E"/>
                      <path d="M6 0H9C10.65 0 12 1.35 12 3C12 4.65 10.65 6 9 6H6V0Z" fill="#FF7262"/>
                      <path d="M12 9C12 10.65 10.65 12 9 12C7.35 12 6 10.65 6 9C6 7.35 7.35 6 9 6C10.65 6 12 7.35 12 9Z" fill="#1ABCFE"/>
                    </svg>
                  </div>
                  <div className="tab-container">
                    <div className="tab-item active">
                      <span className="tab-title">Design</span>
                    </div>
                    <div className="tab-item">
                      <span className="tab-title">Is</span>
                    </div>
                    <div className="tab-item">
                      <span className="tab-title">Not</span>
                    </div>
                    <div className="tab-item">
                      <span className="tab-title">Just</span>
                    </div>
                    <div className="tab-item">
                      <span className="tab-title">Pixels</span>
                    </div>
                  </div>
                </div>
                <div className="tab-bar-controls">
                  <button className="share-btn">Share</button>
                  <div className="user-avatar">NG</div>
                </div>
              </div>

              <div className="main">
                <aside className="sidebar">
                  <div className="file-info">
                    <div className="file-name">Portfolio-refresh</div>
                    <div className="file-meta">
                      <span>Drafts</span>
                    </div>
                  </div>
                </aside>

                <div className="canvas-container">
                  <div className="canvas">
                    <div className="frame frame-dark">
                      <div className="frame-header">
                        <div className="frame-title">About</div>
                      </div>
                      <div className="frame-content">
                        <p>I'm a product designer specializing in developer tools and observability platforms.</p>
                        <h2>Why I Design for Technical Products</h2>
                        <p>Complex problems energize me. The harder the technical challenge, the more impactful good design becomes.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="inspector">
                  <div className="inspector-header">
                    <button className="user-btn active">
                      <span>N</span>
                    </button>
                    <button className="share-btn">Share</button>
                  </div>
                </aside>
              </div>
            </div>
          </div>

          <button
            className="close-figma"
            onClick={handleClose}
            aria-label="Close Figma workspace"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </>
      )}
    </>
  );
};