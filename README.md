# Thesis Defense Presentation

Master's thesis defense presentation for "Opening the Black Box: Attention Analysis Reveals Learned Physics and Architectural Constraints in Transformer Weather Models"

## Project Structure

```
.
├── index.html              # Main presentation file (open this in browser)
├── styles.css              # All presentation styles
├── app.js                  # Presentation logic and slide loader
├── slides/                 # Individual slide HTML files
│   ├── slide-01.html
│   ├── slide-02.html
│   └── ... (26 slides total)
├── *.png                   # Presentation images
└── thesis_defense_presentation (2).html  # Original monolithic file (backup)
```

## How to Use

**IMPORTANT**: This presentation must be served via a local web server due to dynamic slide loading and image paths. Opening `index.html` directly in a browser will not work properly.

### Quick Start
```bash
# Start a local server (Python 3)
python -m http.server 8000

# Then open in browser
http://localhost:8000
```

### Editing
1. **Edit a slide**: Modify the corresponding file in the `slides/` directory (e.g., `slides/slide-05.html`)
2. **Edit styles**: Modify `styles.css`
3. **Add/remove slides**:
   - Add new slide HTML files to `slides/`
   - Update `TOTAL_SLIDES` constant in `app.js`
4. **Replace images**: Images are in the root directory (`.png` files). Slides 12-13 use embedded images.

## Keyboard Shortcuts

- `←` / `→` - Navigate between slides
- `Space` - Next slide
- `F` - Toggle fullscreen
- `H` - Toggle help overlay
- `Home` - Jump to first slide
- `End` - Jump to last slide
- `Esc` - Hide help overlay

## Editing Slides

Each slide is a self-contained HTML fragment with the structure:

```html
<div class="slide bg-surface" id="slide-X">
  <div class="title-zone">
    <h1>Slide Title</h1>
  </div>

  <div class="content-zone">
    <!-- Slide content here -->
  </div>

  <div class="footnote-zone">
    <p>Optional footnote text</p>
  </div>
</div>
```

Available utility classes are defined in `styles.css`.

### Embedding Images

Images are referenced from slides using relative paths. Since slides are in the `slides/` subdirectory, use `../` to reference images in the root:

```html
<img src="../image-name.png" alt="Description" style="width: 100%;">
```

Currently embedded images:
- **Slide 12**: `global_contribution_Map.png` - Global contribution maps visualization
- **Slide 13**: `rosegrid_ringnormalized.png` and `rosegrid_global.png` - Wind-rose diagrams

## Git History

- Initial commit: Original monolithic HTML file
- Refactor commit: Modular structure with separate CSS and slide files

To revert to the original version:
```bash
git checkout HEAD~1
```

## Development

The presentation uses vanilla JavaScript to dynamically load slides. A local web server is recommended for development to avoid CORS issues:

```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000
```
