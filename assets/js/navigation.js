/**
 * EliteCar - Navigation Module
 * Handles responsive menu, mobile drawer, dropdowns, and sticky header
 */

const NavigationModule = {
  eventsBound: false,

  init() {
    this.header = document.querySelector('.site-header');
    this.menuToggle = document.querySelector('.menu-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.dropdownParents = document.querySelectorAll('.has-dropdown');
    this.navLinks = document.querySelectorAll('.nav-link, .dropdown-link');

    this.bindEvents();
    this.handleScroll();
  },

  bindEvents() {
    // Global Scroll event for sticky header
    if (!this.eventsBound) {
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });

      // Mobile Hamburger Menu Toggle
      if (this.menuToggle && this.navMenu) {
        this.menuToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = this.navMenu.classList.toggle('open');
          this.menuToggle.classList.toggle('active', isOpen);
          this.menuToggle.setAttribute('aria-expanded', isOpen);

          // Track menu toggle
          this.trackEvent(isOpen ? 'menu_opened' : 'menu_closed');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
          if (!this.header.contains(e.target) && this.navMenu.classList.contains('open')) {
            this.closeMobileMenu();
          }
        });
      }

      // Close on resize if returning to desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && this.navMenu && this.navMenu.classList.contains('open')) {
          this.closeMobileMenu();
        }
      });

      this.eventsBound = true;
    }

    // Mobile Dropdown Accordion Toggle
    this.dropdownParents.forEach((parent) => {
      const link = parent.querySelector('.nav-link');
      if (link && !link.dataset.bound) {
        link.dataset.bound = 'true';
        link.addEventListener('click', (e) => {
          // On mobile view (< 768px), prevent default click and toggle accordion
          if (window.innerWidth < 768) {
            e.preventDefault();
            const isExpanded = parent.classList.toggle('mobile-expanded');
            link.setAttribute('aria-expanded', isExpanded);
          }
        });
      }
    });

    // Close mobile menu on nav link click (smooth anchor jump)
    this.navLinks.forEach((link) => {
      if (!link.dataset.bound) {
        link.dataset.bound = 'true';
        link.addEventListener('click', () => {
          const href = link.getAttribute('href');
          if (href && (href.startsWith('#') || href.includes('#'))) {
            this.closeMobileMenu();
          }
        });
      }
    });
  },

  handleScroll() {
    if (!this.header) return;
    if (window.scrollY > 40) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  },

  closeMobileMenu() {
    if (this.navMenu) {
      this.navMenu.classList.remove('open');
    }
    if (this.menuToggle) {
      this.menuToggle.classList.remove('active');
      this.menuToggle.setAttribute('aria-expanded', 'false');
    }
    this.dropdownParents.forEach((p) => p.classList.remove('mobile-expanded'));
  },

  trackEvent(action) {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'navigation_interaction',
        component_type: 'menu',
        component_name: 'header_navigation',
        element_text: action,
        value: 1
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  NavigationModule.init();
});
