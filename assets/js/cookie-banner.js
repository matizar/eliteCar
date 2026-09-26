/**
 * EliteCar - Cookie Consent Banner Module
 * Manages 90-day persistence via localStorage & cookie fallback
 */

const CookieBanner = {
  COOKIE_NAME: 'elitecar_cookie_ack',
  COOKIE_DAYS: 90,

  init() {
    this.banner = document.querySelector('.cookie-consent-banner');
    this.acceptBtn = document.querySelector('.btn-accept-cookies');

    if (!this.banner) return;

    if (!this.hasAccepted()) {
      // Small entrance delay for smooth user experience
      setTimeout(() => {
        this.show();
      }, 1000);
    }

    if (this.acceptBtn) {
      this.acceptBtn.addEventListener('click', () => {
        this.accept();
      });
    }
  },

  hasAccepted() {
    try {
      const local = localStorage.getItem(this.COOKIE_NAME);
      if (local === 'true') return true;
    } catch (e) {
      // LocalStorage disabled fallback
    }

    // Cookie fallback
    const match = document.cookie.match(new RegExp('(^| )' + this.COOKIE_NAME + '=([^;]+)'));
    return match ? match[2] === 'true' : false;
  },

  accept() {
    try {
      localStorage.setItem(this.COOKIE_NAME, 'true');
    } catch (e) {}

    const date = new Date();
    date.setTime(date.getTime() + (this.COOKIE_DAYS * 24 * 60 * 60 * 1000));
    document.cookie = `${this.COOKIE_NAME}=true; expires=${date.toUTCString()}; path=/; SameSite=Lax`;

    this.hide();

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'cookie_consent_accepted',
        component_type: 'banner',
        component_name: 'cookie_notice',
        value: 1
      });
    }
  },

  show() {
    if (this.banner) {
      this.banner.classList.add('show');
    }
  },

  hide() {
    if (this.banner) {
      this.banner.classList.remove('show');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CookieBanner.init();
});
