/**
 * EliteCar - WhatsApp Floating Button Module
 * Includes 3-second security delay, pulsing animation, and dataLayer tracking
 */

const WhatsAppFloat = {
  buttonSelector: '.whatsapp-floating-btn',
  delayMs: 3000, // 3-second delay as requested

  init() {
    this.btn = document.querySelector(this.buttonSelector);
    if (!this.btn) return;

    // Display button after 3 seconds
    setTimeout(() => {
      this.show();
      this.trackEvent('whatsapp_button_visible');
    }, this.delayMs);

    this.btn.addEventListener('click', () => {
      this.trackEvent('whatsapp_button_click');
    });
  },

  show() {
    if (this.btn) {
      this.btn.classList.add('visible');
    }
  },

  trackEvent(action) {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'interaction',
        component_type: 'floating_button',
        component_name: 'whatsapp',
        element_text: action,
        value: 1
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  WhatsAppFloat.init();
});
