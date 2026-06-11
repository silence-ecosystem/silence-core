## [PATH]: docs/verification/SOFT_NOIR_VERIFICATION_8_OF_8.md

title: SOFT_NOIR_VERIFICATION_8_OF_8
status: REQUIRED_BEFORE_BUILD
version: 1.0.1
classification: SSoT
sentinel: S11_ENFORCED
pcs: 0.999
logic: BINARY_PASS_FAIL
failure_mode: WORLD_HALT
owner: PHI_CORE_GUARDIAN
updated: 2026-06-11

---

# [T] SOFT_NOIR_VERIFICATION_8_OF_8

## 1. STATUS OPERACYJNY

SOFT_NOIR_VERIFICATION_8_OF_8 ustanawia binarną bramkę 8/8 uruchamianą przed każdym buildem produkcyjnym. Wynik inny niż 8/8 PASS oznacza WORLD_HALT i blokadę dalszego pipeline'u.

Dokument egzekwuje cztery klasy niezmienników: granica IP ADR-004, determinizm obliczeniowy, rygor S11 oraz zgodność UI z zasadami Soft-Noir i derywacją \(\phi\). Bramka ma charakter techniczny, nie deklaratywny: każda sekcja mapuje się na jawny warunek PASS/FAIL, komendę weryfikacyjną oraz skutek operacyjny.

## 2. ZAKRES ENFORCEMENTU

Zakres obejmuje wyłącznie aktywne domeny monorepo odpowiedzialne za kod wykonywalny i ich konfigurację: `03_ee/`, `04_packages/`, `05_apps/`, root config oraz dokumenty governance wymagane przez aktywne CI. Katalog `07_archive/legacy_monorepo` pozostaje wyłączony z produkcyjnych ścieżek importu i może występować wyłącznie jako referencja historyczna.

Weryfikacja 8/8 nie zastępuje testów domenowych ani review architektonicznego. Jej rolą jest zablokowanie merge lub build w chwili wykrycia naruszenia niezmienników ustanowionych przez RULE-DOM-001, KANON_NAZEWNICTWA oraz rygor timingowy oparty o GOLDEN_SECOND_MS.

## 3. MAPPING TABEL

| ID  | Gate                      | Requirement                                                                           | Verification                                                | PASS Condition       | FAIL Condition                                        |
| --- | ------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------- | -------------------- | ----------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------- | ------------------------------ |
| 1   | ADR-004 ARCH_AUDIT        | Zero imports `04_packages -> 03_ee` i `05_apps -> 03_ee`                              | `pnpm boundary-check`                                       | exit code 0          | wykryty import cross-domain                           |
| 2   | DETERMINISM_CHECK         | Bit-exact reproducibility i aktywne testy determinism                                 | `pnpm test:determinism`                                     | wszystkie testy PASS | dowolny test FAIL                                     |
| 3   | S11_SENTINEL              | Zero terminologii zakazanej i zero pól API typu `pcs`                                 | `pnpm s11-check`                                            | exit code 0          | wykryty termin zakazany lub pole niekanoniczne        |
| 4   | PHI_MATH_VALIDATE         | Timingi i stałe wyłącznie z GOLDEN_SECOND_MS i pochodnych                             | `grep -RIn "1618\\                                          | 2618\\               | 4236\\                                                | 6854" 04_packages 05_apps` + review allowlist | wszystkie trafienia pochodzą z kanonicznych constants lub testów | surowe literały poza allowlist |
| 5   | DEPENDENCY_CRUISER        | Zero cykli i zero ostrzeżeń blokujących w grafie domen                                | `pnpm boundary-check` + konfiguracja depcruise bez naruszeń | brak violations      | jakiekolwiek violations                               |
| 6   | CONTEXT_CONTRACT_VALIDATE | Payload L2 zgodny z kontraktem publicznym lub wewnętrznym schematem                   | `pnpm typecheck` oraz walidatory kontraktów w pakietach     | exit code 0          | niezgodność typów lub kontraktu                       |
| 7   | EFFECT_LOG_INTEGRITY      | Append-only hash-chain SHA-256 dla EffectLog                                          | `node scripts/verify-effect-log-chain.mjs`                  | exit code 0          | zerwana ciągłość seq/hash                             |
| 8   | ADR-002 COMPLIANCE_CHECK  | UI respektuje Soft-Noir i \(\phi\)-spacing przez kanoniczne tokens i layout constants | `grep -RIn "clamp\\(                                        | ease-in-out          | random\\(" 05_apps 04_packages` + design token review | brak zakazanych wzorców poza allowlist        | wykryty niedozwolony layout/motion pattern                       |

## 4. REGUŁY WERYFIKACYJNE 8/8

### 4.1 ADR-004: ARCH_AUDIT

**Requirement:** Zero importów z `03_ee/` do `04_packages/` oraz zero bezpośrednich importów z `03_ee/` do `05_apps/`.

**Verification:**

```bash
pnpm boundary-check
```

**Result:** [ ] PASS / [ ] FAIL

**Operational effect:** FAIL powoduje natychmiastowy WORLD_HALT. Jest to krytyczne naruszenie granicy IP i naruszenie RULE-DOM-001.

### 4.2 DETERMINISM_CHECK

**Requirement:** Deterministyczne funkcje i powtarzalny wynik testów dla wektorów wejściowych kontrolowanych przez testy.

**Verification:**

```bash
pnpm test:determinism
```

**Result:** [ ] PASS / [ ] FAIL

**Operational effect:** FAIL oznacza, że aktywny kod narusza kontrakt bit-exact lub przestał być reprodukowalny.

### 4.3 S11_SENTINEL

**Requirement:** Zero terminów zakazanych przez S11 oraz zero niekanonicznych nazw pól typu `pcs` w interfejsach i payloadach.

**Verification:**

```bash
pnpm s11-check
```

**Result:** [ ] PASS / [ ] FAIL

**Operational effect:** FAIL blokuje merge i build. Nazewnictwo jest traktowane jako integralna część kontraktu systemu.

### 4.4 PHI_MATH_VALIDATE

**Requirement:** Wszystkie timingi i stałe ruchu są derywowane z `GOLDEN_SECOND_MS = 1618` oraz z pochodnych kanonicznych: `2618`, `4236`, `6854`.

**Verification:**

```bash
grep -RIn "1618\|2618\|4236\|6854" 04_packages 05_apps
```

**Result:** [ ] PASS / [ ] FAIL

**Operational effect:** PASS wymaga review allowlist. Dozwolone są wyłącznie trafienia w plikach constants, testach lub jawnie zatwierdzonych adapterach. FAIL oznacza obecność magicznych liczb poza kanonem.

### 4.5 DEPENDENCY_CRUISER

**Requirement:** Zero cykli i zero naruszeń grafu zależności między domenami.

**Verification:**

```bash
pnpm boundary-check
```

**Result:** [ ] PASS / [ ] FAIL

**Operational effect:** FAIL blokuje build. Boundary i integralność grafu zależności są wspólną bramką.

### 4.6 CONTEXT_CONTRACT_VALIDATE

**Requirement:** Kontrakty payloadów L2 i interfejsów runtime są zgodne z typami i walidatorami repo.

**Verification:**

```bash
pnpm typecheck
```

**Result:** [ ] PASS / [ ] FAIL

**Operational effect:** FAIL oznacza rozjazd między kontraktem a implementacją, co unieważnia deterministyczną redukcję stanu.

### 4.7 EFFECT_LOG_INTEGRITY

**Requirement:** EffectLog pozostaje append-only, a każdy wpis zachowuje poprawny `seq`, `prev_hash` i `hash` liczony przez SHA-256.

**Verification:**

```bash
node scripts/verify-effect-log-chain.mjs
```

**Result:** [ ] PASS / [ ] FAIL

**Operational effect:** FAIL powoduje WORLD_HALT. Bez integralnego hash-chain nie istnieje ścieżka audytowa zgodna z wymaganym reżimem logowania.

### 4.8 ADR-002: COMPLIANCE_CHECK

**Requirement:** UI używa kanonicznej palety Soft-Noir, layoutów opartych o \(\phi\) i nie używa wzorców zakazanych jak arbitralny easing, `clamp()` dla spacingu systemowego lub niedeterministyczne ruchy.

**Verification:**

```bash
grep -RIn "clamp\(|ease-in-out|random\(" 05_apps 04_packages
```

**Result:** [ ] PASS / [ ] FAIL

**Operational effect:** FAIL oznacza naruszenie kontraktu wizualno-ruchowego i blokuje build.

## 5. SEKWENCJA URUCHOMIENIA

Kolejność bramek jest nienegocjowalna i wynosi:

1. `pnpm boundary-check`
2. `pnpm test:determinism`
3. `pnpm s11-check`
4. `pnpm typecheck`
5. `node scripts/verify-effect-log-chain.mjs`
6. review allowlist dla \(\phi\)-timing i Soft-Noir grep checks

Kroki 1–5 są automatyczne i blokujące. Krok 6 jest również blokujący, chyba że zostanie zastąpiony przez ustanowione w repo skrypty walidacyjne o równoważnym rygorze.

## 6. ALLOWLIST DLA PHI_MATH_VALIDATE I ADR-002

Dozwolone trafienia dla timing literals obejmują wyłącznie:

- pliki constants,
- testy jednostkowe i property-based,
- jawnie zatwierdzone komponenty prezentacyjne, które importują wartości z constants i używają literali tylko jako snapshot test fixture.

Zakazane są:

- surowe literały timingowe w komponentach UI bez importu z constants,
- lokalne `setTimeout(1618)` bez mapowania na kanoniczną stałą,
- `clamp()` w spacingu systemowym,
- `ease-in-out` i inne arbitralne easing curves w warstwie produkcyjnej.

## 7. CHECKLISTA PASS/FAIL

- [x] Jawna ścieżka `[PATH]` obecna.
- [x] Kompletność pliku zachowana.
- [x] Rygor S11 zachowany w treści normatywnej.
- [x] Granica IP ADR-004 opisana na poziomie logicznym i operacyjnym.
- [x] Derywacja timingów z `GOLDEN_SECOND_MS` opisana.
- [x] Append-only EffectLog z SHA-256 opisany jako gate.
- [x] Binary PASS/FAIL i `WORLD_HALT` zdefiniowane.
- [x] Domknięcie semantyczne bez placeholderów.

## 8. EFFECTLOG

```text
S11.COMMIT.ID: PHI-SOFT-NOIR-8OF8-20260611-001
EVENT: SOFT_NOIR_VERIFICATION_GATE_ESTABLISHED
CHANGE:
  - ustanowiono kanoniczny dokument bramki 8/8 przed buildem
  - zmapowano ADR-004, determinism, S11, phi-math, contracts, EffectLog i Soft-Noir do binarnego PASS/FAIL
  - usunięto niepotwierdzone narzędzia spoza kanonu repo i zastąpiono je komendami zgodnymi z aktywnym enforcementem
STATUS: PASS
```

## 9. WERDYKT

Ten plik może zostać przyjęty jako kanoniczna specyfikacja bramki przed buildem pod warunkiem, że repo zawiera lub otrzyma skrypt `scripts/verify-effect-log-chain.mjs`, ponieważ właśnie ten element domyka techniczną egzekwowalność punktu 7/8. Jeśli skrypt nie istnieje, dokument pozostaje normatywnie poprawny, ale wdrożenie gate’a 7/8 jest niepełne i wymaga natychmiastowego domknięcia.
