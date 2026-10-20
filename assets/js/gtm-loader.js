/**
 * EliteCar - Google Tag Manager Loader
 * Inyecta el contenedor GTM de forma dinámica en todas las páginas del sitio.
 * Lee el ID del contenedor desde /data/site-config.json para facilitar su actualización
 * sin necesidad de editar archivos HTML individuales.
 *
 * IMPORTANTE: Este script debe cargarse lo más temprano posible en el <head>
 * (antes de cualquier otro script) para garantizar que GTM capture todos los eventos.
 */

(function () {
  'use strict';

  // Detectar si la página está en una subcarpeta (services/)
  var isSubfolder = window.location.pathname.includes('/services/') ||
                    window.location.href.includes('/services/');
  var basePath = isSubfolder ? '../data/' : 'data/';

  /**
   * Inyecta el snippet <script> de GTM en el <head>
   */
  function injectGTMHead(containerId) {
    // Inicializar dataLayer antes de inyectar GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + containerId;
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  }

  /**
   * Inyecta el <noscript> iframe de GTM justo después de la apertura del <body>
   */
  function injectGTMNoScript(containerId) {
    var noscript = document.createElement('noscript');
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.googletagmanager.com/ns.html?id=' + containerId;
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);

    // Insertar como primer hijo del body
    if (document.body.firstChild) {
      document.body.insertBefore(noscript, document.body.firstChild);
    } else {
      document.body.appendChild(noscript);
    }
  }

  /**
   * Carga la configuración y ejecuta la inyección GTM
   */
  function loadGTM() {
    // Primero intentar con el data bundle (para file:// o entornos offline)
    if (window.ELITECAR_DATA && window.ELITECAR_DATA['site-config']) {
      var config = window.ELITECAR_DATA['site-config'];
      if (config.gtm && config.gtm.enabled && config.gtm.containerId && config.gtm.containerId !== 'GTM-XXXXXXX') {
        injectGTMHead(config.gtm.containerId);
        if (document.body) {
          injectGTMNoScript(config.gtm.containerId);
        } else {
          document.addEventListener('DOMContentLoaded', function () {
            injectGTMNoScript(config.gtm.containerId);
          });
        }
      }
      return;
    }

    // Si no hay bundle, cargar desde JSON via fetch
    if (window.location.protocol === 'file:') {
      // En file:// sin bundle no podemos hacer fetch — se omite GTM silenciosamente
      console.info('GTMLoader: Protocolo file:// detectado sin data-bundle. GTM omitido.');
      return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', basePath + 'site-config.json?_t=' + Date.now(), true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          var config = JSON.parse(xhr.responseText);
          if (config.gtm && config.gtm.enabled && config.gtm.containerId && config.gtm.containerId !== 'GTM-XXXXXXX') {
            injectGTMHead(config.gtm.containerId);
            if (document.body) {
              injectGTMNoScript(config.gtm.containerId);
            } else {
              document.addEventListener('DOMContentLoaded', function () {
                injectGTMNoScript(config.gtm.containerId);
              });
            }
          }
        } catch (e) {
          console.warn('GTMLoader: Error parseando site-config.json:', e);
        }
      }
    };
    xhr.send();
  }

  // Ejecutar inmediatamente (el script se carga en el <head>)
  loadGTM();
})();
