# Marketer Affirmations

## Overview

A satirical single-page web application that displays random marketing affirmations with Awwwards-level visual design and export capabilities. The project is a static, no-build HTML/CSS/JavaScript application featuring 70 seeded affirmations across 10 marketing categories (alphabetically sorted with General first), single premium theme with full-bleed Fall-Pattern-02 botanical wallpaper, luxury typography, and PNG export functionality for social sharing.

**Recent Major Update (Sept 2025)**: Complete visual redesign to achieve Awwwards nominee-level quality with improved hierarchy, toned-down floral backgrounds, enhanced card legibility, refined spacing, premium button interactions, and subtle parallax scroll effects. Micro label "For Motivational Use Only" replaces redundant branding. Tagline updated to "Unvarnished truths, elegantly phrased as affirmations."

**Latest Refinement (Sept 30, 2025)**: Comprehensive spacing and visual tension improvements delivering "refined but passive-aggressive" aesthetic. Hero section tightened with consistent rhythm, card positioned higher, florals now frame the card from corners through lighter vignettes, warm-toned multi-layer shadows for depth, micro label right-aligned as stamp, and smooth quote transitions with fade/slide animations.

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

**Single Premium Theme (Deep Forest Ornate)**
- Full-bleed Fall-Pattern-02.png botanical wallpaper at 25% opacity with 1px blur
- Dual-layer vignette system for floral framing:
  - Body vignette (ellipse 65% 55% at 50% 42%): rgba(0,0,0,0.15) → rgba(0,0,0,0.65) → rgba(0,0,0,0.85)
  - Stage spotlight (ellipse 60% 55% at 50% 48%): transparent → rgba(0,0,0,0.08) → rgba(0,0,0,0.22)
- Florals interact with card from corners, creating frame effect rather than wallpaper
- Forest green palette with gold accents for highlights and interactions
- Glass-morphic card with 97% white opacity and 12px backdrop blur
- Warm-toned brown shadows (rgba 26,20,16) in three layers: 8px, 24px, 64px
- Subtle parallax scroll effect on background (15% movement rate, respects prefers-reduced-motion)
- Smooth quote transitions: fade out/up (200ms) → change text → fade in/down (10ms delay)

**Visual Hierarchy**
- **Title**: Dominant Playfair Display at clamp(52px, 7vw, 96px) with enhanced shadow
- **Tagline**: Delicate Playfair italic at 18px - "Unvarnished truths, elegantly phrased as affirmations."
- Title-to-tagline spacing: var(--space-xs) [8px] for tight unit feel
- Tagline-to-controls spacing: var(--space-md) [24px] for cohesive hero stack
- **Micro Label**: "For Motivational Use Only" in 11px uppercase, right-aligned with `align-self: flex-end` for stamp effect, 0.12em letter-spacing, rgba(26,58,46,0.4)
- **Quote**: Bold serif at clamp(32px, 4vw, 48px) with tighter padding for improved card rhythm
- Quote-to-buttons spacing: var(--space-sm) [16px] with 12px gap between buttons

**Wallpaper Implementation**
- `body::before` for fixed-position background image with parallax transform
- `body::after` for atmospheric vignette/depth overlay
- Layered approach: blurred wallpaper → vignette → content → high-opacity glass card

**Design Rationale**: Single-theme focus allows refined polish and cohesive aesthetic without complexity of theme switching. Lighter dual-layer vignettes let florals frame the card from corners while maintaining focus on content. Warm brown shadows anchor the card with depth. Tightened vertical rhythm throughout hero section creates "refined but passive-aggressive" tension—aesthetic inspired by "vintage etiquette guide × luxury candle box × brand strategist's inner monologue." High-opacity card ensures excellent text legibility while maintaining visual richness.

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