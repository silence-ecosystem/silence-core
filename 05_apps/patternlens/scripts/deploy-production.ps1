# ============================================
# PATTERNLENS v4.0 PRODUCTION DEPLOYMENT
# PowerShell Script for Windows
# Domain: patternlens.app
# ============================================

$ErrorActionPreference = "Stop"
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$LogFile = "deployment-$Timestamp.log"

Write-Host "🚀 PatternLens Production Deployment" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Timestamp: $Timestamp"
Write-Host "Target: patternlens.app"
Write-Host ""

# ============================================
# PRE-FLIGHT CHECKS
# ============================================
Write-Host "📋 Pre-flight checks..." -ForegroundColor Yellow

# Check Vercel CLI
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Install with: npm i -g vercel" -ForegroundColor Red
    exit 1
}

# Check Node version
$nodeVersion = (node -v) -replace 'v', ''
$nodeMajor = [int]($nodeVersion.Split('.')[0])
if ($nodeMajor -lt 18) {
    Write-Host "❌ Node.js 18+ required. Current: v$nodeVersion" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js: v$nodeVersion" -ForegroundColor Green

# Check package.json
if (-not (Test-Path "package.json")) {
    Write-Host "❌ package.json not found. Run from patternlens-web directory." -ForegroundColor Red
    exit 1
}
Write-Host "✅ package.json found" -ForegroundColor Green
Write-Host ""

# ============================================
# BUILD
# ============================================
Write-Host "🔨 Building for production..." -ForegroundColor Yellow

$env:NODE_ENV = "production"
$buildOutput = npm run build 2>&1 | Tee-Object -FilePath $LogFile -Append

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Check $LogFile" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# ============================================
# DEPLOYMENT
# ============================================
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow

$env:NODE_ENV = "production"
$env:NEXT_TELEMETRY_DISABLED = "1"

$deployArgs = @(
    "deploy",
    "--prod",
    "--yes",
    "--force",
    "--archive=tgz",
    "--env", "NEXT_PUBLIC_VERSION=4.0.0",
    "--env", "NEXT_PUBLIC_ENVIRONMENT=production",
    "--meta", "deployment-strategy=conservative-with-aggressive-timeline",
    "--meta", "architecture-compliance=manifest-validated"
)

$deployOutput = & vercel @deployArgs 2>&1 | Tee-Object -FilePath $LogFile -Append

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed. Check $LogFile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🌐 Production URL: https://patternlens.app" -ForegroundColor Cyan
Write-Host "📄 Log file: $LogFile"
Write-Host ""

# ============================================
# POST-DEPLOYMENT VERIFICATION
# ============================================
Write-Host "🔍 Post-deployment verification..." -ForegroundColor Yellow

try {
    $healthCheck = Invoke-WebRequest -Uri "https://patternlens.app/api/health" -UseBasicParsing -TimeoutSec 10
    if ($healthCheck.StatusCode -eq 200) {
        Write-Host "✅ Health check passed (HTTP $($healthCheck.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Health check returned HTTP $($healthCheck.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Health check failed: $_" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
