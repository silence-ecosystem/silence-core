# ============================================
# INTEGRATION SCRIPT - PatternLens v4.0
# Target: C:\Users\offic\Desktop\silence-mvp
# ============================================

$ErrorActionPreference = "Stop"
$ProjectPath = "C:\Users\offic\Desktop\silence-mvp"
$PackagePath = $PSScriptRoot  # Zakłada że pakiet jest rozpakowany obok skryptu

Write-Host "🔧 INTEGRATING PATTERNLENS v4.0" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Target: $ProjectPath"
Write-Host ""

# Verify project exists
if (-not (Test-Path "$ProjectPath\package.json")) {
    Write-Host "❌ Project not found at $ProjectPath" -ForegroundColor Red
    exit 1
}

# ============================================
# 1. SCRIPTS
# ============================================
Write-Host "[1/7] 📜 Copying scripts..." -ForegroundColor Yellow

$scripts = @(
    "deploy-production.ps1",
    "deploy-production.sh",
    "verify-deployment.sh",
    "mobile-crush.ps1"
)

foreach ($script in $scripts) {
    $src = Join-Path $PackagePath "scripts\$script"
    $dst = Join-Path $ProjectPath "scripts\$script"
    if (Test-Path $src) {
        Copy-Item $src $dst -Force
        Write-Host "  ✓ $script" -ForegroundColor Green
    }
}

# ============================================
# 2. API ROUTES
# ============================================
Write-Host "[2/7] 🔌 Copying API routes..." -ForegroundColor Yellow

# Objects API
$objectsDir = Join-Path $ProjectPath "src\app\api\objects"
New-Item -ItemType Directory -Force -Path $objectsDir | Out-Null
Copy-Item (Join-Path $PackagePath "api\objects\route.ts") $objectsDir -Force
Write-Host "  ✓ src/app/api/objects/route.ts" -ForegroundColor Green

# Health API
$healthDir = Join-Path $ProjectPath "src\app\api\health"
New-Item -ItemType Directory -Force -Path $healthDir | Out-Null
Copy-Item (Join-Path $PackagePath "api\health\route.ts") $healthDir -Force
Write-Host "  ✓ src/app/api/health/route.ts" -ForegroundColor Green

# ============================================
# 3. SUPABASE SCHEMA
# ============================================
Write-Host "[3/7] 🗄️ Copying Supabase schema..." -ForegroundColor Yellow

$migrationsDir = Join-Path $ProjectPath "supabase\migrations"
New-Item -ItemType Directory -Force -Path $migrationsDir | Out-Null
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$schemaFile = "${timestamp}_production_schema.sql"
Copy-Item (Join-Path $PackagePath "schema\production-schema.sql") (Join-Path $migrationsDir $schemaFile) -Force
Write-Host "  ✓ supabase/migrations/$schemaFile" -ForegroundColor Green

# ============================================
# 4. DOCS
# ============================================
Write-Host "[4/7] 📚 Copying docs..." -ForegroundColor Yellow

$docsDir = Join-Path $ProjectPath "docs"
Copy-Item (Join-Path $PackagePath "docs\COMMANDS.md") $docsDir -Force
Copy-Item (Join-Path $PackagePath "docs\DASHBOARD_REQUIREMENTS.md") $docsDir -Force
Write-Host "  ✓ docs/COMMANDS.md" -ForegroundColor Green
Write-Host "  ✓ docs/DASHBOARD_REQUIREMENTS.md" -ForegroundColor Green

# ============================================
# 5. VERCEL.JSON
# ============================================
Write-Host "[5/7] 🚀 Creating vercel.json..." -ForegroundColor Yellow

$vercelJson = @'
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": ".next",
  "regions": ["fra1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
'@

$vercelJson | Out-File -FilePath (Join-Path $ProjectPath "vercel.json") -Encoding UTF8
Write-Host "  ✓ vercel.json" -ForegroundColor Green

# ============================================
# 6. OFFLINE PAGE
# ============================================
Write-Host "[6/7] 📴 Creating offline page..." -ForegroundColor Yellow

$offlineDir = Join-Path $ProjectPath "src\app\offline"
New-Item -ItemType Directory -Force -Path $offlineDir | Out-Null

$offlinePage = @'
export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-8">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">📴</div>
        <h1 className="text-2xl font-bold mb-4">Brak połączenia</h1>
        <p className="text-slate-400 mb-6">
          PatternLens wymaga połączenia z internetem do analizy.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition"
        >
          Spróbuj ponownie
        </button>
      </div>
    </div>
  );
}
'@

$offlinePage | Out-File -FilePath (Join-Path $offlineDir "page.tsx") -Encoding UTF8
Write-Host "  ✓ src/app/offline/page.tsx" -ForegroundColor Green

# ============================================
# 7. ENV CHECK
# ============================================
Write-Host "[7/7] 🔐 Checking .env.local..." -ForegroundColor Yellow

$envFile = Join-Path $ProjectPath ".env.local"
$envContent = Get-Content $envFile -Raw -ErrorAction SilentlyContinue

$requiredVars = @(
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "ANTHROPIC_API_KEY"
)

$missing = @()
foreach ($var in $requiredVars) {
    if ($envContent -notmatch $var) {
        $missing += $var
    }
}

if ($missing.Count -gt 0) {
    Write-Host "  ⚠️ Missing env vars:" -ForegroundColor Yellow
    foreach ($var in $missing) {
        Write-Host "     - $var" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ✓ All required env vars present" -ForegroundColor Green
}

# ============================================
# SUMMARY
# ============================================
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✅ INTEGRATION COMPLETE" -ForegroundColor Green
Write-Host ""
Write-Host "New/Updated files:" -ForegroundColor White
Write-Host "  scripts/deploy-production.ps1"
Write-Host "  scripts/mobile-crush.ps1"
Write-Host "  src/app/api/objects/route.ts"
Write-Host "  src/app/api/health/route.ts"
Write-Host "  src/app/offline/page.tsx"
Write-Host "  supabase/migrations/$schemaFile"
Write-Host "  docs/COMMANDS.md"
Write-Host "  docs/DASHBOARD_REQUIREMENTS.md"
Write-Host "  vercel.json"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. cd $ProjectPath"
Write-Host "  2. .\scripts\mobile-crush.ps1"
Write-Host "  3. npm run build"
Write-Host "  4. .\scripts\deploy-production.ps1"
Write-Host ""
