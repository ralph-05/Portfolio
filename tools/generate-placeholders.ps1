# Generates placeholder SVG assets for the portfolio.
# Re-run after changing the palette so placeholders stay on-brand.
param([string]$Root = ".")

$ErrorActionPreference = "Stop"

function Write-Svg {
    param([string]$RelativePath, [string]$Content)
    $full = Join-Path $Root $RelativePath
    $dir  = Split-Path $full -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    Set-Content -LiteralPath $full -Value $Content -Encoding UTF8
    Write-Host "wrote $RelativePath"
}

# ---------------------------------------------------------------- favicon
Write-Svg "assets/img/favicon.svg" @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#g)"/>
  <text x="32" y="41" font-family="Consolas,monospace" font-size="24" font-weight="700"
        text-anchor="middle" fill="#fff">&lt;/&gt;</text>
</svg>
'@

# ---------------------------------------------------------------- avatar (profile photo placeholder)
Write-Svg "assets/img/avatar.svg" @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="55%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <clipPath id="clip"><circle cx="200" cy="200" r="200"/></clipPath>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="400" height="400" fill="url(#bg)"/>
    <circle cx="200" cy="160" r="62" fill="#ffffff" opacity=".92"/>
    <path d="M72 352c0-72 57-126 128-126s128 54 128 126z" fill="#ffffff" opacity=".92"/>
  </g>
</svg>
'@

# ---------------------------------------------------------------- workspace (network rack illustration)
Write-Svg "assets/img/workspace.svg" @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450">
  <defs>
    <linearGradient id="d" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb" stop-opacity=".25"/>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity=".25"/>
    </linearGradient>
    <linearGradient id="s" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="600" height="450" rx="18" fill="#0d1322"/>
  <rect x="1" y="1" width="598" height="448" rx="17" fill="url(#d)"/>
  <g stroke="#2f3b57" stroke-width="6" stroke-linecap="round">
    <line x1="70" y1="95" x2="70" y2="95"/>
    <line x1="70" y1="130" x2="240" y2="130"/>
    <line x1="70" y1="160" x2="190" y2="160"/>
    <line x1="70" y1="190" x2="220" y2="190"/>
    <line x1="70" y1="220" x2="160" y2="220"/>
  </g>
  <rect x="300" y="55" width="250" height="160" rx="10" fill="#131b2e" stroke="url(#s)" stroke-width="4"/>
  <g stroke="#38bdf8" stroke-width="3" opacity=".7">
    <line x1="320" y1="90" x2="470" y2="90"/>
    <line x1="320" y1="120" x2="520" y2="120"/>
    <line x1="320" y1="150" x2="440" y2="150"/>
    <line x1="320" y1="180" x2="500" y2="180"/>
  </g>
  <rect x="90" y="290" width="420" height="18" rx="9" fill="url(#s)"/>
  <rect x="140" y="308" width="16" height="90" rx="8" fill="#1b2438"/>
  <rect x="444" y="308" width="16" height="90" rx="8" fill="#1b2438"/>
  <rect x="230" y="245" width="150" height="45" rx="8" fill="#131b2e" stroke="#38bdf8" stroke-width="3"/>
  <circle cx="460" cy="290" r="18" fill="#22d3ee"/>
</svg>
'@

# ---------------------------------------------------------------- project thumbnails
# One entry per project in assets/js/data.js — keep n, colours and title in sync.
$project = @'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 375" width="600" height="375">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="__C1__"/>
      <stop offset="100%" stop-color="__C2__"/>
    </linearGradient>
    <linearGradient id="veil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#070b14" stop-opacity="0"/>
      <stop offset="100%" stop-color="#070b14" stop-opacity=".6"/>
    </linearGradient>
  </defs>
  <rect width="600" height="375" fill="url(#g)"/>
  <g fill="#ffffff" opacity=".14">
    <circle cx="470" cy="80" r="120"/>
    <circle cx="110" cy="320" r="90"/>
  </g>
  <rect x="55" y="75" width="300" height="200" rx="14" fill="#070b14" opacity=".84"/>
  <rect x="70" y="90" width="270" height="24" rx="7" fill="#ffffff" opacity=".22"/>
  <g fill="#ffffff" opacity=".3">
    <rect x="70" y="128" width="120" height="9" rx="4.5"/>
    <rect x="70" y="148" width="190" height="9" rx="4.5"/>
    <rect x="70" y="182" width="90" height="64" rx="9"/>
    <rect x="170" y="182" width="90" height="64" rx="9"/>
    <rect x="270" y="182" width="55" height="64" rx="9"/>
  </g>
  <rect x="70" y="256" width="120" height="9" rx="4.5" fill="#ffffff" opacity=".45"/>
  <rect width="600" height="375" fill="url(#veil)"/>
  <text x="36" y="336" font-family="Segoe UI,system-ui,sans-serif" font-size="26" font-weight="700"
        fill="#ffffff" opacity=".92">__TITLE__</text>
</svg>
'@
$themes = @(
    @{ n = 1; c1 = "#2563eb"; c2 = "#06b6d4"; t = "QuickTap POS" },
    @{ n = 2; c1 = "#06b6d4"; c2 = "#8b5cf6"; t = "Attendance System" },
    @{ n = 3; c1 = "#8b5cf6"; c2 = "#2563eb"; t = "Network Topology" },
    @{ n = 4; c1 = "#0ea5e9"; c2 = "#34d399"; t = "Content Filtering" }
)
foreach ($p in $themes) {
    $svg = $project.Replace("__C1__", $p.c1).Replace("__C2__", $p.c2).Replace("__TITLE__", $p.t)
    Write-Svg "assets/img/project-$($p.n).svg" $svg
}

Write-Host "`nAll assets generated."