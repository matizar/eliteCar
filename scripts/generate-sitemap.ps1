$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$siteUrl = 'https://www.elitecar.com.co'
$sitemapPath = Join-Path $root 'sitemap.xml'
$excludedFiles = @(
  'base-form.html',
  'googled9a8eec74af5450c.html'
)

$pages = Get-ChildItem -Path $root -Recurse -File -Filter '*.html' |
  Where-Object {
    $relativePath = $_.FullName.Substring($root.Length).TrimStart('\')
    $_.Name -notin $excludedFiles -and
      $relativePath -notmatch '(^|\\)(assets|data|scripts|document)\\'
  } |
  Sort-Object @{
    Expression = { if ($_.FullName -eq (Join-Path $root 'index.html')) { 0 } else { 1 } }
  }, FullName

$settings = New-Object System.Xml.XmlWriterSettings
$settings.Encoding = New-Object System.Text.UTF8Encoding($false)
$settings.Indent = $true
$settings.IndentChars = '  '

$writer = [System.Xml.XmlWriter]::Create($sitemapPath, $settings)
try {
  $writer.WriteStartDocument()
  $writer.WriteStartElement('urlset', 'http://www.sitemaps.org/schemas/sitemap/0.9')

  foreach ($page in $pages) {
    $relativePath = $page.FullName.Substring($root.Length).TrimStart('\')
    $urlPath = ($relativePath -split '\\' | ForEach-Object { [System.Uri]::EscapeDataString($_) }) -join '/'
    if ($relativePath -eq 'index.html') {
      $urlPath = ''
    }

    $writer.WriteStartElement('url')
    $writer.WriteElementString('loc', "$siteUrl/$urlPath")
    $writer.WriteEndElement()
  }

  $writer.WriteEndElement()
  $writer.WriteEndDocument()
} finally {
  $writer.Dispose()
}

Write-Host "Sitemap generado: $sitemapPath ($($pages.Count) URLs)"
