# Marketer Affirmations

## Overview

A satirical single-page web application that displays random marketing affirmations with Awwwards-level visual design and export capabilities. The project is a static, no-build HTML/CSS/JavaScript application featuring 70 seeded affirmations across 10 marketing categories (alphabetically sorted with General first), single premium theme with full-bleed Fall-Pattern-02 botanical wallpaper, luxury typography, and PNG export functionality for social sharing.

**Recent Major Update (Sept 2025)**: Complete visual redesign to achieve Awwwards nominee-level quality with improved hierarchy, toned-down floral backgrounds, enhanced card legibility, refined spacing, premium button interactions, and subtle parallax scroll effects. Micro label "For Motivational Use Only" replaces redundant branding. Tagline updated to "Unvarnished truths, elegantly phrased as affirmations."

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
- Enhanced radial vignette (ellipse 70% 50%) with gradient from rgba(0,0,0,0.3) to rgba(0,0,0,0.8)
- Forest green palette with gold accents for highlights and interactions
- Glass-morphic card with 97% white opacity and 12px backdrop blur
- Subtle parallax scroll effect on background (15% movement rate, respects prefers-reduced-motion)

**Visual Hierarchy**
- **Title**: Dominant Playfair Display at clamp(52px, 7vw, 96px) with enhanced shadow
- **Tagline**: Delicate Playfair italic at 18px - "Unvarnished truths, elegantly phrased as affirmations."
- **Micro Label**: "For Motivational Use Only" in 9px uppercase with subtle forest green
- **Quote**: Bold serif at clamp(32px, 4vw, 48px) with generous padding for legibility

**Wallpaper Implementation**
- `body::before` for fixed-position background image with parallax transform
- `body::after` for atmospheric vignette/depth overlay
- Layered approach: blurred wallpaper → vignette → content → high-opacity glass card

**Design Rationale**: Single-theme focus allows refined polish and cohesive aesthetic without complexity of theme switching. Toned-down florals, enhanced vignette, and high-opacity card ensure excellent text legibility while maintaining visual richness.

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