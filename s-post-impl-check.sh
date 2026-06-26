#!/usr/bin/env bash
# ============================================================
# s-post-impl-check.sh — v1.1 (format-resilient)
# SILENCE Ecosystem · POST_IMPL_CHECKLIST · HARD_SEVEN_v2026
# S11.COMMIT.ID: GOVERNANCE-POST-IMPL-CHECK-SH-20260620-002
# ============================================================
set -uo pipefail

PHI=1.618033988749895
PCS=0.997
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
PASS=0; FAIL=0

pass()    { echo -e "${GREEN}  [PASS]${NC} $1"; PASS=$((PASS+1)); }
fail()    { echo -e "${RED}  [FAIL]${NC} $1"; FAIL=$((FAIL+1)); }
warn()    { echo -e "${YELLOW}  [WARN]${NC} $1"; }
section() { echo -e "\n${BLUE}━━ $1${NC}"; }

cd "$REPO_ROOT"
echo -e "${BLUE}REPO_ROOT: $REPO_ROOT${NC}"

find_dir() {
  local n="$1"
  local alt="${n//_/}"
  if   [ -d "$REPO_ROOT/$n" ];   then echo "$REPO_ROOT/$n";   return 0
  elif [ -d "$REPO_ROOT/$alt" ]; then echo "$REPO_ROOT/$alt"; return 0
  else return 1; fi
}

# ─── BLOK 0 — STRUKTURA REPO ──────────────
section "BLOK 0 — STRUKTURA REPO"

for root in 01_governance 02_protocols 03_ee 04_packages 05_apps 06_infrastructure 07_research 08_meta; do
  dir=$(find_dir "$root" 2>/dev/null || true)
  if [ -n "$dir" ] && [ -d "$dir" ]; then pass "Root: $(basename "$dir")"
  else fail "Brak root: $root"; fi
done

[ -f "$REPO_ROOT/AGENTS.md" ] && pass "AGENTS.md obecny" || fail "Brak AGENTS.md"
[ -f "$REPO_ROOT/CLAUDE.md" ] && pass "CLAUDE.md obecny" || fail "Brak CLAUDE.md"
if [ -f "$REPO_ROOT/AGENTS.md" ] && [ -f "$REPO_ROOT/CLAUDE.md" ]; then
  diff -q "$REPO_ROOT/AGENTS.md" "$REPO_ROOT/CLAUDE.md" >/dev/null 2>&1 \
    && pass "AGENTS.md == CLAUDE.md" || warn "AGENTS.md ≠ CLAUDE.md"
fi

if [ -f "$REPO_ROOT/pnpm-workspace.yaml" ]; then
  grep -qE "03_ee|03ee" "$REPO_ROOT/pnpm-workspace.yaml" 2>/dev/null \
    && fail "pnpm-workspace.yaml zawiera 03_ee" || pass "pnpm-workspace.yaml bez 03_ee"
else fail "Brak pnpm-workspace.yaml"; fi

AH=0
for raw in 04_packages 04packages 05_apps 05apps; do
  dir=$(find_dir "$raw" 2>/dev/null || true); [ -n "$dir" ] && [ -d "$dir" ] || continue
  n=$(grep -r "07_archive\|07archive\|legacymonorepo" "$dir" --include="*.ts" --include="*.tsx" -l 2>/dev/null | wc -l || echo 0)
  AH=$((AH+n))
done
[ "$AH" -eq 0 ] && pass "07_archive — zero importów" || fail "07_archive — $AH plików"

# ─── BLOK 1 — RULE-DOM-001 ────────────────
section "BLOK 1 — RULE-DOM-001 / BOUNDARY"

[ -f "$REPO_ROOT/.dependency-cruiser.js" ] && pass ".dependency-cruiser.js obecny" || fail "Brak .dependency-cruiser.js"
pnpm boundary-check --silent 2>/dev/null && pass "boundary-check → PASS" || fail "boundary-check → FAIL/brak"

for raw in 04_packages 04packages 05_apps 05apps 05_services 05services; do
  dir=$(find_dir "$raw" 2>/dev/null || true); [ -n "$dir" ] && [ -d "$dir" ] || continue
  n=$(grep -r "from.*03.ee\|require.*03.ee" "$dir" --include="*.ts" --include="*.tsx" -l 2>/dev/null | wc -l || echo 0)
  [ "$n" -eq 0 ] && pass "$(basename "$dir") — zero importów 03_ee" || fail "$(basename "$dir") — $n importów 03_ee"
done

# ─── BLOK 2 — S11 ─────────────────────────
section "BLOK 2 — S11 VOCABULARY"

pnpm s11-check --silent 2>/dev/null && pass "s11-check → PASS" || fail "s11-check → FAIL/brak"

SH=0
for raw in 04_packages 04packages 05_apps 05apps; do
  dir=$(find_dir "$raw" 2>/dev/null || true); [ -n "$dir" ] && [ -d "$dir" ] || continue
  n=$(grep -rn "stres\|lęk\|anxiety\|wellness\|mindfulness\|diagnoz\|terapeu\|kliniczn" "$dir" \
        --include="*.ts" --include="*.tsx" --include="*.md" -l 2>/dev/null | wc -l || echo 0)
  SH=$((SH+n))
done
[ "$SH" -eq 0 ] && pass "S11 — zero terminów zakazanych" || fail "S11 — $SH plików z terminami"

# ─── BLOK 3 — MATHCORE φ ──────────────────
section "BLOK 3 — MATHCORE φ"

pnpm --filter "@silence/core" test:determinism --silent 2>/dev/null \
  && pass "test:determinism → PASS" || fail "test:determinism → FAIL/brak"

RH=0
for raw in 04_packages 04packages 05_apps 05apps; do
  dir=$(find_dir "$raw" 2>/dev/null || true); [ -n "$dir" ] && [ -d "$dir" ] || continue
  n=$(grep -rn "Math\.random()" "$dir" --include="*.ts" --include="*.tsx" -l 2>/dev/null | wc -l || echo 0)
  RH=$((RH+n))
done
[ "$RH" -eq 0 ] && pass "Math.random() — zero wystąpień" || fail "Math.random() — $RH plików"

# ─── BLOK 4 — NAZEWNICTWO ─────────────────
section "BLOK 4 — NAZEWNICTWO"

LH=0
for raw in 04_packages 04packages 05_apps 05apps; do
  dir=$(find_dir "$raw" 2>/dev/null || true); [ -n "$dir" ] && [ -d "$dir" ] || continue
  n=$(grep -rn "silence-objects\|behavioral-engine-ee\|intervention-timing-ee" "$dir" \
        --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l || echo 0)
  LH=$((LH+n))
done
[ "$LH" -eq 0 ] && pass "Legacy nazwy — brak" || fail "Legacy nazwy — $LH wystąpień"

BH=0
for raw in 04_packages 04packages; do
  dir=$(find_dir "$raw" 2>/dev/null || true); [ -n "$dir" ] && [ -d "$dir" ] || continue
  n=$(grep -rn "export \* from" "$dir" --include="*.ts" -l 2>/dev/null | wc -l || echo 0)
  BH=$((BH+n))
done
[ "$BH" -eq 0 ] && pass "Barrel files — brak" || warn "Barrel files — $BH plików"

# ─── BLOK 5 — CI GATES ────────────────────
section "BLOK 5 — CI GATE SET"

for gate in boundary-check s11-check lint type-check; do
  if pnpm run "$gate" --silent 2>/dev/null; then pass "$gate → PASS"
  elif pnpm turbo run "$gate" --silent 2>/dev/null; then pass "$gate (turbo) → PASS"
  else fail "$gate → FAIL/brak"; fi
done
pnpm test --silent 2>/dev/null && pass "pnpm test → PASS" || fail "pnpm test → FAIL"

# ─── BLOK 6 — VERCEL CONFIG ───────────────
section "BLOK 6 — VERCEL CONFIG"

VF=0
for vj in apps/patternlens/vercel.json 05_apps/patternlens/vercel.json 05apps/patternlens/vercel.json; do
  [ -f "$REPO_ROOT/$vj" ] || continue
  VF=1
  grep -q "turbo-ignore" "$REPO_ROOT/$vj" && pass "vercel.json — turbo-ignore" || fail "vercel.json — brak turbo-ignore"
  grep -q "fra1" "$REPO_ROOT/$vj" && pass "vercel.json — region fra1" || warn "vercel.json — brak fra1"
  break
done
[ "$VF" -eq 0 ] && warn "Brak vercel.json dla patternlens"

# ─── BLOK 7 — RULE OF 500 / TODO ──────────
section "BLOK 7 — RULE OF 500 / TODO"

O5=0
for raw in 04_packages 04packages 05_apps 05apps; do
  dir=$(find_dir "$raw" 2>/dev/null || true); [ -n "$dir" ] && [ -d "$dir" ] || continue
  while IFS= read -r f; do
    lines=$(wc -l < "$f" 2>/dev/null || echo 0)
    if [ "$lines" -gt 500 ]; then warn "Rule of 500: $f ($lines)"; O5=$((O5+1)); fi
  done < <(find "$dir" \( -name "*.ts" -o -name "*.tsx" \) \
    -not -path "*/node_modules/*" -not -path "*/.next/*" 2>/dev/null)
done
[ "$O5" -eq 0 ] && pass "Rule of 500 — OK" || fail "Rule of 500 — $O5 plików"

TH=0
for raw in 04_packages 04packages 05_apps 05apps; do
  dir=$(find_dir "$raw" 2>/dev/null || true); [ -n "$dir" ] && [ -d "$dir" ] || continue
  n=$(grep -rn "TODO\|FIXME" "$dir" --include="*.ts" --include="*.tsx" -l 2>/dev/null | wc -l || echo 0)
  TH=$((TH+n))
done
[ "$TH" -eq 0 ] && pass "TODO/FIXME — zero" || fail "TODO/FIXME — $TH plików"

# ─── WERDYKT ──────────────────────────────
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  WERDYKT POST-IMPL${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  PHI=$PHI  PCS≥$PCS"
echo -e "  PASS=${GREEN}$PASS${NC}  FAIL=${RED}$FAIL${NC}"
echo ""

if [ "$FAIL" -eq 0 ]; then
  echo -e "${GREEN}  STATUS: STABLE · MERGE ALLOWED${NC}"
  echo -e "  S11.COMMIT.ID: GOVERNANCE-POST-IMPL-CHECK-SH-20260620-002"
  exit 0
else
  echo -e "${RED}  STATUS: WORLDHALT · ${FAIL} STATE_VIOLATION(S)${NC}"
  exit 1
fi
