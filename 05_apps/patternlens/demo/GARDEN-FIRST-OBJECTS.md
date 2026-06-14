[PATH]: 05_apps/patternlens/demo/GARDEN-FIRST-OBJECTS.md

---

title: GARDEN FIRST OBJECTS — DEMO SET
status: DRAFT
created: 2026-06-14
updated: 2026-06-14
author: Perplexity
classification: INTERNAL
sentinel: S11_ENFORCED
pcs: 0.997

---

# Cel

Ten zestaw pokazuje pierwsze obiekty Garden w formie demonstracyjnej, zgodnej z kartą Kimi oraz z semantyką S11. Obiekty nie diagnozują użytkownika. Rejestrują wyłącznie strukturę wpisu i mapują ją do 4-fazowego raportu.

# Object Schema v0

```json
{
  "objectId": "obj_001",
  "title": "Late Loop Capture",
  "input": "Od kilku dni wieczorem wracam do tej samej myśli o zadaniu, którego nie domknąłem.",
  "pattern": "Repeated evening return to unresolved task",
  "tension": "Open loop gains dominance in low-noise window",
  "function": "Keeps unresolved item in active foreground",
  "cost": "Attention lock on one unfinished branch",
  "report": {
    "kontekst": {
      "text": "Wpis wskazuje na powracający wzorzec związany z niedomkniętym zadaniem.",
      "confidence": 0.88
    },
    "napiecie": {
      "text": "Napięcie pojawia się, gdy otwarta pętla utrzymuje wysoką widoczność jednego wątku.",
      "confidence": 0.84
    },
    "znaczenie": {
      "text": "Wzorzec sugeruje, że system nadaje temu elementowi wysoki priorytet operacyjny.",
      "confidence": 0.79
    },
    "funkcja": {
      "text": "Funkcją wzorca może być utrzymanie niedomkniętego elementu w polu decyzji.",
      "confidence": 0.82
    }
  },
  "freeAlternative": "Zapisz jedno zdanie zamknięcia dla tego wątku i wróć do obserwacji jutro.",
  "constructionDisclaimer": "This output is a structural construction, not a diagnosis or directive."
}
```

# Demo Objects

## 1. Late Loop Capture

**Input:** „Od kilku dni wieczorem wracam do tej samej myśli o zadaniu, którego nie domknąłem.”

**Kontekst:** Wpis pokazuje powtarzalny powrót do jednego niedomkniętego wątku w oknie wieczornym.
Confidence: 0.88

**Napięcie:** Otwarta pętla utrzymuje ten element wysoko w polu uwagi, mimo braku nowego bodźca.
Confidence: 0.84

**Znaczenie:** System traktuje ten wątek jako nierozliczony operacyjnie, dlatego wraca do niego seryjnie.
Confidence: 0.79

**Funkcja:** Funkcją może być utrzymanie gotowości do zamknięcia zadania, a nie jego utrata.
Confidence: 0.82

**Free Alternative:** Zapisz pojedynczą następną akcję dla tego wątku.

## 2. Split Context Drift

**Input:** „W pracy zaczynam jedną rzecz, po chwili otwieram drugą, a pod koniec nie pamiętam, która była pierwsza.”

**Kontekst:** Wpis wskazuje na rozszczepienie bieżącego pola pracy między kilka aktywnych gałęzi.
Confidence: 0.91

**Napięcie:** Napięcie rośnie, gdy przełączanie kontekstu odbywa się szybciej niż domykanie mikroetapów.
Confidence: 0.86

**Znaczenie:** Wzorzec może wskazywać na przeciążenie kolejki wykonawczej, a nie na pojedynczy błąd.
Confidence: 0.80

**Funkcja:** Funkcją może być równoległe utrzymywanie kilku możliwości wykonania w stanie aktywnym.
Confidence: 0.83

**Free Alternative:** Ogranicz następną sesję do jednego okna i jednego celu operacyjnego.

## 3. Social Replay Echo

**Input:** „Po spotkaniu długo odtwarzam w głowie jedno zdanie i zastanawiam się, po co to powiedziałem.”

**Kontekst:** Wpis dotyczy pojedynczego elementu interakcji, który utrzymał wysoką widoczność po zakończeniu zdarzenia.
Confidence: 0.87

**Napięcie:** Napięcie bierze się z ponownego odtwarzania jednego fragmentu bez dodania nowej informacji.
Confidence: 0.83

**Znaczenie:** Wzorzec może pełnić funkcję wtórnej walidacji sygnału społecznego.
Confidence: 0.76

**Funkcja:** Funkcją może być ponowna analiza kosztu komunikacyjnego jednego komunikatu.
Confidence: 0.81

**Free Alternative:** Oznacz ten fragment jako zakończony zapisując jedno neutralne podsumowanie.

## 4. Morning Threshold Friction

**Input:** „Rano wiem, co mam zrobić, ale przez długi czas nie mogę wejść w pierwszy ruch.”

**Kontekst:** Wpis opisuje rozjazd między jasnością celu a uruchomieniem pierwszego kroku.
Confidence: 0.90

**Napięcie:** Napięcie koncentruje się na progu wejścia, nie na całym zadaniu.
Confidence: 0.85

**Znaczenie:** Wzorzec sugeruje, że największy koszt znajduje się w aktywacji sekwencji startowej.
Confidence: 0.82

**Funkcja:** Funkcją może być odwlekanie wejścia do momentu uzyskania wyższego poziomu pewności operacyjnej.
Confidence: 0.80

**Free Alternative:** Zdefiniuj ruch startowy trwający mniej niż 2 minuty.

## 5. Quiet Window Compression

**Input:** „Dopiero późnym wieczorem czuję, że mogę zebrać myśli, ale wtedy zaczynam nadrabiać wszystko naraz.”

**Kontekst:** Wpis wskazuje, że okno niskiego szumu pojawia się późno i prowadzi do kompresji wielu zadań.
Confidence: 0.89

**Napięcie:** Napięcie wynika z kumulacji zaległych gałęzi w jednym wąskim oknie dostępności.
Confidence: 0.87

**Znaczenie:** Wzorzec pokazuje, że system preferuje późne okna porządkowania, ale płaci za to gęstością wejścia.
Confidence: 0.81

**Funkcja:** Funkcją może być wykorzystanie jedynego stabilnego okna do szybkiej rekonstrukcji porządku.
Confidence: 0.84

**Free Alternative:** Wybierz tylko jeden wątek do domknięcia w tym oknie.

# Operator Notes

- Wszystkie obiekty są deskryptywne i strukturalne.
- Nie użyto języka diagnostycznego.
- Każdy obiekt zachowuje 4-fazowy raport i confidence.
- Obiekty nadają się jako seed content do demo Garden / Archive / Dashboard.
