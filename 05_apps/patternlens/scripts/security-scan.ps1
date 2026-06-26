# ============================================================
# FILE 3: security-scan.ps1
# PatternLens Security Scanner
# ============================================================

param(
    [switch]$Fix = $false
)

Write-Host "`n🔒 PATTERNLENS SECURITY SCAN" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$issues = @()

# 1. NPM Audit
Write-Host "`n📦 NPM Vulnerability Scan..." -ForegroundColor Yellow
$auditOutput = npm audit --json 2>$null | ConvertFrom-Json

if ($auditOutput.metadata.vulnerabilities) {
    $vulns = $auditOutput.metadata.vulnerabilities
    $critical = $vulns.critical
    $high = $vulns.high
    $moderate = $vulns.moderate
    $low = $vulns.low
    
    Write-Host "   Critical: $critical | High: $high | Moderate: $moderate | Low: $low" -ForegroundColor $(if ($critical -gt 0 -or $high -gt 0) { "Red" } else { "Yellow" })
    
    if ($critical -gt 0 -or $high -gt 0) {
        $issues += "NPM: $critical critical, $high high vulnerabilities"
        
        if ($Fix) {
            Write-Host "   Attempting auto-fix..." -ForegroundColor Magenta
            npm audit fix
        }
    }
} else {
    Write-Host "   ✅ No vulnerabilities found" -ForegroundColor Green
}

# 2. Environment Secrets Check
Write-Host "`n🔐 Secrets Exposure Check..." -ForegroundColor Yellow
$secretPatterns = @(
    "sk-ant-",           # Claude API
    "sk_live_",          # Stripe Live
    "sk_test_",          # Stripe Test
    "eyJhbGci",          # JWT tokens
    "SUPABASE_SERVICE_ROLE",
    "password\s*=\s*['""]"
)

$exposedSecrets = @()
Get-ChildItem -Recurse -Include *.ts,*.tsx,*.js,*.jsx -Exclude node_modules | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    foreach ($pattern in $secretPatterns) {
        if ($content -match $pattern) {
            # Exclude .env files and test files
            if ($_.FullName -notmatch "\.env" -and $_.FullName -notmatch "\.test\.") {
                $exposedSecrets += "$($_.FullName): possible secret exposure"
            }
        }
    }
}

if ($exposedSecrets.Count -gt 0) {
    Write-Host "   ❌ Potential secrets in code:" -ForegroundColor Red
    $exposedSecrets | ForEach-Object { Write-Host "      $_" -ForegroundColor Red }
    $issues += "Secrets: $($exposedSecrets.Count) potential exposures"
} else {
    Write-Host "   ✅ No hardcoded secrets detected" -ForegroundColor Green
}

# 3. .gitignore Check
Write-Host "`n📄 .gitignore Validation..." -ForegroundColor Yellow
$gitignore = Get-Content ".gitignore" -ErrorAction SilentlyContinue
$requiredIgnores = @(".env", ".env.local", ".env.production", "node_modules", ".next")

$missingIgnores = @()
foreach ($ignore in $requiredIgnores) {
    if ($gitignore -notcontains $ignore -and $gitignore -notmatch [regex]::Escape($ignore)) {
        $missingIgnores += $ignore
    }
}

if ($missingIgnores.Count -gt 0) {
    Write-Host "   ⚠️  Missing from .gitignore: $($missingIgnores -join ', ')" -ForegroundColor Yellow
    $issues += ".gitignore: missing $($missingIgnores.Count) entries"
} else {
    Write-Host "   ✅ .gitignore properly configured" -ForegroundColor Green
}

# 4. Dependency Check (outdated)
Write-Host "`n📊 Outdated Dependencies..." -ForegroundColor Yellow
$outdated = npm outdated --json 2>$null | ConvertFrom-Json
$outdatedCount = ($outdated.PSObject.Properties | Measure-Object).Count

if ($outdatedCount -gt 0) {
    Write-Host "   ⚠️  $outdatedCount packages outdated" -ForegroundColor Yellow
    if ($outdatedCount -le 5) {
        $outdated.PSObject.Properties | ForEach-Object {
            Write-Host "      $($_.Name): $($_.Value.current) → $($_.Value.latest)" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "   ✅ All dependencies up to date" -ForegroundColor Green
}

# 5. HTTPS Enforcement Check
Write-Host "`n🌐 HTTPS Configuration..." -ForegroundColor Yellow
$nextConfig = Get-Content "next.config.js" -Raw -ErrorAction SilentlyContinue
$vercelConfig = Get-Content "vercel.json" -Raw -ErrorAction SilentlyContinue

if ($nextConfig -match "forceSSL" -or $vercelConfig -match "https") {
    Write-Host "   ✅ HTTPS enforcement configured" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Verify HTTPS is enforced in production" -ForegroundColor Yellow
}

# 6. RLS Policy Check (reminder)
Write-Host "`n🛡️  Database Security Reminder..." -ForegroundColor Yellow
Write-Host "   → Verify RLS policies on: profiles, reports, interpretations" -ForegroundColor Cyan
Write-Host "   → Verify consent_logs is append-only" -ForegroundColor Cyan

# Summary
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🔒 SECURITY SCAN COMPLETE" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if ($issues.Count -eq 0) {
    Write-Host "✅ No critical security issues found" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  $($issues.Count) issue(s) found:" -ForegroundColor Yellow
    $issues | ForEach-Object { Write-Host "   • $_" -ForegroundColor Yellow }
    exit 1
}
