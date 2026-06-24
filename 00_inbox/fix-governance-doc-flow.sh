# File: /home/ewa/silence/00_inbox/fix-governance-doc-flow.sh
#!/usr/bin/env bash
set -euo pipefail

cd /home/ewa/silence

echo "== GOV PROTOKOL: STATUS =="
git status --short
git log --oneline --decorate -n 3

echo
echo "== CHECK: artefakt GOV_* =="
test -f docs/GOV_protokol_eliminacji_redundancji_senior_dev_edition_v1.0.0.md
wc -l docs/GOV_protokol_eliminacji_redundancji_senior_dev_edition_v1.0.0.md

echo
echo "== GATES: boundary / S11 / typecheck / determinism =="

# 1. boundary-check
pnpm boundary-check

# 2. s11-check
pnpm s11-check

# 3. typecheck
pnpm typecheck

# 4. determinism – tylko jeśli komenda istnieje
if pnpm run | grep -q "testdeterminism"; then
  pnpm testdeterminism
elif pnpm run | grep -q "test:determinism"; then
  pnpm test:determinism
else
  echo "[INFO] brak testdeterminism w package.json – pomijam ten gate"
fi

echo
echo "== TURBO: affected build/test przez pnpm exec =="

pnpm exec turbo run build --filter=...[origin/main...HEAD]
pnpm exec turbo run test  --filter=...[origin/main...HEAD]

echo "[OK] wszystkie dostępne gate’y dla GOV protokołu wykonane"
