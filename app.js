// Configuration
const SLIDES_DIR = 'slides';

// Slide files in presentation order
const SLIDE_FILES = [
  '01-title.html',
  '02-overview.html',
  '03-background-nwp.html',
  '04-paradigm-shift.html',
  '05-background-xai.html',
  '06-background-transformer.html',
  '07-challenge-swin.html',
  '08-research-objectives.html',
  '09-approach-attention.html',
  '10-experimental-design.html',
  '11-algorithm-reverse-rollout.html',
  '12-viz-contribution-maps.html',
  '13-viz-wind-rose.html',
  '14-result-synoptic-scale.html',
  '15-result-zonal-anisotropy.html',
  '16-observation-symmetric.html',
  '17-observation-latitudinal.html',
  '18-expert-evaluation.html',
  '19-synthesis.html',
  '20-limitations.html',
  '21-future-work.html',
  '22-contributions.html',
  '23-conclusions.html',
  '24-appendix-statistics.html'
];

const TOTAL_SLIDES = SLIDE_FILES.length;

// State
let currentSlide = 0;
let slidesLoaded = false;

// Update the total slides counter
document.getElementById('total-slides').textContent = TOTAL_SLIDES;

// Load all slides into the container
async function loadSlides() {
  const container = document.getElementById('slide-container');

  try {
    // Load all slides by filename
    const loadPromises = SLIDE_FILES.map(filename =>
      fetch(`${SLIDES_DIR}/${filename}`)
        .then(response => response.text())
    );

    const slideContents = await Promise.all(loadPromises);

    // Insert all slides into the container
    slideContents.forEach((content, index) => {
      container.insertAdjacentHTML('beforeend', content);
    });

    slidesLoaded = true;

    // Initialize the presentation
    initializePresentation();
  } catch (error) {
    console.error('Error loading slides:', error);
    container.innerHTML = '<div class="slide bg-surface active"><div class="content-zone center"><h1>Error loading presentation</h1><p>Please refresh the page.</p></div></div>';
  }
}

// Initialize the presentation after slides are loaded
function initializePresentation() {
  const slides = document.querySelectorAll('.slide');

  // Load slide from URL hash
  const hash = window.location.hash;
  if (hash && hash.startsWith('#slide-')) {
    const slideNum = parseInt(hash.replace('#slide-', '')) - 1;
    if (slideNum >= 0 && slideNum < TOTAL_SLIDES) {
      currentSlide = slideNum;
    }
  }

  // Show the initial slide
  showSlide(currentSlide);

  // Show help briefly on load
  setTimeout(() => {
    document.getElementById('help').classList.add('visible');
    setTimeout(() => {
      document.getElementById('help').classList.remove('visible');
    }, 3000);
  }, 500);
}

// Show a specific slide
function showSlide(index) {
  if (!slidesLoaded) return;

  const slides = document.querySelectorAll('.slide');

  if (index < 0) index = 0;
  if (index >= TOTAL_SLIDES) index = TOTAL_SLIDES - 1;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  currentSlide = index;
  document.getElementById('current-slide').textContent = currentSlide + 1;

  // Update URL hash
  history.replaceState(null, null, `#slide-${currentSlide + 1}`);
}

// Navigation functions
function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    document.body.classList.add('fullscreen');
  } else {
    document.exitFullscreen();
    document.body.classList.remove('fullscreen');
  }
}

function toggleHelp() {
  document.getElementById('help').classList.toggle('visible');
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  switch(e.key) {
    case 'ArrowRight':
    case ' ':
      e.preventDefault();
      nextSlide();
      break;
    case 'ArrowLeft':
      prevSlide();
      break;
    case 'f':
    case 'F':
      toggleFullscreen();
      break;
    case 'h':
    case 'H':
      toggleHelp();
      break;
    case 'Home':
      showSlide(0);
      break;
    case 'End':
      showSlide(TOTAL_SLIDES - 1);
      break;
    case 'Escape':
      document.getElementById('help').classList.remove('visible');
      break;
  }
});

// Click navigation
document.getElementById('slide-container').addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  if (x > rect.width / 2) {
    nextSlide();
  } else {
    prevSlide();
  }
});

// Handle fullscreen changes
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    document.body.classList.remove('fullscreen');
  }
});

// Load slides when the page loads
loadSlides();
