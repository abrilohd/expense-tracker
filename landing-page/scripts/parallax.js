/**
 * Parallax Scroll Effects
 * Handles smooth parallax scrolling using requestAnimationFrame
 */

let parallaxElements = [];
let ticking = false;
let isEnabled = true;

const isMobile = window.innerWidth <= 768;

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion && !isMobile) {
    initParallax();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
  }
});

function initParallax() {
  const elements = document.querySelectorAll('[data-parallax]');
  
  parallaxElements = Array.from(elements).map(element => {
    const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
    return {
      element,
      speed,
      initialOffset: element.offsetTop
    };
  });
}

function onScroll() {
  if (!isEnabled || !ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      updateParallax();
      ticking = false;
    });
  }
}

function updateParallax() {
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  
  parallaxElements.forEach(({ element, speed }) => {
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + scrollY;
    const elementHeight = element.offsetHeight;
    
    if (scrollY + windowHeight > elementTop - windowHeight && 
        scrollY < elementTop + elementHeight + windowHeight) {
      
      const offset = (scrollY - elementTop + windowHeight) * speed;
      element.style.transform = `translateY(${offset}px)`;
    }
  });
}

function onResize() {
  const newIsMobile = window.innerWidth <= 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (newIsMobile) {
    isEnabled = false;
    parallaxElements.forEach(({ element }) => {
      element.style.transform = 'none';
    });
  } else if (!prefersReducedMotion) {
    isEnabled = true;
  }
  
  if (!ticking && isEnabled) {
    ticking = true;
    requestAnimationFrame(() => {
      initParallax();
      updateParallax();
      ticking = false;
    });
  }
}

window.addEventListener('beforeunload', () => {
  isEnabled = false;
  parallaxElements = [];
});
