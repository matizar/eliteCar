$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$indexPath = Join-Path $root 'index.html'

function Read-JsonFile([string]$name) {
  $path = Join-Path (Join-Path $root 'data') "$name.json"
  return [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8) | ConvertFrom-Json
}

function Html([object]$value) {
  if ($null -eq $value) { return '' }
  return ([string]$value).Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;').Replace('"', '&quot;').Replace("'", '&#39;')
}

function Safe-Path([string]$value) {
  if ($value.StartsWith('../')) { $value = $value.Substring(3) }
  return Html $value
}

function Set-JsonBlock([string]$source, [string]$name, [string]$content) {
  $start = "<!-- JSON:$name`:START -->"
  $end = "<!-- JSON:$name`:END -->"
  $startIndex = $source.IndexOf($start, [StringComparison]::Ordinal)
  $endIndex = $source.IndexOf($end, [StringComparison]::Ordinal)
  if ($startIndex -lt 0 -or $endIndex -lt $startIndex) {
    throw "No se encontraron los marcadores JSON:$name"
  }
  if ($source.IndexOf($start, $startIndex + $start.Length, [StringComparison]::Ordinal) -ge 0 -or
      $source.IndexOf($end, $endIndex + $end.Length, [StringComparison]::Ordinal) -ge 0) {
    throw "Los marcadores JSON:$name deben ser unicos"
  }
  $before = $source.Substring(0, $startIndex + $start.Length)
  $after = $source.Substring($endIndex)
  return "$before`n$content`n$after"
}

function Render-Navigation($data) {
  $items = foreach ($item in $data.items) {
    $href = Safe-Path $item.path
    if ($item.type -ne 'dropdown' -or $null -eq $item.items) {
      "<div class=`"nav-item`"><a href=`"$href`" class=`"nav-link`">$(Html $item.label)</a></div>"
      continue
    }
    $submenu = foreach ($sub in $item.items) {
      "<a href=`"$(Safe-Path $sub.path)`" class=`"dropdown-link`" role=`"menuitem`">$(Html $sub.label)</a>"
    }
    @"
<div class="nav-item has-dropdown">
  <a href="$href" class="nav-link" aria-haspopup="true" aria-expanded="false">
    $(Html $item.label)
    <svg class="dropdown-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </a>
  <div class="dropdown-menu" role="menu">$($submenu -join "`n")</div>
</div>
"@
  }
  return $items -join "`n"
}

function Render-Slides($data) {
  $items = for ($i = 0; $i -lt $data.slides.Count; $i++) {
    $slide = $data.slides[$i]
    $activeClass = if ($i -eq 0) { ' active' } else { '' }
    $titleTag = if ($i -eq 0) { 'h1' } else { 'h2' }
    $ctaText = if ($slide.ctaText) { $slide.ctaText } else { 'CONOCE ' + [char]0x00C1 + 'S' }
    @"
<div class="slide-item$activeClass">
  <img src="$(Safe-Path $slide.image)" alt="$(Html $(if ($slide.alt) { $slide.alt } else { $slide.title }))" class="slide-image">
  <div class="slide-overlay"></div>
  <div class="slide-content">
    <span class="slide-badge">$(Html $(if ($slide.badge) { $slide.badge } else { 'ELITECAR' }))</span>
    <$titleTag class="slide-title">$(Html $slide.title)</$titleTag>
    <p class="slide-subtitle">$(Html $slide.subtitle)</p>
    <a href="$(Safe-Path $slide.ctaLink)" class="btn hero-cta">$(Html $ctaText)</a>
  </div>
</div>
"@
  }
  return $items -join "`n"
}

function Render-ServiceCards($items) {
  $cards = foreach ($service in $items) {
    $alt = if ($service.alt) { $service.alt } else { $service.name }
    $category = if ($service.category) { $service.category } else { 'Servicio' }
    $cta = if ($service.ctaText) { $service.ctaText } else { 'CONOCE ' + [char]0x00C1 + 'S' }
    @"
<article class="service-card" data-service-id="$(Html $service.id)">
  <div class="service-card-media"><img src="$(Safe-Path $service.image)" alt="$(Html $alt)" class="service-card-img" loading="lazy"><span class="service-card-category">$(Html $category)</span></div>
  <div class="service-card-body"><h3 class="service-card-title">$(Html $service.name)</h3><p class="service-card-desc">$(Html $service.description)</p><a href="$(Safe-Path $service.link)" class="btn btn-sm service-card-cta">$(Html $cta)</a></div>
</article>
"@
  }
  return $cards -join "`n"
}

$benefitIcons = @{
  shield = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
  seguridad = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>'
  telemetry = '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>'
  tecnologia = '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line>'
  quality = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>'
  calidad = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>'
  maintenance = '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>'
  mantenimiento = '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>'
  handshake = '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>'
  conductores = '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline>'
  invoice = '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>'
  facturacion = '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>'
}

function Render-Benefits($items) {
  $cards = foreach ($item in $items) {
    $icon = $benefitIcons[$item.icon]
    if (!$icon) { $icon = '<circle cx="12" cy="12" r="10"></circle>' }
    @"
<div class="benefit-card">
  <div class="benefit-icon-wrapper"><svg class="benefit-icon" viewBox="0 0 24 24">$icon</svg></div>
  <h3 class="benefit-title">$(Html $item.title)</h3>
  <p class="benefit-desc">$(Html $item.description)</p>
</div>
"@
  }
  return $cards -join "`n"
}

function Render-Faq($items) {
  $cards = for ($i = 0; $i -lt $items.Count; $i++) {
    $item = $items[$i]
    @"
<div class="faq-item">
  <button class="faq-trigger" aria-expanded="false">
    <div class="faq-question-wrap"><span class="faq-number">$($i + 1)</span><span class="faq-question">$(Html $item.question)</span></div>
    <span class="faq-indicator">+</span>
  </button>
  <div class="faq-answer" aria-hidden="true"><div class="faq-answer-inner">$(Html $item.answer)</div></div>
</div>
"@
  }
  return $cards -join "`n"
}

function Render-MapPins($items) {
  $icon = '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>'
  $pins = @($items | Where-Object { $_.show -ne $false })
  $output = for ($i = 0; $i -lt $pins.Count; $i++) {
    $pin = $pins[$i]
    if ($pin.coordinates.x -notmatch '^\d+(\.\d+)?%$' -or $pin.coordinates.y -notmatch '^\d+(\.\d+)?%$') {
      throw "Coordenadas invalidas para el pin $($pin.city)"
    }
    $active = if ($i -eq 0) { ' active' } else { '' }
    $role = if ($pin.role) { " ($(Html $pin.role))" } else { '' }
    $description = if ($pin.description) { "<br>$(Html $pin.description)" } else { '' }
    @"
<div class="map-pin$active" style="left: $($pin.coordinates.x); top: $($pin.coordinates.y);" data-city="$(Html $pin.city)">
  <div class="pin-pulse"></div>
  <svg class="pin-icon" viewBox="0 0 24 24" fill="#F2CD16" stroke="#141C1C" stroke-width="1.5">$icon</svg>
  <div class="map-tooltip"><strong>$(Html $pin.city)$role</strong>$description</div>
</div>
"@
  }
  return $output -join "`n"
}

function Render-ContactInfo($company) {
  $phone = if ($company.phone) { $company.phone } else { $company.phoneMobile }
  $tel = $phone -replace '[^0-9+]', ''
  $address = if ($company.address) { $company.address } else { $company.headquarters }
  @"
<div class="contact-info-item">
  <svg class="contact-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
  <div class="contact-info-text"><strong>Sede Principal</strong><span>$(Html $address)</span></div>
</div>
<div class="contact-info-item">
  <svg class="contact-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
  <div class="contact-info-text"><strong>L&#237;neas de Atenci&#243;n</strong><a href="tel:$(Html $tel)">$(Html $phone)</a></div>
</div>
<div class="contact-info-item">
  <svg class="contact-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
  <div class="contact-info-text"><strong>Correo Electr&#243;nico</strong><a href="mailto:$(Html $company.email)">$(Html $company.email)</a></div>
</div>
<div class="contact-info-item">
  <svg class="contact-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  <div class="contact-info-text"><strong>Horario Operativo</strong><span>$(Html $company.hours)</span></div>
</div>
"@
}

$navigation = Read-JsonFile 'navigation'
$slider = Read-JsonFile 'slider'
$corporate = Read-JsonFile 'corporate'
$services = Read-JsonFile 'services'
$benefits = Read-JsonFile 'benefits'
$faq = Read-JsonFile 'faq'
$map = Read-JsonFile 'map'
$html = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
$bundleData = [ordered]@{}
foreach ($name in @('navigation', 'slider', 'corporate', 'services', 'benefits', 'faq', 'map', 'about', 'services-detail')) {
  $bundleData[$name] = Read-JsonFile $name
}
$footerPhone = if ($map.companyInfo.phone) { $map.companyInfo.phone } else { $map.companyInfo.phoneMobile }
$footerAddress = if ($map.companyInfo.address) { $map.companyInfo.address } else { $map.companyInfo.headquarters }
$faqMoreCount = [Math]::Max(0, $faq.questions.Count - $faq.initialDisplay)
$faqMoreLabel = if ($faqMoreCount -gt 0) {
  'MOSTRAR M' + [char]0x00C1 + "S PREGUNTAS ($faqMoreCount M" + [char]0x00C1 + 'S)'
} else {
  'MOSTRAR M' + [char]0x00C1 + 'S PREGUNTAS'
}
$whatsappNumber = [string]$map.companyInfo.whatsappNumber -replace '[^0-9]', ''
$whatsappMessage = if ($map.companyInfo.whatsappMessage) {
  $map.companyInfo.whatsappMessage
} else {
  'Hola EliteCar, deseo informacion sobre servicios de transporte.'
}
$whatsappUrl = 'https://wa.me/' + $whatsappNumber + '?text=' + [System.Uri]::EscapeDataString($whatsappMessage)
$socialImage = [string]$slider.slides[0].image
if ($socialImage -notmatch '^https?://') {
  $socialImage = 'https://elitecar.com.co/' + $socialImage.TrimStart('/')
}
$servedCities = @($map.pins | Where-Object { $_.show -ne $false } | ForEach-Object { $_.city })
$businessSchema = @{
  '@context' = 'https://schema.org'
  '@type' = 'LocalBusiness'
  name = $map.companyInfo.name
  image = $socialImage
  description = $corporate.lead
  url = 'https://elitecar.com.co/'
  telephone = $footerPhone
  email = $map.companyInfo.email
  address = $footerAddress
  areaServed = $servedCities
} | ConvertTo-Json -Depth 20 -Compress
$businessSchema = $businessSchema.Replace('<', '\u003c').Replace('>', '\u003e').Replace('&', '\u0026')

$blocks = [ordered]@{
  HEADER_CTA = "<a href=`"$(Safe-Path $navigation.cta.path)`" class=`"btn btn-sm header-cta-btn`">$(Html $navigation.cta.label)</a>"
  SOCIAL_IMAGE = "<meta property=`"og:image`" content=`"$(Html $socialImage)`">"
  TWITTER_IMAGE = "<meta name=`"twitter:image`" content=`"$(Html $socialImage)`">"
  BUSINESS_SCHEMA = "<script type=`"application/ld+json`">$businessSchema</script>"
  NAVIGATION = Render-Navigation $navigation
  SLIDER = Render-Slides $slider
  CORPORATE_BADGE = "<span class=`"badge-tag`">$(Html $corporate.badge)</span>"
  CORPORATE_TITLE = "<h2 class=`"corporate-headline`">$(Html $corporate.title)</h2>"
  CORPORATE_LEAD = "<p class=`"corporate-lead`">$(Html $corporate.lead)</p>"
  CORPORATE_COLUMNS = (($corporate.columns | ForEach-Object { "<div class=`"corporate-text-column`"><p>$(Html $_.paragraph)</p></div>" }) -join "`n")
  CORPORATE_METRICS = (($corporate.metrics | ForEach-Object { "<div class=`"metric-card`"><div class=`"metric-value`">$(Html $_.value)</div><div class=`"metric-label`">$(Html $_.label)</div><div class=`"metric-detail`">$(Html $_.detail)</div></div>" }) -join "`n")
  SERVICES_TITLE = "<h2 class=`"section-title`">$(Html $services.sectionTitle)</h2>"
  SERVICES_SUBTITLE = "<p class=`"section-subtitle`">$(Html $services.sectionSubtitle)</p>"
  SERVICES = Render-ServiceCards $services.services
  BENEFITS_TITLE = "<h2 class=`"section-title`">$(Html $benefits.title)</h2>"
  BENEFITS_SUBTITLE = "<p class=`"section-subtitle`">$(Html $benefits.subtitle)</p>"
  BENEFITS = Render-Benefits $benefits.items
  BENEFITS_CTA = "<a href=`"$(Safe-Path $benefits.cta.link)`" class=`"btn`">$(Html $benefits.cta.text)</a>"
  FAQ_TITLE = "<h2 class=`"section-title`">$(Html $faq.title)</h2>"
  FAQ_SUBTITLE = "<p class=`"section-subtitle`">$(Html $faq.subtitle)</p>"
  FAQ_IMAGE = "<img src=`"$(Safe-Path $faq.sideImage.url)`" alt=`"$(Html $faq.sideImage.alt)`" class=`"faq-side-img`" loading=`"lazy`">"
  FAQ_BADGE = "<span class=`"faq-image-badge`">$(Html $faq.sideImage.badge)</span>"
  FAQ = Render-Faq $faq.questions
  FAQ_LOAD_MORE = "<button class=`"btn btn-secondary btn-block btn-faq-load-more`">$(Html $faqMoreLabel)</button>"
  CONTACT_TITLE = "<h2 class=`"section-title`">$(Html $map.title)</h2>"
  CONTACT_SUBTITLE = "<p class=`"section-subtitle`">$(Html $map.subtitle)</p>"
  MAP_PINS = Render-MapPins $map.pins
  CONTACT_INFO = Render-ContactInfo $map.companyInfo
  FOOTER_ADDRESS = "<strong>Direcci&#243;n:</strong><br>$(Html $footerAddress)"
  FOOTER_PHONE = "<strong>Tel&#233;fono:</strong><br><a href=`"tel:$(Html ($footerPhone -replace '[^0-9+]', ''))`" style=`"color: var(--color-primary);`">$(Html $footerPhone)</a>"
  FOOTER_EMAIL = "<strong>Email Corporativo:</strong><br><a href=`"mailto:$(Html $map.companyInfo.email)`" style=`"color: var(--color-primary);`">$(Html $map.companyInfo.email)</a>"
  WHATSAPP_LINK = @"
<a href="$(Html $whatsappUrl)" class="whatsapp-floating-btn" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp">
  <span class="whatsapp-tooltip">&#191;Conversamos por WhatsApp?</span>
  <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.76-.15-.25-.02-.39.11-.52.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.3 3.8 2.53 1.09 2.53.73 2.99.69.46-.04 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.07-.11-.23-.17-.48-.29z"/></svg>
</a>
"@
}

foreach ($name in $blocks.Keys) {
  $html = Set-JsonBlock $html $name ([string]$blocks[$name])
}

$faqSchema = @{
  '@context' = 'https://schema.org'
  '@type' = 'FAQPage'
  mainEntity = @($faq.questions | ForEach-Object {
    @{
      '@type' = 'Question'
      name = $_.question
      acceptedAnswer = @{
        '@type' = 'Answer'
        text = $_.answer
      }
    }
  })
} | ConvertTo-Json -Depth 20 -Compress
$faqSchema = $faqSchema.Replace('<', '\u003c').Replace('>', '\u003e').Replace('&', '\u0026')
$html = Set-JsonBlock $html 'FAQ_SCHEMA' "<script type=`"application/ld+json`">$faqSchema</script>"

$encoding = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($indexPath, $html, $encoding)
$bundleJson = $bundleData | ConvertTo-Json -Depth 100
$bundlePath = Join-Path (Join-Path $root 'assets') 'js\data-bundle.js'
$bundle = "// Generated from data/*.json by scripts/render-home.ps1.`nwindow.ELITECAR_DATA = $bundleJson;`n"
[System.IO.File]::WriteAllText($bundlePath, $bundle, $encoding)
Write-Output 'index.html y data-bundle.js generados desde data/*.json'
