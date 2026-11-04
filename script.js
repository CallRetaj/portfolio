const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeToggle.querySelector('.theme-icon').textContent = isLight ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
});

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
  menuToggle.textContent = nav.classList.contains('open') ? '×' : '☰';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.textContent = '☰';
  });
});

// Reveal sections gently as they enter the viewport.
const revealTargets = document.querySelectorAll('.section-heading, .skill-card, .project-card, .timeline-item, .certificate');
revealTargets.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealTargets.forEach(el => observer.observe(el));


// Independent image carousel for each project.
document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const slides = [...gallery.querySelectorAll('.gallery-slide')];
  const dotsWrap = gallery.querySelector('.gallery-dots');
  const prev = gallery.querySelector('.gallery-prev');
  const next = gallery.querySelector('.gallery-next');
  let current = 0;
  let available = slides.filter(slide => {
    const img = slide.querySelector('img');
    if (!img) return false;
    img.addEventListener('load', () => gallery.classList.add('has-images'));
    img.addEventListener('error', () => {
      slide.classList.add('image-missing');
      img.style.display = 'none';
    });
    return true;
  });
  const dots = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-dot' + (index === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Show image ${index + 1}`);
    dot.addEventListener('click', () => show(index));
    dotsWrap.appendChild(dot);
    return dot;
  });
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  }
  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  // Hide navigation when the project has only one image slot in a future edit.
  if (slides.length < 2) { prev.hidden = true; next.hidden = true; dotsWrap.hidden = true; }
  // Check already-cached images.
  slides.forEach(slide => {
    const img = slide.querySelector('img');
    if (img && img.complete && img.naturalWidth > 0) gallery.classList.add('has-images');
  });
});
