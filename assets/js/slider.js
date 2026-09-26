/**
 * EliteCar - Hero Slider Module
 * Handles auto-play, transitions, touch swipe, dots, and event tracking
 */

class HeroSlider {
  constructor(containerSelector = '.hero-slider-section', options = {}) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.track = this.container.querySelector('.slider-track');
    this.slides = Array.from(this.container.querySelectorAll('.slide-item'));
    this.prevBtn = this.container.querySelector('.slider-arrow-prev');
    this.nextBtn = this.container.querySelector('.slider-arrow-next');
    this.dotsContainer = this.container.querySelector('.slider-dots');

    this.options = Object.assign({
      autoplay: true,
      autoplayDelay: 4500,
      loop: true
    }, options);

    this.currentIndex = 0;
    this.slidesCount = this.slides.length;
    this.timer = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isPaused = false;
    this.eventsBound = false;

    this.init();
  }

  reinit(options = {}) {
    if (this.timer) clearInterval(this.timer);
    this.track = this.container.querySelector('.slider-track');
    this.slides = Array.from(this.container.querySelectorAll('.slide-item'));
    this.slidesCount = this.slides.length;
    this.currentIndex = 0;
    this.isPaused = false;

    if (options.autoplay !== undefined) this.options.autoplay = options.autoplay;
    if (options.autoplayDelay !== undefined) this.options.autoplayDelay = options.autoplayDelay;

    if (this.slidesCount === 0) return;

    this.renderDots();
    this.bindEvents();
    this.updateSlider();

    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  init() {
    if (this.slidesCount === 0) return;

    this.renderDots();
    this.bindEvents();
    this.updateSlider();

    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  renderDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';

    this.slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `dot-btn ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir a diapositiva ${idx + 1}`);
      dot.addEventListener('click', () => {
        this.goToSlide(idx);
        this.trackEvent(`dot_click_slide_${idx + 1}`);
      });
      this.dotsContainer.appendChild(dot);
    });

    this.dots = Array.from(this.dotsContainer.querySelectorAll('.dot-btn'));
  }

  bindEvents() {
    if (this.eventsBound) return;
    this.eventsBound = true;

    // Arrow Navigation
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.trackEvent('arrow_next_click');
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.trackEvent('arrow_prev_click');
      });
    }

    // Pause on Hover (Desktop)
    this.container.addEventListener('mouseenter', () => {
      this.pauseAutoplay();
    });

    this.container.addEventListener('mouseleave', () => {
      this.resumeAutoplay();
    });

    // Touch Swipe Gestures (Mobile/Tablet)
    this.container.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.pauseAutoplay();
    }, { passive: true });

    this.container.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
      this.resumeAutoplay();
    }, { passive: true });
  }

  handleSwipe() {
    const swipeDistance = this.touchEndX - this.touchStartX;
    const threshold = 50; // min 50px threshold as specified

    if (swipeDistance < -threshold) {
      // Swipe left -> Next
      this.nextSlide();
      this.trackEvent('swipe_next');
    } else if (swipeDistance > threshold) {
      // Swipe right -> Prev
      this.prevSlide();
      this.trackEvent('swipe_prev');
    }
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlider();
    this.resetTimer();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slidesCount;
    this.updateSlider();
    this.resetTimer();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slidesCount) % this.slidesCount;
    this.updateSlider();
    this.resetTimer();
  }

  updateSlider() {
    if (this.track) {
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    this.slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === this.currentIndex);
    });

    if (this.dots) {
      this.dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === this.currentIndex);
      });
    }
  }

  startAutoplay() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, this.options.autoplayDelay);
  }

  pauseAutoplay() {
    this.isPaused = true;
  }

  resumeAutoplay() {
    this.isPaused = false;
  }

  resetTimer() {
    if (this.options.autoplay) {
      this.startAutoplay();
    }
  }

  trackEvent(action) {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'slider_interaction',
        component_type: 'slider',
        component_name: 'hero_main',
        element_text: action,
        value: this.currentIndex + 1
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.heroSliderInstance = new HeroSlider();
});
