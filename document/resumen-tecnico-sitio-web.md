# Resumen técnico del sitio web EliteCar

## 1. Propósito y alcance

Este documento describe la arquitectura, la metodología de desarrollo y el procedimiento operativo para mantener los contenidos del sitio web corporativo de EliteCar. Está dirigido a las personas que actualizan textos, imágenes y páginas antes de publicar cambios.

El sitio es una aplicación web estática: no utiliza un CMS, una base de datos ni un servidor de aplicación propio. Los archivos HTML, CSS, JavaScript, JSON e imágenes se publican como archivos en un servidor web o plataforma de alojamiento estático. Las integraciones externas —por ejemplo, Brevo y Google Tag Manager— son independientes de esa arquitectura.

## 2. Arquitectura y metodología de desarrollo

### Tecnologías

- **HTML5 semántico:** estructura de páginas, secciones, enlaces, formularios y contenido disponible directamente en el documento.
- **CSS3 sin framework pesado:** estilos y componentes compartidos en `assets/css/styles.css`, con variables de diseño y reglas adaptables a distintos tamaños de pantalla.
- **JavaScript vanilla modular:** cada archivo de `assets/js/` atiende una función concreta, como navegación, slider, carrusel, FAQ, mapa, cookies o carga de contenido.
- **JSON:** almacena datos editoriales estructurados para el inicio, la navegación, las preguntas frecuentes, la página institucional y los detalles de servicios.
- **PowerShell:** genera partes del HTML inicial de la página de inicio, un paquete local de datos y el sitemap.

### Flujo de renderizado

1. Los archivos de `data/` actúan como fuente editable para las secciones que admiten administración por datos.
2. `scripts/render-home.ps1` lee y valida sintácticamente los JSON usados, escapa valores insertados en HTML y reemplaza los bloques delimitados por comentarios `JSON:...:START` y `JSON:...:END` dentro de `index.html`.
3. El mismo script regenera `assets/js/data-bundle.js`. El paquete permite que el cargador use los datos cuando el sitio se abre localmente con `file://` o no puede obtener el JSON.
4. En HTTP/HTTPS, `assets/js/content-loader.js` solicita los JSON y actualiza las secciones compatibles. La página de inicio ya incluye contenido HTML inicial, de modo que no depende exclusivamente de JavaScript para mostrar su contenido principal.
5. Las páginas internas parten de HTML con contenido inicial. El cargador actualiza “Quiénes Somos” desde `data/about.json` y las páginas bajo `services/` desde `data/services-detail.json`, cuando existe una entrada cuyo identificador coincide con el nombre del archivo.

El HTML inicial de la página de inicio y los bloques generados son salida del proceso, no la fuente editorial recomendada. Si se modifica un bloque generado manualmente, la siguiente ejecución de `render-home.ps1` lo reemplazará con los datos del JSON.

### Organización principal

| Ruta | Responsabilidad |
|---|---|
| `index.html` | Página principal y contenido HTML inicial de inicio. |
| `quienes-somos.html` | Plantilla HTML inicial de la página institucional. |
| `services/*.html` | Páginas internas de servicios; contienen estructura y contenido inicial. |
| `data/*.json` | Datos editables para navegación, inicio, FAQ, contacto, página institucional y servicios. |
| `assets/css/styles.css` | Estilos, diseño compartido y comportamiento responsivo visual. |
| `assets/js/` | Interacciones y carga de datos en el navegador. |
| `assets/images/` | Imágenes, organizadas por uso (por ejemplo `hero/`, `services/`, `faq/` y `logo/`). |
| `scripts/render-home.ps1` | Regenera los bloques de inicio y el paquete `data-bundle.js`. |
| `scripts/generate-sitemap.ps1` | Genera `sitemap.xml` a partir de las páginas HTML públicas. |

## 3. Gestión y actualización de contenidos

### Archivos de datos

| Archivo | Contenido que administra |
|---|---|
| `data/navigation.json` | Etiquetas, rutas y submenús de navegación, además del CTA del encabezado. |
| `data/slider.json` | Diapositivas del hero: textos, CTA, imagen, texto alternativo y parámetros del slider. |
| `data/corporate.json` | Titulares, párrafos y métricas de presentación corporativa en el inicio. |
| `data/services.json` | Título de sección y tarjetas de servicios del inicio, incluyendo ruta e imagen. |
| `data/benefits.json` | Título, descripciones, iconos y CTA de beneficios. |
| `data/faq.json` | Preguntas, respuestas, imagen lateral y cantidad inicial visible. |
| `data/map.json` | Información de contacto, WhatsApp, ciudades y coordenadas de los pines del mapa. |
| `data/about.json` | Hero, historia, imagen, pilares y métricas de “Quiénes Somos”. |
| `data/services-detail.json` | Contenido de detalle asociado al identificador/nombre de archivo de cada servicio. |
| `data/site-config.json` | Configuración de integraciones, incluido el estado e identificador del contenedor GTM. |

### Procedimiento para actualizar textos

1. Identifique el archivo JSON responsable del contenido en la tabla anterior.
2. Edite el valor manteniendo la estructura: comillas dobles, claves, llaves, corchetes y comas. Guarde el archivo como UTF-8.
3. No introduzca etiquetas HTML en valores de texto salvo que el componente esté expresamente diseñado para recibir marcado. En la mayoría de secciones, el texto debe ser contenido plano.
4. Para añadir elementos repetibles —por ejemplo, una pregunta, un beneficio o un servicio— copie un objeto existente y actualice todos sus campos. Mantenga identificadores únicos cuando existan.
5. Revise que el JSON siga siendo válido y que las rutas referenciadas existan.
6. Desde la raíz del proyecto, regenere el inicio y el paquete de respaldo:

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\render-home.ps1
   ```

7. Revise los cambios generados en `index.html` y `assets/js/data-bundle.js`. Compruebe la página localmente mediante HTTP y pruebe también la navegación y la versión móvil.
8. Publique juntos los JSON modificados y los archivos generados correspondientes. No publique solo `index.html` si también cambió el paquete de respaldo.

El contenido dinámico de páginas internas se actualiza desde sus JSON en HTTP/HTTPS, pero su HTML también conserva una versión inicial. Si se requiere que el texto actualizado siga apareciendo cuando JavaScript o la carga JSON no están disponibles, actualice el marcado inicial de la página interna además del JSON.

### Contenido editado directamente en HTML

Los textos legales, metadatos SEO y partes de las páginas que no estén enlazadas a los datos se mantienen en sus archivos `.html`. Para cambiarlos, edite la página correspondiente sin eliminar las etiquetas semánticas ni los atributos de accesibilidad. Guarde como UTF-8. Las modificaciones directas a bloques `JSON:...:START/END` de `index.html` no son persistentes frente a una regeneración.

### Extensión editorial recomendada

Las siguientes cifras son objetivos editoriales para facilitar la lectura y el ajuste visual; no son límites impuestos automáticamente por el código:

| Elemento | Extensión orientativa |
|---|---:|
| Título principal de página (`h1`) | 35–70 caracteres |
| Titular o badge de sección | 20–60 caracteres |
| Subtítulo de hero | 100–180 caracteres, en una o dos frases |
| Descripción de tarjeta de servicio | 100–180 caracteres |
| Pregunta frecuente | Una pregunta concreta, preferiblemente menor de 120 caracteres |
| Respuesta FAQ | 1–3 párrafos breves, respondiendo directamente a la pregunta |
| Título SEO (`<title>`) | Aproximadamente 50–60 caracteres, único por página |
| Meta descripción | Aproximadamente 140–160 caracteres, única y fiel al contenido visible |

Priorice información verificable, lenguaje claro y una idea principal por párrafo. Evite repetir palabras clave, usar títulos en mayúsculas sostenidas en textos largos y publicar cifras comerciales sin confirmarlas.

## 4. Actualización y optimización de imágenes

### Recomendaciones técnicas

Use **WebP** para fotografías e imágenes rasterizadas del sitio, con nombres descriptivos en minúsculas y guiones, sin espacios ni tildes. Guarde el archivo en la subcarpeta temática correspondiente y actualice su ruta en el JSON o HTML que lo utiliza. Los logotipos vectoriales deben conservarse preferiblemente como SVG. El recurso Open Graph existente es JPG; si se sustituye, verifique su compatibilidad con las plataformas sociales antes de publicar.

Algunos valores de imagen en `data/about.json` y `data/services-detail.json` todavía apuntan a URLs externas de Unsplash. Para alojar esas fotografías localmente, descargue y optimice la imagen con permiso de uso, guárdela bajo `assets/images/` y sustituya la URL por la ruta local correspondiente; actualice también `alt`.

| Uso | Dimensiones orientativas | Proporción | Peso objetivo |
|---|---:|---:|---:|
| Hero / diapositiva | 1920 × 1080 px | 16:9 | hasta 180 KB |
| Tarjeta de servicio | 800 × 500 px | 16:10 | hasta 80 KB |
| Imagen lateral de FAQ | 1000 × 800 px | 5:4 | hasta 120 KB |
| Hero de página interna | 1920 × 600 px | panorámica | hasta 140 KB |
| Imagen de detalle interno | 1000 × 650 px | 3:2 | hasta 110 KB |
| Logotipo | Preferiblemente vectorial | según diseño | SVG optimizado |

Son valores de referencia, no reglas comprobadas por un validador del proyecto. Elija el recorte que mantenga el sujeto visible en móvil y desktop; reduzca dimensiones y calidad hasta equilibrar nitidez y peso. Una calidad WebP aproximada de 80–85 % es un buen punto de partida, no un requisito fijo.

### Pasos para reemplazar una imagen

1. Prepare y optimice la imagen en WebP. Verifique su visualización, dimensiones y peso.
2. Añada el archivo, por ejemplo, en `assets/images/services/transporte-aeropuerto-flota.webp`.
3. Cambie el campo `image` o `url` que corresponda. En JSON, use una ruta relativa a la raíz, como `assets/images/services/transporte-aeropuerto-flota.webp`. En HTML dentro de `services/`, la ruta a assets normalmente empieza con `../assets/`.
4. Actualice el texto alternativo (`alt`) con una descripción breve de la información visual relevante. Use `alt=""` solo si la imagen es puramente decorativa.
5. Compruebe que las rutas funcionen desde la página donde se muestra la imagen y que no haya errores 404.

Si el diseño usa `object-fit: cover`, la imagen puede recortarse de forma distinta según el viewport. Compruebe el encuadre en móvil y escritorio; no incluya texto esencial incrustado en la fotografía.

## 5. Incorporación de contenido nuevo y páginas internas

### Añadir una página de detalle de servicio

1. Cree `services/nombre-del-servicio.html` tomando como referencia una página existente de `services/`. Mantenga el idioma (`lang="es"`), metadatos básicos, header, footer, estructura semántica y referencias a CSS y JavaScript.
2. Sustituya el contenido inicial del HTML y complete sus metadatos propios: `<title>`, descripción, URL canónica y etiquetas Open Graph. Use un único `h1`, títulos jerárquicos y enlaces funcionales.
3. Añada una entrada en `data/services-detail.json` cuya clave coincida exactamente con el nombre del archivo sin `.html`. Por ejemplo, `nombre-del-servicio` para `nombre-del-servicio.html`. Use la misma estructura de los otros detalles (hero, párrafo, características, CTAs, imagen y `alt`).
4. Si el servicio debe aparecer como tarjeta en el inicio, añada el objeto correspondiente a `services` dentro de `data/services.json`. Defina `id` único, `name`, `description`, `image`, `alt` y `link` con ruta `services/nombre-del-servicio.html`.
5. Si debe aparecer en el desplegable, incluya el enlace en `data/navigation.json`. Compruebe que la ruta relativa desde el inicio y desde las páginas internas sea correcta; la carga dinámica ajusta rutas JSON, pero los enlaces escritos directamente en HTML requieren la ruta relativa correcta.
6. Regenere `index.html` y `data-bundle.js` con `scripts/render-home.ps1`.
7. Regenere el sitemap:

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File scripts\generate-sitemap.ps1
   ```

   El generador incluye páginas HTML públicas detectadas en el proyecto y excluye `base-form.html` y el archivo de verificación de Google. Revise `sitemap.xml` después de ejecutarlo.
8. Pruebe la página directamente, los enlaces del header y tarjetas, imágenes, llamadas a la acción, metadatos y visualización adaptable. Publique la página y los archivos JSON, imágenes, bundle y sitemap modificados.

`data/services-detail.json` incluye una clave `alquiler-temporal`, pero para que esa clave corresponda a una página navegable también debe existir su archivo HTML y deben añadirse los enlaces pertinentes. La existencia de datos JSON por sí sola no crea una página.

### Añadir otros tipos de páginas

Para una página institucional o legal, cree un HTML coherente con las plantillas existentes, añada enlaces desde la navegación o páginas relacionadas y complete metadatos, accesibilidad y enlaces internos. El cargador actual reconoce expresamente la página de inicio, `quienes-somos.html`, páginas dentro de `services/` y páginas generales/legales; crear un nuevo JSON no conecta automáticamente una página a ese cargador. Si el contenido debe ser dinámico, se requiere implementar y probar la integración correspondiente en `assets/js/content-loader.js`.

## 6. Revisión previa a publicación

- Validar JSON y revisar que no haya comas finales, claves duplicadas o campos eliminados accidentalmente.
- Ejecutar `render-home.ps1` tras los cambios de datos y revisar el diff de archivos generados.
- Ejecutar `generate-sitemap.ps1` al añadir o eliminar páginas públicas.
- Verificar enlaces, rutas de imágenes, textos alternativos, títulos y descripciones SEO.
- Probar interacciones y maquetación en escritorio y móvil usando HTTP/HTTPS; la apertura con `file://` tiene restricciones de navegador y solo cuenta con el respaldo incluido en `data-bundle.js`.
- Confirmar que los textos visibles, los datos JSON y los metadatos describan el mismo contenido.
- Publicar todos los archivos relacionados en una misma versión y validar la página desplegada por HTTPS.

## 7. Límites del modelo de gestión

La edición de contenidos es una operación sobre archivos del repositorio, no una interfaz administrativa para usuarios finales. Los JSON permiten centralizar datos, pero el esquema se mantiene mediante convenciones y el generador no sustituye una revisión editorial o visual. Las páginas internas requieren conservar su HTML inicial y metadatos; el cargador dinámico complementa ese marcado, no crea automáticamente una página completa.
