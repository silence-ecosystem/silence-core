# ============================================================
# FILE 2: run-tests.ps1
# PatternLens Test Runner
# ============================================================

param(
    [switch]$Coverage = $false,
    [switch]$Watch = $false
)

Write-Host "`n🧪 PATTERNLENS TEST SUITE" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$startTime = Get-Date

# 1. TypeScript Validation
Write-Host "`n📝 TypeScript Check..." -ForegroundColor Yellow
npm run typecheck
$tsResult = $LASTEXITCODE

if ($tsResult -eq 0) {
    Write-Host "   ✅ TypeScript: PASS" -ForegroundColor Green
} else {
    Write-Host "   ❌ TypeScript: FAIL" -ForegroundColor Red
}

# 2. ESLint
Write-Host "`n🔎 ESLint Check..." -ForegroundColor Yellow
npm run lint
$lintResult = $LASTEXITCODE

if ($lintResult -eq 0) {
    Write-Host "   ✅ ESLint: PASS" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  ESLint: WARNINGS" -ForegroundColor Yellow
}

# 3. Language Validator (custom)
Write-Host "`n🌐 Language Validation..." -ForegroundColor Yellow
$validatorPath = "$PSScriptRoot\..\validate-strings.js"
if (Test-Path $validatorPath) {
    node $validatorPath ./src
    $langResult = $LASTEXITCODE
    if ($langResult -eq 0) {
        Write-Host "   ✅ Language: PASS" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Language: FORBIDDEN TERMS FOUND" -ForegroundColor Red
    }
} else {
    Write-Host "   ⚠️  Language validator not found" -ForegroundColor Yellow
    $langResult = 0
}

# 4. Unit Tests (if configured)
Write-Host "`n🧪 Unit Tests..." -ForegroundColor Yellow
$jestConfig = Test-Path "jest.config.js" -or Test-Path "jest.config.ts"
if ($jestConfig) {
    if ($Coverage) {
        npm test -- --coverage
    } elseif ($Watch) {
        npm test -- --watch
    } else {
        npm test
    }
    $testResult = $LASTEXITCODE
} else {
    Write-Host "   ⚠️  No test configuration found" -ForegroundColor Yellow
    $testResult = 0
}

# 5. Build Test
Write-Host "`n🔨 Build Test..." -ForegroundColor Yellow
npm run build
$buildResult = $LASTEXITCODE

if ($buildResult -eq 0) {
    Write-Host "   ✅ Build: PASS" -ForegroundColor Green
} else {
    Write-Host "   ❌ Build: FAIL" -ForegroundColor Red
}

# Summary
$endTime = Get-Date
$duration = ($endTime - $startTime).TotalSeconds

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$results = @{
    "TypeScript" = $tsResult
    "ESLint" = $lintResult
    "Language" = $langResult
    "Build" = $buildResult
}

$failCount = 0
foreach ($test in $results.GetEnumerator()) {
    $status = if ($test.Value -eq 0) { "✅ PASS" } else { "❌ FAIL"; $failCount++ }
    Write-Host "   $($test.Key): $status" -ForegroundColor $(if ($test.Value -eq 0) { "Green" } else { "Red" })
}

Write-Host "`n⏱️  Duration: $([math]::Round($duration, 2))s" -ForegroundColor Cyan

if ($failCount -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n❌ $failCount TEST(S) FAILED" -ForegroundColor Red
    exit 1
}
