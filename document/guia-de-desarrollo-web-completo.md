EliteCar - Documento Técnico de Desarrollo Web
==============================================

> **Versión:** 1.0  
> **Fecha:** 26 de septiembre de 2026  
> **Estado:** Especificación Técnica para Implementación

* * *

Tabla de Contenidos
-------------------

1. [Resumen del Proyecto](https://lumo.proton.me/#resumen-del-proyecto)
2. [Especificaciones de Diseño](https://lumo.proton.me/#especificaciones-de-dise%C3%B1o)
3. [Arquitectura del Sitio](https://lumo.proton.me/#arquitectura-del-sitio)
4. [Componentes Interactivos](https://lumo.proton.me/#componentes-interactivos)
5. [Gestión de Contenidos](https://lumo.proton.me/#gesti%C3%B3n-de-contenidos)
6. [Consideraciones Técnicas](https://lumo.proton.me/#consideraciones-tecnicas)
7. [SEO y Optimización](https://lumo.proton.me/#seo-y-optimizaci%C3%B3n)
8. [Seguridad y Privacidad](https://lumo.proton.me/#seguridad-y-privacidad)
9. [Estructura de Archivos](https://lumo.proton.me/#estructura-de-archivos)
10. [Anexos y Ejemplos](https://lumo.proton.me/#anexos-y-ejemplos)

* * *

Resumen del Proyecto
--------------------

Sitio web corporativo responsivo para EUTE CAR, empresa de soluciones de transporte empresarial. El sitio consta de:

* **Home Page** (versión desktop, tablet y mobile)
* **3 páginas internas** para servicios destacados
* **Páginas legales** (Política de Privacidad, Términos de Servicio, Cookies)
* **Página corporativa** (Quiénes Somos)
* **Botón flotante de WhatsApp** con delay de seguridad
* **Banner de cookies** informativo

**Stack Tecnológico:** HTML5 + CSS3 + JavaScript Vanilla (sin frameworks pesados)

* * *

Especificaciones de Diseño
--------------------------

### 2.1 Paleta de Colores

    /* === COLORES PRIMARIOS === */
    --color-primary: #F2CD16;           /* Amarillo principal */
    --color-primary-hover: #FFDF3D;     /* Amarillo brillante para hover */
    --color-primary-active: #FFEA00;    /* Amarillo presionado */
    --color-inactive: #CCCCCC;          /* Estado inactivo */
    
    /* === FONDO === */
    --color-bg-light: #FDFEFE;          /* Blanco con tono frío */
    --color-bg-dark: #141C1C;           /* Oscuro principal */
    --color-bg-dark-alt: #414D4D;       /* Oscuro alternativo */
    
    /* === TIPOGRAFÍA OSCURA (sobre fondo claro) === */
    --color-text-primary: #141C1C;      /* Principal - pesos fuertes */
    --color-text-secondary: #414D4D;    /* Secundaria - pesos medios */
    --color-text-muted: #999999;        /* Atributos/muted */
    
    /* === TIPOGRAFÍA CLARA (sobre fondo oscuro) === */
    --color-text-light: #FFFFFF;        /* Blanco puro */
    --color-text-light-muted: #999999;  /* Gris atenuado */

> **Nota de implementación:** El color `--color-primary-active` (#FFEA00) debe retornar rápidamente a `--color-primary` mediante transición CSS con duración máxima de 150ms.

### 2.2 Tipografía - Montserrat

    /* === IMPORTACIÓN DE FUENTES === */
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Montserrat:ital@1&display=swap');
    
    :root {
      --font-family: 'Montserrat', sans-serif;
      --font-logo: 'Montserrat', sans-serif;  /* Itálica aplicada inline */
    
      /* BASE: 16px (escala modular 8px) */
      --font-size-base: 1rem;              /* 16px */
      --font-size-sm: 0.875rem;            /* 14px */
      --font-size-xs: 0.75rem;             /* 12px */
    
      /* JERARQUÍA HEADING */
      --font-size-h1: 3rem;                /* 48px - Mobile primero, escalar arriba */
      --font-size-h2: 2.25rem;             /* 36px */
      --font-size-h3: 1.5rem;              /* 24px */
      --font-size-h4: 1.25rem;             /* 20px */
    }
    
    /* Logo en itálica */
    .logo-text {
      font-style: italic;
      font-weight: 700;
    }

### 2.3 Sistema de Espaciado

Base: **Múltiplos de 4px**, preferentemente 8px
    :root {
      --space-1: 0.25rem;   /* 4px */
      --space-2: 0.5rem;    /* 8px */
      --space-3: 1rem;      /* 16px */
      --space-4: 1.5rem;    /* 24px */
      --space-5: 2rem;      /* 32px */
      --space-6: 3rem;      /* 48px */
      --space-7: 4rem;      /* 64px */
      --space-8: 6rem;      /* 96px */

      /* MARGENES DE SECCIÓN */
      --section-padding-mobile: var(--space-5);
      --section-padding-desktop: var(--space-7);
    }

### 2.4 Breakpoints

| Nombre           | Ancho  | Aplicación            |
| ---------------- | ------ | --------------------- |
| `mobile-lite`    | 320px  | Dispositivos pequeños |
| `mobile`         | 400px  | Smartphones estándar  |
| `tablet`         | 768px  | Tablets portrait      |
| `desktop-laptop` | 1024px | Laptops               |
| `desktop`        | 1200px | Monitores medios      |
| `desktop-large`  | 1600px | Monitores grandes     |

    /* Mobile-first approach */
    @media (min-width: 768px) { /* tablet */ }
    @media (min-width: 1024px) { /* laptop */ }
    @media (min-width: 1200px) { /* desktop */ }
    @media (min-width: 1600px) { /* large desktop */ }

### 2.5 Observaciones de Diseño Detectadas

| Elemento               | Preocupación                         | Recomendación                                |
| ---------------------- | ------------------------------------ | -------------------------------------------- |
| Contraste blanco/negro | Usuario solicitó atenuación          | ✅ Aplicado: #FDFEFE (fondo), #414D4D (texto) |
| Logo itálica           | Puede afectar legibilidad            | Usar solo en logotipo, no en body text       |
| Animación fugaz hover  | Muy rápida puede ser imperceptible   | 150-200ms transición es adecuada             |
| 5 breakpoints          | Puede generar duplicidad 1024/1200px | Considerar consolidar a 4 breakpoints        |

* * *

Arquitectura del Sitio
----------------------

### 3.1 Mapa de Páginas

    / (home)
    ├── /servicios/rutas-empresariales
    ├── /servicios/transporte-aeropuerto
    ├── /servicios/alquiler-temporal
    ├── /quienes-somos
    ├── /politica-privacidad
    ├── /terminos-servicio
    └── /cookies

### 3.2 Estructura HTML Semántica

    <!DOCTYPE html>
    <html lang="es">
    <head>
      <!-- Meta tags esenciales (ver sección SEO) -->
    </head>
    <body>
      <header class="site-header">
        <!-- Navegación (ver componente Menú) -->
      </header>
    
      <main>
        <!-- Hero Slider -->
        <!-- Sección Servicios -->
        <!-- Sección Beneficios -->
        <!-- Sección FAQ -->
        <!-- Sección Contacto + Mapa -->
      </main>
    
      <footer class="site-footer">
        <!-- Enlaces legales, redes sociales, créditos -->
      </footer>
    
      <!-- WhatsApp Float Button -->
      <!-- Cookie Banner -->
    </body>
    </html>

* * *

Componentes Interactivos
------------------------

### 4.1 Hero Slider

    // config-slider.json
    {
      "autoplay": true,
      "autoplayDelay": 4500,
      "transition": "slide",
      "slidesCount": 4,
      "loop": true,
      "navigation": {
        "arrows": true,
        "dots": true
      },
      "slides": [
        {
          "image": "assets/images/slider/slide-1.webp",
          "alt": "Flota empresarial EliteCar",
          "title": "Movilidad empresarial que se adapta a tu operación",
          "ctaText": "Conoce nuestras soluciones",
          "ctaLink": "/servicios"
        }
      ]
    }

**Comportamientos:**

* Autoplay: 4.5s entre diapositivas (cíclico)
* Transición deslizamiento horizontal suave
* Flechas de navegación visibles en desktop/tablet
* Indicadores (dots) en parte inferior
* Pause on hover (opcional)

### 4.2 Carrusel de Servicios

    // config-services.json
    {
      "visible": {
        "desktop": 4,
        "tablet": 2,
        "mobile": "all-show-first-6-expand"
      },
      "navigation": {
        "type": "buttons",
        "swipe": true
      },
      "services": [
        {
          "id": "rutas-empresariales",
          "name": "Rutas Empresariales",
          "image": "assets/images/services/rutas.webp",
          "description": "Soluciones de transporte para commuting corporativo",
          "link": "/servicios/rutas-empresariales"
        }
      ]
    }

**Comportamientos por dispositivo:**

| Dispositivo         | Comportamiento                                                       |
| ------------------- | -------------------------------------------------------------------- |
| Desktop (≥1200px)   | 4 servicios visibles, botones navegación, swipe habilitado           |
| Tablet (768-1199px) | 2 servicios visibles, botones navegación, swipe habilitado           |
| Mobile (<768px)     | Primeros 6 servicios expandidos, botón "Ver más" despliega restantes |

### 4.3 Menú de Navegación

    // config-navigation.json
    {
      "items": [
        {
          "label": "Inicio",
          "path": "/",
          "type": "anchor"
        },
        {
          "label": "Servicios",
          "type": "dropdown",
          "items": [
            { "label": "Rutas Empresariales", "path": "/servicios/rutas-empresariales" },
            { "label": "Transporte Aeropuerto", "path": "/servicios/transporte-aeropuerto" },
            { "label": "Alquiler Temporal", "path": "/servicios/alquiler-temporal" }
          ]
        },
        {
          "label": "Quiénes Somos",
          "path": "/quienes-somos"
        },
        {
          "label": "Contacto",
          "path": "#contacto",
          "type": "anchor"
        }
      ],
      "behavior": {
        "mobile": "inline-dropdown",
        "servicesAnchor": true
      }
    }

**Comportamientos:**

| Dispositivo | Presentación           | Submenú Servicios   |
| ----------- | ---------------------- | ------------------- |
| Desktop     | Horizontal en header   | Dropdown clásico    |
| Tablet      | Horizontal o hamburger | Dropdown clásico    |
| Mobile      | Inline bajo header     | Acordeón expandible |

> **Nota crítica:** La opción "Servicios" en mobile es ancla a la misma página (#servicios), no navegación externa.

### 4.4 FAQ - Preguntas Frecuentes

    // config-faq.json
    {
      "initialDisplay": 5,
      "loadMore": true,
      "defaultOpen": 0,
      "questions": [
        {
          "question": "¿Qué tipos de vehículos están disponibles?",
          "answer": "Contamos con sedanes, SUVs y vans ejecutivas..."
        }
      ]
    }

**Comportamientos:**

* Mostrar 5 preguntas iniciales
* Primera pregunta desplegada por defecto
* Botón "Ver más preguntas" carga restante
* Comportamiento acordeón (una abierta a la vez)

### 4.5 Mapa Interactivo (Imagen Estática)

    // config-map.json
    {
      "image": "assets/images/map/colombia-map.webp",
      "interactive": true,
      "pins": [
        {
          "city": "Bogotá",
          "show": true,
          "coordinates": { "x": "52%", "y": "38%" },
          "label": "Operación Central - Bogotá"
        },
        {
          "city": "Medellín",
          "show": true,
          "coordinates": { "x": "28%", "y": "35%" },
          "label": "Oficina Regional - Medellín"
        },
        {
          "city": "Ciudad cercana Bogotá",
          "show": false,
          "coordinates": { "x": "50%", "y": "40%" },
          "label": "Ubicación oculta"
        }
      ]
    }

**Implementación:**

* Imagen estática de Colombia con hotspots SVG/absolute positioning
* Pins posicionados con % (responsive)
* Click/tap muestra tooltip con información
* JSON controla visibilidad por ciudad

### 4.6 Formulario de Contacto (Brevo CRM)

    <!-- Fragmento integrado de Brevo -->
    <div id="brevo-form-container">
      <!-- Código embebido proporcionado por Brevo -->
      <form action="https://api-brevo-endpoint" method="POST">
        <!-- Campos estándar -->
      </form>
    </div>
    
    <script>
    // Confirmación visual post-envío
    document.addEventListener('formSubmitted', (e) => {
      const confirmation = document.createElement('div');
      confirmation.className = 'form-success-message';
      confirmation.innerHTML = '¡Gracias! Hemos recibido tu mensaje.';
      e.target.after(confirmation);
    });
    </script>

### 4.7 Botón WhatsApp Flotante

    // whatsapp-float.js
    const WhatsAppFloat = {
      init() {
        // Crear elemento (oculto inicialmente)
        this.createFloat();
    
        // Esperar 3 segundos antes de mostrar
        setTimeout(() => {
          this.show();
          this.trackEvent('whatsapp_button_visible');
        }, 3000);
      },
    
      trackEvent() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'interaction',
          'component_type': 'floating_button',
          'component_name': 'whatsapp',
          'element_text': 'Contactar por WhatsApp',
          'value': 1
        });
      }
    };
    
    document.addEventListener('DOMContentLoaded', () => {
      WhatsAppFloat.init();
    });

### 4.8 Banner de Cookies

    // cookie-banner.js
    const CookieBanner = {
      COOKIE_NAME: 'elitecar_cookie_ack',
      COOKIE_AGE: 90, // días (3 meses)
    
      init() {
        if (!this.hasAccepted()) {
          this.show();
        }
      },
    
      accept() {
        this.setCookie(this.COOKIE_NAME, 'true', this.COOKIE_AGE);
        this.hide();
        // No GTM integration por ahora
      }
    };

**Presentación:**

* Texto simple: "Este sitio utiliza cookies para mejorar tu experiencia."
* Botón: "Entendido" / "Aceptar"
* Posición: Inferior (fixed)
* Periodo: 3 meses

* * *

Gestión de Contenidos
---------------------

### 5.1 Sistema JSON Local

**Ventajas:**

* Sin dependencias de backend
* Fácil edición (formato legible)
* Versionable con Git
* Validación simple

**Estructura recomendada:**

    /data/
    ├── navigation.json
    ├── slider.json
    ├── services.json
    ├── faq.json
    ├── map.json
    ├── benefits.json
    └── corporate.json

### 5.2 Ejemplo de Schema Unificado

    {
      "$schema": "./schemas/page-data.schema.json",
      "metadata": {
        "lastUpdated": "2026-09-26",
        "updatedBy": "[nombre-editor]"
      },
      "sections": {
        "hero": { ... },
        "services": { ... },
        "benefits": { ... }
      },
      "ctas": [
        {
          "text": "Cotiza ahora",
          "link": "/contacto",
          "variant": "primary"
        }
      ],
      "images": {
        "path": "assets/images/",
        "alt_mapping": {
          "service-1.webp": "Flota de vehículos para rutas empresariales"
        }
      }
    }

* * *

Consideraciones Técnicas
------------------------

### 6.1 Compatibilidad de Browsers

`✅ Soporte requerido: - Safari (iOS + macOS) - últimas 2 versiones - Chrome (Mobile + Desktop) - últimas 2 versiones - Samsung Browser - Microsoft Edge - última versión ⚠️ Considerar: - In-View Safari (WebView iOS) - evitar animaciones complejas - Windows/Mac corporativos (priorizar laptops)`

### 6.2 Performance Targets

| Métrica                 | Objetivo               |
| ----------------------- | ---------------------- |
| First Contentful Paint  | < 1.5s                 |
| Time to Interactive     | < 3s                   |
| Cumulative Layout Shift | < 0.1                  |
| Total Bundle Size       | < 500KB (sin imágenes) |

### 6.3 Optimización de Imágenes

    <!-- Formato prioritario -->
    <img src="service-thumbnail.webp" 
         alt="Descripción según servicio"
         loading="lazy"
         width="400"
         height="250">
    
    <!-- Fallback para browsers antiguos -->
    <picture>
      <source srcset="service-thumbnail.webp" type="image/webp">
      <img src="service-thumbnail.jpg" alt="...">
    </picture>

**Reglas:**

* Todas las imágenes: formato `.webp`
* Alt text obligatorio según contexto
* Lazy loading para imágenes below-the-fold
* Dimensiones explícitas (width/height) para evitar CLS

### 6.4 Google Tag Manager

    // data-layer-events.js
    window.dataLayer = window.dataLayer || [];
    
    function gtag_event(event_name, params) {
      window.dataLayer.push({
        'event': event_name,
        'component_type': params.component_type,
        'component_name': params.component_name,
        'element_text': params.element_text,
        'value': params.value || null
      });
    }
    
    // Ejemplos de uso:
    gtag_event('slider_navigation', {
      'component_type': 'slider',
      'component_name': 'hero_main',
      'element_text': 'Siguiente slide',
      'value': 2
    });
    
    gtag_event('form_submit', {
      'component_type': 'form',
      'component_name': 'contact_brevo',
      'element_text': 'Enviar mensaje',
      'value': 1
    });

**Eventos a rastrear:**

* Slider navigation (flechas, dots)
* Menu interactions (open/close, clicks)
* Service carousel navigation
* FAQ expand/collapse
* Form submissions
* CTA button clicks
* Map pin interactions
* WhatsApp float interactions

* * *

SEO y Optimización
------------------

### 7.1 Meta Tags Requeridos

    <head>
      <!-- Idioma -->
      <html lang="es">
    
      <!-- Meta Básicos -->
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
      <!-- SEO -->
      <title>EliteCar - Innovación sobre ruedas | Transporte Empresarial</title>
      <meta name="description" content="Soluciones de transporte empresarial en Colombia. Rutas corporativas, transporte aeropuerto, alquiler temporal. Flota moderna y servicio confiable.">
      <meta name="keywords" content="transporte empresarial, rutas corporativas, transporte aeropuerto, alquiler vehículos">
      <meta name="author" content="EliteCar">
      <meta name="robots" content="index, follow">
    
      <!-- Open Graph (Facebook, LinkedIn) -->
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://elitecar.com/">
      <meta property="og:title" content="EliteCar - Innovación sobre ruedas">
      <meta property="og:description" content="Soluciones de transporte empresarial en Colombia">
      <meta property="og:image" content="https://elitecar.com/assets/images/og-image.webp">
      <meta property="og:locale" content="es_CO">
    
      <!-- Twitter Cards -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:url" content="https://elitecar.com/">
      <meta name="twitter:title" content="EliteCar - Innovación sobre ruedas">
      <meta name="twitter:description" content="Soluciones de transporte empresarial en Colombia">
      <meta name="twitter:image" content="https://elitecar.com/assets/images/twitter-card.webp">
    
      <!-- Canonical -->
      <link rel="canonical" href="https://elitecar.com/">
    </head>

### 7.2 Jerarquía H-Tags

    <body>
      <h1>EliteCar - Innovación sobre ruedas</h1>
    
      <section id="hero">
        <!-- H1 único por página -->
      </section>
    
      <section id="services">
        <h2>Nuestros Servicios</h2>
        <article>
          <h3>Rutas Empresariales</h3>
        </article>
      </section>
    
      <section id="benefits">
        <h2>¿Por qué elegirnos?</h2>
      </section>
    
      <section id="faq">
        <h2>Preguntas Frecuentes</h2>
      </section>
    </body>

> **Regla:** Mínimo y Máximo **1 H1 por página**. Estructura jerárquica H1 → H2 → H3 sin saltos.

### 7.3 Schema Markup (JSON-LD)

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "EliteCar",
      "description": "Soluciones de transporte empresarial en Colombia",
      "url": "https://elitecar.com/",
      "logo": "https://elitecar.com/assets/images/logo.webp",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bogotá",
        "addressCountry": "CO"
      },
      "sameAs": [
        "https://facebook.com/elitecar",
        "https://instagram.com/elitecar"
      ]
    }
    </script>

### 7.4 Sitemap y Robots

    <!-- sitemap.xml -->
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://elitecar.com/</loc>
        <priority>1.0</priority>
        <changefreq>weekly</changefreq>
      </url>
      <url>
        <loc>https://elitecar.com/servicios/rutas-empresariales</loc>
        <priority>0.8</priority>
        <changefreq>monthly</changefreq>
      </url>
      <!-- resto de páginas -->
    </urlset>
    

    # robots.txt
    User-agent: *
    Allow: /
    Sitemap: https://elitecar.com/sitemap.xml

* * *

Seguridad y Privacidad
----------------------

### 8.1 Headers de Seguridad

    # .htaccess o configuración del servidor
    <IfModule mod_headers.c>
      Header set X-Content-Type-Options "nosniff"
      Header set X-Frame-Options "SAMEORIGIN"
      Header set X-XSS-Protection "1; mode=block"
      Header set Referrer-Policy "strict-origin-when-cross-origin"
    </IfModule>

### 8.2 Validación de Formularios

    // Validación client-side antes de enviar
    const validateForm = (form) => {
      const errors = [];
    
      // Email validación
      const email = form.querySelector('[type="email"]');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.push('Email inválido');
      }
    
      // Campos requeridos
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          errors.push(`${field.name} es requerido`);
        }
      });
    
      return errors;
    };

### 8.3 Protección contra Spam

    // WhatsApp float delay (evita scraping automático)
    setTimeout(() => {
      whatsappButton.classList.remove('hidden');
      // Solo se hace visible después de 3s
    }, 3000);
    
    // honeypot field en formulario (invisible para usuarios)
    <input type="text" name="honeypot" style="display:none;" tabindex="-1" autocomplete="off">

* * *

Estructura de Archivos
----------------------

    elitecar-website/
    ├── index.html
    ├── quienes-somos.html
    ├── politica-privacidad.html
    ├── terminos-servicio.html
    ├── cookies.html
    ├── assets/
    │   ├── css/
    │   │   └── styles.css
    │   ├── js/
    │   │   ├── main.js
    │   │   ├── slider.js
    │   │   ├── carousel.js
    │   │   ├── navigation.js
    │   │   ├── faq.js
    │   │   ├── map.js
    │   │   ├── whatsapp-float.js
    │   │   └── cookie-banner.js
    │   ├── images/
    │   │   ├── logo/
    │   │   ├── hero/
    │   │   ├── services/
    │   │   ├── team/
    │   │   └── map/
    │   └── fonts/
    ├── data/
    │   ├── navigation.json
    │   ├── slider.json
    │   ├── services.json
    │   ├── faq.json
    │   ├── map.json
    │   └── benefits.json
    ├── services/
    │   ├── rutas-empresariales.html
    │   ├── transporte-aeropuerto.html
    │   └── alquiler-temporal.html
    └── README.md

* * *

Anexos y Ejemplos
-----------------

### A.1 Ejemplo CSS - Variables y Reset

    /* === CSS RESET MODERNO === */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    html {
      font-size: 16px;
      scroll-behavior: smooth;
    }
    
    body {
      font-family: var(--font-family);
      background-color: var(--color-bg-light);
      color: var(--color-text-primary);
      line-height: 1.6;
    }
    
    /* === BOTONES === */
    .btn {
      background-color: var(--color-primary);
      color: var(--color-text-primary);
      padding: var(--space-3) var(--space-5);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
    }
    
    .btn:hover {
      background-color: var(--color-primary-hover);
    }
    
    .btn:active {
      background-color: var(--color-primary-active);
      transform: scale(0.98);
    }
    
    .btn:disabled {
      background-color: var(--color-inactive);
      cursor: not-allowed;
    }

### A.2 Ejemplo JavaScript - Slider Module

    // slider.js
    class HeroSlider {
      constructor(config) {
        this.slides = config.slides;
        this.interval = config.autoplayDelay;
        this.currentIndex = 0;
        this.container = document.querySelector('.hero-slider');
        this.init();
      }
    
      init() {
        this.renderSlides();
        this.setupNavigation();
        if (this.interval) {
          this.startAutoplay();
        }
      }
    
      renderSlides() {
        // Generar DOM de slides
      }
    
      setupNavigation() {
        // Configurar flechas y dots
      }
    
      startAutoplay() {
        this.timer = setInterval(() => this.next(), this.interval);
      }
    
      next() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlide();
      }
    
      trackEvent(action) {
        gtag_event('slider_interaction', {
          'component_type': 'slider',
          'component_name': 'hero_main',
          'element_text': action,
          'value': this.currentIndex + 1
        });
      }
    }

### A.3 Checklist de Implementación

* [ ] Configuración de variables CSS
* [ ] Implementación de navegación responsiva
* [ ] Hero Slider funcional
* [ ] Carrusel de servicios (desktop/tablet)
* [ ] Expansión móvil de servicios
* [ ] Módulo FAQ con carga progresiva
* [ ] Mapa estático interactivo
* [ ] Formulario Brevo integrado
* [ ] Botón WhatsApp con delay
* [ ] Banner de cookies
* [ ] Meta tags SEO completos
* [ ] Schema markup JSON-LD
* [ ] Sitemap.xml generado
* [ ] Google Tag Manager configurado
* [ ] Optimización de imágenes WebP
* [ ] Testing cross-browser
* [ ] Testing responsive (todos los breakpoints)
* [ ] Validación de formularios
* [ ] Headers de seguridad

* * *

Notas Finales y Recomendaciones
-------------------------------

### B.1 Áreas que Requieren Atención Especial

| Tema                           | Riesgo                                     | Mitigación                                                                   |
| ------------------------------ | ------------------------------------------ | ---------------------------------------------------------------------------- |
| JSON edición por no técnicos   | Errores de sintaxis                        | Proveer editor de texto recomendado (VS Code, Notepad++) con validación JSON |
| Hotspots del mapa (posicion %) | Pueden desplazarse en redimensionamiento   | Usar contenedor con aspect-ratio fijo, testear todos los breakpoints         |
| Botón WhatsApp delay           | Usuarios pueden frustrarse si tardan mucho | 3s es aceptable, considerar añadir spinner indicando "Cargando..."           |
| Animaciones "fugas"            | Pueden ser imperceptibles                  | Testear en dispositivos reales, asegurar ≥150ms                              |
| Consolida 5→4 breakpoints      | Reducción de código                        | Evaluar si 1024px y 1200px realmente requieren estilos diferentes            |

* * *

Contactos y Recursos
--------------------

* **Desarrollado por:** MATIZAR 2026
* **Documentación técnica:** Mantener README.md actualizado
* **Editor JSON recomendado:** Visual Studio Code con extensión "JSON Tools"
* **Optimizador de imágenes:** Squoosh.app o TinyPNG para batch conversion WebP

* * *

> **Documento generado por:** Lumo AI  
> **Última revisión:** 26 de septiembre de 2026  
> **Próxima revisión:** Al completar fase de desarrollo

* * *

Este documento técnico está diseñado para servir como **guía completa de implementación**. Cada sección contiene especificaciones precisas listas para desarrollo. Si durante la implementación surgen inconsistencias, priorizar lo especificado aquí sobre interpretaciones subjetivas del mockup gráfico.

---

Anexo: Detalle Visual por Sección - EliteCar
============================================

> **Documento Complementario**  
> **Basado en:** Mockup de diseño responsivo + Especificaciones técnicas previas  
> **Última actualización:** 26 de septiembre de 2026

* * *

Índice de Secciones
-------------------

1. [Hero Slider](#1-hero-slider)
2. [Sección Servicios](#2-secci%C3%B3n-servicios)
3. [Beneficios Grid](#3-beneficios-grid)
4. [FAQ Accordion](#4-faq-accordion)
5. [Contacto + Mapa](#5-contacto--mapa)
6. [Footer](#6-footer)

* * *

1. Hero Slider

--------------

### 1.1 Layout Desktop (≥1200px)

    ┌─────────────────────────────────────────────────────┐
    │  HEADER (fixed, 80px height)                        │
    │                                                     │
    │                    HERO SLIDER                      │
    │  ┌───────────────────────────────────────────────┐  │
    │  │                                               │  │
    │  │           IMAGEN FULL WIDTH                   │  │
    │  │              (100vw - header)                 │  │
    │  │                                               │  │
    │  │    ← [←]                         [→] →        │  │
    │  │                                               │  │
    │  │         • • • •  (dots centrados)             │  │
    │  │                                               │  │
    │  │   Overlay Gradiente: negro 30% opacidad       │  │
    │  │   Texto H1: centro, blanco                    │  │
    │  │   CTA Button: centro, amarillo #F2CD16        │  │
    │  │                                               │  │
    │  └───────────────────────────────────────────────┘  │
    │                                                     │
    └─────────────────────────────────────────────────────┘

| Elemento           | Dimensión             | Posición                              | Observaciones                                             |
| ------------------ | --------------------- | ------------------------------------- | --------------------------------------------------------- |
| Contenedor slider  | 100vh (full viewport) | Ocupa todo el space debajo del header | Min-height: 600px                                         |
| Imagen background  | Cover, center         | 100% width × 100% height              | `object-fit: cover`                                       |
| Overlay gradiente  | Degradado radial      | Cubre toda la imagen                  | Color: `rgba(20,28,28,0.3)` → `rgba(20,28,28,0.5)` bottom |
| H1 Title           | Max 700px ancho       | Centro vertical, 20% desde top        | Font: 48px/56px line-height                               |
| CTA Button         | 240×56px              | 24px debajo del H1                    | Padding: 16px 32px                                        |
| Flechas navegación | 48×48px               | 80px desde bordes laterales           | Icon white, opacity 0.8→1 hover                           |
| Dots indicadores   | 12px diámetro         | Bottom, 24px desde borde              | Gap entre dots: 8px                                       |

### 1.2 Layout Tablet (768-1199px)

| Cambio respecto a desktop | Especificación                      |
| ------------------------- | ----------------------------------- |
| H1 size                   | Reduce a 36px (2.25rem)             |
| CTA button                | Reduce a 200×52px                   |
| Flechas                   | Se mantienen, posición proporcional |
| Dots                      | Mismos specs, centrados             |

### 1.3 Layout Mobile (<768px)

| Elemento           | Ajuste crítico                                    |
| ------------------ | ------------------------------------------------- |
| Contenedor slider  | Min-height: 500px, max-height: 70vh               |
| Overlay gradiente  | Aumenta opacidad a 40% para mejor contraste texto |
| H1 Title           | 32px (2rem), max-width 90%                        |
| CTA Button         | Full-width opcional, min-height 48px              |
| Flechas navegación | Ocultas en mobile, solo swipe gestures            |
| Dots               | 10px diámetro, gap 6px                            |

### 1.4 Estados y Transiciones

    /* Estado normal del CTA */
    .hero-cta {
      background-color: #F2CD16;
      transition: background-color 150ms ease-out;
    }
    
    /* Hover */
    .hero-cta:hover {
      background-color: #FFDF3D;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(242, 205, 22, 0.3);
    }
    
    /* Active (press) */
    .hero-cta:active {
      background-color: #FFEA00;
      transform: translateY(0);
      transition: 100ms ease-out;
    }
    
    /* Auto-slide fade */
    .slide-enter {
      animation: fadeIn 0.6s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

### 1.5 Consideraciones Críticas

* ⚠️ **Z-index del overlay:** Debe estar entre imagen y texto (`z-index: 1`)
* ⚠️ **Text shadow en H1:** Agregar `text-shadow: 0 2px 4px rgba(0,0,0,0.5)` para legibilidad sobre cualquier imagen
* ⚠️ **Pause autoplay:** En hover del slider (desktop), pausa reproducción pero mantiene flechas funcionales
* ⚠️ **Touch swipe:** Implementar threshold mínimo de 50px para detectar swipe intencional

* * *

2. Sección Servicios

--------------------

### 2.1 Layout Desktop (≥1200px)

    ┌─────────────────────────────────────────────────────────┐
    │  TÍTULO SECCIÓN                                        │
    │  ┌───────────────────────────────────────────────────┐ │
    │  │            Nuestros Servicios                     │ │
    │  └───────────────────────────────────────────────────┘ │
    │                                                        │
    │  [←]  ┌────┐ ┌────┐ ┌────┐ ┌────┐  [→]                 │
    │       │ SRV│ │ SRV│ │ SRV│ │ SRV│                      │
    │       │ 1  │ │ 2  │ │ 3  │ │ 4  │                      │
    │       └────┘ └────┘ └────┘ └────┘                      │
    │                                                        │
    │  Cada Card: 280px width × 320px height                 │
    │  Gap entre cards: 24px                                 │
    │  Padding container: 48px lateral                       │
    └─────────────────────────────────────────────────────────┘

| Elemento           | Dimensión       | Espaciado                    | Detalles                    |
| ------------------ | --------------- | ---------------------------- | --------------------------- |
| Título sección     | Max-width 600px | Margin-bottom: 64px          | H2, 36px, centrado          |
| Container carrusel | Full-width      | Padding-left/right: 48px     | Overflow hidden para bordes |
| Card individual    | 280×320px       | Gap: 24px                    | Border-radius: 8px          |
| Card image         | 280×180px       | Top of card                  | Object-fit: cover           |
| Card title         | Full card width | Padding-top: 16px            | H3, 20px                    |
| Card description   | 200px width     | Margin: 12px 0               | 14px, 3 líneas máx          |
| Button CTA         | 180×48px        | Bottom padding: 24px         | Full-width card             |
| Botones navegación | 48×48px         | Vertical center del carrusel | Icon gray → yellow hover    |

### 2.2 Layout Tablet (768-1199px)

    ┌─────────────────────────────────────────────────────┐
    │  TÍTULO                                             │
    │  ┌───────────────────────────────────────────────┐  │
    │  │          Nuestros Servicios                   │  │
    │  └───────────────────────────────────────────────┘  │
    │                                                      │
    │  [←]  ┌────┐ ┌────┐  [→]                           │
    │       │ SRV│ │ SRV│                                │
    │       │ 1  │ │ 2  │                                │
    │       └────┘ └────┘                                │
    │                                                      │
    │  Cada Card: 340px width × 380px height               │
    │  Gap: 32px                                          │
    │  Padding container: 32px lateral                    │
    └─────────────────────────────────────────────────────┘

| Cambio vs Desktop  | Especificación             |
| ------------------ | -------------------------- |
| Cards visibles     | 2 (en lugar de 4)          |
| Card width         | Aumenta proporcionalmente  |
| Card height        | Mayor para contenido extra |
| Navigation buttons | Misma dimensión            |

### 2.3 Layout Mobile (<768px)

    ┌──────────────────────────────────────┐
    │  TÍTULO                              │
    │                                      │
    │  ┌─────────────────────────────────┐ │
    │  │  CARD 1 (expandido full width)  │ │
    │  │                                 │ │
    │  │  Card completa                  │ │
    │  └─────────────────────────────────┘ │
    │  ┌─────────────────────────────────┐ │
    │  │  CARD 2                         │ │
    │  └─────────────────────────────────┘ │
    │  [...] hasta 6 cards                │
    │                                      │
    │  [▼ VER MÁS SERVICIOS ▼]            │
    │                                      │
    │  [▲ OCULTAR ▲] (se muestra al expandir)│
    └──────────────────────────────────────┘

| Comportamiento      | Especificación                    |
| ------------------- | --------------------------------- |
| Cards iniciales     | 6 expandidas verticalmente        |
| Card dimensions     | 100% width × auto height          |
| Card padding        | 24px interno                      |
| Gap entre cards     | 16px                              |
| Botón "Ver más"     | Full-width, 56px height, centrado |
| Animación expansión | 300ms ease-in-out                 |

### 2.4 Card Service - Detalle Específico

    ┌─────────────────────────────────┐
    │  ╭─────────────────────────────╮│
    │  │                             ││  ← Image: 280×180px
    │  │      IMAGEN DEL SERVICIO    ││     border-radius: 8px 8px 0 0
    │  │                             ││
    │  ╰─────────────────────────────╯│
    │                                 │
    │   🛡️ ICON (32px)               │
    │                                 │
    │   Título del Servicio           │  ← H4, 20px, bold
    │                                 │
    │   Descripción breve del         │  ← 14px, max 3 líneas
    │   servicio en dos líneas        │
    │                                 │
    │   ┌─────────────────────────┐   │
    │   │   CONOCE MÁS →          │   │  ← Button, amarillo
    │   └─────────────────────────┘   │
    └─────────────────────────────────┘

| Estado | Cambios visuales                      |
| ------ | ------------------------------------- |
| Normal | Shadow: 0 2px 8px rgba(0,0,0,0.1)     |
| Hover  | Shadow aumenta a 0 4px 16px, lift 4px |
| Focus  | Outline 2px #F2CD16, offset 2px       |

* * *

3. Beneficios Grid

------------------

### 3.1 Layout Desktop/Tablet (≥768px)

    ┌─────────────────────────────────────────────────────────┐
    │  ┌───────────────────────────────────────────────────┐ │
    │  │              ¿Por qué elegirnos?                  │ │
    │  └───────────────────────────────────────────────────┘ │
    │                                                         │
    │  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
    │  │  🛡️    │  │  💻    │  │  📋    │                    │
    │  │         │  │         │  │         │                    │
    │  │ Seguridad│  │ Tecnología│ │ Calidad │                   │
    │  │         │  │         │  │         │                    │
    │  └─────────┘  └─────────┘  └─────────┘                    │
    │                                                         │
    │  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
    │  │  🔧    │  │  🤝    │  │  📄    │                    │
    │  │         │  │         │  │         │                    │
    │  │ Mant.   │  │ Confianza│  │ Factur. │                   │
    │  │         │  │         │  │         │                    │
    │  └─────────┘  └─────────┘  └─────────┘                    │
    │                                                         │
    │  [VER TODOS LOS BENEFICIOS →]                          │
    └─────────────────────────────────────────────────────────┘

| Elemento           | Dimensión            | Espaciado           | Detalles           |
| ------------------ | -------------------- | ------------------- | ------------------ |
| Título sección     | Max-width 500px      | Margin-bottom: 48px | H2, 36px, centrado |
| Container grid     | Max-width 1200px     | Padding: 0 48px     | Center aligned     |
| Benefit card       | 320px × 240px        | Gap: 32px           | 3 columnas         |
| Icon               | 48×48px              | Top: 24px, centered | SVG, 24pt stroke   |
| Icon background    | Circle 80px diámetro | Behind icon         | Yellow 10% opacity |
| Benefit title      | Full width           | Margin-top: 24px    | H4, 18px           |
| Benefit desc       | 280px width          | Margin: 12px 0      | 14px, 2-3 líneas   |
| Button "Ver todos" | 220×48px             | Margin-top: 48px    | Outlined variant   |

### 3.2 Layout Mobile (<768px)

    ┌─────────────────────────────────┐
    │  ¿Por qué elegirnos?            │
    │                                  │
    │  ┌───────────────────────────┐  │
    │  │  🛡️                      │  │
    │  │       Seguridad           │  │
    │  │  Descripción...           │  │
    │  └───────────────────────────┘  │
    │                                  │
    │  ┌───────────────────────────┐  │
    │  │  💻                       │  │
    │  │     Tecnología            │  │
    │  │  Descripción...           │  │
    │  └───────────────────────────┘  │
    │  [...] (stack vertical)        │
    │                                  │
    │  [VER TODOS LOS BENEFICIOS]    │
    └─────────────────────────────────┘

| Cambio vs Desktop | Especificación             |
| ----------------- | -------------------------- |
| Layout            | Stack vertical (1 columna) |
| Card width        | 100% (max 400px)           |
| Card height       | Auto (contenido fluido)    |
| Icon size         | 40×40px                    |
| Gap entre cards   | 24px                       |

### 3.3 Icono - Especificaciones Visuales

    ┌─────────────────────────────────┐
    │        ○ 80px diámetro          │
    │       ╱│╲                       │
    │      ╱ │ ╲  Fondo: #F2CD16 10%  │
    │     ●  │  ●                     │
    │      ╲ │ ╲                     │
    │       ╲│╱                      │
    │         │                       │
    │       ICON 24×24px              │
    │     Color: #F2CD16              │
    └─────────────────────────────────┘

* **Stroke weight:** 2px para SVG
* **Hover effect:** Icon escala a 110%, background 20% opacity
* **Consistencia:** Todos los íconos del mismo estilo visual (outline o filled, no mezclar)

* * *

4. FAQ Accordion

----------------

### 4.1 Layout Desktop

    ┌─────────────────────────────────────────────────────────┐
    │  ┌───────────────────────────────────────────────────┐ │
    │  │              Preguntas Frecuentes                 │ │
    │  └───────────────────────────────────────────────────┘ │
    │                                                         │
    │  ╔═══════════════════════════════════════════════════╗ │
    │  ║  1. ¿Qué tipos de vehículos están disponibles? ✓ │ │  ← ABIERTA POR DEFECTO
    │  ╠═══════════════════════════════════════════════════╣ │
    │  ║                                                 ║ │
    │  ║  Respondemos: Contamos con sedanes, SUVs, vans  ║ │
    │  ║  ejecutivas... (max 200px ancho texto)          ║ │
    │  ║                                                 ║ │
    │  ╚═══════════════════════════════════════════════════╝ │
    │                                                         │
    │  ┌───────────────────────────────────────────────────┐ │
    │  │  2. ¿Cómo se realiza el proceso de reserva?   [+] │ │  ← CERRADA
    │  └───────────────────────────────────────────────────┘ │
    │                                                         │
    │  ┌───────────────────────────────────────────────────┐ │
    │  │  3. ¿Ofrecen tarifas especiales para contratos? [+]│ │
    │  └───────────────────────────────────────────────────┘ │
    │                                                         │
    │  ┌───────────────────────────────────────────────────┐ │
    │  │  4. ...                                       [+] │ │
    │  └───────────────────────────────────────────────────┘ │
    │                                                         │
    │  ┌───────────────────────────────────────────────────┐ │
    │  │  5. ...                                       [+] │ │
    │  └───────────────────────────────────────────────────┘ │
    │                                                         │
    │  [MOSTRAR MÁS PREGUNTAS (5 más)]                       │
    └─────────────────────────────────────────────────────────┘

| Elemento             | Dimensión                | Estado            | Observaciones                    |
| -------------------- | ------------------------ | ----------------- | -------------------------------- |
| Container FAQ        | Max-width 900px          | Center aligned    | Padding lateral: 48px            |
| Item abierto         | Height: auto (min 120px) | Expanded          | Border-bottom: 1px solid #CCCCCC |
| Item cerrado         | Height: 72px             | Collapsed         | Border-bottom: 1px solid #EEEEEE |
| Número pregunta      | 24×24px circle           | Left margin: 16px | Background: #F2CD16, texto negro |
| Texto pregunta       | Flex-grow                | Left of indicator | 16px, 60% width container        |
| Indicador [+/-]      | 32×32px                  | Right side        | Rotate 45° para + → -            |
| Panel respuesta      | 90% container width      | Padding: 24px 0   | Slide-down animación             |
| Button "Mostrar más" | 280×56px                 | Margin-top: 48px  | Variants: secondary              |

### 4.2 Layout Mobile

    ┌────────────────────────────┐
    │ Preguntas Frecuentes       │
    │                            │
    │ ┌────────────────────────┐ │
    │ │ ① ¿Qué tipos...      ✓ │ │
    │ ├────────────────────────┤ │
    │ │ Respuesta completa     │ │
    │ │ ...                    │ │
    │ └────────────────────────┘ │
    │                            │
    │ ┌────────────────────────┐ │
    │ │ ② ¿Cómo se realiza... │ │
    │ └────────────────────────┘ │
    │                            │
    │ [MOSTRAR MÁS]             │
    └────────────────────────────┘

| Adaptación mobile | Especificación       |
| ----------------- | -------------------- |
| Container padding | 24px lateral         |
| Number circle     | 20×20px              |
| Question text     | 100% width (wrapped) |
| Indicator size    | 28×28px              |
| Answer padding    | 16px 0               |

### 4.3 Animaciones y Transiciones

    /* Expansión del panel */
    .faq-answer {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out, opacity 0.3s ease-out;
    }
    
    .faq-answer.open {
      max-height: 500px;
      opacity: 1;
    }
    
    /* Rotación indicador */
    .faq-indicator {
      transition: transform 0.3s ease;
    }
    
    .faq-item.active .faq-indicator {
      transform: rotate(45deg); /* + se convierte en x */
    }
    
    /* Smooth scroll para primera pregunta */
    .faq-item:first-child {
      scroll-margin-top: 100px; /* Para evitar overlap con header fixed */
    }

### 4.4 Comportamiento de Acordeón

* **Una sola abierta:** Al abrir una, las demás se cierran automáticamente
* **Click en abierto:** Cierra esa pregunta (toggle)
* **Keyboard nav:** Tab navega entre headers, Enter/Espacio expande/contrae
* **Focus visible:** Outline claro alrededor del item activo

* * *

5. Contacto + Mapa

------------------

### 5.1 Layout Desktop (2-columnas)

    ┌─────────────────────────────────────────────────────────┐
    │  ┌───────────────────────────────────────────────────┐ │
    │  │                    CONTACTO                       │ │
    │  └───────────────────────────────────────────────────┘ │
    │                                                         │
    │  ┌─────────────────────────┐  ┌──────────────────────┐ │
    │  │                         │  │                      │ │
    │  │  FORMULARIO             │  │  MAPA INTERACTIVO    │ │
    │  │                         │  │                      │ │
    │  │  Nombre    [________]  │  │  ╭──────────────╮    │ │
    │  │  Email     [________]  │  │  │   🗺️ COLOMBIA│    │ │
    │  │  Teléfono  [________]  │  │  │              │    │ │
    │  │  Servicio  [▼_______▼] │  │  │      📍      │    │ │
    │  │  Mensaje   [_________] │  │  │              │    │ │
    │  │             [_________] │  │  │   📍       │    │ │
    │  │             [_________] │  │  │              │    │ │
    │  │                         │  │  ╰──────────────╯    │ │
    │  │  ☑ Acepto términos     │  │                      │ │
    │  │  [ENVIAR MENSAJE]      │  │                      │ │
    │  │                         │  │                      │ │
    │  │  ✓ Mensaje enviado     │  │                      │ │
    │  │                         │  │                      │ │
    │  └─────────────────────────┘  └──────────────────────┘ │
    │                                                         │
    └─────────────────────────────────────────────────────────┘

| Elemento            | Dimensión                    | Gap                  | Detalles                  |
| ------------------- | ---------------------------- | -------------------- | ------------------------- |
| Container principal | Max-width 1200px             | 48px padding lateral | Display: flex, gap: 64px  |
| Columna formulario  | 50% (flex-basis: 480px)      | -                    | Orden: 1 en desktop       |
| Columna mapa        | 50% (flex-basis: 480px)      | -                    | Aspect-ratio: 4/3         |
| Input fields        | 100% width, 56px height      | Margin-bottom: 16px  | Border: 1px solid #CCCCCC |
| Select dropdown     | 100% width, 56px height      | Margin-bottom: 16px  | Chevron right             |
| Textarea            | 100% width, 120px min-height | Margin-bottom: 24px  | Resize: vertical          |
| Checkbox terms      | Auto                         | Margin: 16px 0       | 14px texto                |
| Submit button       | 100% width, 56px height      | -                    | Yellow, full width        |
| Success message     | Full width                   | Appears below button | Green checkmark icon      |
| Mapa container      | 100% × 100%                  | -                    | Background: #F5F5F5       |

### 5.2 Layout Tablet (768-1199px)

    ┌──────────────────────────────────────────────┐
    │  CONTACTO                                    │
    │                                              │
    │  ┌────────────────────────────────────────┐  │
    │  │  FORMULARIO                            │  │
    │  │                                        │  │
    │  │  [Campos apilados]                     │  │
    │  │                                        │  │
    │  └────────────────────────────────────────┘  │
    │                                              │
    │  ┌────────────────────────────────────────┐  │
    │  │  MAPA                                  │  │
    │  │                                        │  │
    │  │  [Mapa estático con pins]              │  │
    │  │                                        │  │
    │  └────────────────────────────────────────┘  │
    └──────────────────────────────────────────────┘

| Cambio vs Desktop    | Especificación                   |
| -------------------- | -------------------------------- |
| Layout               | Stack vertical (columnas apilan) |
| Form width           | 100% (max 600px, centered)       |
| Map width            | 100%                             |
| Gap between sections | 48px                             |

### 5.3 Layout Mobile (<768px)

    ┌─────────────────────────┐
    │ CONTACTO                │
    │                         │
    │ Nombre [____________]   │
    │ Email  [____________]   │
    │ Tel    [____________]   │
    │ Serv.  [▼________▼]     │
    │ Msg    [___________]    │
    │        [___________]    │
    │        [___________]    │
    │                         │
    │ ☑ Acepto términos       │
    │ [ENVIAR]                │
    │                         │
    │ ✓ Enviado               │
    │                         │
    │ ┌─────────────────────┐ │
    │ │     MAPA            │ │
    │ │                     │ │
    │ │     📍 📍          │ │
    │ │                     │ │
    │ └─────────────────────┘ │
    └─────────────────────────┘

| Ajuste crítico mobile | Especificación      |
| --------------------- | ------------------- |
| Form padding          | 24px lateral        |
| Input height          | 48px (más compacto) |
| Button height         | 52px                |
| Map height            | 300px (min)         |
| Checkbox size         | 18px × 18px         |

### 5.4 Mapa Interactivo - Hotspots

    ╭─────────────────────────────────────╮
    │                                     │
    │    BOGOTÁ 📍 (52%, 38%)             │
    │                                     │
    │         MEDELLÍN 📍 (28%, 35%)      │
    │                                     │
    │               📍 CALI              │
    │       (35%, 68%)                    │
    │                                     │
    │    📍 CARTAGENA                     │
    │    (75%, 25%)                       │
    │                                     │
    │         Barranquilla 📍             │
    │         (72%, 18%)                  │
    │                                     │
    ╰─────────────────────────────────────╯

| Propiedad              | Valor                                  |
| ---------------------- | -------------------------------------- |
| Pin size               | 32×32px (24×24px clickable area)       |
| Pin color              | #F2CD16 con shadow negro 30%           |
| Tooltip on hover/click | White bg, 160px width                  |
| Tooltip position       | Pin top + 10px offset                  |
| Tooltip content        | Nombre ciudad + "Operación disponible" |
| Exit tooltip           | Click fuera o botón [×]                |

### 5.5 Feedback del Formulario

**Estados de validación:**
    Normal:     Border #CCCCCC, background white
    Focus:      Border #F2CD16, outline 2px
    Error:      Border #DC3545, background #FFF5F5, mensaje rojo
    Success:    Border #28A745, mensaje verde con check ✓

    Mensaje éxito:
    ┌─────────────────────────────────────┐
    │ ✓ ¡Gracias! Hemos recibido tu       │
    │   mensaje. Nos pondremos en contacto│
    │   en menos de 24 horas.             │
    └─────────────────────────────────────┘

**Timing:**

* Fade in: 200ms después de submit
* Persistencia: Permanente hasta refresh o nuevo envío
* Auto-hide: Opcional después de 10 segundos

* * *

6. Footer

---------

### 6.1 Layout Desktop (4 columnas)

    ┌─────────────────────────────────────────────────────────────────────────────┐
    │                                                                           │
    │  ╭───────────────╮  ╭───────────────╮  ╭───────────────╮  ╭───────────────╮  │
    │  │  LOGO         │  │  ENLACES     │  │  SERVICIOS   │  │  CONTACTO    │  │
    │  │  EliteCar     │  │              │  │              │  │              │  │
    │  │               │  │ - Inicio     │  │ - Rutas      │  │ 📞 Teléfono  │  │
    │  │  Slogan       │  │ - Servicios  │  │ - Aeropuerto │  │ 📧 Email     │  │
    │  │  breve        │  │ - Quiénes    │  │ - Alquiler   │  │ 📍 Dirección │  │
    │  │               │  │ - Contacto   │  │              │  │              │  │
    │  │  [Iconos red.]│  │              │  │              │  │              │  │
    │  ╰───────────────╯  ╰───────────────╯  ╰───────────────╯  ╰───────────────╯  │
    │                                                                           │
    ├───────────────────────────────────────────────────────────────────────────┤
    │                                                                           │
    │  Política Privacidad | Términos | Cookies | Desarrollado por: MATIZAR ©2026│
    │                                                                           │
    └─────────────────────────────────────────────────────────────────────────────┘

| Columna       | Contenido                  | Ancho relativo |
| ------------- | -------------------------- | -------------- |
| 1 - Brand     | Logo, slogan, social icons | 25%            |
| 2 - Links     | Navegação principal        | 25%            |
| 3 - Servicios | Links a páginas internas   | 25%            |
| 4 - Contacto  | Info directa               | 25%            |
| Bottom bar    | Legal + créditos           | 100%           |

| Elemento         | Dimensión           | Estilo                             |
| ---------------- | ------------------- | ---------------------------------- |
| Container footer | Full-width          | Background: #141C1C                |
| Inner wrapper    | Max-width 1200px    | Padding: 64px 48px                 |
| Columnas         | 25% cada una        | Gap: 48px                          |
| Logo             | 180×60px            | Blanco                             |
| Heading columna  | 18px, 600 weight    | Margin-bottom: 24px                |
| Links            | 16px, normal weight | Color: #999999                     |
| Link hover       | Color: #F2CD16      | Underline none → 2px underline     |
| Social icons     | 32×32px each        | Gap: 16px                          |
| Bottom bar       | Full-width          | Padding: 24px 48px                 |
| Copyright text   | 14px                | Color: #666666, text-align: center |

### 6.2 Layout Tablet (2×2 grid)

    ┌─────────────────────────────────────────────────────┐
    │                                                   │
    │  ┌───────────────┐  ┌───────────────┐             │
    │  │  LOGO         │  │  ENLACES     │             │
    │  │  EliteCar     │  │              │             │
    │  │               │  │ - Inicio     │             │
    │  │  [Social]     │  │ - Servicios  │             │
    │  └───────────────┘  └───────────────┘             │
    │                                                   │
    │  ┌───────────────┐  ┌───────────────┐             │
    │  │  SERVICIOS   │  │  CONTACTO    │             │
    │  │              │  │              │             │
    │  │ - Rutas      │  │ 📞           │             │
    │  │ - Aeropuerto │  │ 📧           │             │
    │  └───────────────┘  └───────────────┘             │
    │                                                   │
    ├───────────────────────────────────────────────────┤
    │                                                   │
    │  Política | Términos | Cookies | MATIZAR ©2026   │
    │                                                   │
    └─────────────────────────────────────────────────────┘

| Adaptación tablet | Especificación            |
| ----------------- | ------------------------- |
| Grid              | 2×2 (2 columnas, 2 filas) |
| Column width      | 50% cada una              |
| Row gap           | 48px                      |
| Padding inner     | 48px                      |

### 6.3 Layout Mobile (stack vertical)

    ┌─────────────────────────────┐
    │  LOGO                       │
    │  EliteCar                   │
    │  [Social icons]             │
    │                             │
    │  ENLACES                    │
    │  - Inicio                   │
    │  - Servicios                │
    │                             │
    │  SERVICIOS                  │
    │  - Rutas                    │
    │                             │
    │  CONTACTO                   │
    │  📞 Número                  │
    │  📧 Email                   │
    │                             │
    ├─────────────────────────────┤
    │ Política | Términos        │
    │ Cookies | MATIZAR ©2026    │
    └─────────────────────────────┘

| Ajuste mobile   | Especificación                        |
| --------------- | ------------------------------------- |
| Layout          | Stack vertical (1 columna)            |
| Section spacing | 32px entre bloques                    |
| Padding lateral | 24px                                  |
| Social icons    | 28×28px, gap 12px                     |
| Bottom bar      | Line-breaks automáticos, 18px padding |
| Copyright       | Center aligned                        |

### 6.4 Social Icons - Specs

    ┌─────┬─────┬─────┐
    │ FB  │ IG  │ LN  │  ← 32×32px cada uno
    └─────┴─────┴─────┘
    
    Estado normal:   Fill: #999999
    Estado hover:    Fill: #FFFFFF
    Transición:      150ms ease-in-out

* **Plataformas:** Facebook, Instagram, LinkedIn (mínimo)
* **Formato:** SVG inline (evitar carga externa)
* **ARIA labels:** "Siguenos en Facebook", etc.

### 6.5 Bottom Bar - Legal Links

| Elemento    | Especificación                   |
| ----------- | -------------------------------- |
| Separadores | Pipe `                           |
| Color link  | #999999 → #F2CD16 hover          |
| Copyright   | "Desarrollado por: MATIZAR 2026" |
| Spacing     | 16px entre enlaces               |
| Responsive  | Wrapping automático en mobile    |

* * *

Resumen de Específicas Críticas
-------------------------------

| Sección        | Medida que NO debes cambiar | Razón                                         |
| -------------- | --------------------------- | --------------------------------------------- |
| **Hero**       | Min-height 600px            | Evita contenido cortado en pantallas pequeñas |
| **Hero**       | Overlay opacity ≥30%        | Garantiza legibilidad del texto blanco        |
| **Servicios**  | Min 4 cards desktop         | Mantenimiento de grid balanceado              |
| **Servicios**  | Card gap ≥24px              | Evita sensación de aglomeración               |
| **FAQ**        | 5 preguntas iniciales       | UX consistente con mockup                     |
| **Formulario** | Input height 56px           | Accesibilidad (touch target mínimo 44px)      |
| **Footer**     | Padding 64px desktop        | Balance visual con contenido arriba           |

* * *

> **Fin del Anexo Visual**  
> Este documento complementa las especificaciones técnicas principales. Cualquier discrepancia entre este documento y el mockup gráfico, **priorizar este documento**.

* * *

por favor mantén un código limpio, estructurado y totalmente en inglés.
