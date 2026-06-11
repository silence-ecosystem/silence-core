[PATH]: 01_governance/ADR/ADR-005-event-schema-extensions-layer.md

---

title: ADR-005-EVENT-SCHEMA-EXTENSIONS-LAYER
status: PRODUKCJA (IMMUTABLE)
date: 2026-04-01
author: silence-architect
classification: SSoT
sentinel: S11_ENFORCED
adr_status: ACCEPTED
supersedes: none
implements: EVENT_SCHEMA_EXTENSIONS_LAYER
pcs: 0.999

---

# ADR-005 — EVENT SCHEMA EXTENSIONS LAYER FOR `SilenceEventV1`

## 1. ZAKRES DECYZJI

Niniejszy artefakt ustanawia dwuwarstwowy model schematu dla `SilenceEventV1`. Celem jest jednoczesne zamrożenie pól krytycznych dla kompatybilności oraz odblokowanie bezpiecznych rozszerzeń eksperymentalnych bez naruszania kontraktów downstream.

## 2. KONTEKST OPERACYJNY

`SilenceEventV1` stanowi kanoniczny typ zdarzenia współdzielony przez warstwy open-core i warstwy zamknięte. Brak rozróżnienia pomiędzy polem zamrożonym a polem rozszerzalnym prowadzi do dwóch błędów: nadmiernego blokowania zmian albo niekontrolowanego łamania kompatybilności.

## 3. DECYZJA

Przyjmuje się model dwuwarstwowy `CORE + EXTENSIONS`.

### 3.1 CORE — warstwa zamrożona

Pola poniżej wymagają formalnego ADR dla każdej zmiany:

| Field        | Type     | Rola                                   |
| ------------ | -------- | -------------------------------------- |
| `timestamp`  | `string` | czas zdarzenia UTC ISO 8601            |
| `user_id`    | `string` | identyfikator pseudonimizowany UUID v4 |
| `event_type` | `string` | nazwa zdarzenia zgodna z kanonem S11   |
| `session_id` | `string` | identyfikator sesji UUID v4            |

Zmiana pola Core wymaga: nowego ADR, aktualizacji publicznego schematu, aktualizacji walidatorów kontraktowych oraz major bump semver.

### 3.2 EXTENSIONS — warstwa modyfikowalna

Do `SilenceEventV1` dodaje się pojedyncze pole:

```typescript
extensions?: Record<string, unknown>
```

Reguły dla `extensions` są następujące:

- nowe klucze mogą być dodawane bez ADR
- klucze mogą być oznaczane jako deprecated bez ADR
- klucze nie mogą być usuwane w obrębie tego samego minor
- wartości muszą być JSON-serialisable
- warstwa walidacyjna dopuszcza `passthrough()`
- promocja klucza z `extensions` do `CORE` wymaga pełnego ADR

### 3.3 Wstępnie zarejestrowane klucze rozszerzeń

| Key             | Type             | Rola                              |
| --------------- | ---------------- | --------------------------------- |
| `phi_phase`     | `number \| null` | indeks fazy φ-engine              |
| `attention_ema` | `number \| null` | średnia wykładnicza sygnału uwagi |
| `rhythm_hrv`    | `number \| null` | proxy zmienności rytmu            |

## 4. MINIMAL SAFEGUARD

Przed emisją jakiegokolwiek nowego pola eksperymentalnego do produkcji należy wprowadzić minimalny wzorzec:

```typescript
export interface SilenceEventV1 {
  timestamp: string;
  user_id: string;
  event_type: string;
  session_id: string;
  extensions?: Record<string, unknown>;
}
```

Wzorzec ten gwarantuje, że konsumenci obserwujący wyłącznie pola `CORE` pozostają nienaruszeni przez zmiany w warstwie rozszerzeń.

## 5. KONSEKWENCJE

### 5.1 Skutki dodatnie

Model odblokowuje iterację nad sygnałami eksperymentalnymi, a jednocześnie utrwala stabilność kontraktów podstawowych. Zachowuje kompatybilność wsteczną i utrzymuje kontrolę nad `event_type` jako polem objętym rygorem S11.

### 5.2 Skutki ujemne

Warstwa `extensions` osłabia ścisłe typowanie w czasie kompilacji i zwiększa koszt odkrywania dostępnych kluczy. Konsument musi samodzielnie walidować pola rozszerzeń, jeżeli wymaga silnych gwarancji.

### 5.3 Skutki neutralne

Decyzja nie zmienia semantyki już istniejących zdarzeń. Dodaje jedynie formalną strefę bezpiecznej rozszerzalności.

## 6. CHECKLISTA IMPLEMENTACYJNA

- dodać `extensions?: Record<string, unknown>` do `SilenceEventV1`
- dodać JSDoc z listą kluczy wstępnych
- zmienić walidator rozszerzeń na `passthrough()`
- wyeksportować dokumentacyjny typ rozszerzeń
- wykonać minor bump publicznego pakietu
- zaktualizować checklistę PR o referencję do ADR-005

## 7. MATH_CORE

| Parametr          | Stała Bazowa   | Derywacja               | Wartość Operacyjna |
| ----------------- | -------------- | ----------------------- | ------------------ |
| PCS Threshold     | `PCS_BASE`     | $$1 - \phi^{-12}$$      | > 0.997            |
| Validation Window | `GOLDENSECOND` | $$GS \times \phi^{-2}$$ | ~382ms             |
| Sync Interval     | `GOLDENSECOND` | $$GS \times \phi^{2}$$  | ~2618ms            |
| Layout Ratio      | `PHI_INVERSE`  | $$1 : \phi$$            | 0.618              |

## 8. EFFECTLOG

- `2026-04-01T00:00:00Z` — DEFINE — Rozdzielono schema layer na `CORE` i `EXTENSIONS`.
- `2026-04-01T00:00:01Z` — ENFORCE — Zamrożono pola krytyczne i otwarto warstwę rozszerzeń.
- `2026-04-01T00:00:02Z` — STABILIZE — Ustanowiono minimal safeguard dla kompatybilności downstream.
