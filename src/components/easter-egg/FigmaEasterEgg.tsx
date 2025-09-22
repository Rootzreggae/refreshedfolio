import React, { useState, useEffect, useCallback } from 'react';
import './styles.css';

export const FigmaEasterEgg: React.FC = () => {
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
          <div id="figma-workspace" className="figma-workspace">
            {/* Figma Interface Content */}
            <div className="app">
              {/* Mac Window Bar */}
              <div className="window-bar">
                <div className="window-controls">
                  <div className="window-control close"></div>
                  <div className="window-control minimize"></div>
                  <div className="window-control maximize"></div>
                </div>
              </div>

              {/* Tab Bar */}
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
                      <button className="tab-close">×</button>
                    </div>
                    <div className="tab-item">
                      <span className="tab-title">Is</span>
                      <button className="tab-close">×</button>
                    </div>
                    <div className="tab-item">
                      <span className="tab-title">Not</span>
                      <button className="tab-close">×</button>
                    </div>
                    <div className="tab-item">
                      <span className="tab-title">Just</span>
                      <button className="tab-close">×</button>
                    </div>
                    <div className="tab-item">
                      <span className="tab-title">Pixels</span>
                      <button className="tab-close">×</button>
                    </div>
                    <div className="tab-item">
                      <span className="tab-title">It's</span>
                      <button className="tab-close">×</button>
                    </div>
                    <div className="tab-item">
                      <span className="tab-title">Problem</span>
                      <button className="tab-close">×</button>
                    </div>
                    <div className="tab-item">
                      <span className="tab-title">Solving</span>
                      <button className="tab-close">×</button>
                    </div>
                    <div className="tab-item">
                      <span className="tab-title">Magic</span>
                      <button className="tab-close">×</button>
                    </div>
                  </div>
                </div>

                <div className="tab-bar-controls">
                  <button className="share-btn" aria-label="Share">Share</button>
                  <div className="user-avatar">NG</div>
                </div>
              </div>

              {/* Main Content */}
              <div className="main">
                {/* Sidebar */}
                <aside className="sidebar">
                  <div className="sidebar-header">
                    <div className="sidebar-controls">
                      <button className="sidebar-btn" aria-label="Menu">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <rect x="2" y="2" width="5" height="5" stroke="currentColor"/>
                          <rect x="9" y="2" width="5" height="5" stroke="currentColor"/>
                          <rect x="2" y="9" width="5" height="5" stroke="currentColor"/>
                          <rect x="9" y="9" width="5" height="5" stroke="currentColor"/>
                        </svg>
                      </button>
                    </div>
                    <button className="sidebar-btn" aria-label="Collapse">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="2" width="12" height="12" stroke="currentColor"/>
                      </svg>
                    </button>
                  </div>

                  <div className="file-info">
                    <div className="file-name">Portfolio-refresh</div>
                    <div className="file-meta">
                      <span>Drafts</span>
                    </div>
                  </div>

                  <div className="tabs">
                    <button className="tab active">File</button>
                    <button className="tab">Assets</button>
                  </div>

                  <div className="search">
                    <svg className="search-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                    <input type="text" className="search-input" placeholder="Search" />
                  </div>

                  <div className="sidebar-content">
                    <div className="section">
                      <div className="section-header">
                        <span>Pages</span>
                        <button className="add-btn" aria-label="Add page">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 3V11M3 7H11" stroke="currentColor" strokeWidth="1.5"/>
                          </svg>
                        </button>
                      </div>
                      <div className="page-item active">Page 1</div>
                    </div>

                    <div className="section">
                      <div className="section-header">
                        <span>Layers</span>
                      </div>
                      <ul className="layers">
                        <li className="layer">
                          <div className="layer-icon">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <rect x="2" y="2" width="10" height="10" stroke="currentColor"/>
                            </svg>
                          </div>
                          <span className="layer-name">about frame</span>
                          <span className="layer-position">-700</span>
                        </li>
                        <li className="layer">
                          <div className="layer-icon">#</div>
                          <span className="layer-name">homepage</span>
                        </li>
                        <li className="layer">
                          <div className="layer-icon">#</div>
                          <span className="layer-name">portfolio</span>
                          <span className="layer-position">-500</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </aside>

                {/* Canvas */}
                <div className="canvas-container">
                  {/* Top Ruler */}
                  <div className="ruler ruler-horizontal">
                    <div className="ruler-marks"></div>
                  </div>
                  {/* Left Ruler */}
                  <div className="ruler ruler-vertical">
                    <div className="ruler-marks"></div>
                  </div>
                  <div className="canvas">
                    <div className="frame frame-dark">
                      <div className="frame-header">
                        <div className="frame-title">About</div>
                      </div>
                      <div className="frame-content">
                        <p className="intro">I'm a product designer specializing in developer tools and observability platforms. My broad design background helps me create technical products that feel surprisingly human.</p>

                        <h2>Why I Design for Technical Products</h2>

                        <p>Complex problems energize me. Transforming observability data into actionable insights at Grafana taught me that the harder the technical challenge, the more impactful good design becomes.</p>
                      </div>
                    </div>

                    <div className="frame frame-dark">
                      <div className="frame-header">
                        <div className="frame-title">Homepage</div>
                      </div>
                      <div className="frame-content">
                        <h1>Nilson is building<br/>tools at Dynatrace.</h1>
                        <p>Building a self-hosted solution that developers actually want to use. Reducing complexity while maintaining security standards that enterprise teams trust.</p>

                        <div className="content-section">
                          <h3>Past Work</h3>
                          <p>Keystrok • Open Source • Grafana Labs • Jungle AI</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Toolbar */}
                  <div className="floating-toolbar">
                    <button className="toolbar-tool active">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M3 3L6 12L9 9L12 6L3 3Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor"/>
                      </svg>
                    </button>
                    <div className="toolbar-divider"></div>
                    <button className="toolbar-tool">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="4" y="4" width="10" height="10" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                    <button className="toolbar-tool">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Inspector */}
                <aside className="inspector">
                  <div className="inspector-header">
                    <button className="user-btn active">
                      <span>N</span>
                    </button>
                    <button className="play-btn">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M5 4V12L11 8L5 4Z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button className="share-btn">Share</button>
                  </div>

                  <div className="inspector-tabs">
                    <button className="inspector-tab active">Design</button>
                    <button className="inspector-tab">Prototype</button>
                    <button className="inspector-tab">
                      <span>48%</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                  </div>

                  <div className="inspector-content">
                    <div className="section">
                      <div className="section-title">Page</div>
                      <div className="page-selector">
                        <span>1E1E1E</span>
                        <input type="text" defaultValue="100" className="input-small" />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>

          {/* Close Button */}
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