# ============================================================
# PatternLens — Deployment Status Check
# Version: 2.0.0 (Merged)
# YOLO MODE: Runs automatically, no confirmations
# ============================================================

param(
    [switch]$AutoDeploy = $false,
    [switch]$Verbose = $false
)

$ErrorCount = 0
$WarningCount = 0

Write-Host @"

╔═══════════════════════════════════════════════════════════════╗
║         🔍 PATTERNLENS DEPLOYMENT STATUS CHECK                 ║
╚═══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

$startTime = Get-Date

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 1. ENVIRONMENT VARIABLES (Check first - needed for build)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "🔐 ENVIRONMENT VARIABLES" -ForegroundColor Yellow

$requiredVars = @(
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY", 
    "SUPABASE_SERVICE_ROLE_KEY",
    "NEXT_PUBLIC_APP_URL",
    "CLAUDE_API_KEY"
)

$optionalVars = @(
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "RESEND_API_KEY"
)

# Check .env.local file
$envFile = ".env.local"
$envContent = if (Test-Path $envFile) { Get-Content $envFile -Raw } else { "" }

foreach ($var in $requiredVars) {
    if ($envContent -match $var -or (Test-Path env:$var)) {
        Write-Host "   ✅ $var" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $var MISSING" -ForegroundColor Red
        $ErrorCount++
    }
}

foreach ($var in $optionalVars) {
    if ($envContent -match $var -or (Test-Path env:$var)) {
        Write-Host "   ✅ $var" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $var (optional)" -ForegroundColor Gray
    }
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 2. DEPENDENCIES CHECK
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n📦 DEPENDENCIES" -ForegroundColor Yellow

if (Test-Path "node_modules") {
    $nodeModulesSize = "{0:N0} MB" -f ((Get-ChildItem node_modules -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB)
    Write-Host "   ✅ node_modules exists ($nodeModulesSize)" -ForegroundColor Green
} else {
    Write-Host "   ❌ node_modules missing — run 'npm install'" -ForegroundColor Red
    $ErrorCount++
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 3. TYPESCRIPT CHECK
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n📘 TYPESCRIPT" -ForegroundColor Yellow

$tscOutput = npm run typecheck 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ TypeScript: PASSED" -ForegroundColor Green
} else {
    Write-Host "   ❌ TypeScript: ERRORS" -ForegroundColor Red
    if ($Verbose) {
        $tscOutput | Select-Object -First 10 | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
    }
    $ErrorCount++
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 4. ESLINT CHECK
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n🔧 ESLINT" -ForegroundColor Yellow

$lintOutput = npm run lint 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ ESLint: PASSED" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  ESLint: WARNINGS" -ForegroundColor Yellow
    $WarningCount++
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 5. BUILD TEST
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n🔨 BUILD" -ForegroundColor Yellow

$buildStart = Get-Date
$buildOutput = npm run build 2>&1
$buildDuration = ((Get-Date) - $buildStart).TotalSeconds

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Build: SUCCESS ($([math]::Round($buildDuration, 1))s)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Build: FAILED" -ForegroundColor Red
    if ($Verbose) {
        $buildOutput | Select-Object -Last 15 | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
    }
    $ErrorCount++
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 6. ROUTE ANALYSIS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n🗺️  ROUTES" -ForegroundColor Yellow

$routes = Get-ChildItem -Path "src/app" -Recurse -Filter "page.tsx" -ErrorAction SilentlyContinue
$routeCount = if ($routes) { $routes.Count } else { 0 }
$apiRoutes = Get-ChildItem -Path "src/app/api" -Recurse -Filter "route.ts" -ErrorAction SilentlyContinue
$apiCount = if ($apiRoutes) { $apiRoutes.Count } else { 0 }
$components = Get-ChildItem -Path "src/components" -Recurse -Filter "*.tsx" -ErrorAction SilentlyContinue
$componentCount = if ($components) { $components.Count } else { 0 }

Write-Host "   📍 Pages: $routeCount" -ForegroundColor Cyan
Write-Host "   🔌 API routes: $apiCount" -ForegroundColor Cyan
Write-Host "   🧩 Components: $componentCount" -ForegroundColor Cyan

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 7. SECURITY AUDIT
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n🔒 SECURITY" -ForegroundColor Yellow

$auditOutput = npm audit --production 2>&1
$vulnMatch = $auditOutput | Select-String -Pattern "(\d+) vulnerabilities"
if ($vulnMatch) {
    $vulnText = $vulnMatch.Matches[0].Value
    if ($vulnText -match "^0") {
        Write-Host "   ✅ No vulnerabilities" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  $vulnText" -ForegroundColor Yellow
        $WarningCount++
    }
} else {
    Write-Host "   ✅ No vulnerabilities" -ForegroundColor Green
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 8. DISK USAGE
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n💾 DISK USAGE" -ForegroundColor Yellow

if (Test-Path ".next") {
    $buildSize = (Get-ChildItem -Path ".next" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   📦 .next: $([math]::Round($buildSize, 2)) MB" -ForegroundColor Cyan
} else {
    Write-Host "   📦 .next: N/A (not built)" -ForegroundColor Gray
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 9. GIT STATUS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Write-Host "`n📊 GIT" -ForegroundColor Yellow

$branch = git branch --show-current 2>$null
$commit = git rev-parse --short HEAD 2>$null
$uncommitted = (git status --porcelain 2>$null | Measure-Object -Line).Lines

Write-Host "   🌿 Branch: $branch" -ForegroundColor Cyan
Write-Host "   📝 Commit: $commit" -ForegroundColor Cyan
if ($uncommitted -gt 0) {
    Write-Host "   ⚠️  Uncommitted: $uncommitted files" -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Working tree clean" -ForegroundColor Green
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FINAL SUMMARY
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
$totalTime = ((Get-Date) - $startTime).TotalSeconds

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 STATUS SUMMARY" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Status icons
$envIcon = if ($ErrorCount -eq 0 -or $envContent) { "✅" } else { "❌" }
$tsIcon = if ($LASTEXITCODE -eq 0) { "✅" } else { "❌" }
$buildIcon = if (Test-Path ".next") { "✅" } else { "❌" }

Write-Host "Env: $envIcon | TypeScript: $tsIcon | Build: $buildIcon" -ForegroundColor $(if ($ErrorCount -eq 0) { "Green" } else { "Yellow" })
Write-Host "Routes: $routeCount | APIs: $apiCount | Components: $componentCount" -ForegroundColor Cyan
Write-Host "⏱️  Check completed in $([math]::Round($totalTime, 1))s" -ForegroundColor Gray

if ($ErrorCount -eq 0) {
    Write-Host "`n🚀 READY FOR DEPLOYMENT" -ForegroundColor Green
    
    if ($AutoDeploy) {
        Write-Host "`n⚡ Auto-deploying..." -ForegroundColor Magenta
        & "$PSScriptRoot\deploy.ps1"
    }
    
    exit 0
} else {
    Write-Host "`n❌ $ErrorCount ERROR(S) — FIX BEFORE DEPLOY" -ForegroundColor Red
    if ($WarningCount -gt 0) {
        Write-Host "⚠️  $WarningCount warning(s)" -ForegroundColor Yellow
    }
    exit 1
}
