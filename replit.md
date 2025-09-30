# Marketer Affirmations

## Overview

A satirical single-page web application that displays random marketing affirmations with visual theming and export capabilities. The project is a static, no-build HTML/CSS/JavaScript application designed as a visual test sandbox. It features approximately 60 seeded affirmations across 10 marketing categories, three switchable visual themes (Ornate, Ribbon, Glass), and PNG export functionality for social sharing.

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

### Visual Theme System

**Three-Theme Architecture**
- Theme A (Ornate): Floral corner overlays with paper grain texture and gold accents
- Theme B (Ribbon): Decorative ribbon bar with stamp logo accent elements  
- Theme C (Glass): Frosted glass card effect with soft vignette overlay
- Theme switching implemented via `data-theme` attribute on `<html>` element, triggering CSS custom property cascades

**Design Rationale**: Attribute-based theme switching avoids class toggling complexity and allows CSS to handle all visual transitions declaratively

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

**Google Fonts (Optional)**
- Fonts: Playfair Display, Cormorant, Inter
- Currently commented out in HTML with self-hosting option available
- Used for typography hierarchy (display, serif, sans-serif)

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