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

1. **View the presentation**: Open `index.html` in a web browser
2. **Edit a slide**: Modify the corresponding file in the `slides/` directory (e.g., `slides/slide-05.html`)
3. **Edit styles**: Modify `styles.css`
4. **Add/remove slides**:
   - Add new slide HTML files to `slides/`
   - Update `TOTAL_SLIDES` constant in `app.js`

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
