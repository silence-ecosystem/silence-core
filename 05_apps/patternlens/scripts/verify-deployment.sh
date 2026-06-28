#!/bin/bash
# ============================================
# POST-DEPLOYMENT VERIFICATION
# PatternLens v4.0 | patternlens.app
# ============================================

set -euo pipefail

DOMAIN="${1:-patternlens.app}"
BASE_URL="https://${DOMAIN}"

echo "🔍 Post-Deployment Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Target: ${BASE_URL}"
echo ""

PASSED=0
FAILED=0

check() {
    local name="$1"
    local result="$2"
    local expected="$3"
    
    if [[ "$result" == "$expected" ]]; then
        echo "✅ ${name}: PASS"
        ((PASSED++))
    else
        echo "❌ ${name}: FAIL (got: ${result}, expected: ${expected})"
        ((FAILED++))
    fi
}

# ============================================
# 1. HEALTH CHECK
# ============================================
echo ""
echo "📋 Health Check"
echo "─────────────────"

HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/health" 2>/dev/null || echo "000")
check "Health endpoint responds" "$HEALTH_STATUS" "200"

if [[ "$HEALTH_STATUS" == "200" ]]; then
    HEALTH_BODY=$(curl -s "${BASE_URL}/api/health" 2>/dev/null)
    DB_CHECK=$(echo "$HEALTH_BODY" | grep -o '"database":"ok"' || echo "")
    check "Database connection" "${DB_CHECK:-none}" '"database":"ok"'
fi

# ============================================
# 2. STATIC ASSETS
# ============================================
echo ""
echo "📦 Static Assets"
echo "─────────────────"

HOMEPAGE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}" 2>/dev/null || echo "000")
check "Homepage loads" "$HOMEPAGE" "200"

# ============================================
# 3. API ENDPOINTS
# ============================================
echo ""
echo "🔌 API Endpoints"
echo "─────────────────"

# Unauth request should return 401
OBJECTS_UNAUTH=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/objects" 2>/dev/null || echo "000")
check "Objects endpoint (unauth = 401)" "$OBJECTS_UNAUTH" "401"

# ============================================
# 4. SECURITY HEADERS
# ============================================
echo ""
echo "🔒 Security Headers"
echo "─────────────────"

HEADERS=$(curl -sI "${BASE_URL}" 2>/dev/null)

HSTS=$(echo "$HEADERS" | grep -i "strict-transport-security" || echo "")
if [[ -n "$HSTS" ]]; then
    check "HSTS header present" "yes" "yes"
else
    check "HSTS header present" "no" "yes"
fi

XFO=$(echo "$HEADERS" | grep -i "x-frame-options" || echo "")
if [[ -n "$XFO" ]]; then
    check "X-Frame-Options header" "yes" "yes"
else
    check "X-Frame-Options header" "no" "yes"
fi

# ============================================
# 5. PERFORMANCE
# ============================================
echo ""
echo "⚡ Performance"
echo "─────────────────"

TTFB=$(curl -s -o /dev/null -w "%{time_starttransfer}" "${BASE_URL}" 2>/dev/null || echo "9999")
TTFB_MS=$(echo "$TTFB * 1000" | bc | cut -d'.' -f1)

if [[ "$TTFB_MS" -lt 1000 ]]; then
    check "TTFB < 1000ms" "${TTFB_MS}ms" "<1000ms"
else
    check "TTFB < 1000ms" "${TTFB_MS}ms" "<1000ms"
fi

# ============================================
# SUMMARY
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "─────────────────"
echo "Passed: ${PASSED}"
echo "Failed: ${FAILED}"
echo ""

if [[ $FAILED -eq 0 ]]; then
    echo "🎉 All checks passed!"
    exit 0
else
    echo "⚠️  Some checks failed. Review above."
    exit 1
fi
