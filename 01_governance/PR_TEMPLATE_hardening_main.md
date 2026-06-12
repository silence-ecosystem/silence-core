<!--
[PATH]: 01_governance/PR_TEMPLATE_hardening_main.md
-->

### Title

`feat: git governance, vercel hardening, real workspace typecheck and 8-package fix`

***

### 1. Scope

Ten PR domyka bazową warstwę operacyjną repo SILENCE: ustanawia git governance, wprowadza scope hardening dla Vercela, zamienia placeholderowy typecheck na realną orkiestrację workspace oraz naprawia 8 pakietów open-core do pełnego PASS w `pnpm typecheck`.

Zmiana ma charakter infrastrukturalny i enforcementowy: nie dodaje nowej logiki high-risk, nie przenosi żadnej domeny z `03_ee` do `04_packages` lub `05_apps`, nie zmienia też zachowania deterministycznego engine’u poza poprawą jakości bramek buildowych.

***

### 2. What this PR includes

#### Git governance

- zainicjalizowanie repozytorium Git i ustanowienie `main` jako branchu bazowego.
- utworzenie branchy roboczych dla zmian hardeningowych i typecheck fixów, zgodnie z trunk-based workflow oraz zasadą małych, audytowalnych zmian.
- powiązanie zmian z historią commitów i ścieżką review wymagającą PR przed merge do `main`.

#### Vercel hardening

- dodanie `.vercelignore`, który wyklucza z uploadu co najmniej `03_ee/`, `07_archive/`, `01_governance/`, `02_protocols/`, `docs/` i `design/`, tak aby deploy nie obejmował warstw poza publicznym runtime.
- dodanie `vercel.json`, w którym `ignoreCommand` pomija build przy zmianach dotyczących wyłącznie wykluczonych scope’ów, a `github.deploymentEnabled` pełni rolę bramki dla releasu na `main`.
- utrzymanie Vercela jako warstwy deterministycznej orkiestracji i deployu dla aplikacji oraz open-core, bez ścieżki importu lub publikacji logiki enterprise.

#### Real workspace typecheck

- zastąpienie rootowego placeholdera prawdziwą komendą `turbo run typecheck --continue`.
- rozszerzenie `turbo.json` o task `typecheck`, tak aby TypeScript stał się rzeczywistą bramką buildową w skali workspace.
- dodanie `typecheck: tsc --noEmit` tam, gdzie było to wymagane, oraz uzupełnienie konfiguracji w pakietach open-core.

#### Naprawa 8 pakietów open-core

- doprowadzenie do pełnego PASS dla `pnpm typecheck` przez naprawę `validator`, `language`, `ui`, `dashboard`, `legal`, `symbolic`, `sequences` i `voice`.
- usunięcie uszkodzonych komentarzy po dodaniu `[PATH]`, dodanie self-contained `tsconfig.json` oraz brakujących depsów typu `@types/node`, `typescript`, `@silence/events`, `@silence/contracts` tam, gdzie były wymagane przez kompilację.
- finalny wynik: `pnpm typecheck` przechodzi 19/19 tasków.

***

### 3. Rationale

`SILENCE_STRUCT_v2_0` definiuje obowiązkowe bramki przed buildem: `boundary-check`, `test:determinism`, `s11-check`, `typecheck`, verifier hash-chain oraz kontrolę magicznych liczb i timingów. Przed tym PR repo miało część z tych zabezpieczeń, ale nadal brakowało pełnej ścieżki audytowej Git, twardego ograniczenia Vercela względem domen niepublicznych oraz binarnego `typecheck` dla całego workspace, co osłabiało model PASS/WORLD_HALT.

Ten PR zamyka tę lukę i przesuwa repo z etapu częściowego enforcementu do stanu, w którym podstawowy zestaw gate’ów działa operacyjnie i może być egzekwowany zarówno lokalnie, jak i w CI/CD.

***

### 4. Gates checklist

Na branchu `fix/typecheck-eight-packages` wszystkie krytyczne bramki przechodzą:

- [x] `pnpm install` → PASS, 37 workspace projects.
- [x] `pnpm boundary-check` → PASS, 0 violations.
- [x] `pnpm s11-check` → PASS, 0 violations.
- [x] `pnpm test:determinism` → PASS, 7/7.
- [x] `pnpm test:vitest` → PASS, 11/11.
- [x] `pnpm typecheck` → PASS, 19/19 tasks successful.

To domyka zestaw bramek wymaganych przez `SILENCE_STRUCT_v2_0` dla warstwy open-core i aplikacyjnej na obecnym etapie repo.

***

### 5. Safety / IP boundary

- brak zmian w `03_ee/*`.
- brak nowych importów `04_packages/@silence/* ← 03_ee/*`.
- brak nowych importów `05_apps/* ← 03_ee/*`.
- `.vercelignore` oraz `vercel.json` wzmacniają granicę deployową, tak aby publiczny build nie obejmował katalogów governance, archive i enterprise.
- zmiana nie wprowadza predictive logic, EE-only context fusion ani żadnej logiki high-risk do open-core.

***

### 6. S11 compliance

S11 pozostaje zachowane na poziomie kodu, CI i warstwy deployowej: `pnpm s11-check` przechodzi bez naruszeń, a standard S11 wymaga, aby system, UI, dokumentacja i workflow-visible payloads nie używały języka klinicznego ani terapeutycznego. Ten PR nie rozszerza wyjątków S11; utrzymuje jedynie istniejące, jawnie kontrolowane meta-wyjątki dla słownika i dokumentów nadrzędnych.

***

### 7. EffectLog

Zmiany zostały zapisane w `01_governance/EFFECTLOG.md` jako kolejne wpisy append-only, zgodnie z wymogiem hash-chain dla decyzji krytycznych w repo. W szczególności:

- `ENTRY 034` — git init / ustanowienie ścieżki repo.
- `ENTRY 035` — Vercel hardening + real workspace typecheck.
- `ENTRY 036` — naprawa 8 pakietów i pełny PASS `pnpm typecheck`.

Brak edycji historycznych wpisów i brak naruszenia łańcucha audytowego.

***

### 8. Reviewer notes

Reviewer powinien zweryfikować trzy rzeczy:

1. że `vercel.json` i `.vercelignore` faktycznie odcinają `03_ee` i scope niepubliczne od deployu.
2. że `typecheck` działa z roota jako realna orkiestracja, a nie placeholder.
3. że żaden z fixów w 8 pakietach nie zmienia runtime contracts ani granicy IP, tylko przywraca spójność kompilacji i konfiguracji workspace.

***

### 9. How to verify locally

```bash
pnpm install
pnpm boundary-check
pnpm s11-check
pnpm test:determinism
pnpm test:vitest
pnpm typecheck
```

Wszystkie komendy powinny zakończyć się statusem 0.

***

### 10. Merge intent

Po review ten PR ustanawia `main` jako branch z aktywnymi bramkami Git, Vercel i TypeScript, gotowy do dalszego prowadzenia zmian zgodnie z trunk-based workflow i zasadą małych PR-ów. Kolejne zmiany powinny już zakładać, że `typecheck`, `boundary-check` i `s11-check` są obowiązkowymi gate’ami, a nie opcjonalną warstwą pomocniczą.
