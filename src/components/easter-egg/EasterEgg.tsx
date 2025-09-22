import React, { useEffect, useState } from 'react';
import { FigmaUI } from './FigmaUI';

export const EasterEgg: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for figma layer visibility changes
    const checkVisibility = () => {
      const figmaWorkspace = document.getElementById('figma-workspace');
      if (figmaWorkspace) {
        const isShowing = !figmaWorkspace.classList.contains('hidden') &&
                         window.getComputedStyle(figmaWorkspace).opacity !== '0';
        setIsVisible(isShowing);
      }
    };

    // Check initial state
    checkVisibility();

    // Set up observer for changes
    const observer = new MutationObserver(checkVisibility);
    const figmaWorkspace = document.getElementById('figma-workspace');

    if (figmaWorkspace) {
      observer.observe(figmaWorkspace, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    // Listen for fold interactions (if using custom events)
    const handleReveal = () => setIsVisible(true);
    const handleHide = () => setIsVisible(false);

    window.addEventListener('figma-reveal', handleReveal);
    window.addEventListener('figma-hide', handleHide);

    // Track discovery for Context7
    if (isVisible && (window as any).context7) {
      (window as any).context7.store('easter-egg.figma-viewed', {
        timestamp: Date.now(),
        tabMessage: 'Design Is Not Just Pixels It\'s Problem Solving Magic'
      });
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('figma-reveal', handleReveal);
      window.removeEventListener('figma-hide', handleHide);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return <FigmaUI />;
};

export default EasterEgg;