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
  initRoomsTabSelector();
  initBookingModal();
  initOccupancySelectors();
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
    { track: 'gfBalconyTrack',  dots: 'gfBalconyDots' },
    { track: 'gfNoBalconyTrack', dots: 'gfNoBalconyDots' },
    { track: 'ffBalconyTrack',   dots: 'ffBalconyDots' },
    { track: 'ffNoBalconyTrack', dots: 'ffNoBalconyDots' },
    { track: 'room5Track',       dots: 'room5Dots' },
    { track: 'aboutRoomTrack',  dots: 'aboutRoomDots' },
    
    // Apartment Units
    { track: 'aptUnit1Track',  dots: 'aptUnit1Dots' },
    { track: 'aptUnit2Track',  dots: 'aptUnit2Dots' },
    { track: 'aptUnit3Track',  dots: 'aptUnit3Dots' },
    
    // Lodge Rooms
    { track: 'beeDeeLodgeTrack', dots: 'beeDeeLodgeDots' },
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

  if (slideCount <= 1) {
    if (dotsWrap) dotsWrap.style.display = 'none';
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }

  let current = 0;
  let isDragging = false;
  let startX = 0;

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
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // Button controls
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  // Keyboard
  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { prev(); }
    if (e.key === 'ArrowRight') { next(); }
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
    }
    isDragging = false;
    carousel.style.cursor = 'grab';
  });
  carousel.addEventListener('mouseleave', () => {
    isDragging = false;
    carousel.style.cursor = 'grab';
  });
  carousel.style.cursor = 'grab';

  goTo(0);
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
      this.setAttribute('alt', this.getAttribute('alt'));
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
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();

    if (href === '#rooms') {
      const staySelectorArea = document.getElementById('staySelectorArea');
      const stayTabsWrap = document.getElementById('stayTabsWrap');
      const mansionRoomsContainer = document.getElementById('mansionRoomsContainer');
      const apartmentRoomsContainer = document.getElementById('apartmentRoomsContainer');
      const lodgeRoomsContainer = document.getElementById('lodgeRoomsContainer');

      if (selectedStayType) {
        stayTabsWrap.classList.remove('hidden');
        if (selectedStayType === 'mansion') {
          mansionRoomsContainer.classList.remove('hidden');
          apartmentRoomsContainer.classList.add('hidden');
          lodgeRoomsContainer.classList.add('hidden');
        } else if (selectedStayType === 'apartment') {
          apartmentRoomsContainer.classList.remove('hidden');
          mansionRoomsContainer.classList.add('hidden');
          lodgeRoomsContainer.classList.add('hidden');
        } else if (selectedStayType === 'lodge') {
          lodgeRoomsContainer.classList.remove('hidden');
          mansionRoomsContainer.classList.add('hidden');
          apartmentRoomsContainer.classList.add('hidden');
        }
      } else {
        staySelectorArea.classList.remove('hidden');
        stayTabsWrap.classList.add('hidden');
        mansionRoomsContainer.classList.add('hidden');
        apartmentRoomsContainer.classList.add('hidden');
        lodgeRoomsContainer.classList.add('hidden');
      }
    }

    const offset = 100; // account for fixed navbar
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── ROOMS TAB SELECTOR ─────────────────────────────────────
let selectedStayType = null;

function initRoomsTabSelector() {
  const selectMansionBtn = document.getElementById('selectMansionBtn');
  const selectApartmentBtn = document.getElementById('selectApartmentBtn');
  const selectLodgeBtn = document.getElementById('selectLodgeBtn');
  const selectMansionCard = document.getElementById('selectMansionCard');
  const selectApartmentCard = document.getElementById('selectApartmentCard');
  const selectLodgeCard = document.getElementById('selectLodgeCard');
  
  const staySelectorArea = document.getElementById('staySelectorArea');
  const stayTabsWrap = document.getElementById('stayTabsWrap');
  const mansionRoomsContainer = document.getElementById('mansionRoomsContainer');
  const apartmentRoomsContainer = document.getElementById('apartmentRoomsContainer');
  const lodgeRoomsContainer = document.getElementById('lodgeRoomsContainer');
  
  const tabMansion = document.getElementById('tabMansion');
  const tabApartment = document.getElementById('tabApartment');
  const tabLodge = document.getElementById('tabLodge');

  if (!selectMansionBtn || !selectApartmentBtn || !selectLodgeBtn) return;

  function selectStay(type, preventScroll = false) {
    selectedStayType = type;

    if (type === 'mansion') {
      mansionRoomsContainer.classList.remove('hidden');
      apartmentRoomsContainer.classList.add('hidden');
      lodgeRoomsContainer.classList.add('hidden');
      
      tabMansion.classList.add('active');
      tabApartment.classList.remove('active');
      tabLodge.classList.remove('active');
      
      selectMansionCard.classList.add('selected');
      selectApartmentCard.classList.remove('selected');
      selectLodgeCard.classList.remove('selected');
    } else if (type === 'apartment') {
      apartmentRoomsContainer.classList.remove('hidden');
      mansionRoomsContainer.classList.add('hidden');
      lodgeRoomsContainer.classList.add('hidden');
      
      tabApartment.classList.add('active');
      tabMansion.classList.remove('active');
      tabLodge.classList.remove('active');
      
      selectApartmentCard.classList.add('selected');
      selectMansionCard.classList.remove('selected');
      selectLodgeCard.classList.remove('selected');
    } else if (type === 'lodge') {
      lodgeRoomsContainer.classList.remove('hidden');
      mansionRoomsContainer.classList.add('hidden');
      apartmentRoomsContainer.classList.add('hidden');
      
      tabLodge.classList.add('active');
      tabMansion.classList.remove('active');
      tabApartment.classList.remove('active');
      
      selectLodgeCard.classList.add('selected');
      selectMansionCard.classList.remove('selected');
      selectApartmentCard.classList.remove('selected');
    }

    stayTabsWrap.classList.remove('hidden');

    // Update URL hash without refreshing
    let typeHash = '';
    if (type === 'mansion') typeHash = 'mansion-rooms';
    else if (type === 'apartment') typeHash = 'apartment-rooms';
    else if (type === 'lodge') typeHash = 'bee-dee-lodge';

    if (typeHash && window.location.hash !== '#' + typeHash) {
      history.pushState(null, null, '#' + typeHash);
    }

    if (!preventScroll) {
      setTimeout(() => {
        let targetContainer;
        if (type === 'mansion') targetContainer = mansionRoomsContainer;
        else if (type === 'apartment') targetContainer = apartmentRoomsContainer;
        else if (type === 'lodge') targetContainer = lodgeRoomsContainer;
        
        const offset = window.innerWidth < 768 ? 80 : 120;
        const top = targetContainer.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 100);
    }
  }

  selectMansionBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    selectStay('mansion');
  });
  selectApartmentBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    selectStay('apartment');
  });
  selectLodgeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    selectStay('lodge');
  });

  selectMansionCard.addEventListener('click', () => selectStay('mansion'));
  selectApartmentCard.addEventListener('click', () => selectStay('apartment'));
  selectLodgeCard.addEventListener('click', () => selectStay('lodge'));

  tabMansion.addEventListener('click', () => selectStay('mansion'));
  tabApartment.addEventListener('click', () => selectStay('apartment'));
  tabLodge.addEventListener('click', () => selectStay('lodge'));

  // Share Stay Button Click Handler
  const btnShareStay = document.getElementById('btnShareStay');
  if (btnShareStay) {
    btnShareStay.addEventListener('click', (e) => {
      e.stopPropagation();
      let typeHash = 'mansion-rooms';
      if (selectedStayType === 'mansion') typeHash = 'mansion-rooms';
      else if (selectedStayType === 'apartment') typeHash = 'apartment-rooms';
      else if (selectedStayType === 'lodge') typeHash = 'bee-dee-lodge';
      
      const shareUrl = window.location.href.split('#')[0] + '#' + typeHash;
      copyToClipboard(shareUrl);
    });
  }

  // Handle initial URL hash on page load
  const initHash = window.location.hash;
  if (initHash) {
    let type = null;
    if (initHash === '#mansion-rooms') type = 'mansion';
    else if (initHash === '#apartment-rooms') type = 'apartment';
    else if (initHash === '#bee-dee-lodge') type = 'lodge';

    if (type) {
      selectStay(type, true);
      setTimeout(() => {
        const roomsSection = document.getElementById('rooms');
        if (roomsSection) {
          const offset = window.innerWidth < 768 ? 80 : 100;
          const top = roomsSection.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 400);
    }
  }
}

// ── BOOKING MODAL SYSTEM ──────────────────────────────────
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const whatsappOpt = document.getElementById('modalWhatsappOpt');
  const modalTitle = document.getElementById('modalTitle');
  const modalBrand = document.getElementById('modalBrand');
  const modalSubtext = document.getElementById('modalSubtext');
  
  const stepPropertySelect = document.getElementById('modalStepPropertySelect');
  const stepContactOptions = document.getElementById('modalStepContactOptions');
  const modalSelectMansionBtn = document.getElementById('modalSelectMansionBtn');
  const modalSelectApartmentBtn = document.getElementById('modalSelectApartmentBtn');
  const modalSelectLodgeBtn = document.getElementById('modalSelectLodgeBtn');
  
  const modalStepLodgePreference = document.getElementById('modalStepLodgePreference');
  const modalLodgeSelectNonAcBtn = document.getElementById('modalLodgeSelectNonAcBtn');
  const modalLodgeSelectAcBtn = document.getElementById('modalLodgeSelectAcBtn');

  if (!modal || !closeBtn || !whatsappOpt) return;

  function openModal(roomName = "", unitNum = null) {
    if (roomName) {
      stepPropertySelect.classList.add('hidden');
      if (modalStepLodgePreference) modalStepLodgePreference.classList.add('hidden');
      stepContactOptions.classList.remove('hidden');

      modalTitle.textContent = `Book ${roomName}`;
      
      const isApartment = unitNum !== null && unitNum !== 'Lodge' && (roomName.includes('2BHK') || roomName.includes('3BHK') || roomName.includes('Apartment'));
      const isLodge = unitNum === 'Lodge';
      let text = '';
      if (isApartment) {
        modalBrand.textContent = "The Castleton Apartment";
        modalSubtext.textContent = "Choose your preferred booking option. Direct WhatsApp booking.";
        if (unitNum) {
          const activeOption = document.querySelector(`#unit${unitNum}PrefSelector .pref-btn.active`);
          text = activeOption ? activeOption.getAttribute('data-msg') : '';
        } else {
          text = `Hi, I want to book ${roomName} at The Castleton Apartment. Please share availability.`;
        }
      } else if (isLodge) {
        modalBrand.textContent = "Bee Dee Lodge";
        modalSubtext.textContent = "Choose your preferred booking option. Direct WhatsApp booking.";
        const activeOption = document.querySelector(`#unitLodgePrefSelector .pref-btn.active`);
        text = activeOption ? activeOption.getAttribute('data-msg') : '';
      } else {
        modalBrand.textContent = "The Castleton Mansion";
        modalSubtext.textContent = "Choose your preferred booking option. Direct WhatsApp booking.";
        
        let price = '';
        if (roomName === 'Mansion Room 1') price = '₹3,000';
        else if (roomName === 'Mansion Room 2') price = '₹2,800';
        else if (roomName === 'Mansion Room 3') price = '₹3,000';
        else if (roomName === 'Mansion Room 4') price = '₹2,600';
        else if (roomName === 'Mansion Room 5') price = '₹3,000';
        
        if (price) {
          text = `Hi, I want to book ${roomName} at The Castleton Mansion. Please confirm availability. Price shown is ${price} per night.`;
        } else {
          text = `Hi, I want to book ${roomName} at The Castleton Mansion. Please share availability.`;
        }
      }
      
      whatsappOpt.href = `https://wa.me/919864323486?text=${encodeURIComponent(text)}`;
    } else {
      // Check current stay category to pre-select
      let currentCategory = '';
      if (selectedStayType === 'mansion' || window.location.hash === '#mansion-rooms') currentCategory = 'mansion';
      else if (selectedStayType === 'apartment' || window.location.hash === '#apartment-rooms') currentCategory = 'apartment';
      else if (selectedStayType === 'lodge' || window.location.hash === '#bee-dee-lodge') currentCategory = 'lodge';

      if (currentCategory) {
        selectPropertyType(currentCategory);
      } else {
        stepPropertySelect.classList.remove('hidden');
        stepContactOptions.classList.add('hidden');
        if (modalStepLodgePreference) modalStepLodgePreference.classList.add('hidden');
        modalBrand.textContent = "Select Property";
        modalTitle.textContent = "Book Your Stay";
        modalSubtext.textContent = "Please select the property category you want to book.";
      }
    }
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function selectPropertyType(type) {
    stepPropertySelect.classList.add('hidden');
    
    if (type === 'lodge') {
      if (modalStepLodgePreference) modalStepLodgePreference.classList.remove('hidden');
      stepContactOptions.classList.add('hidden');
    } else {
      if (modalStepLodgePreference) modalStepLodgePreference.classList.add('hidden');
      stepContactOptions.classList.remove('hidden');
      
      if (type === 'mansion') {
        modalBrand.textContent = "The Castleton Mansion";
        modalTitle.textContent = "Book Your Stay";
        modalSubtext.textContent = "Choose your preferred booking option. For urgent availability, call us directly.";
        const text = "Hi, I want to book a stay at The Castleton Mansion. Please share availability.";
        whatsappOpt.href = `https://wa.me/919864323486?text=${encodeURIComponent(text)}`;
      } else {
        modalBrand.textContent = "The Castleton Apartment";
        modalTitle.textContent = "Book Your Stay";
        modalSubtext.textContent = "Choose your preferred booking option. For urgent availability, call us directly.";
        const text = "Hi, I want to book a stay at The Castleton Apartment. Please share availability.";
        whatsappOpt.href = `https://wa.me/919864323486?text=${encodeURIComponent(text)}`;
      }
    }
  }

  function selectLodgePreference(acType) {
    if (modalStepLodgePreference) modalStepLodgePreference.classList.add('hidden');
    stepContactOptions.classList.remove('hidden');
    
    modalBrand.textContent = "Bee Dee Lodge";
    modalTitle.textContent = `Book Bee Dee Lodge Room (${acType === 'ac' ? 'AC' : 'Non AC'})`;
    modalSubtext.textContent = "Choose your preferred booking option. Direct WhatsApp booking.";
    
    let text = '';
    if (acType === 'ac') {
      text = "Hi, I want to book an AC room at Bee Dee Lodge by The Castleton. Please confirm availability. Price shown is ₹1,800 per night.";
    } else {
      text = "Hi, I want to book a Non AC room at Bee Dee Lodge by The Castleton. Please confirm availability. Price shown is ₹799 per night.";
    }
    
    whatsappOpt.href = `https://wa.me/919864323486?text=${encodeURIComponent(text)}`;
  }

  modalSelectMansionBtn.addEventListener('click', () => selectPropertyType('mansion'));
  modalSelectApartmentBtn.addEventListener('click', () => selectPropertyType('apartment'));
  if (modalSelectLodgeBtn) modalSelectLodgeBtn.addEventListener('click', () => selectPropertyType('lodge'));
  
  if (modalLodgeSelectNonAcBtn) modalLodgeSelectNonAcBtn.addEventListener('click', () => selectLodgePreference('non-ac'));
  if (modalLodgeSelectAcBtn) modalLodgeSelectAcBtn.addEventListener('click', () => selectLodgePreference('ac'));

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Reset steps state for next open
    stepPropertySelect.classList.add('hidden');
    if (modalStepLodgePreference) modalStepLodgePreference.classList.add('hidden');
    stepContactOptions.classList.remove('hidden');
  }

  document.querySelectorAll('.btn-book-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-book-room-trigger');
    if (trigger) {
      e.preventDefault();
      const roomName = trigger.getAttribute('data-room-name');
      const unitNum = trigger.getAttribute('data-unit');
      openModal(roomName, unitNum);
    }
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

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



// ── OCCUPANCY/PREFERENCE SELECTORS ─────────────────────────
function initOccupancySelectors() {
  const prefButtons = document.querySelectorAll('.pref-btn');
  prefButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const parentSelector = btn.closest('.pref-buttons');
      if (!parentSelector) return;
      
      // Remove active class from all buttons in this selector group
      parentSelector.querySelectorAll('.pref-btn').forEach(item => {
        item.classList.remove('active');
      });
      
      // Add active class to clicked button
      btn.classList.add('active');
      
      // Find parent room-card/apartment-card to update price and note dynamically
      const card = btn.closest('.room-card');
      if (!card) return;
      
      const oldPrice = btn.getAttribute('data-old-price');
      const finalPrice = btn.getAttribute('data-final-price');
      const note = btn.getAttribute('data-note');
      
      // Update prices
      const priceOldEl = card.querySelector('.price-old');
      const priceFinalEl = card.querySelector('.price-final');
      if (priceOldEl) priceOldEl.textContent = oldPrice;
      if (priceFinalEl) priceFinalEl.textContent = finalPrice;
      
      // Update note
      const noteEl = card.querySelector('.pref-note');
      if (noteEl) {
        noteEl.textContent = note;
      }
    });
  });
}

// ── TOAST & CLIPBOARD HELPERS ──────────────────────────────
function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="color: #DFFF3F; margin-right: 6px; vertical-align: middle;"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Link copied");
    }).catch(err => {
      fallbackCopyTextToClipboard(text);
    });
  } else {
    fallbackCopyTextToClipboard(text);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast("Link copied");
  } catch (err) {
    console.error('Fallback copy failed', err);
  }
  document.body.removeChild(textArea);
}
