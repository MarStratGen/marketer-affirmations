# Marketer Affirmations

A visual test sandbox for satirical marketer affirmations with three switchable themes and PNG export functionality.

## What This Is

A static, single-page web app that displays random satirical affirmations for marketers. Features include:

- Random affirmation display with area filtering
- Three visual themes: Ornate, Ribbon, and Glass
- 1080×1080 PNG export with floral burgundy garden aesthetic
- Share functionality (Web Share API with clipboard fallback)
- ~60 seeded affirmations across 10 marketing areas

## How to Run

### In Replit Preview

The site is configured to run automatically. Simply:

1. Click the "Run" button or open the webview
2. The site will be served on port 5000
3. Access it through the Replit preview window

### Locally

If running outside Replit:

```bash
# Using Python
python -m http.server 5000

# Using Node.js (if you have http-server installed)
npx http-server -p 5000

# Using PHP
php -S localhost:5000
```

Then open `http://localhost:5000` in your browser.

## Features

### Marketing Areas

Filter affirmations by area using the dropdown:
- General
- Social
- Brand
- Performance
- SEO
- Email
- Content
- Product
- Events
- Growth

### Themes

Switch between three visual themes:

**Theme A: Ornate**
- Floral corner decorations
- Gold-tinted background
- Paper grain texture overlay
- Elegant, maximalist design

**Theme B: Ribbon**
- Decorative tape/ribbon header
- Stamp mark accent
- Clean burgundy borders

**Theme C: Glass**
- Frosted glass card effect
- Backdrop blur
- Vignette overlay
- Modern, translucent aesthetic

### Actions

- **New Affirmation**: Get a random affirmation (avoids immediate repeats)
- **Copy Caption**: Copy formatted text with attribution
- **Download PNG**: Export 1080×1080 image with current theme styling
- **Share**: Use Web Share API (mobile) or copy to clipboard (desktop)

## Customization

### Replace Floral Assets

To use your own background images and decorative elements:

1. Replace files in `public/graphics/`:
   - `bg-main.jpg` - Main burgundy background (1080×1080)
   - `bg-gold.jpg` - Gold variant for Theme A (1080×1080)
   - `florals-corners.png` - Corner decorations for Theme A (1080×1080, transparent PNG)
   - `tape.png` - Ribbon/tape graphic for Theme B (1080×120, transparent PNG)
   - `stamp-ma.png` - Stamp mark for Theme B (200×200, transparent PNG)
   - `grain.png` - Paper texture overlay (512×512)

2. Keep the same dimensions for best results
3. Use transparent PNGs for overlays (florals, tape, stamp)

### Add More Affirmations

Edit `data/affirmations.json`:

```json
{
  "id": "A061",
  "tags": ["content"],
  "text": "Your satirical affirmation here."
}
```

- Use unique IDs (format: A###)
- Include at least one tag from the available areas
- Keep text under ~240 characters for best display
- Maintain the dry, satirical tone

### Tweak Typography

The site uses a font stack with fallbacks:

**Headings**: `'Playfair Display', 'Cormorant', Georgia, serif`
**Body**: `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`

To use Google Fonts (optional):
1. Uncomment the Google Fonts `<link>` tags in `index.html`
2. Or download fonts and self-host them in a `/fonts` directory

To change fonts:
1. Edit the `font-family` properties in `styles.css`
2. Update the `fontFamily` variable in `app.js` (line for canvas export)

### PNG Export Customization

The canvas export settings are in `app.js`:

- Font size auto-fits between 30px-90px (adjust in `autoFitFontSize()`)
- Max text width: 800px (adjust `maxWidth` in `downloadPNG()`)
- Max 6 lines of text (adjust `maxLines` in `drawWrappedText()`)
- Footer position: 60px from bottom-right

## Technical Notes

- **No build tools**: Pure HTML/CSS/JS
- **No backend**: Static files only
- **Worker logging**: Stubbed out (`WORKER_BASE = ""`)
- **Permalink pages**: Not included in this visual test
- **Browser compatibility**: Modern browsers with Canvas API and optional Web Share API

## File Structure

```
.
├── index.html              # Main page
├── styles.css              # All theme styles
├── app.js                  # Application logic
├── data/
│   └── affirmations.json   # Affirmation data
├── public/
│   └── graphics/           # Images and decorative assets
└── README.md               # This file
```

## Credits

Built as a visual test for Marketer Affirmations - a satirical affirmation generator for marketing professionals.
