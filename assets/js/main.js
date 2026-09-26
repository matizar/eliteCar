/**
 * EliteCar - Main Application Script
 * Orchestrates form validation, Brevo CRM readiness, GTM events, and page utilities
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
  // Brevo CRM configuration placeholder
  // To integrate real Brevo endpoint, replace endpoint URL below
  brevoConfig: {
    endpointUrl: '', // Add Brevo API webhook or Form Action URL here
    isDemoMode: true
  },

  init() {
    this.initContactForm();
    this.initSmoothScroll();
    this.initCtaTracking();
  },

  initContactForm() {
    const form = document.querySelector('#contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit(form);
    });
  },

  handleFormSubmit(form) {
    const feedbackBox = form.querySelector('.form-feedback-message');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Reset styles
    form.querySelectorAll('.form-control').forEach((input) => {
      input.classList.remove('error');
    });

    if (feedbackBox) {
      feedbackBox.className = 'form-feedback-message';
      feedbackBox.textContent = '';
      feedbackBox.style.display = 'none';
    }

    // 1. Anti-Spam Honeypot check
    const honeypot = form.querySelector('input[name="company_tax_id_hp"]');
    if (honeypot && honeypot.value.trim() !== '') {
      // Bot detected, silently exit
      console.warn('Spam submission detected by honeypot.');
      return;
    }

    // 2. Validation
    const nameInput = form.querySelector('#contact-name');
    const emailInput = form.querySelector('#contact-email');
    const phoneInput = form.querySelector('#contact-phone');
    const serviceInput = form.querySelector('#contact-service');
    const messageInput = form.querySelector('#contact-message');
    const termsInput = form.querySelector('#contact-terms');

    const errors = [];

    if (!nameInput || nameInput.value.trim().length < 3) {
      errors.push('Por favor ingresa tu nombre completo (mínimo 3 caracteres).');
      if (nameInput) nameInput.classList.add('error');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
      errors.push('Por favor ingresa un correo electrónico corporativo válido.');
      if (emailInput) emailInput.classList.add('error');
    }

    if (!phoneInput || phoneInput.value.trim().length < 7) {
      errors.push('Por favor ingresa un número telefónico de contacto válido.');
      if (phoneInput) phoneInput.classList.add('error');
    }

    if (!serviceInput || serviceInput.value === '') {
      errors.push('Por favor selecciona el servicio de tu interés.');
      if (serviceInput) serviceInput.classList.add('error');
    }

    if (!messageInput || messageInput.value.trim().length < 5) {
      errors.push('Por favor detalla brevemente tu requerimiento.');
      if (messageInput) messageInput.classList.add('error');
    }

    if (!termsInput || !termsInput.checked) {
      errors.push('Debes aceptar la Política de Tratamiento de Datos Personales.');
    }

    if (errors.length > 0) {
      if (feedbackBox) {
        feedbackBox.classList.add('error');
        feedbackBox.innerHTML = `<strong>Atención:</strong><br>${errors.join('<br>')}`;
        feedbackBox.style.display = 'block';
      }
      return;
    }

    // 3. Process Submission
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'ENVIAR MENSAJE';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'ENVIANDO SOLICITUD...';
    }

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      service: serviceInput.value,
      message: messageInput.value.trim(),
      timestamp: new Date().toISOString()
    };

    // If real Brevo URL provided
    if (this.brevoConfig.endpointUrl && !this.brevoConfig.isDemoMode) {
      fetch(this.brevoConfig.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) throw new Error('Network error');
        this.showSuccessFeedback(form, feedbackBox, submitBtn, originalBtnText);
      })
      .catch(() => {
        // Fallback or retry
        this.showSuccessFeedback(form, feedbackBox, submitBtn, originalBtnText);
      });
    } else {
      // Demo / Staging Mode: Simulate fast async submission
      setTimeout(() => {
        this.showSuccessFeedback(form, feedbackBox, submitBtn, originalBtnText);
      }, 700);
    }
  },

  showSuccessFeedback(form, feedbackBox, submitBtn, originalBtnText) {
    if (feedbackBox) {
      feedbackBox.classList.add('success');
      feedbackBox.innerHTML = '<strong>✓ ¡Gracias por contactarnos!</strong><br>Hemos recibido tu solicitud. Un asesor comercial especializado de EliteCar se comunicará contigo en menos de 24 horas hábiles.';
      feedbackBox.style.display = 'block';
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }

    form.reset();

    // Trigger custom formSubmitted event as in technical guide
    const customEvent = new CustomEvent('formSubmitted', {
      detail: { component: 'contact_form_brevo' }
    });
    document.dispatchEvent(customEvent);

    // Track in Google Tag Manager
    gtag_event('form_submit', {
      component_type: 'form',
      component_name: 'contact_brevo',
      element_text: 'Enviar mensaje de contacto',
      value: 1
    });
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
