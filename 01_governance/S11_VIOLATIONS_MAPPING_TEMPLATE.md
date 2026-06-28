## PATH 01_governance/S11_VIOLATIONS_MAPPING_TEMPLATE.md

title S11_VIOLATIONS_MAPPING_TEMPLATE
status TEMPLATE
created 2026-06-23
updated 2026-06-23
author s11-steward-candidate
classification S11_REMEDIATION_TOOL
sentinel S11_ENFORCED

---

TITLE S11_VIOLATIONS_MAPPING_TEMPLATE

## 1. Cel

Szablon służy do deterministycznego odwzorowania naruszeń wykrytych przez `pnpm s11-check` na zgodne z S11 formy językowe oraz do śledzenia stanu remediacji w czasie. [file:39][file:28]

Wypełniona tabela stanowi:

- dowód zgodności z S11-01 (jawne mapowanie forbidden → allowed), [file:39]
- załącznik do sprintu S11 dla governance (HARD_SEVEN cykl EXECUTE/VALIDATE/COMMIT), [file:49]
- materiał audytowy dla S11 Stewarda.

## 2. Instrukcja użycia

1. Uruchom:
   ```bash
   pnpm s11-check --format=json > s11-violations.json
   ```
2. Dla każdego naruszenia z raportu dodaj wiersz w tabeli poniżej.
3. Uzupełniaj kolumny zgodnie z opisem w sekcji 3.
4. Po wprowadzeniu zmian w repo zaktualizuj kolumnę `status` oraz `commit_id`.
5. Po wyzerowaniu wszystkich naruszeń zachowaj plik jako część audytu sprintu S11.

## 3. Opis kolumn

- `id` — stabilny identyfikator wiersza (np. `S11-V-001`).
- `file_path` — ścieżka pliku względem root (np. `01_governance/HARD_SEVEN_v2026.md`).
- `line` — numer linii (lub zakres), w której wykryto naruszenie.
- `forbidden_term` — dokładne słowo/fraza z blocklisty S11. [file:39]
- `category` — jedna z: `clinical`, `therapeutic`, `emotional`, `normative`, `mystic` (odpowiada sekcjom 2.1–2.5 S11-01). [file:39]
- `context_excerpt` — krótki wycinek zdania/tekstu (bez łamania S11; służy tylko orientacyjnie).
- `approved_replacement` — docelowe słowo/fraza zgodna z S11; najlepiej z allowlisty lub tabeli mapowania HARD_SEVEN. [file:39][file:49]
- `rationale` — 1–2 zdania wyjaśnienia, dlaczego wybrano właśnie to mapowanie (język strukturalny, żadnych klinicznych etykiet). [file:39]
- `status` — `PENDING`, `REMAPPED`, `EXCEPTION_REQUESTED`, `EXCEPTION_APPROVED`.
- `commit_id` — `S11-...` identyfikator commitu, w którym remediacja została wykonana (jeśli dotyczy).

## 4. Tabela „S11 VIOLATIONS → S11 MAPPING”

> Uwaga: poniższe wiersze są tylko szkieletem — wypełnij je na podstawie realnego raportu `s11-violations.json`.

| id        | file_path                              | line | forbidden_term | category    | context_excerpt                             | approved_replacement      | rationale                                                                               | status  | commit_id |
| --------- | -------------------------------------- | ---- | -------------- | ----------- | ------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------- | ------- | --------- |
| S11-V-001 | 01_governance/EXAMPLE_FILE.md          | 123  | anxiety        | clinical    | "... monitoruje poziom anxiety użytkownika" | tension_score             | Zastępuje etykietę kliniczną wskaźnikiem napięcia sygnału behawioralnego zgodnie z S11. | PENDING |           |
| S11-V-002 | 02_protocols/EXAMPLE_PROTOCOL.md       | 45   | therapy        | therapeutic | "proponuje formę therapy w przypadku..."    | structural_reflection     | Opisuje proces analizy wzorców zamiast interwencji terapeutycznej.                      | PENDING |           |
| S11-V-003 | 05_apps/example/components/Example.tsx | 78   | chaos          | normative   | "wykryto chaos w danych"                    | signal_noise              | Chaos zastąpiony neutralnym pojęciem zakłóceń sygnału (`SIGNAL_NOISE`).                 | PENDING |           |
| S11-V-004 | 01_governance/EXAMPLE_DOC.md           | 200  | normal         | normative   | "wraca do normal state"                     | baseline_pattern_state    | Normalność zastąpiona opisem stanu odniesienia wzorca, bez wartościowania.              | PENDING |           |
| S11-V-005 | 05_apps/example/pages/example.tsx      | 34   | energy         | mystic      | "odzyskujesz energy"                        | capacity_recovery_pattern | Mistyczna energia zastąpiona opisem wzorca odzyskiwania pojemności systemu.             | PENDING |           |

Po remediacji wypełnij kolumny `status` i `commit_id`:

- `status: REMAPPED` gdy forbidden_term został usunięty/zmieniony w kodzie i s11-check nie raportuje już naruszenia.
- `status: EXCEPTION_REQUESTED` / `EXCEPTION_APPROVED` gdy zastosowano procedurę wyjątku S11 (np. w cytatach zewnętrznych). [file:39]
- `commit_id`: np. `S11-MVP-20260623-00Y` zgodnie z HARD_SEVEN / AUDIT trail. [file:49]

## 5. Użycie w audycie

Po zakończonym sprincie S11:

1. Upewnij się, że dla wszystkich wierszy `status ≠ PENDING`.
2. Dołącz tę tabelę (lub jej wycinek) do artefaktu typu `S11_SNAPSHOT_AFTER_REMEDIATION_YYYY-MM-DD.md`.
3. Zacytuj tam `S11_VIOLATIONS_MAPPING_TEMPLATE.md` jako źródło metodologii mapowania.

---
