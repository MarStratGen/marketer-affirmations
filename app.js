// Marketer Affirmations - App Logic

// Worker config (no-op for visual test)
const WORKER_BASE = "";
function postLog() { /* no-op in test mode */ }

// State
const state = {
  data: [],
  filtered: [],
  current: null,
  area: 'general',
  theme: 'A',
  assets: {},
  lastId: null
};

// DOM Elements
const elements = {
  affirmationText: null,
  affirmationId: null,
  themeSelect: null,
  areaSelect: null,
  btnNew: null,
  btnCopy: null,
  btnDownload: null,
  btnShare: null,
  statusMessage: null,
  exportCanvas: null
};

// Initialize
async function init() {
  // Cache DOM elements
  elements.affirmationText = document.getElementById('affirmation-text');
  elements.affirmationId = document.getElementById('affirmation-id');
  elements.themeSelect = document.getElementById('theme-select');
  elements.areaSelect = document.getElementById('area-select');
  elements.btnNew = document.getElementById('btn-new');
  elements.btnCopy = document.getElementById('btn-copy');
  elements.btnDownload = document.getElementById('btn-download');
  elements.btnShare = document.getElementById('btn-share');
  elements.statusMessage = document.getElementById('status-message');
  elements.exportCanvas = document.getElementById('exportCanvas');

  // Load affirmations data
  try {
    const response = await fetch('data/affirmations.json');
    state.data = await response.json();
  } catch (error) {
    console.error('Failed to load affirmations:', error);
    showStatus('Failed to load affirmations');
    return;
  }

  // Load and cache images for canvas export
  await loadAssets();

  // Parse URL params
  const params = new URLSearchParams(window.location.search);
  if (params.has('area')) {
    state.area = params.get('area');
    elements.areaSelect.value = state.area;
  }
  if (params.has('theme')) {
    state.theme = params.get('theme');
    elements.themeSelect.value = state.theme;
    applyTheme(state.theme);
  }

  // Filter and show initial affirmation
  filterAffirmations();
  pickRandom();

  // Event listeners
  elements.themeSelect.addEventListener('change', handleThemeChange);
  elements.areaSelect.addEventListener('change', handleAreaChange);
  elements.btnNew.addEventListener('click', pickRandom);
  elements.btnCopy.addEventListener('click', copyCaption);
  elements.btnDownload.addEventListener('click', downloadPNG);
  elements.btnShare.addEventListener('click', shareAffirmation);
}

// Load image assets for canvas
async function loadAssets() {
  const assetPaths = {
    bgMain: 'public/graphics/bg-main.jpg',
    bgGold: 'public/graphics/bg-gold.jpg',
    florals: 'public/graphics/florals-corners.png',
    tape: 'public/graphics/tape.png',
    stamp: 'public/graphics/stamp-ma.png',
    grain: 'public/graphics/grain.png'
  };

  const promises = Object.entries(assetPaths).map(([key, path]) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        state.assets[key] = img;
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to load ${path}`);
        resolve();
      };
      img.src = path;
    });
  });

  await Promise.all(promises);
}

// Filter affirmations by area
function filterAffirmations() {
  state.filtered = state.data.filter(aff => 
    aff.tags.includes(state.area) || (state.area === 'general' && aff.tags.includes('general'))
  );
  
  if (state.filtered.length === 0) {
    state.filtered = state.data.filter(aff => aff.tags.includes('general'));
  }
}

// Pick random affirmation (avoid immediate repeats)
function pickRandom() {
  if (state.filtered.length === 0) return;

  let attempts = 0;
  let picked;
  
  do {
    picked = state.filtered[Math.floor(Math.random() * state.filtered.length)];
    attempts++;
  } while (picked.id === state.lastId && state.filtered.length > 1 && attempts < 10);

  state.current = picked;
  state.lastId = picked.id;
  displayAffirmation();
  updateURL();
}

// Display current affirmation
function displayAffirmation() {
  if (!state.current) return;
  
  elements.affirmationText.textContent = state.current.text;
  elements.affirmationId.textContent = `#${state.current.id}`;
}

// Apply theme
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  state.theme = theme;
}

// Handle theme change
function handleThemeChange(e) {
  applyTheme(e.target.value);
  updateURL();
}

// Handle area change
function handleAreaChange(e) {
  state.area = e.target.value;
  filterAffirmations();
  pickRandom();
  updateURL();
}

// Update URL query params
function updateURL() {
  const url = new URL(window.location);
  url.searchParams.set('area', state.area);
  url.searchParams.set('theme', state.theme);
  window.history.replaceState({}, '', url);
}

// Generate caption format
function getCaption() {
  if (!state.current) return '';
  
  return `${state.current.text}\nfrom Marketer Affirmations\nmarketeraffirmations.com/a/${state.current.id}`;
}

// Copy caption to clipboard
async function copyCaption() {
  const caption = getCaption();
  
  try {
    await navigator.clipboard.writeText(caption);
    showStatus('Caption copied to clipboard');
  } catch (error) {
    console.error('Failed to copy:', error);
    showStatus('Failed to copy caption');
  }
}

// Draw text with word wrapping and auto-fit
function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 6) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Limit to max lines
  const displayLines = lines.slice(0, maxLines);
  
  // Calculate starting Y to center vertically
  const totalHeight = displayLines.length * lineHeight;
  let currentY = y - (totalHeight / 2);

  // Draw each line
  displayLines.forEach(line => {
    ctx.fillText(line, x, currentY);
    currentY += lineHeight;
  });
}

// Auto-fit font size for text
function autoFitFontSize(ctx, text, maxWidth, maxHeight, fontFamily) {
  let fontSize = 80;
  const minSize = 30;
  const maxSize = 90;
  
  // Binary search for optimal font size
  let low = minSize;
  let high = maxSize;
  let bestSize = minSize;

  while (low <= high) {
    fontSize = Math.floor((low + high) / 2);
    ctx.font = `${fontSize}px ${fontFamily}`;
    
    const lineHeight = fontSize * 1.4;
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);

    const totalHeight = lines.length * lineHeight;
    
    if (lines.length <= 6 && totalHeight <= maxHeight) {
      bestSize = fontSize;
      low = fontSize + 1;
    } else {
      high = fontSize - 1;
    }
  }

  return bestSize;
}

// Download PNG
async function downloadPNG() {
  if (!state.current) return;

  const canvas = elements.exportCanvas;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw background
  const bgImage = state.theme === 'A' && state.assets.bgGold 
    ? state.assets.bgGold 
    : state.assets.bgMain;
  
  if (bgImage) {
    ctx.drawImage(bgImage, 0, 0, width, height);
  } else {
    // Fallback gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#5a1025');
    gradient.addColorStop(1, '#3c0a18');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  // Apply grain texture
  if (state.assets.grain) {
    ctx.globalAlpha = 0.15;
    ctx.globalCompositeOperation = 'multiply';
    const pattern = ctx.createPattern(state.assets.grain, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  // Theme-specific overlays
  if (state.theme === 'A' && state.assets.florals) {
    ctx.globalAlpha = 0.4;
    ctx.drawImage(state.assets.florals, 0, 0, width, height);
    ctx.globalAlpha = 1;
  }

  if (state.theme === 'B') {
    if (state.assets.tape) {
      ctx.globalAlpha = 0.9;
      ctx.drawImage(state.assets.tape, 0, 0, width, 120);
      ctx.globalAlpha = 1;
    }
    
    if (state.assets.stamp) {
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.translate(900, 180);
      ctx.rotate(-12 * Math.PI / 180);
      ctx.drawImage(state.assets.stamp, -75, -75, 150, 150);
      ctx.restore();
      ctx.globalAlpha = 1;
    }
  }

  if (state.theme === 'C') {
    // Glass card background
    ctx.fillStyle = 'rgba(250, 248, 245, 0.15)';
    ctx.fillRect(140, 300, 800, 400);
    
    // Vignette
    const vignette = ctx.createRadialGradient(540, 540, 200, 540, 540, 800);
    vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }

  // Draw text
  const fontFamily = "'Playfair Display', 'Cormorant', Georgia, serif";
  const text = state.current.text;
  const maxWidth = 800;
  const maxHeight = 400;
  
  const fontSize = autoFitFontSize(ctx, text, maxWidth, maxHeight, fontFamily);
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Text color based on theme
  if (state.theme === 'C') {
    ctx.fillStyle = '#faf8f5';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  } else {
    ctx.fillStyle = '#3c0a18';
    ctx.shadowColor = 'transparent';
  }

  drawWrappedText(ctx, text, width / 2, height / 2, maxWidth, fontSize * 1.4);
  
  ctx.shadowColor = 'transparent';

  // Draw footer
  ctx.font = '18px "Inter", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillStyle = state.theme === 'C' ? '#dcbe78' : '#b98b2e';
  ctx.fillText('marketeraffirmations.com', width - 60, height - 60);

  // Trigger download
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `affirmation-${state.current.id}.png`;
    link.click();
    URL.revokeObjectURL(url);
    showStatus('PNG downloaded');
  }, 'image/png');
}

// Share affirmation
async function shareAffirmation() {
  if (!state.current) return;

  // Try Web Share API with image
  if (navigator.share && navigator.canShare) {
    try {
      // Generate image blob
      const canvas = elements.exportCanvas;
      await drawCanvasForShare();
      
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `affirmation-${state.current.id}.png`, { type: 'image/png' });
        const shareData = {
          title: 'Marketer Affirmations',
          text: state.current.text,
          files: [file]
        };

        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
            showStatus('Shared image');
          } catch (error) {
            if (error.name !== 'AbortError') {
              console.error('Share failed:', error);
              await fallbackCopyCaption();
            }
          }
        } else {
          await fallbackCopyCaption();
        }
      }, 'image/png');
    } catch (error) {
      console.error('Share failed:', error);
      await fallbackCopyCaption();
    }
  } else {
    await fallbackCopyCaption();
  }
}

// Helper to draw canvas for sharing (reuses download logic)
async function drawCanvasForShare() {
  // Just trigger the same drawing as download
  await downloadPNG();
}

// Fallback: copy caption
async function fallbackCopyCaption() {
  const caption = getCaption();
  
  try {
    await navigator.clipboard.writeText(caption);
    showStatus('Caption copied to clipboard');
  } catch (error) {
    console.error('Failed to copy:', error);
    showStatus('Failed to share');
  }
}

// Show status message
function showStatus(message, duration = 3000) {
  elements.statusMessage.textContent = message;
  
  if (duration > 0) {
    setTimeout(() => {
      elements.statusMessage.textContent = '';
    }, duration);
  }
}

// Start app
init();
