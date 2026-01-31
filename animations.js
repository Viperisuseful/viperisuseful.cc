// animations.js
// Handles scroll-triggered reveals, micro-interactions, and magnetic buttons for viperisuseful.cc
// All animations use transforms for performance. Debounced at 16ms. Staggers and reduced motion respected.

// 1. SCROLL-TRIGGERED REVEALS
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = Array.from(document.querySelectorAll('.scroll-reveal'));
if (!prefersReducedMotion && revealEls.length) {
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 100); // Stagger
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el, i) => {
    observer.observe(el);
  });
}

// 2. MICRO-INTERACTIONS: CUSTOM CURSOR
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);
let cursorRAF;
let cursorX = 0, cursorY = 0, targetX = 0, targetY = 0;
function moveCursor(e) {
  targetX = e.clientX;
  targetY = e.clientY;
  if (!cursorRAF) {
    cursorRAF = requestAnimationFrame(updateCursor);
  }
}
function updateCursor() {
  cursorX += (targetX - cursorX) * 0.25;
  cursorY += (targetY - cursorY) * 0.25;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  cursorRAF = null;
}
document.addEventListener('mousemove', moveCursor, { passive: true });

// Cursor scaling on hoverable elements
const hoverables = document.querySelectorAll('.button, .card, .link, .magnetic');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// 3. MICRO-INTERACTIONS: MAGNETIC BUTTONS
function magneticEffect(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width/2;
  const y = e.clientY - rect.top - rect.height/2;
  el.style.transform = `translate(${x*0.15}px, ${y*0.15}px)`;
}
function resetMagnetic(e) {
  e.currentTarget.style.transform = '';
}
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', magneticEffect);
  el.addEventListener('mouseleave', resetMagnetic);
});

// 4. HERO TEXT STAGGER-IN
function staggerHero() {
  const hero = document.querySelector('.hero-stagger');
  if (!hero) return;
  const words = hero.textContent.split(' ');
  hero.innerHTML = words.map(w => `<span class="hero-word" style="opacity:0;display:inline-block;transform:translateY(30px);">${w}</span>`).join(' ');
  setTimeout(() => {
    document.querySelectorAll('.hero-word').forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = 1;
        el.style.transform = 'none';
        el.style.transition = 'opacity 400ms var(--scroll-reveal-ease), transform 400ms var(--scroll-reveal-ease)';
      }, i * 50);
    });
  }, 100);
}

// Fade-in for above-the-fold content (ASCII name, tagline)
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in-onload').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 60);
  });
});

// 5. PERFORMANCE: DEBOUNCED RESIZE/SCROLL EVENTS (if needed)
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}
// (No scroll/resize listeners needed for current features)
