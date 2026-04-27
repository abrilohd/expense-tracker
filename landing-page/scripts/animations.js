/**
 * Premium Animations
 * All animations use design tokens and respect prefers-reduced-motion
 */

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Easing function for stat counter (easeOutQuart)
const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

/**
 * Parallax Scroll Effects
 */
let parallaxElements = [];
let parallaxTicking = false;
let parallaxEnabled = true;
const isMobile = window.innerWidth <= 768;

function initParallax() {
  if (prefersReducedMotion || isMobile) return;
  
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

function onParallaxScroll() {
  if (!parallaxEnabled || !parallaxTicking) {
    parallaxTicking = true;
    requestAnimationFrame(() => {
      updateParallax();
      parallaxTicking = false;
    });
  }
}

/**
 * 1. Hero Headline Animation
 * Each word slides up from 24px below with opacity 0 → 1
 * Stagger: 80ms per word
 */
function animateHeroHeadline() {
  if (prefersReducedMotion) return;

  const headline = document.querySelector('.hero__headline');
  if (!headline) return;

  // Split text into words
  const text = headline.textContent;
  const words = text.split(/(\s+|<br>)/);
  
  // Clear and rebuild with spans
  headline.innerHTML = '';
  
  words.forEach((word, index) => {
    if (word.trim() === '') {
      headline.appendChild(document.createTextNode(word));
    } else {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(24px)';
      span.style.transition = `opacity 500ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.22, 1, 0.36, 1)`;
      span.style.transitionDelay = `${index * 50}ms`;
      headline.appendChild(span);
    }
  });

  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      headline.querySelectorAll('span').forEach(span => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0)';
      });
    });
  });
}

/**
 * 2. Feature Cards Animation
 * Cards slide in from 32px below with opacity 0 → 1
 * Stagger: 120ms per card
 */
function animateFeatureCards() {
  if (prefersReducedMotion) {
    // Show cards immediately
    document.querySelectorAll('.feature-card').forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
    return;
  }

  const cards = document.querySelectorAll('.feature-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const index = Array.from(cards).indexOf(card);
        
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 120);
        
        observer.unobserve(card);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(32px)';
    card.style.transition = 'opacity 400ms cubic-bezier(0.22, 1, 0.36, 1), transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';
    observer.observe(card);
  });
}

/**
 * 3. Stat Numbers Counter Animation
 * Numbers count up from 0 with easeOutQuart
 * Duration: 1400ms
 */
function animateStatCounters() {
  if (prefersReducedMotion) {
    // Show final values immediately
    document.querySelectorAll('.stat-card__number').forEach(element => {
      const target = parseFloat(element.getAttribute('data-count-to'));
      const prefix = element.getAttribute('data-prefix') || '';
      const suffix = element.getAttribute('data-suffix') || '';
      const decimals = parseInt(element.getAttribute('data-decimals')) || 0;
      element.textContent = prefix + target.toFixed(decimals) + suffix;
    });
    return;
  }

  const counters = document.querySelectorAll('.stat-card__number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = parseFloat(element.getAttribute('data-count-to'));
        const prefix = element.getAttribute('data-prefix') || '';
        const suffix = element.getAttribute('data-suffix') || '';
        const decimals = parseInt(element.getAttribute('data-decimals')) || 0;
        
        const duration = 1400;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutQuart(progress);
          const current = easedProgress * target;
          
          element.textContent = prefix + current.toFixed(decimals) + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            element.textContent = prefix + target.toFixed(decimals) + suffix;
          }
        }
        
        requestAnimationFrame(updateCounter);
        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => observer.observe(counter));
}

/**
 * 4. CTA Button Hover Animation
 * Scale(1.04) with intensified glow
 */
function enhanceCTAButton() {
  if (prefersReducedMotion) return;

  const ctaButtons = document.querySelectorAll('.cta__button, .btn--primary');
  
  ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.04) translateY(-2px)';
      this.style.boxShadow = '0 12px 48px rgba(0, 245, 196, 0.6), 0 0 0 2px rgba(0, 245, 196, 0.4)';
      this.style.transition = 'all 150ms cubic-bezier(0.22, 1, 0.36, 1)';
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
      this.style.transition = 'all 150ms cubic-bezier(0.22, 1, 0.36, 1)';
    });
  });
}

/**
 * 5. Navigation Scroll Animation
 * Background transitions from transparent to solid on scroll
 */
function animateNavOnScroll() {
  if (prefersReducedMotion) {
    // Apply solid background immediately
    const nav = document.querySelector('.nav');
    if (nav) {
      nav.style.background = 'var(--bg-secondary)';
      nav.style.borderBottom = '1px solid var(--border-subtle)';
    }
    return;
  }

  const nav = document.querySelector('.nav');
  if (!nav) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const heroHeight = hero.offsetHeight;

  function updateNav() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollY > heroHeight * 0.8) {
      nav.style.background = 'var(--bg-secondary)';
      nav.style.borderBottom = '1px solid var(--border-subtle)';
      nav.style.backdropFilter = 'blur(12px)';
    } else {
      nav.style.background = 'var(--bg-overlay)';
      nav.style.borderBottom = '1px solid var(--border-subtle)';
      nav.style.backdropFilter = 'blur(12px)';
    }
    
    nav.style.transition = 'background 400ms cubic-bezier(0.22, 1, 0.36, 1), border-bottom 400ms cubic-bezier(0.22, 1, 0.36, 1)';
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav(); // Initial check
}

/**
 * 6. Testimonial Cards Animation
 * Similar to feature cards but with different timing
 */
function animateTestimonials() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.testimonial-card').forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });
    return;
  }

  const cards = document.querySelectorAll('.testimonial-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const index = Array.from(cards).indexOf(card);
        
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 150);
        
        observer.unobserve(card);
      }
    });
  }, {
    threshold: 0.1
  });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(32px)';
    card.style.transition = 'opacity 400ms cubic-bezier(0.22, 1, 0.36, 1), transform 400ms cubic-bezier(0.22, 1, 0.36, 1)';
    observer.observe(card);
  });
}

/**
 * Initialize all animations
 */
document.addEventListener('DOMContentLoaded', () => {
  animateHeroHeadline();
  animateFeatureCards();
  animateStatCounters();
  enhanceCTAButton();
  animateNavOnScroll();
  animateTestimonials();
  
  // Initialize parallax
  if (!prefersReducedMotion && !isMobile) {
    initParallax();
    window.addEventListener('scroll', onParallaxScroll, { passive: true });
  }
});
