# ============================================================
# FILE 4: db-backup.ps1
# PatternLens Database Backup (Supabase)
# ============================================================

param(
    [string]$OutputDir = ".\backups",
    [switch]$IncludeSchema = $true
)

Write-Host "`n💾 PATTERNLENS DATABASE BACKUP" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupName = "patternlens_backup_$timestamp"

# Create backup directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Load environment
$envFile = ".env.local"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$supabaseKey = $env:SUPABASE_SERVICE_ROLE_KEY

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "❌ Missing Supabase credentials in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "`n📊 Supabase Project: $supabaseUrl" -ForegroundColor Cyan

# Method 1: Use Supabase CLI (if available)
$supabaseCli = Get-Command supabase -ErrorAction SilentlyContinue

if ($supabaseCli) {
    Write-Host "`n🔧 Using Supabase CLI..." -ForegroundColor Yellow
    
    # Export data
    Write-Host "   Exporting data..." -ForegroundColor Cyan
    supabase db dump -f "$OutputDir\$backupName.sql" --data-only
    
    if ($IncludeSchema) {
        Write-Host "   Exporting schema..." -ForegroundColor Cyan
        supabase db dump -f "$OutputDir\${backupName}_schema.sql" --schema-only
    }
    
    Write-Host "   ✅ Backup complete: $OutputDir\$backupName.sql" -ForegroundColor Green
    
} else {
    # Method 2: API-based backup (limited)
    Write-Host "`n🔧 Using REST API backup (limited)..." -ForegroundColor Yellow
    Write-Host "   ⚠️  For full backup, install Supabase CLI: npm i -g supabase" -ForegroundColor Yellow
    
    $tables = @("profiles", "reports", "interpretations", "consent_logs")
    $backupData = @{}
    
    foreach ($table in $tables) {
        Write-Host "   Backing up: $table..." -ForegroundColor Cyan
        
        try {
            $response = Invoke-RestMethod `
                -Uri "$supabaseUrl/rest/v1/$table?select=*" `
                -Headers @{
                    "apikey" = $supabaseKey
                    "Authorization" = "Bearer $supabaseKey"
                } `
                -Method Get
            
            $backupData[$table] = $response
            $count = if ($response) { $response.Count } else { 0 }
            Write-Host "      → $count rows" -ForegroundColor Gray
        } catch {
            Write-Host "      ❌ Failed: $_" -ForegroundColor Red
        }
    }
    
    # Save as JSON
    $jsonPath = "$OutputDir\$backupName.json"
    $backupData | ConvertTo-Json -Depth 10 | Out-File $jsonPath -Encoding UTF8
    
    Write-Host "`n   ✅ JSON backup saved: $jsonPath" -ForegroundColor Green
}

# Cleanup old backups (keep last 10)
Write-Host "`n🧹 Cleanup old backups..." -ForegroundColor Yellow
$oldBackups = Get-ChildItem $OutputDir -Filter "patternlens_backup_*" | 
    Sort-Object LastWriteTime -Descending | 
    Select-Object -Skip 10

if ($oldBackups) {
    $oldBackups | ForEach-Object {
        Remove-Item $_.FullName -Force
        Write-Host "   Removed: $($_.Name)" -ForegroundColor Gray
    }
    Write-Host "   Cleaned $($oldBackups.Count) old backup(s)" -ForegroundColor Green
} else {
    Write-Host "   No cleanup needed" -ForegroundColor Green
}

# Summary
Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "💾 BACKUP COMPLETE" -ForegroundColor Green
Write-Host "   Location: $OutputDir" -ForegroundColor Cyan
Write-Host "   Timestamp: $timestamp" -ForegroundColor Cyan

exit 0
