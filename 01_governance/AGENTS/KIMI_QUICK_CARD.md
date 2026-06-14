[PATH]: 01_governance/AGENTS/KIMI_QUICK_CARD.md

---

# Kimi Quick Card (MVP SILENCE.OBJECTS)

## 1. Misja

Twoim jedynym celem jest dowiezienie frontowego MVP SILENCE.OBJECTS dokładnie wg:
-W skład **MVP SILENCE.OBJECTS** wchodzi ściśle zdefiniowany zakres produktu, technologii, flow użytkownika, warstw safety, monetyzacji i kryteriów ukończenia — bez dokładania nowych feature’ów, bez rozszerzania zakresu i bez zmiany copy.

## Zakres produktu

Rdzeniem MVP jest frontowe **SILENCE.OBJECTS** oparte o trzy dokumenty źródłowe: Command Center Brief, Detailed Task Breakdown oraz One-Page Reference Card, a reguła nadrzędna mówi wprost, że nie wolno projektować nowego produktu ani wychodzić poza ten zakres. Sam brief obejmuje referencyjnie **9 ekranów**, warstwę safety oraz warstwę paywall/monetyzacji, więc to są elementy obowiązkowe, a nie opcjonalne.

## Stack i architektura

Warstwa frontowa MVP ma być zrobiona w **Next.js 15 App Router + TypeScript + Tailwind + Zustand + Radix UI** oraz w ciemnym motywie typu Slate z JetBrains Mono. Warstwa danych po stronie przeglądarki jest ograniczona wyłącznie do `localStorage` dla profilu, raportów i zgód, bez cookies, IndexedDB i sessionStorage, a backend MVP ma działać przez Vercel Functions pod endpointem `/api/interpret` z integracją modelową i timeoutem 10 sekund.

## Obowiązkowy flow

MVP musi zawierać pełny przepływ użytkownika składający się z **Onboardingu, Inputu, Reportu, Archive i Settings**. Onboarding obejmuje profil z 5 selektorami, neurotyp oraz 2 blokujące zgody RODO; Input zawiera textarea 50–5000 znaków, metadane i detekcję kryzysową; Report ma zawsze 4 fazy — Kontekst, Napięcie, Znaczenie, Funkcja — każdą z confidence 0.0–1.0, ConstructionDisclaimer i 1 darmową alternatywą; Archive przechowuje ostatnie 5 raportów w FREE z wyszukiwaniem i usuwaniem; Settings obejmuje edycję profilu, historię zmian oraz export/delete all.

## Komponenty globalne

Poza głównym flow MVP musi zawierać także komponenty przekrojowe: **SafetyHeader, CrisisModal, Pro landing oraz PaywallModal z 5 triggerami**. To znaczy, że safety i monetyzacja nie są dodatkami „na później”, tylko częścią obowiązkowej definicji MVP już na poziomie pierwszego wdrożenia.

## Reguły copy i safety

W całym MVP obowiązuje zakaz języka diagnostycznego, poradniczego i interpretowania osoby; dozwolony jest wyłącznie język systemowy wokół takich pojęć jak **Object, Tension, Function, Pattern**. UI nie może zawierać słów z forbidden list, nie może obiecywać rezultatów ani używać framingu care/support, a każdy tekst musi przejść checklistę zgodności przed wejściem do kodu.

## Kolejność prac i DONE

Zakres wykonawczy MVP jest podzielony na 10 tasków wykonywanych w stałej kolejności: scaffolding, safety header i modal, onboarding i log zgód, input z crisis detection, integracja API, report display, archive, settings, monetization UI oraz QA/deploy. MVP można uznać za ukończone dopiero wtedy, gdy nie ma P0 bugów, crisis detection blokuje generację w 100% przypadków testowych, cały flow działa produkcyjnie, zgody są logowane i eksportowalne, wszystkie teksty są SUPERPROMPT compliant, a grep forbidden words nie zwraca żadnego naruszenia.

---

## 2. Absolutne reguły

- Brak języka diagnostycznego, porad, interpretacji osoby (tylko struktury doświadczenia).

- Raport zawsze ma 4 fazy: Kontekst, Napięcie, Znaczenie, Funkcja, każda z confidence 0.0–1.0.
- UI nie może zawierać słów z forbidden list (avoid, struggle, needs, trauma, trigger, diagnosis itd.).

Jeśli nie jesteś pewna, czy tekst lub feature jest dozwolony – NIE wdrażasz go.

---

## 3. Architektura i stack

-Frontend: Next.js 15 (App Router), TypeScript, Tailwind, Zustand, Radix UI oraz warstwa Soft‑Noir oparta o kanoniczny kontrakt tokenów silence-phi-tokens; UI konsumuje tokeny kolorów, czasu, motion, spacingu, typografii i stanów bez lokalnych override’ów.

Styling: nie „ciemny motyw Slate + JetBrains Mono” jako luźna decyzja, tylko Soft‑Noir runtime z domenami theme.embersilence, theme.graphitedrift, theme.midnightpaper, theme.ionhaze, z typografią systemową wskazaną w briefie oraz zakazem literalnych wartości w komponentach.

Storage w MVP: tylko localStorage po stronie klienta dla profilu, raportów i zgód; zakazane są sessionStorage, document.cookie i IndexedDB.

Backend: Vercel Functions dla endpointu interpretacji, integracja z Claude 3.5 Sonnet, timeout 10 s, kontrakt JSON z 4 fazami i confidence score

---

## 4. Obowiązkowy przepływ użytkownika

Musisz zbudować i przetestować pełny flow:

1. Onboarding – profil (5 selektorów + neurotyp) + 2 zgody RODO, blokujące.
2. Input – textarea 50–5000 znaków + metadane + detekcja kryzysowa.
3. Report – 4 fazy + confidence + ConstructionDisclaimer + 1 darmowa alternatywa.

4. Archive – historia raportów (FREE: ostatnie 5), wyszukiwarka, usuwanie.

5. Settings – edycja profilu, historia zmian, RODO export/delete all.

Plus: SafetyHeader, CrisisModal, Pro landing, PaywallModal (5 triggerów).

---

## 5. Kolejność prac (nie zmieniasz)

Trzymasz się tej kolejności, chyba że Product Lead jawnie zmieni plan:

**Faza 1 – Foundation**

1. TASK 1 – Project scaffolding (Next.js app, routing 9 ekranów, Zustand, CI).

2. TASK 2 – SafetyHeader + CrisisModal (sticky, blokujący modal).

3. TASK 3 – Onboarding + RODO zgody + log zgód w localStorage.

**Faza 2 – Core Journey**

4. TASK 4 – Input + Crisis Detection (poziomy, blokada przy „Critical”).

5. TASK 5 – Claude API Integration (`/api/interpret`, timeout 10 s, obsługa błędów).

6. TASK 6 – Report Display (4 fazy, confidence, 1 alternatywa).

**Faza 3 – Extensions** 7. TASK 7 – Archive (lista, FREE limit 5, filtry). 8. TASK 8 – Settings (profil, historia, RODO export/delete). 9. TASK 9 – Monetization UI (PaywallModal 5 triggerów, Pro page).

**Faza 4 – QA / Deploy** 10. TASK 10 – QA, styling, deployment na Vercel (staging + prod, test checklist).

---

## 6. Safety i copy – jak pisać UI

Przed dodaniem jakiegokolwiek tekstu UI zawsze stosujesz SUPER‑PROMPT COPY RULES:

- Używasz tylko języka systemowego: Object, Tension, Function, Pattern.
- Zero obietnic rezultatów („poczujesz ulgę”, „to pomoże ci się zmienić”) i zero „care/support framing”.
- Zawsze podkreślasz sprawczość użytkownika („You control use of this tool”, „You decide”).
- Każdy tekst przechodzi checklistę 8 pytań z BRIEF; jeśli choć jedno jest „NIE”, tekst nie wchodzi do kodu.

---

## 7. Kryteria „DONE” dla MVP

Nie oznaczasz MVP jako „done”, dopóki wszystkie warunki nie są spełnione:

- Zero P0 bugów, crisis detection blokuje generację w 100% testów.
- RODO zgody są logowane i eksportowalne, disclaimer medyczny jest na każdej stronie.
- Wszystkie UI teksty są SUPER‑PROMPT compliant, brak forbidden words w grepie.
- Pełny flow Onboarding → Input → Report → Archive → Settings działa na produkcji (Vercel), a testy API + E2E przechodzą.
