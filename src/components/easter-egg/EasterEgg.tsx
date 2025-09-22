import React, { useState, useEffect } from 'react';
import { FigmaUI } from './FigmaUI';
import './easter-egg.css';

export const EasterEgg: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Always initialize Figma in background
    setIsInitialized(true);
  }, []);

  const handleFoldClick = () => {
    setIsRevealed(true);
    document.body.classList.add('figma-revealed');
  };

  const handleClose = () => {
    setIsRevealed(false);
    document.body.classList.remove('figma-revealed');
  };

  return (
    <>
      {/* Figma UI - ALWAYS RENDERED, positioned behind portfolio */}
      <div
        id="figma-layer"
        className={`figma-workspace ${isRevealed ? 'active' : 'hidden'}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 5, // Below portfolio
          opacity: isInitialized ? 1 : 0,
          pointerEvents: isRevealed ? 'auto' : 'none'
        }}
      >
        {isInitialized && <FigmaUI />}
      </div>

      {/* Fold Corner - Always visible unless Figma is fully revealed */}
      {!isRevealed && (
        <div
          className="fold-corner"
          onClick={handleFoldClick}
          style={{ zIndex: 1000 }}
        >
          <div className="fold-corner-triangle" />
        </div>
      )}

      {/* Close Button - Only when revealed */}
      {isRevealed && (
        <button
          className="close-easter-egg"
          onClick={handleClose}
          style={{ zIndex: 10000 }}
        >
          ×
        </button>
      )}
    </>
  );
};

export default EasterEgg;