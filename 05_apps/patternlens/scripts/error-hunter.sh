#!/bin/bash
# ============================================================================
# ERROR HUNTER - SCORCHED EARTH ERROR DETECTION
# PatternLens v4.1 Production
# ============================================================================

set -e

echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                    🔫 ERROR HUNTER INITIATED 🔫                      ║"
echo "║                   KILL ALL ERRORS - NO MERCY                         ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERROR_COUNT=0
WARNING_COUNT=0

# Function to track errors
track_error() {
    ((ERROR_COUNT++))
    echo -e "${RED}[ERROR]${NC} $1"
}

track_warning() {
    ((WARNING_COUNT++))
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

track_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

# Navigate to monorepo root
cd "$(dirname "$0")/.."
ROOT_DIR=$(pwd)

echo "📍 Root directory: $ROOT_DIR"
echo ""

# ============================================================================
# PHASE 1: DEPENDENCY CHECK
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 PHASE 1: DEPENDENCY CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "package.json" ]; then
    track_success "Root package.json found"
else
    track_error "Root package.json MISSING"
fi

if [ -d "node_modules" ]; then
    track_success "node_modules exists"
else
    track_warning "node_modules missing - run npm install"
fi

echo ""

# ============================================================================
# PHASE 2: TYPESCRIPT CHECK
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 PHASE 2: TYPESCRIPT TYPE CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Safety package
if [ -d "packages/silence-objects-safety" ]; then
    cd packages/silence-objects-safety
    if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
        track_error "TypeScript errors in safety package"
        npx tsc --noEmit 2>&1 | grep "error TS" | head -10
    else
        track_success "Safety package: No TS errors"
    fi
    cd "$ROOT_DIR"
fi

# Web app
if [ -d "apps/patternlens-web" ]; then
    cd apps/patternlens-web
    if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
        track_error "TypeScript errors in web app"
        npx tsc --noEmit 2>&1 | grep "error TS" | head -10
    else
        track_success "Web app: No TS errors"
    fi
    cd "$ROOT_DIR"
fi

echo ""

# ============================================================================
# PHASE 3: ESLINT CHECK
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 PHASE 3: ESLINT SCAN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "apps/patternlens-web" ]; then
    cd apps/patternlens-web
    LINT_OUTPUT=$(npx next lint 2>&1 || true)
    if echo "$LINT_OUTPUT" | grep -q "error"; then
        track_error "ESLint errors detected"
        echo "$LINT_OUTPUT" | grep "error" | head -10
    else
        track_success "ESLint: Clean"
    fi
    cd "$ROOT_DIR"
fi

echo ""

# ============================================================================
# PHASE 4: BUILD TEST
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏗️  PHASE 4: BUILD TEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "apps/patternlens-web" ]; then
    cd apps/patternlens-web
    if npm run build 2>&1 | tee /tmp/build_output.txt | grep -q "error"; then
        track_error "Build failed"
        cat /tmp/build_output.txt | grep -A 3 "error" | head -20
    else
        track_success "Build: Success"
    fi
    cd "$ROOT_DIR"
fi

echo ""

# ============================================================================
# PHASE 5: CRITICAL FILE CHECK
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 PHASE 5: CRITICAL FILE CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CRITICAL_FILES=(
    "apps/patternlens-web/src/app/layout.tsx"
    "apps/patternlens-web/src/app/page.tsx"
    "apps/patternlens-web/src/app/api/interpret/route.ts"
    "apps/patternlens-web/next.config.mjs"
    "apps/patternlens-web/tailwind.config.ts"
    "packages/silence-objects-safety/src/index.ts"
    "packages/silence-objects-safety/src/crisis/crisis-keywords.ts"
    "packages/silence-objects-safety/src/crisis/CrisisModal.tsx"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        track_success "$file exists"
    else
        track_error "$file MISSING"
    fi
done

echo ""

# ============================================================================
# FINAL REPORT
# ============================================================================
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║                         📊 FINAL REPORT                              ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "Errors found:   ${RED}$ERROR_COUNT${NC}"
echo -e "Warnings found: ${YELLOW}$WARNING_COUNT${NC}"
echo ""

if [ $ERROR_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ ALL SYSTEMS GREEN - READY FOR DEPLOY${NC}"
    exit 0
else
    echo -e "${RED}❌ ERRORS DETECTED - FIX BEFORE DEPLOY${NC}"
    exit 1
fi
