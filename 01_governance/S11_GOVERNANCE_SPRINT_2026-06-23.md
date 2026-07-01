## PATH 01_governance/S11_GOVERNANCE_SPRINT_2026-06-23.md

title S11_GOVERNANCE_SPRINT_2026_06_23
status PLANNED
created 2026-06-23
updated 2026-06-23
author s11-steward-candidate
classification SPRINT_SPEC
sentinel S11_ENFORCED
pcs_target 0.999
scope 01_governance 02_protocols 05_apps_ui_copy
dependencies

- S11-01-Language-Standard.md
- HARD_SEVEN_v2026.md
- VERCEL_DEPLOYMENT_GUIDE_v1.md

---

TITLE S11_GOVERNANCE_SPRINT_2026_06_23

## 1. INITIATE

CEL
Wyzerowanie naruszeń `pnpm s11-check` w aktywnym monorepo SILENCE przy niezmienionych wynikach:

- `pnpm boundary-check` — pozostaje PASS,
- `pnpm typecheck` — pozostaje PASS,
- `pnpm turbo run build --filter=...[origin/main...HEAD]` — pozostaje PASS,
- `pnpm turbo run test --filter=...[origin/main...HEAD]` — pozostaje PASS. [file:28][file:58]

DOMENA

- 01_governance (dokumenty normatywne, enforcement),
- 02_protocols (protokóły operacyjne),
- 05_apps (tylko UI copy, jeśli jest w zakresie s11-lint). [file:39]

MODUL DOCZELOWY

- S11 compliance na poziomie repo (`pnpm s11-check`).

OGRANICZENIA

- Zero zmian w logice kodu runtime poza stringami i komentarzami.
- Zero zmian kontraktów API i eventów bez odrębnego ADR.
- Zero naruszeń RULE-DOM-001 (żadnych importów między 03_ee a 04_packages/05_apps). [file:58]
- Zero wprowadzania terminów spoza słownika S11 (łącznie z mistycznymi). [file:39][file:49]

WARUNEK ZAKOŃCZENIA

- `pnpm s11-check` → PASS (exit code 0),
- PCS globalne (wg HARD_SEVEN) ≥ 0.999 dla sprint artefaktu. [file:49]

## 2. DEFINE — KONTRAKT WYKONANIA

WEJŚCIA

1. Aktualny stan repo:
   - 31–36 naruszeń S11 raportowanych przez `pnpm s11-check`. [file:28]
2. Dokumenty SSoT:
   - `S11-01-Language-Standard.md` — blocklist + allowlist. [file:39]
   - `HARD_SEVEN_v2026.md` — PCS gate, Zero-Fragment Policy. [file:49]
   - `VERCEL_DEPLOYMENT_GUIDE_v1.md` — potwierdzenie, że tylko S11 gate jest czerwony. [file:28]

WYJŚCIA

- Zaktualizowane pliki w 01_governance/02_protocols/05_apps z refaktoryzowanym językiem zgodnym z S11.
- Brak naruszeń w raporcie `pnpm s11-check`.
- Nowy artefakt audytowy z PCS ≥ 0.999 dla sprintu (np. `01_governance/S11_SNAPSHOT_AFTER_REMEDIATION.md`).

KLASA PARAMETRÓW

- Parametry to wyłącznie stringi w dokumentach, komentarzach, labelach UI, promptach i README — brak zmian w sygnaturach funkcji, typach, strukturach danych.
- Każda zmiana językowa musi być lokalna (słowo → słowo) i zgodna z mapowaniem S11 (np. `stress` → `TENSION_SCORE`, `chaos` → `SIGNAL_NOISE`). [file:39][file:49]

WYMAGANIA S11

- Brak wystąpień wszystkich terminów z blocklisty S11 (sekcje 2.1–2.5). [file:39]
- Preferowane użycie terminów z allowlisty (sekcja 3) do opisów stanów, metryk i interwencji. [file:39]

WYMAGANIA PCS

- Brak placeholderów, `TODO`, „do ustalenia” itp. w zmienianych plikach (HARD_SEVEN §6). [file:49]
- Każdy plik musi pozostać semantycznie kompletny — Zero-Fragment Policy. [file:49]

GRANICA IP

- Żadna zmiana nie może wprowadzić nowego powiązania między 03_ee, 04_packages i 05_apps (dotykamy tylko tekstu). [file:58]

WALIDACJA

- Automatyczna: `pnpm s11-check` w CI (G1). [file:39]
- Manualna: przegląd losowej próbki zmienionych fragmentów przez S11 Stewarda (G2).

## 3. EXECUTE — SEKWENCJA KROKÓW

Krok 1: LOKALIZACJA NARUSZEŃ

1. Uruchom lokalnie:
   ```bash
   pnpm s11-check --format=json > s11-violations.json
   ```
2. Wyodrębnij listę plików i dokładne fragmenty z naruszeniami. (Operacyjnie w CI to już jest; tu opisujemy wymóg.)

Krok 2: KATEGRYZACJA NARUSZEŃ

Podział każdego naruszenia na jedną z kategorii S11:

- Clinical Diagnoses (2.1), [file:39]
- Therapeutic Terms (2.2),
- Emotional/Affective (2.3),
- Normative/Value Judgments (2.4),
- Mysticism/Spirituality (2.5).

Krok 3: MAPOWANIE NA TERMINY S11

Dla każdej kategorii stosuj mapowanie:

- Clinical / therapeutic / diagnosis → `CLASSIFICATION`, `PATTERN_SIGNATURE`, `STRUCTURAL_EXERCISE`, `STRUCTURAL_REFLECTION`. [file:39][file:49]
- Stress/chaos/overload → `TENSION_SCORE`, `SIGNAL_NOISE`, `LOAD_EXCEEDED`, `ATTENTION_DRIFT`. [file:49]
- Wellness/mood/feeling → opis strukturalny: `activation pattern`, `suppression pattern`, `tension state`. [file:39]
- Mistycyzm → opis strukturalny: `pattern`, `state`, `tension`, bez „energy”, „universe” itp. [file:39]

Krok 4: EDYCJA DOKUMENTÓW

- W 01_governance i 02_protocols zmień wyłącznie tekst — zachowaj strukturę sekcji, nagłówków i tabel.
- W 05_apps dopuszczalne są zmiany etykiet UI, opisów, tooltipów i komunikatów, ale nie ID eventów ani nazw typów/API.

Krok 5: RE-RUN S11 CHECK

Po każdej serii zmian:

```bash
pnpm s11-check
```

- Jeśli liczba naruszeń > 0 → powrót do Kroku 2.
- Jeśli 0 → przejście do fazy VALIDATE.

## 4. VALIDATE — WALIDACJA KOŃCOWA

Warunki:

1. `pnpm s11-check` → PASS (exit 0, brak naruszeń). [file:28][file:39]
2. `pnpm boundary-check` → PASS (brak naruszeń RULE-DOM-001). [file:58]
3. `pnpm typecheck` → PASS.
4. `pnpm exec turbo run build --filter=...[origin/main...HEAD]` → PASS.
5. `pnpm exec turbo run test --filter=...[origin/main...HEAD]` → PASS. [file:28]

Po spełnieniu warunków utwórz nowy snapshot:

`01_governance/S11_SNAPSHOT_AFTER_REMEDIATION_2026-06-XX.md`

z:

- PCS_COMPUTED ≥ 0.999 (brak kary -0.030 i -0.020 z VERCEL_DEPLOYMENT_GUIDE_v1), [file:28][file:49]
- STATUS: PASS.

## 5. COMMIT — AUDYT I METADANE

Wpis audytowy:

```yaml
task_id: S11_GOVERNANCE_SPRINT_20260623
commit_id: S11-MVP-20260623-00X
status: PASS
pcs: 0.999
artifact_path:
  - 01_governance/S11_GOVERNANCE_SPRINT_2026-06-23.md
  - 01_governance/S11_SNAPSHOT_AFTER_REMEDIATION_2026-06-XX.md
boundary_check: PASS
s11_check: PASS
typecheck: PASS
build: PASS
tests: PASS
rule_dom_001: PASS
hard_seven_alignment: PASS
notes:
  - 'Wyzerowano naruszenia s11-check w 01_governance/02_protocols/05_apps_ui_copy.'
```

## 6. STABILIZE — UTRZYMANIE STANU

Po wdrożeniu sprintu:

- `pnpm s11-check` staje się **nieopcjonalnym** gate’em w każdym PR (jak już deklaruje VERCEL_DEPLOYMENT_GUIDE_v1). [file:28]
- Nowe dokumenty/governance muszą od razu spełniać S11 (Zero-Fragment + S11 compliant), inaczej PR jest blokowany. [file:49][file:39]
- Co kwartał (zgodnie z S11-01) generowany jest „S11 Compliance Snapshot” z raportem 0 naruszeń. [file:39]
