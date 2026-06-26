[PATH]: 05_apps/silence-objects/AGENTS.md

**STATUS:** ACTIVE
**SCOPE:** 05_apps/silence-objects
**RIGOR:** HARD_SEVEN ENFORCED, S11 ENFORCED, RULE-DOM-001 SEALED
**PCS_GATE:** 0.990

---

## 1. TASK

Ustanowić operacyjny kontrakt dla modułu `05_apps/silence-objects` jako aplikacji warstwy `05_apps`, z dokładnym opisem komend lint, test, typecheck, build oraz kontraktu wdrożeniowego Vercel, przy zachowaniu szczelnej granicy IP, pełnej zgodności z HARD_SEVEN i jawnej obsługi znanego dryfu typów React 19 ↔ Radix Dialog.[^1][^2]

Ten plik jest lokalnym SSoT dla agentów AI, maintainerów i CI pracujących wyłącznie na `05_apps/silence-objects`, zgodnie z wymogiem „Agent-Ready Repository”, w którym każdy moduł musi posiadać `AGENTS.md`, a sam plik musi pozostać krótki, jednoznaczny i bez fragmentów.[^3][^1]

## 2. GRANICE MODUŁU

`05_apps/silence-objects` należy do warstwy `05_apps` i może konsumować wyłącznie pakiety publiczne z `04_packages/@silence/*` oraz inne dozwolone zależności open-core; nie wolno mu importować niczego z `03_ee/*` ani z `07_archive/legacymonorepo`. Jedyną dopuszczalną bramką do warstwy Enterprise pozostają publiczne kontrakty i `@silence/sdk`, a każde naruszenie tej zasady jest stanem `WORLDHALT` zgodnie z RULE-DOM-001 oraz HARD_SEVEN.[^4][^1]

Ten moduł podlega wszystkim globalnym gate’om repo: `pnpm boundary-check`, `pnpm s11-check`, `pnpm typecheck`, `pnpm exec turbo run build --filter=...[origin/main...HEAD]` oraz `pnpm exec turbo run test --filter=...[origin/main...HEAD]`; lokalny kontrakt nie znosi żadnej z tych bramek.[^2]

## 3. KOMENDY OPERACYJNE

Komendy preferowane uruchamiane są z root repo przez Turborepo, ponieważ selective build tracing i `turbo-ignore` są częścią kanonicznego modelu deployowego.[^2][^3]

```bash
pnpm turbo run dev --filter=05_apps/silence-objects
pnpm turbo run lint --filter=05_apps/silence-objects
pnpm turbo run typecheck --filter=05_apps/silence-objects
pnpm turbo run test --filter=05_apps/silence-objects
pnpm turbo run build --filter=05_apps/silence-objects
```

Jeżeli zachodzi potrzeba pracy z katalogu aplikacji, dopuszczalne są tylko komendy wynikające z lokalnego `package.json`; nie wolno tworzyć równoległych skryptów, które omijają Turbo, CI albo rootowe gate’y.[^1][^3]

## 4. LINT I TYPECHECK

`05_apps/silence-objects` używa `eslint.config.mjs`, który został dostosowany do kompatybilności z ESLint 9 i obecnym plugin stackiem Next 14, a reguły niekompatybilne zostały czasowo wyłączone w sposób jawny i lokalny, zamiast być maskowane globalnie. Ten stan jest akceptowalny wyłącznie jako kontrolowane obejście kompatybilności, a nie jako trwały wzorzec dla innych aplikacji.[^2]

Lokalny gate `LINT_SILENCE_OBJECTS` jest PASS, gdy `pnpm turbo run lint --filter=05_apps/silence-objects` kończy się exit code 0 i nie generuje błędów blokujących. Lokalny gate `TYPECHECK_SILENCE_OBJECTS` jest PASS, gdy `pnpm turbo run typecheck --filter=05_apps/silence-objects` kończy się exit code 0, a jedyne znane odstępstwo typów pozostaje jawnie zarejestrowane w sekcji 6 tego pliku.[^1]

## 5. TEST I BUILD

Gate `TEST_SILENCE_OBJECTS` jest PASS, gdy `pnpm turbo run test --filter=05_apps/silence-objects` kończy się exit code 0 i nie raportuje failing tests; testy nie mogą używać RNG ani `Date.now()` jako źródła decyzji w logice systemowej. Gate `BUILD_SILENCE_OBJECTS` jest PASS, gdy `pnpm turbo run build --filter=05_apps/silence-objects` kończy się exit code 0, bez importów EE, bez ukrytych warningów granicznych i bez zmian routingowych niepokrytych kontraktem.[^4][^1][^2]

## 6. KONTROLOWANE ODSTĘPSTWO: `@ts-nocheck` I RADIX DIALOG

W bieżącym stanie modułu dopuszczone jest wyłącznie jedno jawnie nazwane odstępstwo typów: tymczasowe użycie `// @ts-nocheck` w `components/CrisisModal.tsx` oraz `components/PaywallModal.tsx`, wynikające z pre-existing drift wersji między React 19 a Radix Dialog. To odstępstwo nie jest interpretowane jako przyzwolenie ogólne na wyłączanie typechecku w innych plikach i nie może rozszerzyć się poza te dwie ścieżki bez nowego artefaktu governance.[^1][^2]

Zasady dla tego odstępstwa są sztywne:

- `@ts-nocheck` może występować tylko w tych dwóch plikach,
- musi być traktowane jako debt techniczny do osobnego sprintu kompatybilności,
- nie wolno pod nim ukrywać zmian funkcjonalnych niezwiązanych z konfliktem React 19 ↔ Radix Dialog,
- każda modyfikacja tych plików wymaga uruchomienia pełnego lokalnego zestawu `lint`, `typecheck`, `test`, `build`.[^1]

Jeżeli pojawi się potrzeba dodania `@ts-nocheck` w trzecim pliku, status zmiany przechodzi automatycznie w `PARTIAL`, a merge wymaga nowego wpisu auditowego i osobnego kontraktu remediacyjnego.[^1]

## 7. KONTRAKT VERCEL

`05_apps/silence-objects/vercel.json` musi istnieć i zawierać przynajmniej:

```json
{
  "ignoreCommand": "npx turbo-ignore --fallback=HEAD^1"
}
```

Jest to wymóg bezpośrednio wynikający z kanonicznej strategii selective builds i IgnoreCommand Enforcement dla `apps/*/vercel.json`. Nie wolno rozszerzać lokalnego `vercel.json` o ustawienia zmieniające globalny kontrakt root, chyba że istnieje osobny artefakt ownership dla tej aplikacji; rootowy `vercel.json` pozostaje minimalnym kanonem dla całego monorepo.[^3][^2]

Gate `VERCEL_SILENCE_OBJECTS` jest PASS, gdy plik istnieje, jest poprawnym JSON-em i zawiera prawidłowe `ignoreCommand`.[^2]

## 8. S11 I JĘZYK MODUŁU

Kod, copy UI, komentarze i nazwy identyfikatorów w `05_apps/silence-objects` muszą pozostawać zgodne z S11-01; system nie używa języka klinicznego, terapeutycznego, diagnozującego, patologizującego ani mistycznego jako własnego języka operacyjnego. Jeżeli użytkownik wprowadza takie terminy, moduł może je przyjąć jako wejście, ale nie może ich zwracać jako autorytatywnego opisu systemowego.[^5][^1]

Lokalny gate `S11_LOCAL_SILENCE_OBJECTS` jest PASS, gdy w module nie pojawiają się nowe naruszenia blocklisty S11 w kodzie, UI i komentarzach; globalny `pnpm s11-check` może nadal być czerwony z powodu długu w innych domenach repo, ale nie może to wynikać z nowych zmian w tej aplikacji.[^5][^2]

## 9. KRYTERIA GOTOWOŚCI MODUŁU

`05_apps/silence-objects` ma status `PASS`, gdy równocześnie zachodzą wszystkie warunki:

| Gate                        | Warunek PASS                                                                                                                                    |
| :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `BOUNDARY_SILENCE_OBJECTS`  | `pnpm boundary-check` nie raportuje naruszeń dla ścieżek modułu. [^4]                                                                           |
| `LINT_SILENCE_OBJECTS`      | `pnpm turbo run lint --filter=05_apps/silence-objects` = exit 0. [^1]                                                                           |
| `TYPECHECK_SILENCE_OBJECTS` | `pnpm turbo run typecheck --filter=05_apps/silence-objects` = exit 0 przy ograniczeniu `@ts-nocheck` wyłącznie do 2 zatwierdzonych plików. [^2] |
| `TEST_SILENCE_OBJECTS`      | `pnpm turbo run test --filter=05_apps/silence-objects` = exit 0. [^1]                                                                           |
| `BUILD_SILENCE_OBJECTS`     | `pnpm turbo run build --filter=05_apps/silence-objects` = exit 0. [^2]                                                                          |
| `VERCEL_SILENCE_OBJECTS`    | lokalny `vercel.json` istnieje i ma `ignoreCommand`. [^3][^2]                                                                                   |
| `S11_LOCAL_SILENCE_OBJECTS` | brak nowych naruszeń S11 w module. [^5]                                                                                                         |
| `PCS_SILENCE_OBJECTS`       | ocena lokalna `PCS >= 0.990`. [^1]                                                                                                              |

Status `PARTIAL` jest dopuszczalny wyłącznie wtedy, gdy wszystkie gate’y techniczne są zielone, a otwarty pozostaje wyłącznie jawnie opisany debt językowy albo debt kompatybilności o zatwierdzonym zakresie. Status `BLOCKED` obowiązuje przy failu boundary, build, test albo przy niekontrolowanym rozszerzeniu `@ts-nocheck`.[^4][^1]

## 10. STAN BIEŻĄCY

Na podstawie ostatniego snapshotu repo stan modułu można uznać za lokalnie operacyjny: boundary-check dla repo jest PASS, affected lint/typecheck/test są PASS, a lokalny kontrakt Vercel został utworzony. Jedynym jawnym odstępstwem pozostaje ograniczone `@ts-nocheck` w dwóch modalach związanych z Radix Dialog; globalny `pnpm s11-check` pozostaje czerwony z powodu znanego długu repo, ale nie unieważnia lokalnego kontraktu modułu, o ile moduł nie wnosi nowych naruszeń.[^5][^4][^2]

**STATUS_SILENCE_OBJECTS:** `PASS_LOCAL / PARTIAL_SYSTEM`[^2][^1]

<div align="center">⁂</div>

[^1]: HARD_SEVEN_v2026.md

[^2]: VERCEL_DEPLOYMENT_GUIDE_v1.md

[^3]: GIT_RULES_PLUS_SKILL_v2026.06.md

[^4]: RULE-DOM-001-P0-Remediation-Package.md

[^5]: S11-01-Language-Standard.md
