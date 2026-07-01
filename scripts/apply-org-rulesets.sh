#!/usr/bin/env bash
# Apply organization-level rulesets defined in .github/rulesets/* to the
# silence-ecosystem GitHub organization.
#
# Requires: gh CLI authenticated with admin:org scope.
# Usage:    ./scripts/apply-org-rulesets.sh [dry-run]

set -euo pipefail

ORG="silence-ecosystem"
DRY_RUN="${1:-}"

apply_ruleset() {
  local name="$1"
  local file="$2"
  local target_repos="$3"

  echo "Applying ruleset: $name"
  echo "  Source: $file"
  echo "  Targets: $target_repos"

  if [ "$DRY_RUN" = "dry-run" ]; then
    echo "  [DRY-RUN] Would POST /orgs/$ORG/rulesets"
    return
  fi

  # GitHub API: create organization ruleset
  gh api \
    --method POST \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "/orgs/$ORG/rulesets" \
    --input "$file"
}

# Map ruleset files to repository classes.
# These mappings must match 01_governance/GITHUB_ORG_RULESET_MATRIX.md.
apply_ruleset "nck-ssot-stabilizer" ".github/rulesets/nck-ssot-stabilizer.json" "silence-governance,silence-protocols"
apply_ruleset "open-core-guard" ".github/rulesets/open-core-guard.json" "silence-core"
apply_ruleset "enterprise-sensitive" ".github/rulesets/enterprise-sensitive.json" "silence-enterprise,silence-data"

echo "✅ Org-level rulesets applied."
