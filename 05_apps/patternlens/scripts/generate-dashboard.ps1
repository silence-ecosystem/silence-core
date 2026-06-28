# ============================================================
# FILE 6: generate-dashboard.ps1
# PatternLens Status Dashboard Generator
# ============================================================

param(
    [string]$OutputPath = ".\status-dashboard.html"
)

Write-Host "`n📊 PATTERNLENS DASHBOARD GENERATOR" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Collect metrics
Write-Host "`n📈 Collecting metrics..." -ForegroundColor Yellow

# Git info
$gitBranch = git branch --show-current 2>$null
$gitCommit = git rev-parse --short HEAD 2>$null
$gitCommitMessage = git log -1 --pretty=%B 2>$null
$uncommittedChanges = (git status --porcelain | Measure-Object -Line).Lines

# Package info
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$appVersion = $packageJson.version
$dependencies = ($packageJson.dependencies.PSObject.Properties | Measure-Object).Count
$devDependencies = ($packageJson.devDependencies.PSObject.Properties | Measure-Object).Count

# Build info
$buildExists = Test-Path ".next"
$buildSize = if ($buildExists) { 
    "{0:N2} MB" -f ((Get-ChildItem .next -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB)
} else { "N/A" }

# Route count
$routeCount = (Get-ChildItem -Recurse -Path "src/app" -Filter "page.tsx" -ErrorAction SilentlyContinue | Measure-Object).Count

# Component count
$componentCount = (Get-ChildItem -Recurse -Path "src/components" -Filter "*.tsx" -ErrorAction SilentlyContinue | Measure-Object).Count

# Check statuses
$typeCheckStatus = npm run typecheck 2>&1
$tsOk = $LASTEXITCODE -eq 0

$lintOutput = npm run lint 2>&1
$lintOk = $LASTEXITCODE -eq 0

# Generate HTML
Write-Host "`n🎨 Generating dashboard..." -ForegroundColor Yellow

$html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PatternLens Status Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0d0d1a;
            color: #fafafa;
            padding: 40px;
            min-height: 100vh;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { font-size: 2rem; margin-bottom: 8px; }
        .subtitle { color: #71717a; margin-bottom: 32px; }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 32px;
        }
        .card {
            background: #18181b;
            border: 1px solid #27272a;
            border-radius: 12px;
            padding: 20px;
        }
        .card-title {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #71717a;
            margin-bottom: 8px;
        }
        .card-value {
            font-size: 2rem;
            font-weight: 700;
        }
        .card-meta { color: #a1a1aa; font-size: 0.875rem; margin-top: 4px; }
        .status-ok { color: #22c55e; }
        .status-warn { color: #f59e0b; }
        .status-error { color: #ef4444; }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        .badge-green { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .badge-yellow { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .badge-red { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .section-title {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid #27272a;
        }
        .checklist { list-style: none; }
        .checklist li {
            padding: 8px 0;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .check { font-size: 1.25rem; }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #27272a;
            color: #71717a;
            font-size: 0.875rem;
            text-align: center;
        }
        .refresh-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
        }
        .refresh-btn:hover { background: #2563eb; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔬 PatternLens Status</h1>
        <p class="subtitle">Generated: $timestamp</p>

        <!-- Overview Cards -->
        <div class="grid">
            <div class="card">
                <div class="card-title">Version</div>
                <div class="card-value">$appVersion</div>
                <div class="card-meta">$gitBranch @ $gitCommit</div>
            </div>
            <div class="card">
                <div class="card-title">Build Size</div>
                <div class="card-value">$buildSize</div>
                <div class="card-meta">$routeCount routes, $componentCount components</div>
            </div>
            <div class="card">
                <div class="card-title">Dependencies</div>
                <div class="card-value">$dependencies</div>
                <div class="card-meta">+ $devDependencies dev</div>
            </div>
            <div class="card">
                <div class="card-title">Uncommitted</div>
                <div class="card-value $(if ($uncommittedChanges -eq 0) { 'status-ok' } else { 'status-warn' })">$uncommittedChanges</div>
                <div class="card-meta">changes</div>
            </div>
        </div>

        <!-- Health Checks -->
        <div class="card" style="margin-bottom: 32px;">
            <div class="section-title">Health Checks</div>
            <ul class="checklist">
                <li>
                    <span class="check">$(if ($tsOk) { '✅' } else { '❌' })</span>
                    <span>TypeScript</span>
                    <span class="badge $(if ($tsOk) { 'badge-green' } else { 'badge-red' })">$(if ($tsOk) { 'PASS' } else { 'FAIL' })</span>
                </li>
                <li>
                    <span class="check">$(if ($lintOk) { '✅' } else { '⚠️' })</span>
                    <span>ESLint</span>
                    <span class="badge $(if ($lintOk) { 'badge-green' } else { 'badge-yellow' })">$(if ($lintOk) { 'PASS' } else { 'WARN' })</span>
                </li>
                <li>
                    <span class="check">$(if ($buildExists) { '✅' } else { '❌' })</span>
                    <span>Production Build</span>
                    <span class="badge $(if ($buildExists) { 'badge-green' } else { 'badge-red' })">$(if ($buildExists) { 'READY' } else { 'MISSING' })</span>
                </li>
            </ul>
        </div>

        <!-- Last Commit -->
        <div class="card">
            <div class="section-title">Last Commit</div>
            <p style="color: #a1a1aa;">$gitCommitMessage</p>
        </div>

        <div class="footer">
            PatternLens — powered by SILENCE.OBJECTS framework<br>
            Construction tool for structural interpretations
        </div>
    </div>

    <button class="refresh-btn" onclick="location.reload()">🔄 Refresh</button>
</body>
</html>
"@

# Write HTML file
$html | Out-File $OutputPath -Encoding UTF8

Write-Host "`n✅ Dashboard generated: $OutputPath" -ForegroundColor Green

# Optionally open in browser
$openBrowser = Read-Host "Open in browser? (y/n)"
if ($openBrowser -eq "y") {
    Start-Process $OutputPath
}

exit 0
