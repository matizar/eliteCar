/**
 * EliteCar - Interactive Map Module
 * Controls hotspot pins, tooltips, responsive coordinates, and location info
 */

const MapModule = {
  init() {
    this.container = document.querySelector('.map-interactive-container');
    if (!this.container) return;

    this.pins = Array.from(this.container.querySelectorAll('.map-pin'));
    this.bindEvents();
  },

  bindEvents() {
    this.pins.forEach((pin) => {
      if (pin.dataset.bound) return;
      pin.dataset.bound = 'true';

      // Toggle active pin on click/tap
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasActive = pin.classList.contains('active');

        // Deactivate other pins
        this.pins.forEach((p) => p.classList.remove('active'));

        if (!wasActive) {
          pin.classList.add('active');
          const city = pin.getAttribute('data-city');
          this.trackEvent(`pin_click_${city}`);
        }
      });
    });

    if (!this.docClickBound) {
      this.docClickBound = true;
      // Close any active tooltip when clicking outside the map
      document.addEventListener('click', () => {
        this.pins.forEach((p) => p.classList.remove('active'));
      });
    }
  },

  trackEvent(action) {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'map_interaction',
        component_type: 'map',
        component_name: 'colombia_coverage_map',
        element_text: action,
        value: 1
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MapModule.init();
});
