# ============================================================
# FILE 8: deploy.ps1
# PatternLens Smart Deployment Script
# ============================================================

param(
    [string]$commitMessage = "",
    [switch]$skipTests = $false,
    [switch]$dryRun = $false
)

Write-Host @"

╔═══════════════════════════════════════════════════════════════╗
║              🚀 PATTERNLENS DEPLOYMENT                         ║
╚═══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

if ($dryRun) {
    Write-Host "🔍 DRY RUN MODE — No changes will be made" -ForegroundColor Yellow
}

# Step 1: PRE-FLIGHT CHECKS
if (-not $skipTests) {
    Write-Host "`n✈️  PRE-FLIGHT CHECKS" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
    
    # TypeScript
    Write-Host "   TypeScript check..." -ForegroundColor Cyan
    npm run typecheck 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ TypeScript errors found" -ForegroundColor Red
        Write-Host "   Run 'npm run typecheck' to see details" -ForegroundColor Gray
        exit 1
    }
    Write-Host "   ✅ TypeScript OK" -ForegroundColor Green
    
    # ESLint
    Write-Host "   ESLint check..." -ForegroundColor Cyan
    npm run lint 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ⚠️  ESLint warnings (continuing...)" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ ESLint OK" -ForegroundColor Green
    }
}

# Step 2: GIT STATUS
Write-Host "`n📝 GIT STATUS" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$branch = git branch --show-current
$gitStatus = git status --porcelain

Write-Host "   Branch: $branch" -ForegroundColor Cyan

if ($gitStatus) {
    $changeCount = ($gitStatus | Measure-Object -Line).Lines
    Write-Host "   Changes: $changeCount file(s)" -ForegroundColor Yellow
    git status --short | ForEach-Object { Write-Host "      $_" -ForegroundColor Gray }
} else {
    Write-Host "   ✅ Working tree clean" -ForegroundColor Green
}

# Step 3: BUILD PRODUCTION
Write-Host "`n🔨 PRODUCTION BUILD" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($dryRun) {
    Write-Host "   [DRY RUN] Would run: npm run build" -ForegroundColor Gray
} else {
    # Clean previous build
    if (Test-Path ".next") {
        Remove-Item -Recurse -Force .next
        Write-Host "   Cleaned .next directory" -ForegroundColor Gray
    }
    
    # Build
    $buildStart = Get-Date
    npm run build
    $buildDuration = ((Get-Date) - $buildStart).TotalSeconds
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n   ❌ Production build failed" -ForegroundColor Red
        exit 1
    }
    
    # Build stats
    $buildSize = "{0:N2} MB" -f ((Get-ChildItem .next -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB)
    Write-Host "   ✅ Build complete in $([math]::Round($buildDuration, 1))s ($buildSize)" -ForegroundColor Green
}

# Step 4: GIT OPERATIONS
Write-Host "`n📤 GIT COMMIT & PUSH" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if (-not $gitStatus) {
    Write-Host "   No changes to commit" -ForegroundColor Gray
} else {
    # Generate commit message if not provided
    if (-not $commitMessage) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
        $commitMessage = "deploy: production update [$timestamp]"
    }
    
    if ($dryRun) {
        Write-Host "   [DRY RUN] Would commit: $commitMessage" -ForegroundColor Gray
        Write-Host "   [DRY RUN] Would push to origin/$branch" -ForegroundColor Gray
    } else {
        # Stage all
        git add .
        Write-Host "   ✅ Staged all changes" -ForegroundColor Green
        
        # Commit
        git commit -m "$commitMessage"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Committed: $commitMessage" -ForegroundColor Green
        }
        
        # Push
        git push origin $branch
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Pushed to origin/$branch" -ForegroundColor Green
        } else {
            Write-Host "   ❌ Push failed" -ForegroundColor Red
            exit 1
        }
    }
}

# Step 5: VERCEL DEPLOYMENT
Write-Host "`n🌐 VERCEL DEPLOYMENT" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if ($dryRun) {
    Write-Host "   [DRY RUN] Vercel would auto-deploy from push" -ForegroundColor Gray
} else {
    Write-Host "   Vercel auto-deploy triggered..." -ForegroundColor Cyan
    Write-Host "   Monitor at: https://vercel.com/dashboard" -ForegroundColor Gray
    
    # Wait for deployment to start
    Start-Sleep -Seconds 3
    
    Write-Host "   ✅ Deployment initiated" -ForegroundColor Green
}

# Step 6: POST-DEPLOYMENT
Write-Host "`n📋 POST-DEPLOYMENT CHECKLIST" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$checklist = @(
    "Monitor Vercel dashboard for build status",
    "Verify: https://patternlens.app",
    "Test: /login, /signup, /dashboard",
    "Check: /emergency (crisis resources visible)",
    "Verify: Stripe webhook (if payments changed)"
)

$checklist | ForEach-Object { Write-Host "   □ $_" -ForegroundColor White }

# Final summary
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
if ($dryRun) {
    Write-Host "🔍 DRY RUN COMPLETE — No changes made" -ForegroundColor Yellow
} else {
    Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
    Write-Host "   Production: https://patternlens.app" -ForegroundColor Cyan
}

exit 0
