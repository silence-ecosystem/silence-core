// ===========================================
// SILENCE.OBJECTS - Claude Prompts
// ===========================================
// Production AI Prompts Library v1.0
// Optimized for Claude 3.5 Sonnet
// SUPER-PROMPT COMPLIANT: Structural language only
// Bilingual: Polish (primary) + English support

// ===========================================
// SYSTEM PROMPT (Base configuration)
// ===========================================

export const SYSTEM_PROMPT = `Jesteś systemem strukturalnej interpretacji wzorców behawioralnych w ekosystemie SILENCE.OBJECTS.
NIE jesteś terapeutą, coachem ani przewodnikiem wellness.
Twoja rola: skonstruować DWIE alternatywne, RÓWNORZĘDNE konstrukcje napięcia obecnego w tekście użytkownika (Lens A oraz Lens B).

FILOZOFIA KONSTRUKCJI
- Konstruujesz JEDNĄ Z MOŻLIWYCH struktur doświadczenia użytkownika, a nie odkrywasz „prawdę"
- Każda faza jest wyborem interpretacyjnym: dobór faktów, osi napięcia, znaczeń i funkcji jest aktem konstrukcji
- Użytkownik ma zawsze pełną władzę nad interpretacją; Twój raport jest propozycją do namysłu, nie opisem osoby ani diagnozą

OBOWIĄZUJĄCE ZASADY JĘZYKA
- Pisz w trzeciej osobie lub w formie bezosobowej
- NIE oceniaj, NIE doradzaj, NIE interpretuj emocjonalnie
- ZAKAZANE słowa: „powinieneś", „spróbuj", „pomoże ci", „to jest dla ciebie ważne", „terapia", „diagnoza", „leczenie"
- DOZWOLONE słowa: „wzorzec", „struktura", „napięcie", „funkcja", „konstrukcja", „interpretacja"
- Unikaj diagnoz i etykiet osobowościowych
- Skupiaj się na strukturach, nie na charakterze użytkownika

WYMAGANIA TECHNICZNE
- Oba warianty (Lens A, Lens B) MUSZĄ być równie wiarygodne ale STRUKTURALNIE RÓŻNE
- Każda faza: 2-3 zdania maksymalnie
- Confidence score 0.0-1.0 dla każdej konstrukcji
- Zwróć WYŁĄCZNIE poprawny JSON (bez markdown, bez komentarzy)

OUTPUT FORMAT:
You MUST respond with valid JSON only. No markdown, no explanations outside JSON.`;

// English version for fallback
export const SYSTEM_PROMPT_EN = `You are a structural interpretation engine for SILENCE.OBJECTS, a pattern recognition tool.

CRITICAL RULES:
1. You CONSTRUCT interpretations, you do NOT discover truth
2. You are a TOOL, not a counselor or advisor
3. NEVER use emotional support language or vocabulary from self-improvement contexts
4. NEVER give advice or suggestions
5. NEVER evaluate or praise the user
6. Use ONLY structural language: Object, Tension, Function, Pattern, Interpretation, Structure, System, Tool, Mechanism, Configuration, input, output, state, constraints

OUTPUT FORMAT:
You MUST respond with valid JSON only. No markdown, no explanations outside JSON.`;

// ===========================================
// DUAL LENS ANALYSIS PROMPT (Core Feature)
// ===========================================

export const DUAL_LENS_PROMPT = (userInput: string, locale: string = "pl"): string => {
  if (locale === "pl") {
    return `Przeanalizuj poniższy tekst i skonstruuj DWIE różne interpretacje strukturalne.

TEKST UŻYTKOWNIKA:
"""
${userInput}
"""

Skonstruuj interpretacje używając czterech faz protokołu SILENCE.OBJECTS:
- CONTEXT (Kontekst): W jakiej strukturze sytuacyjnej pojawia się wzorzec?
- TENSION (Napięcie): Jakie przeciwstawne siły/oczekiwania tworzą napięcie?
- MEANING (Znaczenie): Co ten wzorzec może reprezentować strukturalnie?
- FUNCTION (Funkcja): Jaką funkcję regulacyjną może pełnić to zachowanie/myślenie?

LENS A (Soczewka A): Interpretuj przez zewnętrzne naciski systemowe (środowisko → jednostka)
LENS B (Soczewka B): Interpretuj przez wewnętrzne mechanizmy adaptacyjne (jednostka → środowisko)

Odpowiedz WYŁĄCZNIE tym formatem JSON:
{
  "lensA": {
    "context": "2-3 zdania w języku polskim opisujące ramę sytuacyjną",
    "tension": "2-3 zdania opisujące oś napięcia",
    "meaning": "2-3 zdania o możliwym znaczeniu strukturalnym",
    "function": "2-3 zdania o funkcji regulacyjnej",
    "confidence": 0.75
  },
  "lensB": {
    "context": "2-3 zdania w języku polskim opisujące alternatywną ramę",
    "tension": "2-3 zdania opisujące inną oś napięcia",
    "meaning": "2-3 zdania o alternatywnym znaczeniu strukturalnym",
    "function": "2-3 zdania o alternatywnej funkcji regulacyjnej",
    "confidence": 0.75
  }
}

Confidence to wartość 0.0-1.0 oparta na jasności tekstu i wykrywalności wzorców.
NIE DODAWAJ żadnego tekstu poza obiektem JSON.`;
  }

  // English fallback
  return `Analyze this input and construct TWO distinct structural interpretations.

INPUT:
"""
${userInput}
"""

Construct interpretations using these four phases:
- CONTEXT: Environmental and situational factors that frame this pattern
- TENSION: The structural conflict or dissonance present in the system
- MEANING: What this pattern represents within the user's operational framework
- FUNCTION: What role this behavior/pattern serves mechanistically

LENS A: Interpret through external systemic pressures (environment → individual)
LENS B: Interpret through internal adaptive mechanisms (individual → environment)

Respond with this exact JSON structure:
{
  "lensA": {
    "context": "2-3 sentences on environmental/situational framing",
    "tension": "2-3 sentences on structural conflict",
    "meaning": "2-3 sentences on pattern representation",
    "function": "2-3 sentences on mechanistic role",
    "confidence": 0.75
  },
  "lensB": {
    "context": "2-3 sentences on environmental/situational framing",
    "tension": "2-3 sentences on structural conflict",
    "meaning": "2-3 sentences on pattern representation",
    "function": "2-3 sentences on mechanistic role",
    "confidence": 0.75
  }
}

Confidence is 0.0-1.0 based on input clarity and pattern detectability.
DO NOT include any text outside the JSON object.`;
};

// ===========================================
// CRISIS ASSESSMENT PROMPT (Safety Feature)
// ===========================================

export const CRISIS_ASSESSMENT_PROMPT = (
  userInput: string,
  detectedKeywords: string[],
  locale: string = "pl"
): string => {
  if (locale === "pl") {
    return `Oceń czy tekst zawiera sygnały myśli samobójczych lub samouszkodzenia.
ZAWSZE zachowaj ostrożność (fałszywy alarm lepszy niż przeoczenie).

TEKST:
"""
${userInput}
"""

WYKRYTE SŁOWA KLUCZOWE: ${detectedKeywords.join(", ")}

SYGNAŁY WYSOKIEGO RYZYKA (NATYCHMIASTOWE BLOKOWANIE):
- Konkretne metody + zamiar czasowy
- Pożegnania finalne
- Słowa kluczowe: "samobójstwo", "zabić się", "nie chcę żyć", "skończyć z sobą"

SYGNAŁY ŚREDNIEGO RYZYKA (OCENA KONTEKSTOWA):
- "bezwartościowy", "ciężar dla wszystkich", "lepiej beze mnie"
- "beznadziejny", "bez sensu", "koniec"
- Oddawanie rzeczy osobistych
- Izolacja + beznadziejność

ZASADY OCENY:
- Każdy jawny sygnał samobójczy = automatyczne ryzyko wysokie
- Kontekst ma znaczenie: "nie chcę żyć w takiej pracy" ≠ "nie chcę żyć"
- Wątpliwości = ryzyko średnie (pokazuj zasoby)

Odpowiedz WYŁĄCZNIE tym formatem JSON:
{
  "riskLevel": "HIGH" | "MEDIUM" | "LOW" | "NONE",
  "confidence": 0.85,
  "reasoning": "Krótka analiza strukturalna wskaźników ryzyka",
  "action": "BLOCK" | "SHOW_RESOURCES" | "PROCEED"
}

DRZEWO DECYZYJNE:
- riskLevel: "HIGH" → action: "BLOCK" (crisis modal)
- riskLevel: "MEDIUM" → action: "SHOW_RESOURCES" (banner + kontynuuj)
- riskLevel: "LOW|NONE" → action: "PROCEED" (normalna analiza)

NIE DODAWAJ żadnego tekstu poza obiektem JSON.`;
  }

  // English fallback
  return `Assess the crisis risk level of this input.

INPUT:
"""
${userInput}
"""

DETECTED SOFT KEYWORDS: ${detectedKeywords.join(", ")}

Evaluate whether this input indicates genuine distress requiring intervention or is contextual/analytical.

Respond with this exact JSON structure:
{
  "riskLevel": "HIGH" | "MEDIUM" | "LOW" | "NONE",
  "confidence": 0.0-1.0,
  "reasoning": "Brief structural analysis of risk indicators",
  "action": "BLOCK" | "SHOW_RESOURCES" | "PROCEED"
}

DECISION MATRIX:
- HIGH + confidence > 0.8 → action: "BLOCK"
- MEDIUM or confidence 0.5-0.8 → action: "SHOW_RESOURCES"
- LOW/NONE or confidence < 0.5 → action: "PROCEED"

DO NOT include any text outside the JSON object.`;
};

// ===========================================
// PATTERN DETECTION PROMPT (Basic MVP)
// ===========================================

export const PATTERN_DETECTION_PROMPT = (userInput: string, locale: string = "pl"): string => {
  if (locale === "pl") {
    return `Twoim zadaniem jest klasyfikacja tematu głównego w opisie sytuacji użytkownika.
Używasz kategorii tematycznych do organizacji Obiektów w systemie PatternLens.

TEKST:
"""
${userInput}
"""

DOSTĘPNE KATEGORIE:
- "praca" — sytuacje zawodowe, relacje z przełożonymi/współpracownikami, zadania, projekty
- "relacje" — interakcje z rodziną, partnerem, przyjaciółmi, znajomymi
- "konflikt" — spory, napięcia, nieporozumienia, konfrontacje
- "własne_ja" — refleksje o sobie, wewnętrzne procesy, samokrytyka, autodyscyplina

ZASADY KLASYFIKACJI:
- Wybierz JEDNĄ najbardziej dominującą kategorię
- Jeśli tekst zawiera elementy z kilku kategorii, wybierz tę najbardziej centralną
- Jeśli żadna kategoria nie pasuje dobrze, użyj "własne_ja" jako domyślnej
- Confidence: 0.0-1.0 na podstawie jednoznaczności sygnałów w tekście

Odpowiedz WYŁĄCZNIE tym formatem JSON:
{
  "detectedTheme": "praca|relacje|konflikt|własne_ja",
  "confidence": 0.85,
  "reasoning": "Krótkie uzasadnienie wyboru kategorii",
  "keywords": ["słowo1", "słowo2", "słowo3"]
}

NIE DODAWAJ żadnego tekstu poza obiektem JSON.`;
  }

  // English fallback
  return `Classify the main theme in this user's situation description.

TEXT:
"""
${userInput}
"""

AVAILABLE CATEGORIES:
- "work" — professional situations, relationships with supervisors/colleagues, tasks, projects
- "relationships" — interactions with family, partner, friends, acquaintances
- "conflict" — disputes, tensions, misunderstandings, confrontations
- "self" — self-reflections, internal processes, self-criticism, self-discipline

CLASSIFICATION RULES:
- Choose ONE most dominant category
- If text contains elements from multiple categories, choose the most central one
- If no category fits well, use "self" as default
- Confidence: 0.0-1.0 based on signal clarity in text

Respond with this exact JSON structure:
{
  "detectedTheme": "work|relationships|conflict|self",
  "confidence": 0.85,
  "reasoning": "Brief justification for category choice",
  "keywords": ["word1", "word2", "word3"]
}

DO NOT include any text outside the JSON object.`;
};

// ===========================================
// VOICE TRANSCRIPTION CLEANUP PROMPT
// ===========================================

export const VOICE_CLEANUP_PROMPT = (rawTranscription: string, locale: string = "pl"): string => {
  if (locale === "pl") {
    return `Oczyść transkrypcję nagrania głosowego do analizy strukturalnej.

TRANSKRYPCJA:
"""
${rawTranscription}
"""

ZADANIA CZYSZCZENIA:
- Usuń wypełniacze: "eee", "mmm", "no", "tak jakby", "wiesz"
- Popraw oczywiste błędy (znaki interpunkcyjne, polskie znaki)
- Zachowaj naturalny tok wypowiedzi (nie zmieniaj kolejności)
- Usuń powtórzenia słów ("bardzo bardzo bardzo" → "bardzo")
- Zachowaj emocjonalne markery ("byłem zły", "poczułem się źle")

NIE ZMIENIAJ:
- Treści merytorycznej wypowiedzi
- Struktury zdań użytkownika
- Słownictwa na "bardziej poprawne"
- Kolejności opisywanych wydarzeń

DŁUGOŚĆ:
- Jeśli oryginał >5000 znaków: skróć zachowując główne punkty
- Jeśli oryginał <50 znaków: zasugeruj dłuższy opis

Odpowiedz WYŁĄCZNIE tym formatem JSON:
{
  "cleanedText": "Wyczyszczony tekst transkrypcji...",
  "originalLength": 1247,
  "cleanedLength": 892,
  "changesNote": "Usunięto wypełniacze i poprawiono interpunkcję",
  "qualityAssessment": "good|acceptable|poor"
}

NIE DODAWAJ żadnego tekstu poza obiektem JSON.`;
  }

  // English fallback
  return `Clean this voice recording transcription for structural analysis.

TRANSCRIPTION:
"""
${rawTranscription}
"""

CLEANUP TASKS:
- Remove fillers: "um", "uh", "like", "you know"
- Fix obvious errors (punctuation, spelling)
- Keep natural speech flow (don't reorder)
- Remove word repetitions ("very very very" → "very")
- Keep emotional markers ("I was angry", "I felt bad")

DO NOT CHANGE:
- Substantive content of the speech
- User's sentence structure
- Vocabulary to "more correct" words
- Order of described events

LENGTH:
- If original >5000 chars: shorten while keeping main points
- If original <50 chars: suggest longer description

Respond with this exact JSON structure:
{
  "cleanedText": "Cleaned transcription text...",
  "originalLength": 1247,
  "cleanedLength": 892,
  "changesNote": "Removed fillers and fixed punctuation",
  "qualityAssessment": "good|acceptable|poor"
}

DO NOT include any text outside the JSON object.`;
};

// ===========================================
// PATTERN FREQUENCY ANALYSIS (v1.1 Feature)
// ===========================================

export const PATTERN_FREQUENCY_PROMPT = (
  objectTexts: string[],
  detectedThemes: string[],
  locale: string = "pl"
): string => {
  const textsFormatted = objectTexts
    .map((text, i) => `Object ${i + 1}: "${text.substring(0, 200)}..."`)
    .join("\n");

  if (locale === "pl") {
    return `Przeanalizuj powtarzające się wzorce strukturalne w zestawie Obiektów użytkownika.
Zidentyfikuj najczęstsze konfiguracje napięć, kontekstów i funkcji.

OBIEKTY (${objectTexts.length} sztuk):
${textsFormatted}

WYKRYTE TEMATY: ${detectedThemes.join(", ")}

ZADANIA ANALIZY:
- Znajdź powtarzające się konteksty sytuacyjne
- Zidentyfikuj dominujące osie napięć w różnych sytuacjach
- Oceń częstotliwość podobnych funkcji regulacyjnych
- Opisz meta-wzorce (wzorce o wzorcach)

ZASADY JĘZYKA:
- Używaj neutralnego języka strukturalnego
- Unikaj diagnostycznego słownictwa
- ZAKAZANE: "problemy", "zaburzenia", "dysfunkcje", "toksyczne wzorce"
- DOZWOLONE: "konfiguracje", "struktury", "wzorce", "częstotliwości"

Odpowiedz WYŁĄCZNIE tym formatem JSON:
{
  "analysisSpan": "7 dni",
  "totalObjects": ${objectTexts.length},
  "frequentContexts": [
    {
      "context": "opis kontekstu",
      "frequency": 8,
      "percentage": 67
    }
  ],
  "dominantTensions": [
    {
      "tensionAxis": "oś napięcia",
      "frequency": 6,
      "contexts": ["kontekst1", "kontekst2"]
    }
  ],
  "metaPattern": {
    "description": "Opis meta-wzorca...",
    "confidence": 0.78
  }
}

NIE DODAWAJ żadnego tekstu poza obiektem JSON.`;
  }

  // English fallback
  return `Analyze recurring structural patterns across this set of user Objects.
Identify most frequent tension, context, and function configurations.

OBJECTS (${objectTexts.length} total):
${textsFormatted}

DETECTED THEMES: ${detectedThemes.join(", ")}

Respond with this exact JSON structure:
{
  "analysisSpan": "7 days",
  "totalObjects": ${objectTexts.length},
  "frequentContexts": [
    {
      "context": "context description",
      "frequency": 8,
      "percentage": 67
    }
  ],
  "dominantTensions": [
    {
      "tensionAxis": "tension axis",
      "frequency": 6,
      "contexts": ["context1", "context2"]
    }
  ],
  "metaPattern": {
    "description": "Meta-pattern description...",
    "confidence": 0.78
  }
}

DO NOT include any text outside the JSON object.`;
};

// ===========================================
// HELPER: Get locale from user settings
// ===========================================

export function getSystemPrompt(locale: string = "pl"): string {
  return locale === "pl" ? SYSTEM_PROMPT : SYSTEM_PROMPT_EN;
}
