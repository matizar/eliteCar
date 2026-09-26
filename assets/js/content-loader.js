/**
 * EliteCar - Dynamic Content Loader Module
 * Carga de forma dinámica y desacoplada todos los contenidos desde los documentos JSON
 * establecidos en la carpeta /data/ para el Home y para las páginas internas.
 * 
 * Soporta actualización en tiempo real desde JSON en servidores web (HTTP/HTTPS)
 * y cuenta con respaldo automático (data-bundle.js) si se ejecuta desde file:// o sin red.
 */

const ContentLoader = {
  isSubfolder: false,
  basePath: 'data/',

  init() {
    this.isSubfolder = window.location.pathname.includes('/services/') || 
                       window.location.href.includes('/services/');
    this.basePath = this.isSubfolder ? '../data/' : 'data/';

    // Detectar tipo de página
    if (document.querySelector('.hero-slider-section') || document.querySelector('#corporativo')) {
      this.loadHomePage();
    } else if (window.location.pathname.includes('quienes-somos.html') || window.location.href.includes('quienes-somos.html')) {
      this.loadAboutPage();
    } else if (this.isSubfolder) {
      this.loadServiceDetailPage();
    } else {
      // Páginas legales o generales: cargar navegación y datos de contacto compartidos
      this.loadGeneralPage();
    }
  },

  /**
   * Helper para obtener JSON con timestamp anti-caché y fallback seguro
   */
  async fetchJSON(name) {
    // Si estamos en file:// intentar primero el fallback si está disponible
    if (window.location.protocol === 'file:' && window.ELITECAR_DATA && window.ELITECAR_DATA[name]) {
      return window.ELITECAR_DATA[name];
    }

    try {
      const response = await fetch(`${this.basePath}${name}.json?_t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} cargando ${name}.json`);
      }
      return await response.json();
    } catch (err) {
      if (window.ELITECAR_DATA && window.ELITECAR_DATA[name]) {
        console.info(`ContentLoader: Usando respaldo local para "${name}.json" (${err.message})`);
        return window.ELITECAR_DATA[name];
      }
      console.warn(`ContentLoader: No fue posible cargar "${name}.json" ni existe respaldo:`, err);
      return null;
    }
  },

  /**
   * Ajuste inteligente de rutas relativas según el nivel de directorio
   */
  adjustPath(path) {
    if (!path) return '#';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('tel:') || path.startsWith('mailto:') || path.startsWith('#')) {
      return path;
    }

    if (this.isSubfolder) {
      if (path.startsWith('services/')) {
        return path.replace('services/', '');
      }
      if (!path.startsWith('../')) {
        return '../' + path;
      }
    } else {
      if (path.startsWith('../')) {
        return path.replace('../', '');
      }
    }
    return path;
  },

  /**
   * Iconos vectoriales SVG optimizados para la sección de beneficios
   */
  getBenefitIconSvg(iconType) {
    switch (iconType) {
      case 'shield':
      case 'seguridad':
        return '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>';
      case 'telemetry':
      case 'tecnologia':
        return '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>';
      case 'quality':
      case 'calidad':
        return '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>';
      case 'maintenance':
      case 'mantenimiento':
        return '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>';
      case 'handshake':
      case 'conductores':
        return '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>';
      case 'invoice':
      case 'facturacion':
        return '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>';
      default:
        return '<circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline>';
    }
  },

  // =========================================================================
  // CARGA DE PÁGINA HOME DINÁMICA
  // =========================================================================
  async loadHomePage() {
    try {
      const [navData, sliderData, corpData, servicesData, benefitsData, faqData, mapData] = await Promise.all([
        this.fetchJSON('navigation'),
        this.fetchJSON('slider'),
        this.fetchJSON('corporate'),
        this.fetchJSON('services'),
        this.fetchJSON('benefits'),
        this.fetchJSON('faq'),
        this.fetchJSON('map')
      ]);

      if (navData) this.renderNavigation(navData);
      if (sliderData) this.renderSlider(sliderData);
      if (corpData) this.renderCorporate(corpData);
      if (servicesData) this.renderServices(servicesData);
      if (benefitsData) this.renderBenefits(benefitsData);
      if (faqData) this.renderFaq(faqData);
      if (mapData) this.renderMapAndContact(mapData);

      this.afterRender();
    } catch (e) {
      console.error('ContentLoader: Error en la carga del Home:', e);
    }
  },

  // =========================================================================
  // RENDER HERO SLIDER (slider.json)
  // =========================================================================
  renderSlider(data) {
    if (!data || !data.slides || !data.slides.length) return;
    const track = document.querySelector('.hero-slider-section .slider-track');
    if (!track) return;

    let html = '';
    data.slides.forEach((slide, idx) => {
      const activeClass = idx === 0 ? 'active' : '';
      const ctaLink = this.adjustPath(slide.ctaLink);
      const isFirst = idx === 0;

      html += `
        <div class="slide-item ${activeClass}">
          <img src="${this.adjustPath(slide.image)}" alt="${slide.alt || slide.title}" class="slide-image">
          <div class="slide-overlay"></div>
          <div class="slide-content">
            <span class="slide-badge">${slide.badge || 'ELITECAR'}</span>
            ${isFirst 
              ? `<h1 class="slide-title">${slide.title}</h1>` 
              : `<h2 class="slide-title" style="font-size: var(--font-size-h1);">${slide.title}</h2>`
            }
            <p class="slide-subtitle">${slide.subtitle}</p>
            <a href="${ctaLink}" class="btn hero-cta">${slide.ctaText || 'CONOCE MÁS'}</a>
          </div>
        </div>
      `;
    });

    track.innerHTML = html;

    // Re-inicializar slider interactivo
    if (window.heroSliderInstance) {
      window.heroSliderInstance.reinit({
        autoplay: data.autoplay !== undefined ? data.autoplay : true,
        autoplayDelay: data.autoplayDelay || 4500
      });
    } else if (typeof HeroSlider === 'function') {
      window.heroSliderInstance = new HeroSlider('.hero-slider-section', {
        autoplay: data.autoplay !== undefined ? data.autoplay : true,
        autoplayDelay: data.autoplayDelay || 4500
      });
    }
  },

  // =========================================================================
  // RENDER BLOQUE CORPORATIVO (corporate.json)
  // =========================================================================
  renderCorporate(data) {
    if (!data) return;
    const section = document.querySelector('#corporativo');
    if (!section) return;

    const badge = section.querySelector('.corporate-header .badge-tag');
    if (badge && data.badge) badge.textContent = data.badge;

    const headline = section.querySelector('.corporate-headline');
    if (headline && data.title) headline.textContent = data.title;

    const lead = section.querySelector('.corporate-lead');
    if (lead && data.lead) lead.textContent = data.lead;

    // Columnas de texto
    const textGrid = section.querySelector('.corporate-grid');
    if (textGrid && data.columns && data.columns.length) {
      textGrid.innerHTML = data.columns.map(col => `
        <div class="corporate-text-column">
          <p>${col.paragraph}</p>
        </div>
      `).join('');
    }

    // Métricas cuantitativas
    const metricsGrid = section.querySelector('.metrics-grid');
    if (metricsGrid && data.metrics && data.metrics.length) {
      metricsGrid.innerHTML = data.metrics.map(m => `
        <div class="metric-card">
          <div class="metric-value">${m.value}</div>
          <div class="metric-label">${m.label}</div>
          <div class="metric-detail">${m.detail}</div>
        </div>
      `).join('');
    }
  },

  // =========================================================================
  // RENDER SERVICIOS CAROUSEL (services.json)
  // =========================================================================
  renderServices(data) {
    if (!data || !data.services) return;
    const section = document.querySelector('.services-section');
    if (!section) return;

    const title = section.querySelector('.section-header .section-title');
    if (title && data.sectionTitle) title.textContent = data.sectionTitle;

    const subtitle = section.querySelector('.section-header .section-subtitle');
    if (subtitle && data.sectionSubtitle) subtitle.textContent = data.sectionSubtitle;

    const track = section.querySelector('.services-track');
    if (track) {
      track.innerHTML = data.services.map(s => `
        <article class="service-card" data-service-id="${s.id}">
          <div class="service-card-media">
            <img src="${this.adjustPath(s.image)}" alt="${s.alt || s.name}" class="service-card-img" loading="lazy">
            <span class="service-card-category">${s.category || 'Servicio'}</span>
          </div>
          <div class="service-card-body">
            <h3 class="service-card-title">${s.name}</h3>
            <p class="service-card-desc">${s.description}</p>
            <a href="${this.adjustPath(s.link)}" class="btn btn-sm service-card-cta">${s.ctaText || 'CONOCE MÁS'}</a>
          </div>
        </article>
      `).join('');
    }

    // Sincronizar el select del formulario de contacto con los servicios cargados
    const serviceSelect = document.querySelector('#contact-service');
    if (serviceSelect && data.services) {
      const currentVal = serviceSelect.value;
      let optionsHtml = '<option value="">Selecciona una opción...</option>';
      data.services.forEach(s => {
        optionsHtml += `<option value="${s.name}">${s.name}</option>`;
      });
      optionsHtml += '<option value="Otro Servicio">Otra Solución Corporativa</option>';
      serviceSelect.innerHTML = optionsHtml;
      if (currentVal) serviceSelect.value = currentVal;
    }

    // Re-inicializar carrusel
    if (window.servicesCarouselInstance) {
      window.servicesCarouselInstance.reinit();
    } else if (typeof ServicesCarousel === 'function') {
      window.servicesCarouselInstance = new ServicesCarousel('.services-section');
    }
  },

  // =========================================================================
  // RENDER BENEFICIOS (benefits.json)
  // =========================================================================
  renderBenefits(data) {
    if (!data) return;
    const section = document.querySelector('#beneficios');
    if (!section) return;

    const title = section.querySelector('.section-header .section-title');
    if (title && data.title) title.textContent = data.title;

    const subtitle = section.querySelector('.section-header .section-subtitle');
    if (subtitle && data.subtitle) subtitle.textContent = data.subtitle;

    const grid = section.querySelector('.benefits-grid');
    if (grid && data.items && data.items.length) {
      grid.innerHTML = data.items.map(item => `
        <div class="benefit-card">
          <div class="benefit-icon-wrapper">
            <svg class="benefit-icon" viewBox="0 0 24 24">
              ${this.getBenefitIconSvg(item.icon)}
            </svg>
          </div>
          <h3 class="benefit-title">${item.title}</h3>
          <p class="benefit-desc">${item.description}</p>
        </div>
      `).join('');
    }

    const ctaBtn = section.querySelector('.benefits-cta-box a');
    if (ctaBtn && data.cta) {
      if (data.cta.text) ctaBtn.textContent = data.cta.text;
      if (data.cta.link) ctaBtn.setAttribute('href', this.adjustPath(data.cta.link));
    }
  },

  // =========================================================================
  // RENDER FAQ ACCORDION (faq.json)
  // =========================================================================
  renderFaq(data) {
    if (!data || !data.questions) return;
    const section = document.querySelector('#faq');
    if (!section) return;

    const title = section.querySelector('.section-header .section-title');
    if (title && data.title) title.textContent = data.title;

    const subtitle = section.querySelector('.section-header .section-subtitle');
    if (subtitle && data.subtitle) subtitle.textContent = data.subtitle;

    // Foto lateral
    if (data.sideImage) {
      const sideImg = section.querySelector('.faq-side-img');
      if (sideImg && data.sideImage.url) {
        sideImg.src = this.adjustPath(data.sideImage.url);
        sideImg.alt = data.sideImage.alt || 'EliteCar Transporte Empresarial';
      }
      const sideBadge = section.querySelector('.faq-image-badge');
      if (sideBadge && data.sideImage.badge) sideBadge.textContent = data.sideImage.badge;
    }

    // Lista de preguntas
    const faqList = section.querySelector('.faq-list');
    if (faqList && data.questions.length) {
      faqList.innerHTML = data.questions.map((q, idx) => `
        <div class="faq-item">
          <button class="faq-trigger" aria-expanded="false">
            <div class="faq-question-wrap">
              <span class="faq-number">${idx + 1}</span>
              <span class="faq-question">${q.question}</span>
            </div>
            <span class="faq-indicator">+</span>
          </button>
          <div class="faq-answer" aria-hidden="true">
            <div class="faq-answer-inner">
              ${q.answer}
            </div>
          </div>
        </div>
      `).join('');
    }

    // Re-inicializar acordeón FAQ
    if (window.faqAccordionInstance) {
      window.faqAccordionInstance.reinit({
        initialDisplay: data.initialDisplay || 5,
        defaultOpen: data.defaultOpen !== undefined ? data.defaultOpen : 0
      });
    } else if (typeof FAQAccordion === 'function') {
      window.faqAccordionInstance = new FAQAccordion('.faq-accordion-box');
    }
  },

  // =========================================================================
  // RENDER MAPA Y CONTACTO (map.json)
  // =========================================================================
  renderMapAndContact(data) {
    if (!data) return;
    const section = document.querySelector('#contacto');
    if (!section) return;

    const title = section.querySelector('.section-header .section-title');
    if (title && data.title) title.textContent = data.title;

    const subtitle = section.querySelector('.section-header .section-subtitle');
    if (subtitle && data.subtitle) subtitle.textContent = data.subtitle;

    // Renderizar pines dinámicos en el mapa interactivo
    const mapContainer = section.querySelector('.map-interactive-container');
    if (mapContainer && data.pins && data.pins.length) {
      // Eliminar pines previos sin tocar el SVG de fondo
      mapContainer.querySelectorAll('.map-pin').forEach(p => p.remove());

      const activePins = data.pins.filter(p => p.show !== false);
      activePins.forEach((pin, idx) => {
        const pinDiv = document.createElement('div');
        pinDiv.className = `map-pin ${idx === 0 ? 'active' : ''}`;
        pinDiv.style.left = pin.coordinates.x;
        pinDiv.style.top = pin.coordinates.y;
        pinDiv.setAttribute('data-city', pin.city);

        pinDiv.innerHTML = `
          <div class="pin-pulse"></div>
          <svg class="pin-icon" viewBox="0 0 24 24" fill="#F2CD16" stroke="#141C1C" stroke-width="1.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <div class="map-tooltip">
            <strong>${pin.city} ${pin.role ? `(${pin.role})` : ''}</strong><br>
            ${pin.description || ''}
          </div>
        `;
        mapContainer.appendChild(pinDiv);
      });

      // Re-inicializar módulo de mapa
      if (window.MapModule && typeof window.MapModule.init === 'function') {
        window.MapModule.init();
      }
    }

    // Actualizar datos de contacto directo de la empresa
    if (data.companyInfo) {
      const c = data.companyInfo;
      const contactInfoList = section.querySelector('.contact-info-list');
      if (contactInfoList) {
        contactInfoList.innerHTML = `
          <div class="contact-info-item">
            <svg class="contact-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <div class="contact-info-text">
              <strong>Sede Principal</strong>
              <span>${c.address || 'Bogotá D.C., Colombia'}</span>
            </div>
          </div>

          <div class="contact-info-item">
            <svg class="contact-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <div class="contact-info-text">
              <strong>Líneas de Atención</strong>
              <a href="tel:${(c.phoneMobile || c.phone || '').replace(/[^0-9+]/g, '')}">${c.phone || c.phoneMobile || '+57 (601) 745-8890'}</a>
            </div>
          </div>

          <div class="contact-info-item">
            <svg class="contact-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <div class="contact-info-text">
              <strong>Correo Electrónico</strong>
              <a href="mailto:${c.email || 'contacto@elitecar.com.co'}">${c.email || 'contacto@elitecar.com.co'}</a>
            </div>
          </div>

          <div class="contact-info-item">
            <svg class="contact-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div class="contact-info-text">
              <strong>Horario Operativo</strong>
              <span>${c.hours || 'Centro de Control 24 Horas / 365 Días'}</span>
            </div>
          </div>
        `;
      }

      // Actualizar botón flotante de WhatsApp
      this.updateWhatsappLinks(c.whatsappNumber, c.whatsappMessage);

      // Actualizar pie de página con datos de contacto
      this.updateFooterContact(c);
    }
  },

  /**
   * Actualiza el botón flotante de WhatsApp y enlaces wa.me
   */
  updateWhatsappLinks(whatsappNumber, whatsappMessage) {
    if (!whatsappNumber) return;
    const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(whatsappMessage || 'Hola EliteCar, deseo información sobre servicios de transporte.');
    const waUrl = `https://wa.me/${cleanNum}?text=${encodedMsg}`;

    const floatBtn = document.querySelector('.whatsapp-floating-btn');
    if (floatBtn) floatBtn.setAttribute('href', waUrl);
  },

  /**
   * Actualiza datos de contacto en el Footer
   */
  updateFooterContact(info) {
    if (!info) return;
    const footer = document.querySelector('.site-footer');
    if (!footer) return;

    const contactP = footer.querySelectorAll('.footer-contact-p');
    if (contactP.length >= 3) {
      if (info.address) {
        contactP[0].innerHTML = `<strong>Dirección:</strong><br>${info.address}`;
      }
      if (info.phone || info.phoneMobile) {
        const pNum = info.phone || info.phoneMobile;
        contactP[1].innerHTML = `<strong>Teléfono:</strong><br><a href="tel:${pNum.replace(/[^0-9+]/g, '')}" style="color: var(--color-primary);">${pNum}</a>`;
      }
      if (info.email) {
        contactP[2].innerHTML = `<strong>Email Corporativo:</strong><br><a href="mailto:${info.email}" style="color: var(--color-primary);">${info.email}</a>`;
      }
    }
  },

  // =========================================================================
  // RENDER NAVEGACIÓN Y MENÚ (navigation.json)
  // =========================================================================
  renderNavigation(data) {
    if (!data) return;
    const navMenu = document.querySelector('#nav-menu');
    if (navMenu && data.items && data.items.length) {
      let navHtml = '';
      data.items.forEach(item => {
        if (item.type === 'dropdown' && item.items) {
          navHtml += `
            <div class="nav-item has-dropdown">
              <a href="${this.adjustPath(item.path)}" class="nav-link" aria-haspopup="true" aria-expanded="false">
                ${item.label}
                <svg class="dropdown-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </a>
              <div class="dropdown-menu" role="menu">
                ${item.items.map(sub => `
                  <a href="${this.adjustPath(sub.path)}" class="dropdown-link" role="menuitem">${sub.label}</a>
                `).join('')}
              </div>
            </div>
          `;
        } else {
          navHtml += `
            <div class="nav-item">
              <a href="${this.adjustPath(item.path)}" class="nav-link">${item.label}</a>
            </div>
          `;
        }
      });
      navMenu.innerHTML = navHtml;

      // Re-vincular eventos del menú de navegación
      if (window.NavigationModule && typeof window.NavigationModule.init === 'function') {
        window.NavigationModule.init();
      }
    }

    // Botón CTA del Header
    if (data.cta) {
      const headerCta = document.querySelector('.header-cta-btn');
      if (headerCta) {
        if (data.cta.label) headerCta.textContent = data.cta.label;
        if (data.cta.path) headerCta.setAttribute('href', this.adjustPath(data.cta.path));
      }
    }
  },

  // =========================================================================
  // CARGA DINÁMICA DE CONTENIDO INTERNO: QUIÉNES SOMOS (about.json)
  // =========================================================================
  async loadAboutPage() {
    try {
      const [aboutData, navData, mapData] = await Promise.all([
        this.fetchJSON('about'),
        this.fetchJSON('navigation'),
        this.fetchJSON('map')
      ]);

      if (navData) this.renderNavigation(navData);
      if (mapData && mapData.companyInfo) {
        this.updateWhatsappLinks(mapData.companyInfo.whatsappNumber, mapData.companyInfo.whatsappMessage);
        this.updateFooterContact(mapData.companyInfo);
      }

      if (!aboutData) return;

      // Hero interno
      if (aboutData.hero) {
        const h = aboutData.hero;
        const breadcrumb = document.querySelector('.inner-breadcrumbs span');
        if (breadcrumb && h.breadcrumb) breadcrumb.textContent = h.breadcrumb;

        const badge = document.querySelector('.page-hero-inner .badge-tag');
        if (badge && h.badge) badge.textContent = h.badge;

        const title = document.querySelector('.inner-page-title');
        if (title && h.title) title.textContent = h.title;

        const lead = document.querySelector('.inner-page-lead');
        if (lead && h.lead) lead.textContent = h.lead;
      }

      // Historia & Propósito
      if (aboutData.story) {
        const s = aboutData.story;
        const storyGrid = document.querySelector('.service-detail-grid');
        if (storyGrid) {
          const badge = storyGrid.querySelector('.badge-tag');
          if (badge && s.badge) badge.textContent = s.badge;

          const h2 = storyGrid.querySelector('.section-title');
          if (h2 && s.title) h2.textContent = s.title;

          const pElements = storyGrid.querySelectorAll('p');
          if (s.paragraphs && s.paragraphs.length) {
            s.paragraphs.forEach((pText, i) => {
              if (pElements[i]) pElements[i].textContent = pText;
            });
          }

          const img = storyGrid.querySelector('.service-detail-img');
          if (img && s.image) {
            img.src = this.adjustPath(s.image);
            img.alt = s.alt || 'EliteCar Operaciones';
          }
        }
      }

      // Pilares (Misión, Visión, Valores)
      if (aboutData.pillars && aboutData.pillars.length) {
        const featuresList = document.querySelector('.service-features-list');
        if (featuresList) {
          featuresList.innerHTML = aboutData.pillars.map(p => `
            <div class="service-feature-item">
              <svg class="feature-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <div>
                <strong>${p.label}:</strong> ${p.text}
              </div>
            </div>
          `).join('');
        }
      }

      // Métricas de trayectoria
      if (aboutData.metrics && aboutData.metrics.length) {
        const metricsGrid = document.querySelector('.metrics-grid');
        if (metricsGrid) {
          metricsGrid.innerHTML = aboutData.metrics.map(m => `
            <div class="metric-card">
              <div class="metric-value">${m.value}</div>
              <div class="metric-label">${m.label}</div>
              <div class="metric-detail">${m.detail}</div>
            </div>
          `).join('');
        }
      }

      this.afterRender();
    } catch (e) {
      console.error('ContentLoader: Error cargando Quiénes Somos:', e);
    }
  },

  // =========================================================================
  // CARGA DINÁMICA DE CONTENIDO INTERNO: SERVICIOS DETALLE (services-detail.json)
  // =========================================================================
  async loadServiceDetailPage() {
    try {
      const [servicesDetailData, navData, mapData] = await Promise.all([
        this.fetchJSON('services-detail'),
        this.fetchJSON('navigation'),
        this.fetchJSON('map')
      ]);

      if (navData) this.renderNavigation(navData);
      if (mapData && mapData.companyInfo) {
        this.updateWhatsappLinks(mapData.companyInfo.whatsappNumber, mapData.companyInfo.whatsappMessage);
        this.updateFooterContact(mapData.companyInfo);
      }

      if (!servicesDetailData) return;

      // Obtener el ID del servicio según el archivo actual
      // ej: "transporte-aeropuerto.html" -> "transporte-aeropuerto"
      const pathParts = window.location.pathname.split('/');
      let currentFile = pathParts[pathParts.length - 1];
      if (!currentFile || currentFile === '') currentFile = 'rutas-empresariales.html';
      const serviceId = currentFile.replace('.html', '');

      const sData = servicesDetailData[serviceId];
      if (!sData) {
        console.info(`ContentLoader: No se encontró detalle específico para ID "${serviceId}"`);
        return;
      }

      // Hero del servicio
      const breadcrumb = document.querySelector('.inner-breadcrumbs span');
      if (breadcrumb && sData.breadcrumb) breadcrumb.textContent = sData.breadcrumb;

      const badge = document.querySelector('.page-hero-inner .badge-tag');
      if (badge && sData.badge) badge.textContent = sData.badge;

      const title = document.querySelector('.inner-page-title');
      if (title && sData.title) title.textContent = sData.title;

      const lead = document.querySelector('.inner-page-lead');
      if (lead && sData.lead) lead.textContent = sData.lead;

      // Contenido Showcase
      const showcase = document.querySelector('.service-detail-grid');
      if (showcase) {
        const secBadge = showcase.querySelector('.badge-tag');
        if (secBadge && sData.sectionBadge) secBadge.textContent = sData.sectionBadge;

        const secTitle = showcase.querySelector('.section-title');
        if (secTitle && sData.sectionTitle) secTitle.textContent = sData.sectionTitle;

        const descP = showcase.querySelector('p');
        if (descP && sData.paragraphs && sData.paragraphs.length) {
          descP.textContent = sData.paragraphs[0];
        }

        // Lista de atributos y características
        const featuresList = showcase.querySelector('.service-features-list');
        if (featuresList && sData.features && sData.features.length) {
          featuresList.innerHTML = sData.features.map(f => `
            <div class="service-feature-item">
              <svg class="feature-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <div>
                <strong>${f.title}:</strong> ${f.description}
              </div>
            </div>
          `).join('');
        }

        // Botones de acción CTA
        const btnContainer = showcase.querySelector('div[style*="margin-top"]');
        if (btnContainer) {
          const btns = btnContainer.querySelectorAll('.btn');
          if (btns.length >= 2) {
            if (sData.ctaQuote) {
              btns[0].textContent = sData.ctaQuote.text;
              btns[0].setAttribute('href', this.adjustPath(sData.ctaQuote.link));
            }
            if (sData.ctaWhatsapp) {
              btns[1].textContent = sData.ctaWhatsapp.text;
              const waNum = (mapData && mapData.companyInfo) ? mapData.companyInfo.whatsappNumber : '573108901234';
              const waMsg = encodeURIComponent(sData.ctaWhatsapp.message || 'Deseo cotizar servicio');
              btns[1].setAttribute('href', `https://wa.me/${waNum}?text=${waMsg}`);
            }
          }
        }

        // Imagen de detalle
        const img = showcase.querySelector('.service-detail-img');
        if (img && sData.image) {
          img.src = this.adjustPath(sData.image);
          img.alt = sData.alt || sData.title;
        }
      }

      this.afterRender();
    } catch (e) {
      console.error('ContentLoader: Error cargando detalle de servicio:', e);
    }
  },

  // =========================================================================
  // CARGA DE PÁGINAS GENERALES (Páginas Legales, etc.)
  // =========================================================================
  async loadGeneralPage() {
    try {
      const [navData, mapData] = await Promise.all([
        this.fetchJSON('navigation'),
        this.fetchJSON('map')
      ]);

      if (navData) this.renderNavigation(navData);
      if (mapData && mapData.companyInfo) {
        this.updateWhatsappLinks(mapData.companyInfo.whatsappNumber, mapData.companyInfo.whatsappMessage);
        this.updateFooterContact(mapData.companyInfo);
      }

      this.afterRender();
    } catch (e) {
      console.error('ContentLoader: Error en página general:', e);
    }
  },

  /**
   * Tareas posteriores al renderizado dinámico (smooth scroll, GTM y eventos)
   */
  afterRender() {
    // Refrescar smooth scrolling y seguimiento CTA si MainApp está cargado
    if (window.MainApp && typeof window.MainApp.initSmoothScroll === 'function') {
      window.MainApp.initSmoothScroll();
      window.MainApp.initCtaTracking();
    }

    // Disparar evento personalizado para observadores externos
    document.dispatchEvent(new CustomEvent('dynamicContentLoaded', {
      detail: { isSubfolder: this.isSubfolder }
    }));
  }
};

// Inicialización automática
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ContentLoader.init());
} else {
  ContentLoader.init();
}
