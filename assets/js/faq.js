/**
 * EliteCar - FAQ Accordion Module
 * Handles progressive display, accessible accordion toggling, and keyboard navigation
 */

class FAQAccordion {
  constructor(containerSelector = '.faq-accordion-box') {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.items = Array.from(this.container.querySelectorAll('.faq-item'));
    this.loadMoreBtn = this.container.querySelector('.btn-faq-load-more');
    this.initialCount = 5;
    this.showingAll = false;

    this.init();
  }

  reinit(options = {}) {
    this.items = Array.from(this.container.querySelectorAll('.faq-item'));
    this.loadMoreBtn = this.container.querySelector('.btn-faq-load-more');
    if (options.initialDisplay !== undefined) this.initialCount = options.initialDisplay;
    this.showingAll = false;
    this.setupInitialDisplay();
    this.bindEvents();
    const defaultOpen = options.defaultOpen !== undefined ? options.defaultOpen : 0;
    if (this.items.length > defaultOpen && defaultOpen >= 0) {
      this.openItem(this.items[defaultOpen], false);
    }
  }

  init() {
    this.setupInitialDisplay();
    this.bindEvents();
  }

  setupInitialDisplay() {
    // Limit initial display to initialCount questions if loadMoreBtn exists
    if (this.loadMoreBtn && this.items.length > this.initialCount) {
      this.items.forEach((item, idx) => {
        if (idx >= this.initialCount) {
          item.style.display = 'none';
        } else {
          item.style.display = 'block';
        }
      });
      this.loadMoreBtn.style.display = 'inline-flex';
      this.loadMoreBtn.textContent = `MOSTRAR MÁS PREGUNTAS (${this.items.length - this.initialCount} MÁS)`;
    } else if (this.loadMoreBtn) {
      this.loadMoreBtn.style.display = 'none';
    }

    // Default open first question (spec: defaultOpen: 0)
    if (this.items.length > 0) {
      this.openItem(this.items[0], false);
    }
  }

  bindEvents() {
    this.items.forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      if (trigger && !trigger.dataset.bound) {
        trigger.dataset.bound = 'true';
        trigger.addEventListener('click', () => {
          this.toggleItem(item);
        });

        // Keyboard accessibility
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggleItem(item);
          }
        });
      }
    });

    if (this.loadMoreBtn && !this.loadMoreBtn.dataset.bound) {
      this.loadMoreBtn.dataset.bound = 'true';
      this.loadMoreBtn.addEventListener('click', () => {
        this.toggleLoadMore();
      });
    }
  }

  toggleItem(targetItem) {
    const isActive = targetItem.classList.contains('active');

    // Close all other items (accordion behavior: single active item)
    this.items.forEach((item) => {
      if (item !== targetItem) {
        this.closeItem(item);
      }
    });

    if (isActive) {
      this.closeItem(targetItem);
      this.trackEvent('faq_collapsed', targetItem);
    } else {
      this.openItem(targetItem);
      this.trackEvent('faq_expanded', targetItem);
    }
  }

  openItem(item, smooth = true) {
    item.classList.add('active');
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');

    if (trigger) {
      trigger.setAttribute('aria-expanded', 'true');
    }
    if (answer) {
      answer.setAttribute('aria-hidden', 'false');
    }
  }

  closeItem(item) {
    item.classList.remove('active');
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');

    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
    if (answer) {
      answer.setAttribute('aria-hidden', 'true');
    }
  }

  toggleLoadMore() {
    this.showingAll = !this.showingAll;

    this.items.forEach((item, idx) => {
      if (idx >= this.initialCount) {
        item.style.display = this.showingAll ? 'block' : 'none';
      }
    });

    this.loadMoreBtn.textContent = this.showingAll
      ? 'MOSTRAR MENOS PREGUNTAS'
      : `MOSTRAR MÁS PREGUNTAS (${this.items.length - this.initialCount} MÁS)`;

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'faq_load_more_interaction',
        component_type: 'faq',
        component_name: 'faq_accordion',
        element_text: this.showingAll ? 'show_all' : 'show_less',
        value: this.items.length
      });
    }
  }

  trackEvent(action, item) {
    const questionText = item.querySelector('.faq-question')?.textContent.trim() || '';
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'faq_interaction',
        component_type: 'accordion',
        component_name: 'faq_section',
        element_text: `${action}: ${questionText}`,
        value: 1
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.faqAccordionInstance = new FAQAccordion();
});
