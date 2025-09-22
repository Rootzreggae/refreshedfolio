// FigmaUI.tsx
import React, { useState } from 'react';
import './FigmaUI.css';

interface Tab {
  id: string;
  name: string;
  active?: boolean;
}

export const FigmaUI: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', name: 'Design', active: false },
    { id: '2', name: 'Is', active: false },
    { id: '3', name: 'Not', active: false },
    { id: '4', name: 'Just', active: false },
    { id: '5', name: 'Pixels', active: true },
    { id: '6', name: "It's", active: false },
    { id: '7', name: 'Problem', active: false },
    { id: '8', name: 'Solving', active: false },
    { id: '9', name: 'Magic', active: false },
  ]);

  const [selectedLayer, setSelectedLayer] = useState<string>('frame-1');
  const [zoomLevel, setZoomLevel] = useState<string>('48%');
  const [activeTool, setActiveTool] = useState<string>('move');

  const handleTabClick = (id: string) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      active: tab.id === id
    })));
  };

  const handleTabClose = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs(tabs.filter(tab => tab.id !== id));
  };

  const handleZoomChange = () => {
    const levels = ['25%', '48%', '50%', '75%', '100%', '150%', '200%'];
    const currentIndex = levels.indexOf(zoomLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    setZoomLevel(levels[nextIndex]);
  };

  return (
    <div className="figma-ui">
      {/* Tab Bar */}
      <div className="figma-tab-bar">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`figma-tab ${tab.active ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span>{tab.name}</span>
            <button
              className="tab-close"
              onClick={(e) => handleTabClose(tab.id, e)}
              aria-label="Close tab"
            >
              ×
            </button>
          </div>
        ))}
        <button className="share-button">Share</button>
        <div className="user-avatar">NG</div>
      </div>

      {/* Main Content */}
      <div className="figma-main">
        {/* Sidebar */}
        <div className="figma-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-title">Layers</span>
            <button className="collapse-btn" aria-label="Collapse">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 6L9 6" stroke="#999" strokeWidth="1.5"/>
              </svg>
            </button>
          </div>
          <div className="layers-list">
            <div
              className={`layer-item ${selectedLayer === 'page-1' ? 'selected' : ''}`}
              onClick={() => setSelectedLayer('page-1')}
            >
              <span className="layer-icon">▼</span>
              <span>Page 1</span>
            </div>
            <div className="layer-group">
              <div
                className={`layer-item indent ${selectedLayer === 'frame-1' ? 'selected' : ''}`}
                onClick={() => setSelectedLayer('frame-1')}
              >
                <span className="layer-icon">□</span>
                <span>About</span>
              </div>
              <div
                className={`layer-item indent ${selectedLayer === 'frame-2' ? 'selected' : ''}`}
                onClick={() => setSelectedLayer('frame-2')}
              >
                <span className="layer-icon">□</span>
                <span>Homepage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas with Rulers */}
        <div className="figma-canvas-container">
          {/* Rulers */}
          <div className="ruler horizontal">
            {[3250, 3500, 3750, 4000, 4250, 4500, 4750, 5000].map(val => (
              <span key={val} className="ruler-mark" style={{ left: `${(val - 3250) / 10}px` }}>
                {val}
              </span>
            ))}
          </div>
          <div className="ruler vertical">
            {[-1000, -750, -500, -250, 0, 250, 500, 750, 1000].map(val => (
              <span key={val} className="ruler-mark" style={{ top: `${(val + 1000) / 10}px` }}>
                {val}
              </span>
            ))}
          </div>
          <div className="ruler-corner"></div>

          {/* Canvas */}
          <div className="figma-canvas">
            {/* Frame 1: About */}
            <div className="figma-frame" style={{ left: '100px', top: '100px' }}>
              <div className="frame-header">
                <span>About</span>
              </div>
              <div className="frame-content">
                <h2>Product Designer specializing in developer tools</h2>
                <p>
                  I design technical products that feel surprisingly human.
                  My work focuses on making complex systems accessible without dumbing them down.
                </p>
                <div className="section">
                  <h3>Why I Design for Technical Products</h3>
                  <p>
                    After years at Grafana Labs, I discovered that developers don't need their tools
                    to be "simple" – they need them to be clear, powerful, and respectful of their expertise.
                  </p>
                </div>
              </div>
              <div className="ruler-guide horizontal" style={{ top: '-5px' }}></div>
              <div className="ruler-guide vertical" style={{ left: '-5px' }}></div>
            </div>

            {/* Frame 2: Homepage */}
            <div className="figma-frame" style={{ left: '750px', top: '100px' }}>
              <div className="frame-header">
                <span>Homepage</span>
              </div>
              <div className="frame-content">
                <h2>API Key Management</h2>
                <h4>The Problem</h4>
                <p>
                  Developers were struggling to manage API keys across multiple services,
                  leading to security vulnerabilities and workflow interruptions.
                </p>
                <h4>The Solution</h4>
                <p>
                  A self-hosted, open-source solution that respects developer workflows
                  while enforcing security best practices.
                </p>
              </div>
              <div className="ruler-guide horizontal" style={{ top: '-5px' }}></div>
              <div className="ruler-guide vertical" style={{ right: '-5px' }}></div>
            </div>
          </div>

          {/* Modern Floating Toolbar */}
          <div className="toolbar-container">
              {/* Move tool - Active by default */}
              <div className="toolbar-group">
                  <button className={`tool-button ${activeTool === 'move' ? 'active' : ''}`} onClick={() => setActiveTool('move')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>
                      </svg>
                  </button>
              </div>

              <div className="toolbar-divider"></div>

              {/* Frame tools */}
              <div className="toolbar-group">
                  <button className={`tool-button has-dropdown ${activeTool === 'frame' ? 'active' : ''}`} onClick={() => setActiveTool('frame')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="4" y="4" width="16" height="16" rx="2"/>
                      </svg>
                  </button>
              </div>

              <div className="toolbar-divider"></div>

              {/* Shape tools */}
              <div className="toolbar-group">
                  <button className={`tool-button has-dropdown ${activeTool === 'rectangle' ? 'active' : ''}`} onClick={() => setActiveTool('rectangle')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="6" y="6" width="12" height="12"/>
                      </svg>
                  </button>
              </div>

              <div className="toolbar-divider"></div>

              {/* Pen tool */}
              <div className="toolbar-group">
                  <button className={`tool-button has-dropdown ${activeTool === 'pen' ? 'active' : ''}`} onClick={() => setActiveTool('pen')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18"/>
                      </svg>
                  </button>
              </div>

              <div className="toolbar-divider"></div>

              {/* Text tool */}
              <div className="toolbar-group">
                  <button className={`tool-button ${activeTool === 'text' ? 'active' : ''}`} onClick={() => setActiveTool('text')}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5 4v3h5.5v12h3V7H19V4z"/>
                      </svg>
                  </button>
              </div>

              {/* Components */}
              <div className="toolbar-group">
                  <button className={`tool-button has-dropdown ${activeTool === 'components' ? 'active' : ''}`} onClick={() => setActiveTool('components')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10"/>
                          <circle cx="12" cy="12" r="3"/>
                      </svg>
                  </button>
              </div>

              <div className="toolbar-divider"></div>

              {/* Hand tool */}
              <div className="toolbar-group">
                  <button className={`tool-button ${activeTool === 'hand' ? 'active' : ''}`} onClick={() => setActiveTool('hand')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M18 11v-1a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0m0 0V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1m4 0v1m-4-1v3"/>
                      </svg>
                  </button>
              </div>

              {/* Comments */}
              <div className="toolbar-group">
                  <button className={`tool-button ${activeTool === 'comments' ? 'active' : ''}`} onClick={() => setActiveTool('comments')}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                      </svg>
                  </button>
              </div>

              <div className="toolbar-divider"></div>

              {/* Right side tools */}
              <div className="toolbar-right">
                  <button className="tool-button">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6.5 7.5L16.5 16.5M16.5 7.5L6.5 16.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                      </svg>
                  </button>
                  <button className="tool-button">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="8" y="3" width="8" height="4" rx="1"/>
                          <path d="M10 7v4M14 7v4"/>
                          <rect x="6" y="11" width="12" height="10" rx="1"/>
                      </svg>
                  </button>
                  <button className="tool-button">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
                      </svg>
                  </button>
              </div>
          </div>
        </div>

        {/* Inspector */}
        <div className="figma-inspector">
          <div className="inspector-header">
            <button className="inspector-btn active">N</button>
            <button className="inspector-btn">▶</button>
            <button className="share-btn">Share</button>
          </div>

          <div className="inspector-tabs">
            <button className="inspector-tab active">Design</button>
            <button className="inspector-tab">Prototype</button>
            <button
              className="zoom-dropdown"
              onClick={handleZoomChange}
            >
              {zoomLevel} ▼
            </button>
          </div>

          <div className="inspector-sections">
            <div className="inspector-section">
              <label>Page</label>
              <div className="color-input">
                <span className="color-preview" style={{ background: '#1E1E1E' }}></span>
                <input type="text" value="1E1E1E" readOnly />
                <input type="text" value="100%" readOnly />
                <button>👁</button>
              </div>
            </div>

            <div className="inspector-section">
              <label>Variables</label>
              <button className="add-btn">⊞</button>
            </div>

            <div className="inspector-section">
              <label>Styles</label>
              <button className="add-btn">+</button>
            </div>

            <div className="inspector-section">
              <label>Export</label>
              <button className="add-btn">+</button>
            </div>
          </div>

          <button className="help-btn">?</button>
        </div>
      </div>
    </div>
  );
};