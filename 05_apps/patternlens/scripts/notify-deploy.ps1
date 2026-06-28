# ============================================================
# FILE 5: notify-deploy.ps1
# PatternLens Deployment Notifications
# ============================================================

param(
    [ValidateSet("success", "failure", "rollback")]
    [string]$Status = "success",
    [string]$Version = "1.0.0",
    [string]$Message = "",
    [string]$SlackWebhook = $env:SLACK_WEBHOOK_URL,
    [string]$DiscordWebhook = $env:DISCORD_WEBHOOK_URL
)

Write-Host "`n📢 PATTERNLENS DEPLOYMENT NOTIFICATION" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss UTC"
$commitHash = git rev-parse --short HEAD 2>$null
$branch = git branch --show-current 2>$null

# Build notification payload
$emoji = switch ($Status) {
    "success" { "✅" }
    "failure" { "❌" }
    "rollback" { "⏪" }
}

$color = switch ($Status) {
    "success" { "#22c55e" }  # green
    "failure" { "#ef4444" }  # red
    "rollback" { "#f59e0b" } # yellow
}

$title = switch ($Status) {
    "success" { "Deployment Successful" }
    "failure" { "Deployment Failed" }
    "rollback" { "Deployment Rolled Back" }
}

# Notification content
$content = @"
$emoji **PatternLens $title**

**Version:** $Version
**Branch:** $branch
**Commit:** $commitHash
**Time:** $timestamp
$(if ($Message) { "`n**Message:** $Message" })

**Links:**
• [Production](https://patternlens.app)
• [Vercel Dashboard](https://vercel.com/dashboard)
"@

Write-Host "`n📋 Notification:" -ForegroundColor Yellow
Write-Host $content -ForegroundColor Gray

# Send to Slack
if ($SlackWebhook) {
    Write-Host "`n📤 Sending to Slack..." -ForegroundColor Yellow
    
    $slackPayload = @{
        attachments = @(
            @{
                color = $color
                title = "$emoji PatternLens $title"
                fields = @(
                    @{ title = "Version"; value = $Version; short = $true }
                    @{ title = "Branch"; value = $branch; short = $true }
                    @{ title = "Commit"; value = $commitHash; short = $true }
                    @{ title = "Time"; value = $timestamp; short = $true }
                )
                footer = "PatternLens CI/CD"
            }
        )
    } | ConvertTo-Json -Depth 10
    
    try {
        Invoke-RestMethod -Uri $SlackWebhook -Method Post -Body $slackPayload -ContentType "application/json"
        Write-Host "   ✅ Slack notification sent" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Slack failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "`n⚠️  No SLACK_WEBHOOK_URL configured" -ForegroundColor Yellow
}

# Send to Discord
if ($DiscordWebhook) {
    Write-Host "`n📤 Sending to Discord..." -ForegroundColor Yellow
    
    $discordPayload = @{
        embeds = @(
            @{
                title = "$emoji PatternLens $title"
                color = [Convert]::ToInt32($color.TrimStart('#'), 16)
                fields = @(
                    @{ name = "Version"; value = $Version; inline = $true }
                    @{ name = "Branch"; value = $branch; inline = $true }
                    @{ name = "Commit"; value = $commitHash; inline = $true }
                )
                timestamp = (Get-Date).ToUniversalTime().ToString("o")
                footer = @{ text = "PatternLens CI/CD" }
            }
        )
    } | ConvertTo-Json -Depth 10
    
    try {
        Invoke-RestMethod -Uri $DiscordWebhook -Method Post -Body $discordPayload -ContentType "application/json"
        Write-Host "   ✅ Discord notification sent" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Discord failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "`n⚠️  No DISCORD_WEBHOOK_URL configured" -ForegroundColor Yellow
}

# Log to file
$logDir = ".\logs"
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

$logEntry = @{
    timestamp = $timestamp
    status = $Status
    version = $Version
    branch = $branch
    commit = $commitHash
    message = $Message
} | ConvertTo-Json

$logFile = "$logDir\deployments.log"
Add-Content -Path $logFile -Value $logEntry

Write-Host "`n📝 Logged to: $logFile" -ForegroundColor Cyan
Write-Host "`n✅ Notification complete" -ForegroundColor Green

exit 0
