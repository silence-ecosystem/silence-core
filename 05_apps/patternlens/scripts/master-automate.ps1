# ============================================================
# FILE 7: master-automate.ps1
# SILENCE.OBJECTS Master Automation — One script to rule them all
# ============================================================

param(
    [ValidateSet("Deploy", "Test", "Backup", "Status", "Security", "Dashboard", "All", "Quick")]
    [string]$Action = "Status",
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"
$scriptRoot = $PSScriptRoot

Write-Host @"

╔═══════════════════════════════════════════════════════════════╗
║          🤖 SILENCE.OBJECTS MASTER AUTOMATION                  ║
║                    PatternLens CI/CD                           ║
╚═══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

Write-Host "Action: $Action" -ForegroundColor Yellow
Write-Host "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$startTime = Get-Date

switch ($Action) {
    "Quick" {
        # Quick check — status only, no deployment
        Write-Host "`n⚡ QUICK STATUS CHECK" -ForegroundColor Magenta
        & "$scriptRoot\status-check.ps1"
    }
    
    "Test" {
        Write-Host "`n🧪 RUNNING TESTS" -ForegroundColor Magenta
        & "$scriptRoot\run-tests.ps1"
    }
    
    "Security" {
        Write-Host "`n🔒 SECURITY SCAN" -ForegroundColor Magenta
        & "$scriptRoot\security-scan.ps1"
    }
    
    "Backup" {
        Write-Host "`n💾 DATABASE BACKUP" -ForegroundColor Magenta
        & "$scriptRoot\db-backup.ps1"
    }
    
    "Status" {
        Write-Host "`n🔍 FULL STATUS CHECK" -ForegroundColor Magenta
        & "$scriptRoot\status-check.ps1"
        & "$scriptRoot\security-scan.ps1"
    }
    
    "Dashboard" {
        Write-Host "`n📊 GENERATING DASHBOARD" -ForegroundColor Magenta
        & "$scriptRoot\generate-dashboard.ps1"
    }
    
    "Deploy" {
        Write-Host "`n🚀 DEPLOYMENT PIPELINE" -ForegroundColor Magenta
        
        if (-not $Force) {
            # Pre-flight checks
            Write-Host "`nRunning pre-flight checks..." -ForegroundColor Yellow
            & "$scriptRoot\run-tests.ps1"
            
            if ($LASTEXITCODE -ne 0) {
                Write-Host "`n❌ Pre-flight failed. Use -Force to skip." -ForegroundColor Red
                exit 1
            }
        }
        
        # Deploy
        & "$scriptRoot\deploy.ps1"
        
        # Notify
        & "$scriptRoot\notify-deploy.ps1" -Status "success" -Version "1.0.0"
    }
    
    "All" {
        Write-Host "`n🔄 FULL AUTOMATION SUITE" -ForegroundColor Magenta
        Write-Host "This will run: Security → Tests → Backup → Deploy → Dashboard`n" -ForegroundColor Gray
        
        $steps = @(
            @{ Name = "Security Scan"; Script = "security-scan.ps1" },
            @{ Name = "Run Tests"; Script = "run-tests.ps1" },
            @{ Name = "Database Backup"; Script = "db-backup.ps1" },
            @{ Name = "Deploy"; Script = "deploy.ps1" },
            @{ Name = "Notify"; Script = "notify-deploy.ps1"; Args = @("-Status", "success") },
            @{ Name = "Status Check"; Script = "status-check.ps1" },
            @{ Name = "Dashboard"; Script = "generate-dashboard.ps1" }
        )
        
        $completed = 0
        $failed = 0
        
        foreach ($step in $steps) {
            Write-Host "`n━━━ $($step.Name) ━━━" -ForegroundColor Yellow
            
            try {
                if ($step.Args) {
                    & "$scriptRoot\$($step.Script)" @($step.Args)
                } else {
                    & "$scriptRoot\$($step.Script)"
                }
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ $($step.Name) complete" -ForegroundColor Green
                    $completed++
                } else {
                    Write-Host "⚠️  $($step.Name) completed with warnings" -ForegroundColor Yellow
                    $completed++
                }
            } catch {
                Write-Host "❌ $($step.Name) failed: $_" -ForegroundColor Red
                $failed++
                
                if (-not $Force) {
                    Write-Host "Stopping pipeline. Use -Force to continue on errors." -ForegroundColor Red
                    break
                }
            }
        }
        
        Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
        Write-Host "📊 PIPELINE SUMMARY" -ForegroundColor Cyan
        Write-Host "   Completed: $completed / $($steps.Count)" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })
        Write-Host "   Failed: $failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
    }
}

# Timing
$endTime = Get-Date
$duration = ($endTime - $startTime).TotalSeconds

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "⏱️  Total time: $([math]::Round($duration, 2)) seconds" -ForegroundColor Cyan
Write-Host "🎉 Automation complete!" -ForegroundColor Green


# ============================================================
# FILE 8: deploy.ps1
# PatternLens Smart Deployment Script
# ============================================================
<#
.SYNOPSIS
    Smart deployment with auto-commit and Vercel trigger
.PARAMETER commitMessage
    Git commit message (default: "deploy: production update")
.PARAMETER skipTests
    Skip pre-flight tests
.PARAMETER dryRun
    Show what would happen without executing
#>

# --- Separate file: deploy.ps1 ---
