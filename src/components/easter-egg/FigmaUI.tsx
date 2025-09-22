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

          {/* Floating Toolbar */}
          <div className="figma-toolbar">
            <button className="tool-btn active">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2v12l4-4 4 4V2z"/>
              </svg>
            </button>
            <div className="tool-divider"></div>
            <button className="tool-btn">□</button>
            <button className="tool-btn">△</button>
            <button className="tool-btn">○</button>
            <div className="tool-divider"></div>
            <button className="tool-btn">✏</button>
            <button className="tool-btn">T</button>
            <div className="tool-divider"></div>
            <button className="tool-btn">⊞</button>
            <button className="tool-btn">💬</button>
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