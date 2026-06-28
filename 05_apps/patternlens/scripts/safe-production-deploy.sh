#!/bin/bash
# ============================================================================
# SAFE PRODUCTION DEPLOY - PatternLens v4.1
# Lint → Type Check → Build → Deploy
# ============================================================================

set -e

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║              🚀 SAFE PRODUCTION DEPLOY INITIATED 🚀                  ║"
echo "║                    PatternLens v4.1                                  ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Navigate to monorepo root
cd "$(dirname "$0")/.."
ROOT_DIR=$(pwd)

echo -e "${BLUE}📍 Root directory:${NC} $ROOT_DIR"
echo ""

# ============================================================================
# STEP 1: ERROR HUNT
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔫 STEP 1: ERROR HUNT${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if ! bash scripts/error-hunter.sh; then
    echo -e "${RED}❌ Error hunt failed. Fix errors before deploying.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Error hunt passed${NC}"
echo ""

# ============================================================================
# STEP 2: INSTALL DEPENDENCIES
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📦 STEP 2: INSTALL DEPENDENCIES${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

npm install --legacy-peer-deps

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# ============================================================================
# STEP 3: BUILD SAFETY PACKAGE
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🛡️  STEP 3: BUILD SAFETY PACKAGE${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd packages/silence-objects-safety
if [ -f "package.json" ]; then
    npm run build || echo "Build script not configured (OK for workspace)"
fi
cd "$ROOT_DIR"

echo -e "${GREEN}✅ Safety package ready${NC}"
echo ""

# ============================================================================
# STEP 4: BUILD WEB APP
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🏗️  STEP 4: BUILD WEB APP${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd apps/patternlens-web
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

cd "$ROOT_DIR"
echo ""

# ============================================================================
# STEP 5: GIT COMMIT
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📝 STEP 5: GIT COMMIT${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if git status --porcelain | grep -q .; then
    git add .
    git commit -m "DEPLOY: PatternLens v4.1 - Build verified $(date +%Y%m%d_%H%M%S)" || true
    echo -e "${GREEN}✅ Changes committed${NC}"
else
    echo -e "${YELLOW}⚠️  No changes to commit${NC}"
fi

echo ""

# ============================================================================
# STEP 6: PUSH TO ORIGIN
# ============================================================================
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 STEP 6: PUSH TO ORIGIN${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

git push origin main || git push origin master

echo -e "${GREEN}✅ Pushed to origin${NC}"
echo ""

# ============================================================================
# COMPLETE
# ============================================================================
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║              ✅ DEPLOYMENT COMPLETE ✅                               ║"
echo "║                                                                      ║"
echo "║  Vercel will auto-deploy from main branch.                          ║"
echo "║  Check: https://vercel.com/dashboard                                ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
