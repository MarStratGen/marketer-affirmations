# Marketer Affirmations

## Overview

A satirical single-page web application that displays random marketing affirmations with Awwwards-level visual design and export capabilities. The project is a static, no-build HTML/CSS/JavaScript application featuring 70 seeded affirmations across 10 marketing categories (alphabetically sorted with General first), single premium theme with full-bleed Fall-Pattern-02 botanical wallpaper, luxury typography, and PNG export functionality for social sharing.

**Recent Major Update (Sept 2025)**: Complete visual redesign to achieve Awwwards nominee-level quality with improved hierarchy, toned-down floral backgrounds, enhanced card legibility, refined spacing, premium button interactions, and subtle parallax scroll effects. Micro label "For Motivational Use Only" replaces redundant branding. Tagline updated to "Unvarnished truths, elegantly phrased as affirmations."

**Latest Refinement (Sept 30, 2025)**: Comprehensive spacing and visual tension improvements delivering "refined but passive-aggressive" aesthetic. Hero section tightened with consistent rhythm, card positioned higher, florals now frame the card from corners through lighter vignettes, warm-toned multi-layer shadows for depth, micro label right-aligned as stamp, and smooth quote transitions with fade/slide animations.

**Major Redesign (Sept 30, 2025 - Final)**: Complete transformation to brighter, floral-forward aesthetic with visible botanical elements framing the card. Replaced micro label with centered area-aware kicker text, added FAQ section with structured data, footer with Buy Me a Coffee, enhanced canvas export to match live design, and comprehensive accessibility improvements with proper focus rings and contrast ratios.

**Floral Masking Refinement (Sept 30, 2025)**: Critical fix to eliminate petal overlap with card content. Implemented proper radial masking with 700-800px diameter clear center zones (350px/380px transparent cores with 200px/220px feathered transitions). Enhanced floral brightness/saturation (1.22-1.28 brightness, 1.18-1.24 saturation) for luxurious dark wallpaper aesthetic. Replaced radial background gradient with cleaner linear vertical gradient. Added 120px top spacing and gradient divider to FAQ section for improved visual separation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Single-Page Application (SPA) Pattern**
- Pure vanilla JavaScript implementation with no frameworks or build tools
- State management handled through a single global `state` object tracking affirmations data, current selection, selected area/theme, and cached assets
- DOM element references cached in `elements` object for performance
- Event-driven architecture with async/await for data loading

**Component Structure**
- **index.html**: Single HTML file with semantic markup and theme-switching attributes via `data-theme`
- **styles.css**: CSS custom properties (variables) for theme management with burgundy garden color palette
- **app.js**: Application logic handling state, DOM manipulation, filtering, theme switching, and canvas-based export

### Visual Design System

**Single Premium Theme (Brighter Floral)**
- Clean vertical gradient background: linear-gradient(180deg, #24282c → #1b1f23 → #181b1e)
- Dual-layer floral system with proper clear center zones:
  - .stage::before: bg-main.png at 68% opacity, brightness(1.28) contrast(1.12) saturate(1.24), 700px diameter clear center (350px transparent → 550px full opacity)
  - .stage::after: florals-corners.png at 72% opacity, brightness(1.22) contrast(1.08) saturate(1.18), 760px diameter clear center (380px transparent → 600px full opacity)
- Florals frame the card from edges with zero overlap in 700-800px protected center zone
- Enhanced brightness and saturation for luxurious dark floral wallpaper aesthetic
- Card: linear-gradient(135deg, #fdfcfb → #f7f4ef), 1px border rgba(0,0,0,0.08), 22px border-radius
- Warm layered shadows: rgba(0,0,0,0.25) 60px/120px blur, rgba(0,0,0,0.15) 20px/40px blur
- Smooth quote transitions: fade out/up (200ms) → change text → fade in/down (10ms delay)

**Visual Hierarchy**
- **Title**: Dominant Playfair Display at clamp(48px, 6.58vw, 90px) - reduced 6% from previous size
- **Tagline**: Delicate Playfair italic at 18px - "Unvarnished truths, elegantly phrased as affirmations."
- Title-to-tagline spacing: 20px for cohesive pairing
- Tagline-to-controls spacing: 18px for tight hero rhythm
- Controls-to-card spacing: 52px for breathing room
- **Kicker Label**: Centered, area-aware text (e.g., "A Strategically Aligned Statement" for General), 12px uppercase, 0.16em letter-spacing, rgba(0,0,0,0.48), margin 8px/0/14px
- **Quote**: Bold serif at clamp(32px, 4vw, 48px), line-height 1.22, letter-spacing 0.15px, color #141516
- Under-rule: 1px solid rgba(185,139,46,0.18), margin 22px/0/16px
- **Buttons**: pill-shaped (999px radius), 13px font, 9px×14px padding, 13px gap, hover translateY(-1px)

**Floral Implementation**
- Body: Clean vertical linear gradient (#24282c → #1b1f23 → #181b1e)
- `.stage::before`: bg-main.png with enhanced filters (brightness 1.28, contrast 1.12, saturate 1.24) at 68% opacity, radial mask creating 700px clear center
- `.stage::after`: florals-corners.png with filters (brightness 1.22, contrast 1.08, saturate 1.18) at 72% opacity, radial mask creating 760px clear center
- Layered approach: clean gradient → masked background florals → masked corner florals → card
- Mobile: Scaled-down masks (360-400px clear zones) maintaining proportional protection

**Design Rationale**: Enhanced floral aesthetic showcases luxurious dark botanical artwork with proper protection zones. Radial masks create 700-800px clear center areas ensuring zero petal overlap with card content while maintaining rich, saturated framing from edges. Linear vertical gradient provides cleaner backdrop separation versus previous radial approach. Area-aware kicker text adds contextual wit while maintaining centered hierarchy. FAQ section with 120px top spacing and gradient divider provides breathing room. Enhanced brightness/saturation filters (1.22-1.28) achieve lush wallpaper quality without washing out detail. Card padding optimized for desktop (32/36/44px) and mobile (22/18/26px) ensures comfortable reading across devices.

### Data Management

**JSON-Based Content Storage**
- Affirmations stored in `data/affirmations.json` as array of objects
- Each affirmation contains: unique ID, tags array (for area filtering), and text content
- Approximately 60 pre-seeded affirmations covering 10 marketing areas (general, social, brand, performance, growth, SEO, email, content, product, events)

**Filtering Logic**
- Client-side filtering by marketing area using tag-based matching
- State maintains both full dataset and filtered subset for performance
- Random selection from filtered results to avoid repetition

### Export System

**Canvas-Based PNG Generation**
- HTML5 Canvas API used for 1080×1080px image rendering
- Export includes: floral burgundy garden background, centered affirmation text with auto-wrap/auto-fit, small footer watermark "marketeraffirmations.com"
- Canvas hidden from UI (`#exportCanvas`) and only used for programmatic rendering

**Share Functionality**
- Primary: Web Share API for native mobile/desktop sharing
- Fallback: Clipboard API for copy-to-clipboard when Web Share unavailable
- PNG download as tertiary option via canvas `toBlob()` method

**Rationale**: Canvas export allows pixel-perfect control over social media image format without server-side rendering

### Asset Management

**Static Asset Structure**
- `public/graphics/` directory contains visual assets:
  - Background images (bg-main.jpg, bg-gold.jpg)
  - Decorative elements (florals-corners.png, tape.png, stamp-ma.png)
  - Texture overlays (grain.png)
- Placeholder generation strategy: If real images unavailable, programmatic/base64 placeholders created at runtime

### Server Configuration

**Static File Serving**
- Designed for simple HTTP server (no build process required)
- Default port: 5000 (configured for Replit preview environment)
- Compatible with Python's http.server, Node.js http-server, or PHP's built-in server
- No server-side logic required - fully client-side application

## External Dependencies

### Third-Party Services

**Google Fonts**
- Fonts: Playfair Display, Cormorant, Inter
- Loaded via Google Fonts CDN with preconnect optimization
- Used for luxury typography hierarchy (Playfair/Cormorant for display, Inter for UI)

### Browser APIs

**Web Share API**
- Used for native share functionality on supported platforms
- Gracefully degrades to clipboard fallback

**Clipboard API**
- Fallback for sharing when Web Share unavailable
- Requires secure context (HTTPS or localhost)

**Canvas API**
- Core dependency for PNG export feature
- Used for dynamic image generation with text rendering

### Development Tools

**No Build Dependencies**
- Zero npm packages or bundlers
- No transpilation or compilation steps
- Pure ES6+ JavaScript (async/await, fetch API)

**Hosting Requirements**
- Static file server capability only
- No database or backend processing
- No environment variables or configuration files required