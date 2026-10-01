/**
 * EliteCar - Main Application Script
 * Orchestrates GTM events and page utilities
 */

// Initialize Google Tag Manager DataLayer
window.dataLayer = window.dataLayer || [];

function gtag_event(eventName, params = {}) {
  window.dataLayer.push({
    event: eventName,
    component_type: params.component_type || 'ui',
    component_name: params.component_name || 'general',
    element_text: params.element_text || '',
    value: params.value || null
  });
}

const MainApp = {
  init() {
    this.initSmoothScroll();
    this.initCtaTracking();
    this.initBrevoCitySelect();
  },

  initBrevoCitySelect() {
    const citySelect = document.querySelector('#city-select');
    const cityField = document.querySelector('#lists');

    if (!(citySelect instanceof HTMLSelectElement) || !(cityField instanceof HTMLInputElement)) {
      return;
    }

    const syncCityField = () => {
      cityField.value = JSON.stringify(citySelect.value ? [citySelect.value] : []);
      cityField.dispatchEvent(new Event('input', { bubbles: true }));
      cityField.dispatchEvent(new Event('change', { bubbles: true }));
    };

    citySelect.addEventListener('change', syncCityField);
    syncCityField();
  },

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElem = document.querySelector(targetId);
        if (targetElem) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetElem.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  },

  initCtaTracking() {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('click', function() {
        const text = this.textContent.trim();
        gtag_event('cta_click', {
          component_type: 'button',
          component_name: 'cta',
          element_text: text,
          value: 1
        });
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MainApp.init();
});
