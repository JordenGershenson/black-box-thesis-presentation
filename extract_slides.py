#!/usr/bin/env python3
"""Extract slides from the monolithic HTML file into separate files."""

import re
from pathlib import Path

def extract_slides(html_file, output_dir):
    """Extract individual slides from HTML file."""
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all slide divs with their content
    # Pattern to match: <div class="slide ... id="slide-X"> ... </div>
    # We need to match the opening tag and find the corresponding closing tag

    lines = content.split('\n')
    slides = []
    current_slide = None
    slide_lines = []
    depth = 0

    for i, line in enumerate(lines):
        # Check if this line starts a slide
        if 'class="slide' in line and 'id="slide-' in line:
            # Extract slide number
            match = re.search(r'id="slide-(\d+)"', line)
            if match:
                current_slide = int(match.group(1))
                slide_lines = [line]
                depth = 1
                continue

        # If we're inside a slide, track the content
        if current_slide is not None:
            slide_lines.append(line)

            # Count divs to track nesting
            depth += line.count('<div')
            depth -= line.count('</div>')

            # If we've closed all divs, we've reached the end of the slide
            if depth == 0:
                slides.append((current_slide, '\n'.join(slide_lines)))
                current_slide = None
                slide_lines = []

    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)

    # Write each slide to a file
    for slide_num, slide_content in slides:
        output_file = output_path / f'slide-{slide_num:02d}.html'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(slide_content)
        print(f'Created {output_file}')

    print(f'\nExtracted {len(slides)} slides to {output_dir}/')
    return len(slides)

if __name__ == '__main__':
    html_file = 'thesis_defense_presentation (2).html'
    output_dir = 'slides'
    extract_slides(html_file, output_dir)
