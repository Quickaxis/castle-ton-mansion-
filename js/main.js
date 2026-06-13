/* ============================================================
   THE CASTLETON MANSION — Main JavaScript
   ============================================================ */

'use strict';

// ── DOM READY ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initCarousels();
  initScrollAnimations();
  initNavHighlight();
  initImageFallbacks();
  initBookingModal();
  initInstagramEmbeds();
});

// ── NAVBAR — scroll & active state ─────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navEl   = navbar?.querySelector('.navbar');
  if (!navEl) return;

  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY > 40) {
          navEl.classList.add('scrolled');
        } else {
          navEl.classList.remove('scrolled');
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
}

// ── HAMBURGER MENU ─────────────────────────────────────────
function initHamburger() {
  const btn      = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');
  if (!btn || !navLinks) return;

  btn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !btn.contains(e.target)) {
      navLinks.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });
}

// ── ACTIVE NAV HIGHLIGHT on scroll ────────────────────────
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => observer.observe(sec));
}

// ── CAROUSELS ──────────────────────────────────────────────
function initCarousels() {
  const rooms = [
    { track: 'chandraTrack',  dots: 'chandraDotsChandra' },
    { track: 'bhargaviTrack', dots: 'bhargaviDots' },
    { track: 'anaghaTrack',   dots: 'anaghaDots' },
    { track: 'amritaTrack',   dots: 'amritaDots' },
    { track: 'pushtiTrack',   dots: 'pushtiDots' },
    { track: 'aboutRoomTrack', dots: 'aboutRoomDots' },
  ];

  rooms.forEach(room => setupCarousel(room.track, room.dots));
}

function setupCarousel(trackId, dotsContainerId) {
  const track     = document.getElementById(trackId);
  const dotsWrap  = document.getElementById(dotsContainerId);
  const carousel  = track?.closest('.room-carousel, .about-img-secondary');
  if (!track || !dotsWrap || !carousel) return;

  const slideCount = track.children.length;
  if (slideCount === 0) return;

  let current = 0;
  let isDragging = false;
  let startX = 0;
  let autoTimer;

  // Build dots
  dotsWrap.innerHTML = '';
  const dots = [];
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', `Photo ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
    dots.push(dot);
  }

  function goTo(idx) {
    current = (idx + slideCount) % slideCount;
    track.style.transform = `translate3d(-${current * 100}%, 0, 0)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // Lazy load next/adjacent slide images when active
    const slidesToLoad = [current, (current + 1) % slideCount, (current - 1 + slideCount) % slideCount];
    slidesToLoad.forEach(slideIndex => {
      const slideEl = track.children[slideIndex];
      if (slideEl) {
        const img = slideEl.querySelector('img[data-src]');
        if (img) {
          img.setAttribute('src', img.getAttribute('data-src'));
          img.removeAttribute('data-src');
        }
      }
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // Button controls
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); resetAuto(); });

  // Keyboard
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { prev(); resetAuto(); }
    if (e.key === 'ArrowRight') { next(); resetAuto(); }
  });

  // Touch / swipe
  carousel.addEventListener('touchstart', (e) => {
    startX    = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetAuto();
    }
    isDragging = false;
  });

  // Mouse drag (desktop)
  carousel.addEventListener('mousedown', (e) => {
    startX     = e.clientX;
    isDragging = true;
    carousel.style.cursor = 'grabbing';
  });
  carousel.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetAuto();
    }
    isDragging = false;
    carousel.style.cursor = 'grab';
  });
  carousel.addEventListener('mouseleave', () => {
    isDragging = false;
    carousel.style.cursor = 'grab';
  });
  carousel.style.cursor = 'grab';

  let isVisible = false;

  // Auto-slide (pauses on hover or when off-screen)
  function startAuto() {
    if (autoTimer) clearInterval(autoTimer);
    if (isVisible) {
      autoTimer = setInterval(next, 4500);
    }
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }
  function resetAuto() {
    stopAuto();
    startAuto();
  }

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  // Pause when offscreen using IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startAuto();
        } else {
          stopAuto();
        }
      });
    }, { threshold: 0.05 });
    observer.observe(carousel);
  } else {
    isVisible = true;
    startAuto();
  }
}

// ── SCROLL ANIMATIONS ──────────────────────────────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  // Stagger children of grids
  document.querySelectorAll('.amenities-grid, .why-grid, .gallery-grid, .insta-grid').forEach(grid => {
    [...grid.children].forEach((child, i) => {
      child.setAttribute('data-animate', 'fade-up');
      child.setAttribute('data-delay', String(i * 80));
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = el.getAttribute('data-delay') || '0';
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('animated');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  // Re-query to get newly added [data-animate] elements from stagger above
  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// ── IMAGE FALLBACK — blank placeholder styling ─────────────
function initImageFallbacks() {
  // For images that fail to load (src file not yet added), show placeholder bg
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      this.style.background = 'linear-gradient(135deg, #e0dfd9 0%, #ebe9e2 50%, #d5d5cb 100%)';
      this.removeAttribute('src');
      this.setAttribute('alt', this.getAttribute('alt') + ' (photo coming soon)');
    });
  });

  // Hero fallback — if hero bg fails, use CSS navy gradient
  const heroBg = document.getElementById('heroBgPhoto');
  if (heroBg) {
    heroBg.addEventListener('error', function () {
      this.style.display = 'none';
      const bgWrap = this.parentElement;
      if (bgWrap) {
        bgWrap.style.background = 'linear-gradient(160deg, #0c2238 0%, #12324A 60%, #1a4f70 100%)';
      }
    });
  }
}

// ── SMOOTH SCROLL for internal links ──────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 100; // account for fixed navbar
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── BOOKING MODAL SYSTEM ──────────────────────────────────
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const whatsappOpt = document.getElementById('modalWhatsappOpt');
  const modalTitle = document.getElementById('modalTitle');

  if (!modal || !closeBtn || !whatsappOpt) return;

  const defaultTitle = "Book Your Stay";
  const defaultText = "Hi, I want to book a stay at The Castleton Mansion. Please share availability.";

  function openModal(roomName = "") {
    if (roomName) {
      modalTitle.textContent = `Book ${roomName}`;
      const text = `Hi, I want to book ${roomName} at The Castleton Mansion. Please share availability.`;
      whatsappOpt.href = `https://wa.me/919864323486?text=${encodeURIComponent(text)}`;
    } else {
      modalTitle.textContent = defaultTitle;
      whatsappOpt.href = `https://wa.me/919864323486?text=${encodeURIComponent(defaultText)}`;
    }
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind all trigger buttons across the site
  document.querySelectorAll('.btn-book-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Bind room triggers
  document.querySelectorAll('.btn-book-room-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roomName = btn.getAttribute('data-room-name');
      openModal(roomName);
    });
  });

  // Close triggers
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Close modal when an option is selected
  whatsappOpt.addEventListener('click', () => {
    setTimeout(closeModal, 600);
  });
  
  const callOpt = document.getElementById('modalCallOpt');
  if (callOpt) {
    callOpt.addEventListener('click', () => {
      setTimeout(closeModal, 600);
    });
  }
}

// ── INSTAGRAM LAZY EMBEDS ─────────────────────────────────
function initInstagramEmbeds() {
  const instagramSection = document.getElementById('instagram');
  if (!instagramSection) return;

  // Only load embeds on desktop/tablet (width >= 768px)
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    instagramSection.classList.add('insta-mobile-fallback');
    return;
  }

  // Set up IntersectionObserver to lazy load the script when near viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadInstagramScript();
        observer.disconnect(); // Only run once
      }
    });
  }, { rootMargin: '200px' }); // Load when 200px from viewport

  observer.observe(instagramSection);
}

function loadInstagramScript() {
  // Check if script already exists
  if (document.querySelector('script[src*="instagram.com/embed.js"]')) {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
    return;
  }

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.instagram.com/embed.js';
  script.onload = () => {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }
  };
  document.body.appendChild(script);
}
