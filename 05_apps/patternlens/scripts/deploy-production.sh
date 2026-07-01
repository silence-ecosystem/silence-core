#!/bin/bash
# ============================================
# PATTERNLENS v4.0 PRODUCTION DEPLOYMENT
# Domain: patternlens.app (NOT .com)
# ============================================

set -euo pipefail

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
LOG_FILE="deployment-${TIMESTAMP}.log"

echo "🚀 PatternLens Production Deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Timestamp: ${TIMESTAMP}"
echo "Target: patternlens.app"
echo ""

# ============================================
# PRE-FLIGHT CHECKS
# ============================================
echo "📋 Pre-flight checks..."

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install with: npm i -g vercel"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required. Current: $(node -v)"
    exit 1
fi

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Run from patternlens-web directory."
    exit 1
fi

echo "✅ Pre-flight checks passed"
echo ""

# ============================================
# BUILD VERIFICATION
# ============================================
echo "🔨 Building for production..."

npm run build 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo "❌ Build failed. Check $LOG_FILE"
    exit 1
fi

echo "✅ Build successful"
echo ""

# ============================================
# DEPLOYMENT (Vercel Standard Flags)
# ============================================
echo "🚀 Deploying to Vercel..."

NODE_ENV=production \
NEXT_TELEMETRY_DISABLED=1 \
vercel deploy --prod \
  --yes \
  --force \
  --archive=tgz \
  --env NEXT_PUBLIC_VERSION=4.0.0 \
  --env NEXT_PUBLIC_ENVIRONMENT=production \
  --meta deployment-strategy="conservative-with-aggressive-timeline" \
  --meta architecture-compliance="manifest-validated" \
  2>&1 | tee -a "$LOG_FILE"

DEPLOY_STATUS=${PIPESTATUS[0]}

if [ $DEPLOY_STATUS -ne 0 ]; then
    echo "❌ Deployment failed. Check $LOG_FILE"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Production URL: https://patternlens.app"
echo "📄 Log file: $LOG_FILE"
echo ""

# ============================================
# POST-DEPLOYMENT VERIFICATION
# ============================================
echo "🔍 Post-deployment verification..."

# Health check
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "https://patternlens.app/api/health" 2>/dev/null || echo "000")

if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✅ Health check passed (HTTP $HEALTH_CHECK)"
else
    echo "⚠️  Health check returned HTTP $HEALTH_CHECK"
fi

echo ""
echo "🎉 Deployment complete!"
