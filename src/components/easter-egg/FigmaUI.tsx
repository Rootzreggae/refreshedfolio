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
    { id: '1', name: 'product', active: false },
    { id: '2', name: 'designer', active: true },
    { id: '3', name: 'specializing', active: false },
    { id: '4', name: 'in', active: false },
    { id: '5', name: 'developer', active: false },
    { id: '6', name: 'tools', active: false },
  ]);

  const [selectedLayer, setSelectedLayer] = useState<string>('about');
  const [zoomLevel, setZoomLevel] = useState<string>('100%');
  const [activeTool, setActiveTool] = useState<string>('move');

  const handleToolChange = (tool: string) => {
    if (tool === activeTool) return; // Don't track clicking the same tool

    setActiveTool(tool);

    // Track tool changes
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('Figma Tool Changed', {
        component: 'FigmaUI',
        action: 'tool_select',
        from: activeTool,
        to: tool
      });
    }
  };

  const handleTabClick = (id: string) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      active: tab.id === id
    })));

    // Track tab interactions
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('Figma Tab Clicked', {
        component: 'FigmaUI',
        action: 'tab_click',
        tab_id: id,
        tab_name: tabs.find(tab => tab.id === id)?.name || 'unknown'
      });
    }
  };

  const handleTabClose = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const tabToClose = tabs.find(tab => tab.id === id);
    setTabs(tabs.filter(tab => tab.id !== id));

    // Track tab close interactions
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('Figma Tab Closed', {
        component: 'FigmaUI',
        action: 'tab_close',
        tab_id: id,
        tab_name: tabToClose?.name || 'unknown'
      });
    }
  };

  const handleZoomIn = () => {
    const levels = ['25%', '50%', '75%', '100%', '150%', '200%'];
    const currentIndex = levels.indexOf(zoomLevel);
    if (currentIndex < levels.length - 1) {
      const newLevel = levels[currentIndex + 1];
      setZoomLevel(newLevel);

      // Track zoom interactions
      if (typeof window !== 'undefined' && window.umami) {
        window.umami.track('Figma Zoom Changed', {
          component: 'FigmaUI',
          action: 'zoom_in',
          from: zoomLevel,
          to: newLevel
        });
      }
    }
  };

  const handleZoomOut = () => {
    const levels = ['25%', '50%', '75%', '100%', '150%', '200%'];
    const currentIndex = levels.indexOf(zoomLevel);
    if (currentIndex > 0) {
      const newLevel = levels[currentIndex - 1];
      setZoomLevel(newLevel);

      // Track zoom interactions
      if (typeof window !== 'undefined' && window.umami) {
        window.umami.track('Figma Zoom Changed', {
          component: 'FigmaUI',
          action: 'zoom_out',
          from: zoomLevel,
          to: newLevel
        });
      }
    }
  };

  return (
    <div className="figma-container">
      {/* Top Bar */}
      <div className="figma-topbar">
        <div className="topbar-left">
          <div className="menu-icon">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="4" height="4" fill="#F24E1E"/>
              <rect x="8" y="2" width="4" height="4" fill="#FF7262"/>
              <rect x="2" y="8" width="4" height="4" fill="#A259FF"/>
              <rect x="8" y="8" width="4" height="4" fill="#1ABCFE"/>
            </svg>
          </div>

          {/* Easter egg tabs */}
          <div className="file-tabs">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`file-tab ${tab.active ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.name}
                <span
                  className="tab-close"
                  onClick={(e) => handleTabClose(tab.id, e)}
                >
                  ×
                </span>
              </div>
            ))}
            <div className="file-tab">+</div>
          </div>
        </div>

        <div className="topbar-right">
          <button className="share-button">Share</button>
          <div className="play-button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 3L13 8L4 13V3Z"/>
            </svg>
          </div>
          <div className="avatar"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="figma-main">
        {/* Sidebar */}
        <div className="figma-sidebar">
          <div className="sidebar-tabs">
            <div className="sidebar-tab active">Layers</div>
            <div className="sidebar-tab">Assets</div>
          </div>
          <div className="layers-panel">
            <input className="search-box" type="text" placeholder="Search" />
            <div className="page-item">
              <span>▶</span>
              <span>#</span>
              <span>Page 1</span>
            </div>
            <div
              className={`page-item ${selectedLayer === 'about' ? 'active' : ''}`}
              onClick={() => setSelectedLayer('about')}
            >
              <span>▼</span>
              <span>#</span>
              <span>About</span>
            </div>
            <div style={{paddingLeft: '20px'}}>
              <div className="page-item">
                <span>□</span>
                <span>Frame 2</span>
              </div>
              <div className="page-item">
                <span>□</span>
                <span>Frame 4</span>
              </div>
            </div>
            <div className="page-item">
              <span>▶</span>
              <span>#</span>
              <span>Homepage</span>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="canvas-area">
          {/* Horizontal Ruler */}
          <div className="ruler-horizontal"></div>

          {/* Canvas Container */}
          <div className="figma-canvas-container">
            {/* Vertical Ruler */}
            <div className="ruler-vertical"></div>
            {/* Ruler Corner */}
            <div className="ruler-corner"></div>

            <div className="canvas-content">
              {/* Hero Artboard */}
              <div className="artboard artboard-hero">
                <span className="artboard-label">About</span>
                {/* Guidelines */}
                <div className="guideline guideline-h" style={{top: '72px'}}></div>
                <div className="guideline guideline-h" style={{bottom: '72px'}}></div>
                <div className="guideline guideline-v" style={{left: '72px'}}></div>
                <div className="guideline guideline-v" style={{right: '72px'}}></div>

                <div className="intro-section">
                  <div className="intro-label">ABOUT</div>
                  <h1 className="intro-title">Nilson<br/>Gaspar</h1>
                  <p className="intro-subtitle">
                    I'm a product designer specializing in
                    <span className="intro-highlight">developer tools</span> and
                    <span className="intro-highlight">observability platforms</span>.
                    My broad design background helps me create technical products
                    that feel surprisingly human.
                  </p>
                </div>

                <div className="quote-block">
                  <p className="quote-text">
                    "There's nothing quite like making a developer say 'finally, this makes sense!'"
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="column-right">
                {/* Small Artboard */}
                <div className="artboard artboard-small">
                  <span className="artboard-label">Homepage</span>
                  {/* Guidelines */}
                  <div className="guideline guideline-h" style={{top: '40px'}}></div>
                  <div className="guideline guideline-v" style={{left: '40px'}}></div>
                  <div className="guideline guideline-v" style={{right: '40px'}}></div>

                  <div className="section-number" style={{top: '-20px', right: '-20px'}}>01</div>

                  <div className="section-content">
                    <div className="section-header">WHY</div>
                    <h2 className="section-title">Technical Products</h2>
                    <p className="section-text">
                      <strong>Complex problems energize me.</strong>
                      Transforming observability data into actionable insights at Grafana taught me that the harder
                      the technical challenge, the more impactful good design becomes.
                    </p>
                  </div>
                </div>

                {/* Medium Artboard */}
                <div className="artboard artboard-medium">
                  <span className="artboard-label">Homepage</span>
                  {/* Guidelines */}
                  <div className="guideline guideline-h" style={{top: '48px'}}></div>
                  <div className="guideline guideline-h" style={{bottom: '48px'}}></div>
                  <div className="guideline guideline-v" style={{left: '48px'}}></div>

                  <div className="section-number" style={{right: '-30px', top: '-30px', color: 'rgba(13, 153, 255, 0.06)'}}>02</div>

                  <div className="point-item">
                    <h3 className="point-title">Real-time impact at scale</h3>
                    <p className="point-text">
                      When I improved time-to-insight by
                      <span className="impact-stat">20%</span><br/>
                      on Grafana's APM tools, it meant thousands of engineers
                      could identify and fix issues faster.
                    </p>
                  </div>

                  <div className="point-item">
                    <h3 className="point-title">Collaboration with brilliant minds</h3>
                    <p className="point-text">
                      Working closely with engineers has sharpened my thinking.
                      I've learned to ask "what's technically possible?" before
                      "what's ideal?" - finding elegant solutions within constraints.
                    </p>
                  </div>

                  <div className="point-item">
                    <h3 className="point-title">The perfect blend of art and science</h3>
                    <p className="point-text">
                      Designing dashboards that visualize millions of data points
                      requires both aesthetic sensibility and deep understanding
                      of how developers think.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Toolbar */}
            <div className="floating-toolbar">
              <button className={`tool-button ${activeTool === 'move' ? 'active' : ''}`} onClick={() => handleToolChange('move')} title="Move">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2L12 6H9V10H13L9 14V11H7V7H4L8 3V2Z"/>
                </svg>
              </button>
              <button className={`tool-button ${activeTool === 'frame' ? 'active' : ''}`} onClick={() => handleToolChange('frame')} title="Frame">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="10" height="10"/>
                </svg>
              </button>
              <button className={`tool-button ${activeTool === 'rectangle' ? 'active' : ''}`} onClick={() => handleToolChange('rectangle')} title="Rectangle">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="3" y="5" width="10" height="6"/>
                </svg>
              </button>
              <button className={`tool-button ${activeTool === 'ellipse' ? 'active' : ''}`} onClick={() => handleToolChange('ellipse')} title="Ellipse">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <ellipse cx="8" cy="8" rx="5" ry="3.5"/>
                </svg>
              </button>
              <button className={`tool-button ${activeTool === 'polygon' ? 'active' : ''}`} onClick={() => handleToolChange('polygon')} title="Polygon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 3L13 7L11 13H5L3 7Z"/>
                </svg>
              </button>
              <button className={`tool-button ${activeTool === 'star' ? 'active' : ''}`} onClick={() => handleToolChange('star')} title="Star">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2L9.5 6.5L14 7L10.5 10L12 14L8 11.5L4 14L5.5 10L2 7L6.5 6.5Z"/>
                </svg>
              </button>
              <div className="tool-divider"></div>
              <button className={`tool-button ${activeTool === 'pen' ? 'active' : ''}`} onClick={() => handleToolChange('pen')} title="Pen">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 13L10 6L13 9L6 16L3 13Z"/>
                </svg>
              </button>
              <button className={`tool-button ${activeTool === 'text' ? 'active' : ''}`} onClick={() => handleToolChange('text')} title="Text">
                <span style={{fontWeight: '600', fontSize: '14px'}}>T</span>
              </button>
              <div className="tool-divider"></div>
              <button className={`tool-button ${activeTool === 'hand' ? 'active' : ''}`} onClick={() => handleToolChange('hand')} title="Hand">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M10 2V8L8 7V3L6 4V9L4 8V5L2 6V11L8 14L14 11V7L12 6V4L10 2Z"/>
                </svg>
              </button>
              <button className={`tool-button ${activeTool === 'comment' ? 'active' : ''}`} onClick={() => handleToolChange('comment')} title="Comment">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2 3H14V11H8L4 14V11H2V3Z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="bottom-bar">
          <div className="zoom-controls">
            <button
              onClick={handleZoomOut}
              style={{background: 'none', border: 'none', color: '#999', cursor: 'pointer'}}
            >
              −
            </button>
            <span className="zoom-value">{zoomLevel}</span>
            <button
              onClick={handleZoomIn}
              style={{background: 'none', border: 'none', color: '#999', cursor: 'pointer'}}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};