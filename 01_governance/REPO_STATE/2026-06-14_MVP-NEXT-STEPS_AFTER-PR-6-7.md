[PATH]: 01_governance/REPO_STATE/2026-06-14_MVP-NEXT-STEPS_AFTER-PR-6-7.md

NEXT STEPS dla MVP po PR #6 i #7
Po zmergowaniu @silence/validator i @silence/language kolejne kroki to dowiezienie frontowego MVP SILENCE.OBJECTS Command Center na Next.js zgodnie z briefem 9‑ekranowego MVP, przy jednoczesnym zachowaniu obecnych bramek S11 i RULE‑DOM‑001.[ppl-ai-file-upload.s3.amazonaws]
Założenia i cel tej listy
Ta lista zakłada, że obecne repo z pakietami @silence/\* to backend logiki bezpieczeństwa i języka, a mvp‑frontend (Next.js) jest odseparowany i korzysta z tych pakietów tylko przez dozwolone warstwy (SDK / kontrakty).[ppl-ai-file-upload.s3.amazonaws]
Celem jest minimalny zestaw PR‑ów, który dowozi 9‑ekranowy MVP (Onboarding, Input, Report, Archive, Settings, Pro, Safety header, Crisis modal, Paywall) z pełnym przepływem: Onboarding → Input → Report → Archive → Settings + stubowana monetizacja.[ppl-ai-file-upload.s3.amazonaws]

PR #8 – Most między monorepo a MVP Frontend
Ten PR ustanawia techniczną ścieżkę integracji między obecnym monorepo SILENCE (core, validator, language) a projektem Next.js silence-objects, bez łamania RULE‑DOM‑001.[ppl-ai-file-upload.s3.amazonaws]
Zakres:
Dodanie pakietu @silence/sdk (jeśli jeszcze nie istnieje) z czystymi, frontend-safe kontraktami: typy Object, Report, Phase, EffectLog, plus funkcje do budowy payloadów do LLM oraz walidacji z użyciem @silence/validator.[ppl-ai-file-upload.s3.amazonaws]
Dodanie prostego klienta API, który front może wywoływać: buildInterpretationRequest(object, profile) → ValidatedInterpretationRequest, zgodnego z APISPEC / POST /api/generate-report z karty referencyjnej.[ppl-ai-file-upload.s3.amazonaws]
Dlaczego teraz: front nie powinien wymyślać kontraktów ad hoc; PR #8 tworzy jedyną dopuszczalną bramkę między UI a logiką rdzenia i usuwa ryzyko dryfu schematu.[ppl-ai-file-upload.s3.amazonaws]

PR #9 – Scaffolding projektu Next.js (MVP Command Center)
Po ustaleniu SDK potrzebujesz czystego szkieletu aplikacji Next.js 15 silence-objects z routingiem pod 9‑ekranowy MVP.[ppl-ai-file-upload.s3.amazonaws]
Zakres:
Utworzenie projektu silence-objects według briefu: Next.js 15 (App Router), TypeScript, Tailwind, Radix UI, Zustand; dark mode, paleta Slate, JetBrains Mono jako font.[ppl-ai-file-upload.s3.amazonaws]
Struktura katalogów dokładnie jak w briefie: src/app/(routes)/page.tsx, onboarding/page.tsx, input/page.tsx, report/page.tsx, archive/page.tsx, settings/page.tsx, pro/page.tsx, globalny layout.tsx z SafetyHeader i nawigacją.[ppl-ai-file-upload.s3.amazonaws]
Uruchomienie podstawowego CI dla frontu: lint, typecheck, testy; zintegrowanie z istniejącą linią CI monorepo lub osobnym pipeline, ale z tą samą polityką „zero czerwonych bramek”.[ppl-ai-file-upload.s3.amazonaws]
Kryterium akceptacji: npm run dev działa, wszystkie trasy istnieją (puste ekrany), brak błędów w konsoli, frontowy CI jest zielony.[ppl-ai-file-upload.s3.amazonaws]

PR #10 – Foundation: Safety Header + Crisis Modal + SUPER‑PROMPT copy
Ten PR dostarcza TIER 1 SAFETY: SafetyHeader, CrisisModal, forbidden words, zgodnie z Command Center Brief i zasadami SUPER‑PROMPT.[ppl-ai-file-upload.s3.amazonaws]
Zakres:
Implementacja SafetyHeader zgodnie ze specyfikacją: sticky na każdej stronie, czerwony, monospace, bez możliwości wyłączenia, z jasnym komunikatem „system konstrukcyjny, nie terapia” oraz numerami 116 123 / 112, dostosowanymi do PL.[ppl-ai-file-upload.s3.amazonaws]
Implementacja CrisisModal z logiką blokującą: modal typu „hard block”, wyzwalany przez poziom Crisis z detektora (w tym etapie można użyć prostego słownika z @silence/language + helpera, zamiast legacy list).[ppl-ai-file-upload.s3.amazonaws]
Integracja z @silence/language i isForbiddenTerm dla tekstów UI; raport z testu, że wszystkie stringi frontowe przechodzą SUPER‑PROMPT compliance, bez słów z forbidden listy (np. „help”, „support”, „therapy”, „diagnosis”).[ppl-ai-file-upload.s3.amazonaws]
Kryterium akceptacji: SafetyHeader i CrisisModal są widoczne i funkcjonalne na wszystkich ekranach, testy E2E dla minimalnego flow z symulowanymi słowami kryzysowymi przechodzą.[ppl-ai-file-upload.s3.amazonaws]

PR #11 – Onboarding + RODO Consent + Consent Log
Teraz możesz wdrożyć Onboarding jako pierwszy krok ścieżki użytkownika, z pełnym loggingiem zgód zgodnie z TIER 1 SAFETY Rule 3 (RODO).[ppl-ai-file-upload.s3.amazonaws]
Zakres:
Ekran Onboarding z 5 selektorami profilu (length, density, language register, role, emotional work, neurotyp opcjonalnie) zgodnie z kartą referencyjną, oraz 2 wymagane checkboxy RODO (polityka prywatności, zgoda na przetwarzanie danych wrażliwych).[ppl-ai-file-upload.s3.amazonaws]
Menedżer zgód (consent-manager) w frontowym kodzie, który loguje zgody do lokalnego storage w formie JSON (czas, pola, wartości), zgodnie ze specyfikacją RODO (Article 17 i 20) w briefie; użyj walidatorów z @silence/validator do weryfikacji struktury logu zanim trafi do storage.[ppl-ai-file-upload.s3.amazonaws]
Po poprawnym Onboardingu, redirect do input oraz logika pomijania ekranu Onboarding, gdy profil i zgody są już zapisane.[ppl-ai-file-upload.s3.amazonaws]
Kryterium akceptacji: użytkownik nie może przejść do Input bez zaznaczenia obu zgód, a export JSON zgód (przygotowany już jako stub w Settings) zawiera poprawnie zwalidowane wpisy.[ppl-ai-file-upload.s3.amazonaws]

PR #12 – Input + Crisis Detection (bez LLM)
Ten PR ustawia ekran Input i deterministyczną logikę Crisis Detection, nadal bez integracji z Claude.[ppl-ai-file-upload.s3.amazonaws]
Zakres:
Ekran input/page.tsx z dużym textarea 50–5000 znaków, licznik znaków, opcjonalne metadane (kontekst, kiedy, intencja) zgodnie z Command Center Brief.[ppl-ai-file-upload.s3.amazonaws]
useCrisisDetection hook oparty o @silence/language + helper isForbiddenTerm i słownik kryzysowy zbriefowany w Command Center (50 polskich słów kluczowych) z progiem intensywności (Safe / Low / Moderate / High / Critical) i blokadą generowania raportu w poziomie Critical.[ppl-ai-file-upload.s3.amazonaws]
Integracja z CrisisModal: przy krytycznym poziomie, generacja raportu jest blokowana, modal jest wyświetlany, a użytkownik może jedynie wrócić do edycji tekstu lub zamknąć modal bez kontynuacji.[ppl-ai-file-upload.s3.amazonaws]
Kryterium akceptacji: testy jednostkowe i E2E pokazują, że bez słów kryzysowych raport może być generowany (stub), a z określoną liczbą słów kryzysowych generacja jest twardo blokowana.[ppl-ai-file-upload.s3.amazonaws]

PR #13 – Backend /api/interpret + integracja z @silence/sdk
Po ustabilizowaniu Onboarding i Input możesz podłączyć API z Claude 3.5 Sonnet, używając kontraktów z PR #8.[ppl-ai-file-upload.s3.amazonaws]
Zakres:
Endpoint POST /api/interpret w Next.js, który przyjmuje Object + profil, waliduje payload używając @silence/validator i typów z @silence/sdk, buduje prompt zgodnie z 4‑fazowym modelem (Context, Tension, Meaning, Function) i wywołuje Claude 3.5 Sonnet.[ppl-ai-file-upload.s3.amazonaws]
Parser odpowiedzi (response-parser) zgodny z apigenerate-report ze specyfikacji: czterofazowa struktura JSON, confidence score 0.0–1.0 na fazę, plus metadane (model, tokens, czas).[ppl-ai-file-upload.s3.amazonaws]
Integracja z mechanizmem safety: jeśli parser wykryje brak faz, błędny score albo forbidden patterns w odpowiedzi, zwraca błąd lub oznacza raport jako niebezpieczny, ale nigdy nie przepuszcza „gołego” tekstu Claude bez walidacji.[ppl-ai-file-upload.s3.amazonaws]
Kryterium akceptacji: testy API (happy path, błędne dane, błędny format odpowiedzi, forbidden patterns) przechodzą; limit czasu 10 s jest egzekwowany.[ppl-ai-file-upload.s3.amazonaws]

PR #14 – Report Display + Confidence + Alternative
Teraz możesz zapełnić ekran Report zgodnie z Command Center Brief.[ppl-ai-file-upload.s3.amazonaws]
Zakres:
Ekran report/page.tsx lub report/[id]/page.tsx wyświetlający 4 fazy jako rozwijane karty z tytułem, treścią, confidence badge (kolor czerwony/amber/zielony dla progów 0.6 i 0.8) oraz ConstructionDisclaimer na górze („AI konstruktor, nie lustro / nie diagnoza”).[ppl-ai-file-upload.s3.amazonaws]
Przycisk generowania alternatywy (AlternativeGeneration): 1 darmowa alternatywa w FREE, reszta spięta z przyszłym Paywallem (stub); backendowy endpoint /api/interpret/alternative może być aliasem do głównego endpointu z innym tagiem.[ppl-ai-file-upload.s3.amazonaws]
Automatyczne zapisywanie raportu do lokalnego archiwum po wygenerowaniu, używając walidowanej struktury z backendu i typów @silence/sdk.[ppl-ai-file-upload.s3.amazonaws]
Kryterium akceptacji: użytkownik po wejściu z Input widzi pełny raport w 4 fazach, widzi confidence, może wygenerować jedną alternatywę i zapis jest widoczny w archiwum.[ppl-ai-file-upload.s3.amazonaws]

PR #15 – Archive + Settings (RODO export/delete)
Po raporcie potrzebujesz pełnej obsługi archiwum i ustawień.[ppl-ai-file-upload.s3.amazonaws]
Zakres:
archive/page.tsx z listą raportów (ostatnie 5 dla FREE, pełna lista dla PRO w przyszłości), z wyszukiwaniem, filtrem dat oraz możliwością wejścia w szczegóły raportu i usunięcia pojedynczych pozycji.[ppl-ai-file-upload.s3.amazonaws]
settings/page.tsx z Editing profilu (re‑użycie OnboardingForm), logiem zmian profilu (historia ostatnich 5 zmian) oraz sekcją RODO Data Management: eksport JSON całej historii (profil + archiwum + logi zgód) oraz przycisk „Delete all data” z modalem potwierdzenia.[ppl-ai-file-upload.s3.amazonaws]
Walidacja wszystkich eksportowanych danych przez @silence/validator (np. validateEffectLogEntry) przed zapisaniem do pliku, tak aby nawet lokalny eksport był spójny z canonem.[ppl-ai-file-upload.s3.amazonaws]
Kryterium akceptacji: użytkownik może przeglądać historię, usuwać pojedyncze raporty, eksportować i usuwać wszystkie dane jednym kliknięciem; po usunięciu powrót do stanu fresh install.[ppl-ai-file-upload.s3.amazonaws]

PR #16 – Paywall UI (bez Stripe, FREE vs PRO)
Ten PR dostarcza pełną logikę Paywall UI i triggerów bez jeszcze podłączanych płatności (Stripe wejdzie w v1.1 / osobnym projekcie).[ppl-ai-file-upload.s3.amazonaws]
Zakres:
PaywallModal z 5 triggerami: druga alternatywa, 6‑ty raport w archiwum, Pattern View, Export PDF, Report Comparison, dokładnie jak w Command Center Brief.[ppl-ai-file-upload.s3.amazonaws]
pro/page.tsx jako landing PRO z tabelą FREE vs PRO, gdzie PRO „sprzedaje” wyłącznie większą widoczność w czasie (więcej obiektów, pattern view, porównania), nigdy „lepszą opiekę”; tekst ściśle zgodny z SUPER‑PROMPT.[ppl-ai-file-upload.s3.amazonaws]
Hook usePaywall zarządzający stanem tieru, licznikiem raportów i warunkami wyzwalania modala; stub tier PRO można wymuszać parametrem środowiskowym na czas developmentu.[ppl-ai-file-upload.s3.amazonaws]
Kryterium akceptacji: wszystkie 5 triggerów pokazuje modal z poprawnym copy, a ścieżka „kontynuuj bez PRO” pozwala kontynuować w trybie FREE zgodnie z tabelą cech.[ppl-ai-file-upload.s3.amazonaws]

PR #17 – QA, S11/SUPER‑PROMPT audit, E2E
Na koniec spinasz QA i audyty językowo‑semantyczne, żeby MVP nie rozjechał się z kanonem SILENCE.[ppl-ai-file-upload.s3.amazonaws]
Zakres:
Testy E2E (Cypress / Playwright) dla pełnej ścieżki: Onboarding → Input → Report → Archive → Settings → Paywall triggers, wraz z case’ami dla CrisisModal; wszystkie włączone do CI.[ppl-ai-file-upload.s3.amazonaws]
Zautomatyzowany check SUPER‑PROMPT dla stringów UI (grep + testy) z forbidden listą z dokumentów MVP i Command Center; pipeline failuje, jeśli wykryje niedozwolone słowa.[ppl-ai-file-upload.s3.amazonaws]
Raport „Launch Readiness” zgodny z Success Criteria: zero P0, crisis detection 100% blokujące w testach, disclaimery na każdej stronie, zero forbidden words, pełny flow działa na stagingu/frontowym środowisku produkcyjnym.[ppl-ai-file-upload.s3.amazonaws]

Kolejność wykonania (PR‑y jako fazy MVP)
Mapowanie na fazy z Command Center Brief i MVP Tasks:
Faza 1 (Foundation): PR #8, #9, #10, #11.[ppl-ai-file-upload.s3.amazonaws]
Faza 2 (Core Journey): PR #12, #13, #14.[ppl-ai-file-upload.s3.amazonaws]
Faza 3 (Extensions): PR #15, #16.[ppl-ai-file-upload.s3.amazonaws]
Faza 4 (QA / Launch): PR #17 + ewentualne drobne fixy.[ppl-ai-file-upload.s3.amazonaws]
