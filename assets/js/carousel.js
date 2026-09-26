/**
 * EliteCar - Services Carousel Module
 * Handles desktop/tablet carousel sliding, mobile expansion toggle, and touch gestures
 */

class ServicesCarousel {
  constructor(containerSelector = '.services-section') {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.wrapper = this.container.querySelector('.services-carousel-wrapper');
    this.track = this.container.querySelector('.services-track');
    this.cards = Array.from(this.container.querySelectorAll('.service-card'));
    this.prevBtn = this.container.querySelector('.carousel-btn-prev');
    this.nextBtn = this.container.querySelector('.carousel-btn-next');
    this.mobileToggleBtn = this.container.querySelector('.btn-toggle-services');

    this.currentIndex = 0;
    this.mobileExpanded = false;
    this.totalCards = this.cards.length;

    this.touchStartX = 0;
    this.touchEndX = 0;
    this.eventsBound = false;

    this.init();
  }

  reinit() {
    this.wrapper = this.container.querySelector('.services-carousel-wrapper');
    this.track = this.container.querySelector('.services-track');
    this.cards = Array.from(this.container.querySelectorAll('.service-card'));
    this.totalCards = this.cards.length;
    this.currentIndex = 0;
    this.mobileExpanded = false;
    this.bindEvents();
    this.updateLayout();
  }

  init() {
    this.bindEvents();
    this.updateLayout();
  }

  bindEvents() {
    if (this.eventsBound) return;
    this.eventsBound = true;

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.next();
        this.trackEvent('services_next_click');
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prev();
        this.trackEvent('services_prev_click');
      });
    }

    // Mobile "Ver más / Mostrar menos" Toggle
    if (this.mobileToggleBtn) {
      this.mobileToggleBtn.addEventListener('click', () => {
        this.toggleMobileExpansion();
      });
    }

    // Touch Swipe for Desktop/Tablet
    if (this.wrapper) {
      this.wrapper.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      this.wrapper.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleTouchSwipe();
      }, { passive: true });
    }

    // Resize listener
    window.addEventListener('resize', () => {
      this.updateLayout();
    });
  }

  getVisibleCount() {
    const width = window.innerWidth;
    if (width >= 1200) return 4;
    if (width >= 768) return 2;
    return 1;
  }

  getMaxIndex() {
    const visible = this.getVisibleCount();
    return Math.max(0, this.totalCards - visible);
  }

  next() {
    const maxIdx = this.getMaxIndex();
    if (this.currentIndex < maxIdx) {
      this.currentIndex++;
      this.updatePosition();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updatePosition();
    }
  }

  updatePosition() {
    if (window.innerWidth < 768) {
      // In mobile, track is vertical flex
      if (this.track) this.track.style.transform = 'none';
      return;
    }

    if (!this.track || this.cards.length === 0) return;

    const visible = this.getVisibleCount();
    const gap = 24; // 24px gap defined in CSS
    const cardWidth = this.cards[0].getBoundingClientRect().width;
    const step = cardWidth + gap;

    this.track.style.transform = `translateX(-${this.currentIndex * step}px)`;

    // Update button states
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex >= this.getMaxIndex();
    }
  }

  updateLayout() {
    if (window.innerWidth < 768) {
      // Mobile Mode
      this.setupMobileCards();
    } else {
      // Desktop / Tablet Mode
      this.cards.forEach((card) => card.classList.remove('hidden-mobile'));
      if (this.currentIndex > this.getMaxIndex()) {
        this.currentIndex = this.getMaxIndex();
      }
      this.updatePosition();
    }
  }

  setupMobileCards() {
    // Show first 4 cards initially on mobile, hide the rest until toggled
    const initialVisible = 4;
    this.cards.forEach((card, idx) => {
      if (idx >= initialVisible && !this.mobileExpanded) {
        card.classList.add('hidden-mobile');
      } else {
        card.classList.remove('hidden-mobile');
      }
    });

    if (this.mobileToggleBtn) {
      if (this.totalCards <= initialVisible) {
        this.mobileToggleBtn.style.display = 'none';
      } else {
        this.mobileToggleBtn.style.display = 'inline-flex';
        this.mobileToggleBtn.textContent = this.mobileExpanded ? '▲ MOSTRAR MENOS' : '▼ VER MÁS SERVICIOS';
      }
    }
  }

  toggleMobileExpansion() {
    this.mobileExpanded = !this.mobileExpanded;
    this.setupMobileCards();
    this.trackEvent(this.mobileExpanded ? 'services_mobile_expanded' : 'services_mobile_collapsed');
  }

  handleTouchSwipe() {
    if (window.innerWidth < 768) return; // Vertical on mobile
    const distance = this.touchEndX - this.touchStartX;
    if (distance < -50) {
      this.next();
      this.trackEvent('services_swipe_next');
    } else if (distance > 50) {
      this.prev();
      this.trackEvent('services_swipe_prev');
    }
  }

  trackEvent(action) {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'service_carousel_interaction',
        component_type: 'carousel',
        component_name: 'services_carousel',
        element_text: action,
        value: this.currentIndex + 1
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.servicesCarouselInstance = new ServicesCarousel();
});
