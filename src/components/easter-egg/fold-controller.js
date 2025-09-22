/**
 * Clean Paper Fold Easter Egg Controller
 * Standalone implementation with no dependencies
 */
export class FoldController {
  constructor() {
    this.isRevealed = false;
    this.isAnimating = false;
    this.hasDiscovered = false;

    // Bind methods to maintain context
    this.handleReveal = this.handleReveal.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);

    this.init();
  }

  init() {
    // Check if user has discovered before
    this.checkDiscoveryStatus();

    // Create all elements
    this.createFoldCorner();
    this.wrapPortfolio();
    this.createCloseButton();

    // Attach event listeners
    this.attachListeners();

    console.log('Fold Controller initialized');
  }

  checkDiscoveryStatus() {
    try {
      this.hasDiscovered = localStorage.getItem('figma-easter-egg-discovered') === 'true';
    } catch (e) {
      console.warn('LocalStorage not available, discovery state will not persist');
      this.hasDiscovered = false;
    }
  }

  createFoldCorner() {
    // Remove any existing fold corner
    const existing = document.querySelector('.fold-corner');
    if (existing) {
      existing.remove();
    }

    const fold = document.createElement('div');
    fold.className = 'fold-corner';
    fold.setAttribute('aria-label', 'Reveal easter egg');
    fold.setAttribute('role', 'button');
    fold.setAttribute('tabindex', '0');

    const triangle = document.createElement('div');
    triangle.className = 'fold-corner-triangle';
    fold.appendChild(triangle);

    document.body.appendChild(fold);
    this.foldElement = fold;
  }

  wrapPortfolio() {
    const main = document.querySelector('main');
    if (!main) {
      console.warn('Main element not found, page-peel animation may not work correctly');
      return;
    }

    // Check if already wrapped
    if (main.parentElement?.classList.contains('portfolio-wrapper')) {
      this.portfolioWrapper = main.parentElement;
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'portfolio-wrapper';
    main.parentNode.insertBefore(wrapper, main);
    wrapper.appendChild(main);
    this.portfolioWrapper = wrapper;
  }

  createCloseButton() {
    // Remove any existing close button
    const existing = document.querySelector('.close-easter-egg');
    if (existing) {
      existing.remove();
    }

    const btn = document.createElement('button');
    btn.className = 'close-easter-egg';
    btn.innerHTML = '×';
    btn.setAttribute('aria-label', 'Close easter egg');
    btn.style.cssText = 'display: none !important;';
    document.body.appendChild(btn);
    this.closeButton = btn;
  }

  attachListeners() {
    // Fold corner listeners
    this.foldElement.addEventListener('click', this.handleReveal);
    this.foldElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleReveal();
      }
    });

    // Close button listener
    this.closeButton.addEventListener('click', this.handleHide);

    // Global keyboard listener
    document.addEventListener('keydown', this.handleKeydown);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
  }

  handleReveal() {
    if (this.isRevealed || this.isAnimating) return;

    console.log('Revealing easter egg');
    this.isAnimating = true;
    this.isRevealed = true;

    // Store discovery state
    if (!this.hasDiscovered) {
      try {
        localStorage.setItem('figma-easter-egg-discovered', 'true');
        this.hasDiscovered = true;
      } catch (e) {
        console.warn('Could not store discovery state');
      }
    }

    // Hide fold corner
    this.foldElement.classList.add('hidden');

    // Start page peel animation
    if (this.portfolioWrapper) {
      this.portfolioWrapper.classList.remove('hiding');
      this.portfolioWrapper.classList.add('revealing');
    }

    // Show Figma layer
    this.showFigmaLayer();

    // Show close button after animation starts
    setTimeout(() => {
      this.closeButton.classList.add('active');
      this.closeButton.style.cssText = 'display: flex !important;';
      this.isAnimating = false;
    }, 800);
  }

  handleHide() {
    if (!this.isRevealed || this.isAnimating) return;

    console.log('Hiding easter egg');
    this.isAnimating = true;
    this.isRevealed = false;

    // Hide close button immediately
    this.closeButton.classList.remove('active');
    this.closeButton.style.cssText = 'display: none !important;';

    // Reverse page peel animation
    if (this.portfolioWrapper) {
      this.portfolioWrapper.classList.remove('revealing');
      this.portfolioWrapper.classList.add('hiding');
    }

    // Hide Figma layer after animation completes
    setTimeout(() => {
      this.hideFigmaLayer();

      if (this.portfolioWrapper) {
        this.portfolioWrapper.classList.remove('hiding');
      }

      this.isAnimating = false;
    }, 1200);

    // Show fold corner again
    setTimeout(() => {
      this.foldElement.classList.remove('hidden');
    }, 1300);
  }

  handleKeydown(e) {
    if (e.key === 'Escape' && this.isRevealed && !this.isAnimating) {
      this.handleHide();
    }
  }

  showFigmaLayer() {
    // Try multiple possible selectors for the Figma layer
    const selectors = [
      '#figma-workspace',
      '.figma-workspace',
      '#figma-layer',
      '[data-figma-layer]',
      '.easter-egg-content'
    ];

    let figmaLayer = null;
    for (const selector of selectors) {
      figmaLayer = document.querySelector(selector);
      if (figmaLayer) break;
    }

    if (figmaLayer) {
      // Remove hidden class and add visible class
      figmaLayer.classList.remove('hidden');
      figmaLayer.classList.add('visible');
      figmaLayer.style.opacity = '1';
      figmaLayer.style.pointerEvents = 'auto';
      console.log('Figma layer shown:', figmaLayer.id || figmaLayer.className);
    } else {
      console.warn('Figma layer not found, creating placeholder');
      this.createPlaceholderFigma();
    }
  }

  hideFigmaLayer() {
    const selectors = [
      '#figma-workspace',
      '.figma-workspace',
      '#figma-layer',
      '[data-figma-layer]',
      '.easter-egg-content'
    ];

    for (const selector of selectors) {
      const figmaLayer = document.querySelector(selector);
      if (figmaLayer) {
        // Add hidden class and remove visible class
        figmaLayer.classList.add('hidden');
        figmaLayer.classList.remove('visible');
        figmaLayer.style.opacity = '0';
        figmaLayer.style.pointerEvents = 'none';
        console.log('Figma layer hidden:', figmaLayer.id || figmaLayer.className);
      }
    }
  }

  createPlaceholderFigma() {
    // Create a simple placeholder if no Figma layer exists
    const placeholder = document.createElement('div');
    placeholder.id = 'figma-layer';
    placeholder.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #1a1a1a;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      z-index: 50000;
      opacity: 1;
      pointer-events: auto;
    `;
    placeholder.innerHTML = `
      <div style="text-align: center;">
        <h2>Figma Easter Egg</h2>
        <p>The Figma UI will be displayed here</p>
        <p style="font-size: 14px; opacity: 0.7; margin-top: 20px;">
          Press ESC or click the close button to return
        </p>
      </div>
    `;

    document.body.appendChild(placeholder);
  }

  cleanup() {
    // Remove event listeners
    document.removeEventListener('keydown', this.handleKeydown);

    // Remove created elements
    if (this.foldElement) {
      this.foldElement.remove();
    }

    if (this.closeButton) {
      this.closeButton.remove();
    }

    // Unwrap portfolio if we wrapped it
    if (this.portfolioWrapper) {
      const main = this.portfolioWrapper.querySelector('main');
      if (main && this.portfolioWrapper.parentNode) {
        this.portfolioWrapper.parentNode.insertBefore(main, this.portfolioWrapper);
        this.portfolioWrapper.remove();
      }
    }

    console.log('Fold Controller cleaned up');
  }

  // Public API methods
  destroy() {
    this.cleanup();
  }

  toggle() {
    if (this.isRevealed) {
      this.handleHide();
    } else {
      this.handleReveal();
    }
  }

  getState() {
    return {
      isRevealed: this.isRevealed,
      isAnimating: this.isAnimating,
      hasDiscovered: this.hasDiscovered
    };
  }
}

// Auto-initialize when DOM is ready
function initializeFoldController() {
  // Avoid duplicate initialization
  if (window.foldController) {
    console.log('Fold Controller already exists');
    return window.foldController;
  }

  const controller = new FoldController();

  // Store reference globally for debugging/external access
  window.foldController = controller;

  return controller;
}

// Initialize based on document state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFoldController);
} else {
  // DOM already loaded
  initializeFoldController();
}

// Export for module usage
export default FoldController;