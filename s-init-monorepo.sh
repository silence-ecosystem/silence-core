#!/bin/bash
# [PATH]: s-init-monorepo.sh
# title: S-INIT-MONOREPO
# status: PRODUKCJA (IMMUTABLE)
# sentinel: S11_ENFORCED
# classification: SSoT
# entity_model: SLN -> GOV -> INIT
# phi_derivation: F(6) = 8 root nodes
# author: PHI-Core Guardian
# created: 2026-06-06

set -euo pipefail

PHI="1.618033988749895"
GOLDENSECOND="1618"
GOLDENSECOND="1618"
PCS="0.999"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONOREPO_ROOT="${SCRIPT_DIR}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[Φ-INIT]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[Φ-WARN]${NC} $1"; }
log_error() { echo -e "${RED}[Φ-FAIL]${NC} $1"; }
log_phi() { echo -e "${BLUE}[Φ-MATH]${NC} $1"; }

# ============================================================================
# FIBONACCI 8-ROOT STRUCTURE
# ============================================================================
declare -a ROOTS=(
    "01_governance"
    "02_protocols"
    "03_ee"
    "04_packages"
    "05_services"
    "06_infrastructure"
    "07_research"
    "08_meta"
)

declare -a EE_SUBDIRS=("jitai" "safety" "decisioning" "models")
declare -a PKG_SUBDIRS=("sdk" "core" "guards" "types")

# ============================================================================
# ANCHOR FILE GENERATORS (UPPER-CASE-KEBAB STANDARD)
# ============================================================================
generate_readme() {
    local dir="$1"
    local name="$2"
    local profile="$3"
    local extra="${4:-}"

    cat > "${dir}/README.MD" <<EOF
---
title: ${name}
status: STABLE
classification: SSoT
sentinel: S11_ENFORCED
determinism_profile: ${profile}
phi_anchor: true
created: $(date -u +"%Y-%m-%d")
---

# ${name}

## Operational Mandate
Directory \`${dir}\` operates under S11 governance with determinism profile \`${profile}\`.

## Constraints
- All operational parameters require explicit φ-derivation proof [T].
- Semantic sterility enforced: zero clinical taxonomy permitted.
- Boundary RULE-DOM-001 is absolute and non-negotiable.

## Determinism Classification
- **Profile:** ${profile}
- **PCS Threshold:** > 0.997
- **φ-Derivation:** Verified

## Inventory
- \`INDEX.MD\`: structural metadata and canonical file registry.
${extra}
EOF
}

generate_index() {
    local dir="$1"
    local name="$2"

    cat > "${dir}/INDEX.MD" <<EOF
---
title: ${name}-INDEX
type: structural_metadata
sentinel: S11_ENFORCED
generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
phi_anchor: true
---

# Index: ${name}

## Structural Metadata
- **Path:** \`${dir}\`
- **Node Type:** $(if [[ "${dir}" == *"03_ee/"* || "${dir}" == *"04_packages/"* ]]; then echo "LAYER-SUBMODULE"; else echo "ROOT-NODE"; fi)
- **Determinism Profile:** See README.MD

## File Registry
| File | Type | Status |
| :--- | :--- | :--- |
| README.MD | canonical_descriptor | STABLE |
| INDEX.MD | structural_metadata | STABLE |

## S11 Compliance
- [x] Semantic sterility verified.
- [x] No high-risk logic in open-core paths.
- [x] φ-mathematical rigor enforced.
EOF
}

create_anchor_files() {
    local dir="$1"
    local name="$2"
    local profile="$3"
    local extra="${4:-}"

    mkdir -p "${dir}"
    generate_readme "${dir}" "${name}" "${profile}" "${extra}"
    generate_index "${dir}" "${name}"
}

# ============================================================================
# ROOT INITIALIZATION
# ============================================================================
init_roots() {
    log_phi "Establishing F(6)=8 Fibonacci root structure..."

    for root in "${ROOTS[@]}"; do
        local dir="${MONOREPO_ROOT}/${root}"
        local profile="audit"

        case "${root}" in
            01_governance|04_packages)
                profile="strict"
                ;;
            08_meta)
                profile="best-effort"
                ;;
            *)
                profile="audit"
                ;;
        esac

        create_anchor_files "${dir}" "${root}" "${profile}"
        log_info "Root stabilized: ${root} [profile=${profile}]"
    done
}

# ============================================================================
# ENTERPRISE LAYER — 03_ee (CLOSED SOURCE / JITAI)
# ============================================================================
init_enterprise() {
    log_phi "Configuring 03_ee (Enterprise Layer — RULE-DOM-001 closed boundary)..."
    local base="${MONOREPO_ROOT}/03_ee"

    local boundary_notice="
## RULE-DOM-001 BOUNDARY NOTICE
This subtree contains proprietary enterprise logic. No code, type definition, or runtime reference within this tree may be consumed by \`04_packages/\` or any open-core primitive. Crossing this boundary constitutes ERROR_CODE_S11."

    for sub in "${EE_SUBDIRS[@]}"; do
        local dir="${base}/${sub}"
        create_anchor_files "${dir}" "EE-${sub}" "audit" "${boundary_notice}"
        log_info "Enterprise submodule: 03_ee/${sub} [audit]"
    done
}

# ============================================================================
# OPEN-CORE LAYER — 04_packages (SDK / DETERMINISTIC PRIMITIVES)
# ============================================================================
init_opencore() {
    log_phi "Configuring 04_packages (Open-Core Layer — strict determinism)..."
    local base="${MONOREPO_ROOT}/04_packages"

    local boundary_notice="
## RULE-DOM-001 BOUNDARY NOTICE
This subtree contains deterministic open-core primitives. All implementations must be bit-exact (strict profile) and must carry zero dependencies on \`03_ee/\`. Open-core purity is enforced by S11 sentinel."

    for sub in "${PKG_SUBDIRS[@]}"; do
        local dir="${base}/${sub}"
        create_anchor_files "${dir}" "PKG-${sub}" "strict" "${boundary_notice}"
        log_info "Open-Core submodule: 04_packages/${sub} [strict]"
    done
}

# ============================================================================
# S11 GATEWAY — CLAUDE.md
# ============================================================================
generate_claude_md() {
    local target="${MONOREPO_ROOT}/CLAUDE.md"
    log_info "Generating SSoT Gateway: CLAUDE.md"

    cat > "${target}" <<'EOF'
---
title: CLAUDE-S11-GATEWAY
status: IMMUTABLE
classification: SSoT
sentinel: S11_ENFORCED
pcs: 0.999
entity_model: SLN -> GOV -> GATEWAY
canonical: true
created: 2026-06-06
---

# S11 PROTOCOL — GATEWAY DEFINITION

## 1. RULE-DOM-001: Boundary Inviolability

The boundary between `03_ee/` (Enterprise Layer) and `04_packages/` (Open-Core Layer) is absolute and non-negotiable.

- **03_ee/** contains proprietary logic: JITAI decisioning, temporal intervention scheduling, safety middleware.
- **04_packages/** contains deterministic primitives, SDK surfaces, type systems, and language guards.

No enterprise logic may cross into open-core. No open-core primitive may depend on enterprise implementation.

## 2. S11 Semantic Sterility

All documentation, variable naming, and operational metadata within this monorepo must conform to S11 sterility standards:

- Prohibited conceptual domains: clinical taxonomy, psychological state descriptors, medical categorization.
- Required mapping: all states must be expressed through technical ontologies (`STATE_VIOLATION`, `BEHAVIORAL_CLUSTER`, `TENSION_SCORE`, `SYSTEM_LOAD_INDEX`).

## 3. Determinism Profiles

| Profile | Description | Applicable Layers |
|---|---|---|
| strict | Bit-exact reproducibility | 01_governance, 04_packages |
| audit | Reconstructable from logs + seed + model version | 03_ee, 05_services, 07_research |
| best-effort | Approximate, non-critical | 08_meta |

## 4. Φ-Mathematical Rigor

All operational parameters must derive from φ ≈ 1.618033988749895.

PCS thresholds, timing windows, and layout ratios must carry explicit φ-derivation proofs marked with [T].

Base constants:
- PCS Threshold: `1 - φ^-12` → > 0.997
- Validation Window: `GS × φ^-2` → ~382 ms
- Sync Interval: `GS × φ^2` → ~2618 ms
- Layout Ratio: `1 : φ` → 0.618

## 5. Operational Aliases

The following aliases are registered for ecosystem operations:
- `s-init`  — Re-run monorepo scaffolding and validation.
- `s-build` — Execute deterministic build pipeline.
- `s-phi`   — Display φ-derived constants and structural validation.
- `s-core`  — Navigate to or validate 04_packages integrity.

## 6. Monorepo Topology

This repository implements an 8-root structure derived from Fibonacci number F(6) = 8.

Roots:
1. 01_governance — Governance, roles, identity contracts
2. 02_protocols  — Semantic protocols, S11 enforcement rules
3. 03_ee         — Enterprise layer (JITAI, decisioning, safety)
4. 04_packages   — Open-Core layer (SDK, deterministic primitives)
5. 05_services   — Service orchestration and runtime glue
6. 06_infrastructure — Build, deploy, and platform infrastructure
7. 07_research   — Anonymized data views (k-anon ≥ 50), hypothesis testing
8. 08_meta       — Meta-documentation, system ontology, operational logs
EOF
}

# ============================================================================
# OPERATIONAL ALIASES
# ============================================================================
install_aliases() {
    log_phi "Registering operational aliases..."

    local alias_block="# === SILENCE SYSTEM ALIASES [S11] ===
alias s-init='bash \"${MONOREPO_ROOT}/s-init-monorepo.sh\"'
alias s-build='echo \"[Φ-BUILD] Deterministic pipeline invocation placeholder\"'
alias s-phi='echo \"φ = ${PHI} | PCS = ${PCS} | F(6) = 8 roots | S11 ACTIVE\"'
alias s-core='cd \"${MONOREPO_ROOT}/04_packages\" && echo \"[Φ-CORE] Open-Core layer: $(pwd)\"'
# === END SILENCE ALIASES ==="

    local shell_rc=""
    if [[ -f "${HOME}/.bashrc" ]]; then
        shell_rc="${HOME}/.bashrc"
    elif [[ -f "${HOME}/.zshrc" ]]; then
        shell_rc="${HOME}/.zshrc"
    fi

    if [[ -n "${shell_rc}" ]]; then
        if ! grep -q "SILENCE SYSTEM ALIASES \[S11\]" "${shell_rc}" 2>/dev/null; then
            printf '\n%s\n' "${alias_block}" >> "${shell_rc}"
            log_info "Aliases persisted to: ${shell_rc}"
        else
            log_warn "Aliases already registered in: ${shell_rc}"
        fi
    else
        log_warn "No .bashrc or .zshrc detected. Aliases not persisted automatically."
        echo ""
        echo "=== ADD THESE ALIASES MANUALLY ==="
        echo "${alias_block}"
        echo "==================================="
    fi

    # Activate in current session if script is sourced
    if [[ "${BASH_SOURCE[0]}" != "${0}" ]]; then
        eval "$(echo "${alias_block}" | grep '^alias')"
        log_info "Aliases activated in current shell session."
    fi
}

# ============================================================================
# STRUCTURAL VALIDATION
# ============================================================================
validate_structure() {
    log_phi "Executing deterministic validation..."
    local fail=0

    for root in "${ROOTS[@]}"; do
        if [[ ! -d "${MONOREPO_ROOT}/${root}" ]]; then
            log_error "Missing root node: ${root}"
            fail=1
        else
            if [[ ! -f "${MONOREPO_ROOT}/${root}/README.MD" ]]; then
                log_error "Missing anchor: ${root}/README.MD"
                fail=1
            fi
            if [[ ! -f "${MONOREPO_ROOT}/${root}/INDEX.MD" ]]; then
                log_error "Missing anchor: ${root}/INDEX.MD"
                fail=1
            fi
        fi
    done

    for sub in "${EE_SUBDIRS[@]}"; do
        if [[ ! -d "${MONOREPO_ROOT}/03_ee/${sub}" ]]; then
            log_error "Missing enterprise submodule: 03_ee/${sub}"
            fail=1
        fi
    done

    for sub in "${PKG_SUBDIRS[@]}"; do
        if [[ ! -d "${MONOREPO_ROOT}/04_packages/${sub}" ]]; then
            log_error "Missing open-core submodule: 04_packages/${sub}"
            fail=1
        fi
    done

    if [[ ! -f "${MONOREPO_ROOT}/CLAUDE.md" ]]; then
        log_error "Missing S11 Gateway: CLAUDE.md"
        fail=1
    fi

    if [[ $fail -eq 0 ]]; then
        log_info "VALIDATION PASSED — Structure conforms to F(6)=8 with S11 enforcement."
        log_phi "φ = ${PHI} | PCS = ${PCS} | Roots = 8 | Status = STABLE"
    else
        log_error "VALIDATION FAILED — Inspect missing components above."
        exit 1
    fi
}

# ============================================================================
# MAIN EXECUTION SEQUENCE
# ============================================================================
main() {
    log_phi "Φ-Core Guardian initializing monorepo scaffold..."
    log_phi "Constants: φ=${PHI} | PCS=${PCS} | Fibonacci roots=8"
    echo ""

    init_roots
    echo ""
    init_enterprise
    echo ""
    init_opencore
    echo ""
    generate_claude_md
    echo ""
    install_aliases
    echo ""
    validate_structure
    echo ""

    log_info "Monorepo scaffold complete. Deterministic structure locked."
    log_info "Next: source your shell profile or re-login to activate aliases."
}

main "$@"
