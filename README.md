# EliteCar - Portal Web Corporativo

> **Versión:** 1.0  
> **Fecha:** 26 de septiembre de 2026  
> **Cliente:** EliteCar Soluciones de Transporte S.A.S.  
> **Desarrollo y Diseño:** MATIZAR 2026  
> **Stack Tecnológico:** HTML5 Semántico + CSS3 Vanilla Modular + JavaScript Vanilla (Sin dependencias pesadas)

---

## 1. Resumen y Arquitectura del Sitio

Este sitio web corporativo ha sido desarrollado siguiendo las especificaciones de la [Guía Técnica de Desarrollo](document/guia-de-desarrollo-web-completo.md) y el diseño visual preliminar responsivo establecido para dispositivos **Desktop, Tablet y Mobile**.

### Características Principales:
* **Diseño Responsivo Total:** Adaptado con breakpoints específicos (`mobile-lite: 320px`, `mobile: 400px`, `tablet: 768px`, `laptop: 1024px`, `desktop: 1200px` y `large: 1600px`).
* **Hero Slider Dinámico:** Desplazamiento horizontal con retardo automático de 4.5s, soporte para gestos táctiles (*swipe*) en móviles, flechas laterales, dots indicadores y pausa en *hover*.
* **Bloque de Presentación Corporativa:** Sección de anclaje de marca post-hero con métricas auditables (+12 años, 99.8% puntualidad, 100% asegurado, soporte 24/7).
* **Carrusel de Servicios de Alto Contraste:** Fondo oscuro institucional (`#141C1C`) con 4 tarjetas visibles en desktop, 2 en tablet (con navegación y swipe) y vista apilada vertical con botón *"Ver más servicios"* en mobile.
* **Módulo de Beneficios:** Grilla de 6 atributos de valor con iconos vectoriales SVG sobre halos circulares amarillos (`#F2CD16`).
* **Acordeón FAQ con Imagen Lateral:** Comportamiento accesible (apertura individual, animación fluida de altura, rotación de indicador a 45° y botón *"Mostrar más preguntas"*).
* **Mapa Interactivo de Cobertura Nacional:** Mapa vectorial de Colombia con pines pulsantes en Bogotá, Medellín, Cali, Barranquilla y Cartagena, tooltips informativos y tarjeta de datos de contacto directo.
* **Formulario de Contacto Preparado para Brevo CRM:** Validación client-side inmediata, protección anti-spam mediante campo *honeypot* invisible y respuesta visual instantánea.
* **Botón Flotante de WhatsApp:** Retardo de seguridad de 3 segundos antes de desplegarse para evitar bloqueos y scraping, con enlace directo y mensaje predeterminado.
* **Banner Informativo de Cookies:** Notificación discreta con persistencia de 90 días mediante `localStorage` y cookies estándar.
* **Páginas Secundarias y Legales Completas:** 3 páginas de servicios específicos (`/services/`) y 4 páginas corporativas y legales (`quienes-somos.html`, `politica-privacidad.html`, `terminos-servicio.html`, `cookies.html`).

---

## 2. Estructura de Carpetas y Archivos

```
eliteCar/
│
├── index.html                      # Página de inicio principal (Home)
├── quienes-somos.html              # Página institucional de la compañía
├── politica-privacidad.html        # Cumplimiento Ley 1581 de 2012 (Habeas Data)
├── terminos-servicio.html          # Condiciones de contratación de transporte
├── cookies.html                    # Política y gestión de cookies
├── sitemap.xml                     # Mapa del sitio para indexación en Google
├── robots.txt                      # Reglas para motores de búsqueda
├── README.md                       # Manual de edición y especificaciones
│
├── assets/
│   ├── css/
│   │   └── styles.css              # Sistema de diseño completo y tokens CSS
│   ├── js/
│   │   ├── main.js                 # Validador de formulario, Brevo y utilidades
│   │   ├── navigation.js           # Menú móvil, sticky header y dropdowns
│   │   ├── slider.js               # Controlador del Hero Slider
│   │   ├── carousel.js             # Carrusel de servicios desktop/tablet/mobile
│   │   ├── faq.js                  # Acordeón de preguntas frecuentes
│   │   ├── map.js                  # Hotspots del mapa interactivo
│   │   ├── whatsapp-float.js       # Botón de WhatsApp con retardo
│   │   └── cookie-banner.js        # Banner de consentimiento de cookies
│   └── images/                     # Carpeta destinada a fotos locales (.webp)
│       ├── logo/
│       ├── hero/
│       ├── services/
│       └── map/
│
├── data/                           # Módulos de datos editables en formato JSON
│   ├── navigation.json             # Enlaces y estructura del menú
│   ├── slider.json                 # Diapositivas del hero (título, texto, fotos)
│   ├── corporate.json              # Textos de la sección intro y métricas
│   ├── services.json               # Lista de servicios, enlaces y descripciones
│   ├── benefits.json               # Beneficios y ventajas corporativas
│   ├── faq.json                    # Preguntas y respuestas del acordeón
│   └── map.json                    # Sedes operativas, pines y datos de contacto
│
└── services/
    ├── rutas-empresariales.html    # Detalle de Rutas y Commuting
    ├── transporte-aeropuerto.html  # Detalle de Traslados VIP Aeropuerto
    └── alquiler-temporal.html      # Detalle de Renting y Flota Temporal
```

---

## 3. Especificaciones para la Edición de Textos

El sitio web está estructurado para que la edición de textos sea rápida, segura y no requiera conocimientos avanzados de programación.

### Opción A: Edición de Contenidos Centralizados en la Carpeta `/data/`

En la carpeta `data/` se encuentran archivos `.json` que contienen toda la información estructurada:

| Archivo | Qué contenido puedes modificar |
| :--- | :--- |
| **`data/corporate.json`** | Titulares, párrafos introductorios y los 4 números de métricas (+12 años, 99.8%, etc.). |
| **`data/slider.json`** | Títulos de cada diapositiva, subtítulos, texto de los botones CTA y enlaces. |
| **`data/services.json`** | Nombre de cada servicio, categoría, descripción corta y textos de botones. |
| **`data/benefits.json`** | Título de cada uno de los 6 beneficios y sus descripciones detalladas. |
| **`data/faq.json`** | Preguntas y respuestas del centro de ayuda FAQ. |
| **`data/map.json`** | Direcciones, teléfonos, correos y nombres de las sedes en Colombia. |

> **Recomendación para editar archivos JSON:**
> 1. Abre el archivo con un editor de texto como **Visual Studio Code**, **Notepad++** o el Bloc de Notas.
> 2. Modifica únicamente el texto que está entre comillas dobles `" "`.
> 3. No borres las comas `,` ni los corchetes `{ }` o `[ ]`.

### Opción B: Edición de Textos en los Archivos HTML

Para modificar textos directamente en el código de las páginas:
1. Abre `index.html` o la página interna correspondiente (por ejemplo `quienes-somos.html`).
2. Utiliza la función de búsqueda (`Ctrl + F`) para localizar la frase o palabra que deseas cambiar.
3. Reemplaza el texto respetando las etiquetas HTML como `<h2>`, `<p>`, `<span>`, etc.
4. Guarda el archivo con codificación **UTF-8**.

---

## 4. Especificaciones para el Reemplazo y Optimización de Imágenes

Actualmente el sitio utiliza imágenes corporativas dummy de alta resolución alojadas en Unsplash (específicamente seleccionadas con temáticas de vehículos ejecutivos, SUVs corporativas y entornos empresariales). 

Cuando desees reemplazarlas por fotografías propias de la flota de EliteCar, sigue estas directrices para garantizar máxima velocidad y nitidez:

### Tabla de Dimensiones y Formatos Recomendados:

| Ubicación de la Imagen | Archivo / Sección | Dimensiones Óptimas | Proporción | Formato | Peso Máx. |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Slider (Diapositivas)** | `index.html` / `slider.json` | 1920 × 1080 px | 16:9 | `.webp` | < 180 KB |
| **Tarjetas de Servicios** | `index.html` / `services.json` | 800 × 500 px | 16:10 | `.webp` | < 80 KB |
| **Foto Lateral del FAQ** | `index.html` / `faq.json` | 1000 × 800 px | 5:4 | `.webp` | < 120 KB |
| **Cabeceras de Páginas Internas**| `services/*.html` | 1920 × 600 px | Panorámica | `.webp` | < 140 KB |
| **Foto Detalle en Páginas Internas**| `services/*.html` | 1000 × 650 px | 3:2 | `.webp` | < 110 KB |
| **Logotipo Institucional** | Header y Footer | 240 × 80 px (o SVG) | - | `.svg` o `.webp` | < 25 KB |

### Pasos para Reemplazar una Imagen:
1. **Toma o selecciona la fotografía:** Procura que el vehículo esté limpio, bien iluminado y centrado.
2. **Ajusta las dimensiones:** Recorta la imagen a las dimensiones recomendadas usando Photoshop, Canva o cualquier editor fotográfico.
3. **Convierte a formato WebP:**
   - Ingresa a la herramienta web gratuita [Squoosh.app](https://squoosh.app/) o [TinyPNG](https://tinypng.com/).
   - Arrastra tu imagen y selecciona el formato de salida **WebP** con calidad entre 80% y 85%.
   - Descarga la imagen optimizada.
4. **Guarda la imagen en el proyecto:**
   - Colócala dentro de la carpeta correspondiente en `assets/images/` (por ejemplo `assets/images/services/rutas-empresariales.webp`).
5. **Actualiza la ruta en el código o JSON:**
   - En `index.html` (o en `data/services.json`), actualiza la propiedad `src` o `"image"` con la ruta relativa: `assets/images/services/rutas-empresariales.webp`.

---

## 5. Configuración de Integraciones Externas

### 5.1 Enlace de WhatsApp
Para modificar el número de teléfono celular al que llegarán los mensajes de WhatsApp:
1. Abre el archivo `index.html` (y los archivos de `services/*.html`).
2. Busca la etiqueta `<a class="whatsapp-floating-btn" href="https://wa.me/573108901234?...">`.
3. Reemplaza el número `573108901234` por el código de país y número deseado (sin espacios, guiones ni el símbolo `+`).
4. Si deseas cambiar el mensaje predeterminado, actualiza el parámetro `text=` utilizando codificación de URL (ejemplo: `Hola%20EliteCar...`).

### 5.2 Formulario de Contacto y Conexión con Brevo CRM
El formulario de contacto incluye validación en tiempo real y anti-spam. Para conectarlo con tu cuenta de **Brevo (Sendinblue)**:
1. Abre `assets/js/main.js`.
2. Localiza la sección `brevoConfig`:
   ```javascript
   brevoConfig: {
     endpointUrl: 'https://tu-endpoint-brevo.com/api/v3/...', // Ingresa aquí la URL de tu Webhook o Formulario de Brevo
     isDemoMode: false // Cambia a false para activar el envío en producción
   }
   ```
3. Si utilizas un formulario embebido con `<iframe>` o script directo de Brevo, puedes sustituir el `<form id="contact-form">` en `index.html` por el fragmento provisto por Brevo dentro de `<div id="brevo-form-container">`.

### 5.3 Google Tag Manager y Analítica
El sitio tiene incorporada la infraestructura de seguimiento mediante `window.dataLayer`. Todos los componentes emiten eventos personalizados:
* `slider_interaction`: Navegación en diapositivas.
* `service_carousel_interaction`: Uso del carrusel de servicios.
* `faq_interaction` y `faq_load_more_interaction`: Apertura y lectura de preguntas.
* `map_interaction`: Clicks sobre los pines de las ciudades de Colombia.
* `whatsapp_button_visible` y `whatsapp_button_click`: Conversiones a WhatsApp.
* `form_submit`: Envíos exitosos del formulario de cotización.

Para instalar el contenedor de Google Tag Manager de EliteCar, simplemente inserta el código oficial de GTM en la cabecera `<head>` de los archivos HTML.

---

## 6. Decisiones Técnicas y Discrepancias Resueltas

Durante el análisis del documento técnico y el mockup preliminar se detectaron 4 definiciones cruzadas, las cuales fueron resueltas priorizando la mejor experiencia de usuario y rendimiento:

1. **Bloque Intro Post-Hero:** El mockup incluía un titular destacado *"ELITECAR - SOLUCIONES DE TRANSPORTE CORPORATIVO"* con 2 columnas de texto y métricas. Se implementó fielmente al diseño visual utilizando el archivo `data/corporate.json`.
2. **Fondo de la Sección Servicios:** Se implementó con el fondo oscuro `--color-bg-dark: #141C1C` mostrado en el mockup para brindar un contraste prémium y destacar las tarjetas de servicios.
3. **Estructura del FAQ:** En lugar de un acordeón aislado, se adoptó el layout visual del mockup (foto de camioneta SUV ejecutiva a la izquierda + caja oscura de preguntas a la derecha en Desktop; apilado ordenado en móviles), conservando toda la funcionalidad técnica de 5 preguntas iniciales y botón de expansión.
4. **Compatibilidad Local y Web:** Los módulos JavaScript están programados con mecanismos de tolerancia a fallos, de tal forma que si el sitio es abierto localmente mediante el protocolo `file://` (donde algunos navegadores restringen peticiones locales `fetch`), los componentes continúan funcionando al 100% gracias a sus contenidos embebidos.

---

## 7. Despliegue y Puesta en Producción

El sitio no requiere servidores Node.js ni bases de datos activas. Puede alojarse en:
* Servidor compartido cPanel / Apache / Nginx.
* Firebase Hosting / Cloudflare Pages / Vercel / GitHub Pages.
* AWS S3 + CloudFront o Google Cloud Storage.

Para garantizar el cumplimiento de los tiempos de carga (**FCP < 1.5s**, **CLS < 0.1**):
* Activa la compresión **Gzip / Brotli** en el servidor web.
* Habilita cabeceras de caché prolongada para los archivos en `assets/`.
* Asegura el certificado SSL (HTTPS).

---
*Documentación elaborada por MATIZAR © 2026 para EliteCar.*
