# Kontrakt Tokenów @silence/phi-tokens

**[PATH]: docs/contracts/phi-tokens-contract.md**

STATUS: CANONICAL | DATA: 2026-06-11 | PCS: 0.998

---

## Rola pakietu

`@silence/phi-tokens` jest jedynym źródłem prawdy (SSoT) dla wszystkich wartości
wizualnych w ekosystemie SILENCE. Żaden parametr wizualny nie może być zdefiniowany
poza tym pakietem.

Format tokenów: DTCG (Design Token Community Group).

---

## Domeny tokenów

### 1. neutrals.soft_noir.*

Gama bazowa obowiązująca we wszystkich motywach.

```json
{
  "neutrals": {
    "soft_noir": {
      "tier0": { "value": "#1F1E1D", "comment": "L≈12% Background/Abyss" },
      "tier1": { "value": "#252321", "comment": "L≈15.3% Sunken/Secondary BG" },
      "tier2": { "value": "#2D2B28", "comment": "L≈19.4% Card/Surface" },
      "tier3": { "value": "#363330", "comment": "L≈24.7% Raised/Modal" },
      "tier4": { "value": "#433F3B", "comment": "L≈30-32% Highlight/Active" },
      "text_primary":   { "value": "#E8E4DF", "comment": "off-white, kontrast ~14.2:1 vs tier0" },
      "text_secondary": { "value": "#B5B0A8", "comment": "muted, min 4.5:1 dla treści decyzyjnych" },
      "text_muted":     { "value": "#7A7670", "comment": "tylko treści niedecyzyjne" }
    }
  }
}
```

### 2. theme.ember_silence.*

```json
{
  "theme": {
    "ember_silence": {
      "bg":           { "value": "#20241C" },
      "accent":       { "value": "#D8A45A", "comment": "ember glow" },
      "border":       { "value": "#2E3228" },
      "focus_ring":   { "value": "#D8A45A" },
      "audio_profile": { "value": "brown_noise_60_120hz" },
      "haptic_profile": { "value": "single_30_40ms" }
    }
  }
}
```

### 3. theme.graphite_drift.*

```json
{
  "theme": {
    "graphite_drift": {
      "bg":            { "value": "#0E1116" },
      "accent":        { "value": "#6E7A8C", "comment": "muted steel" },
      "accent_alt":    { "value": "#6B8F96", "comment": "marine teal" },
      "border":        { "value": "#1A1E24" },
      "focus_ring":    { "value": "#6E7A8C" },
      "audio_profile": { "value": "pink_noise_panning" },
      "haptic_profile": { "value": "double_wave_impulse" }
    }
  }
}
```

### 4. theme.midnight_paper.*

```json
{
  "theme": {
    "midnight_paper": {
      "bg":            { "value": "#111218" },
      "accent":        { "value": "#C49A6A", "comment": "sepia" },
      "border":        { "value": "#1A1B21" },
      "focus_ring":    { "value": "#C49A6A" },
      "audio_profile": { "value": "room_tone_tape_noise" },
      "haptic_profile": { "value": "long_60ms_decay" }
    }
  }
}
```

### 5. theme.ion_haze.*

```json
{
  "theme": {
    "ion_haze": {
      "bg":            { "value": "#0E1318" },
      "accent":        { "value": "#8EC0C7", "comment": "ionic blue" },
      "border":        { "value": "#181E23" },
      "focus_ring":    { "value": "#8EC0C7" },
      "audio_profile": { "value": "air_hum" },
      "haptic_profile": { "value": "cascade_phi_618_381_237ms" }
    }
  }
}
```

### 6. dur.* — Tokeny czasu

```json
{
  "dur": {
    "instant":  { "value": "0ms",    "comment": "twarda zmiana stanu" },
    "micro":    { "value": "200ms",  "comment": "GS × φ⁻⁴ ≈ 145ms, zaokrąglone" },
    "quick":    { "value": "400ms",  "comment": "GS × φ⁻³ ≈ 236ms, zaokrąglone" },
    "ease":     { "value": "618ms",  "comment": "GS × φ⁻¹" },
    "golden":   { "value": "1618ms", "comment": "Golden Second" },
    "breathe":  { "value": "2618ms", "comment": "GS × φ" },
    "ceremony": { "value": "4236ms", "comment": "GS × φ²" }
  }
}
```

### 7. space.* — Spacing Fibonacci

```json
{
  "space": {
    "fib3":  { "value": "3px",  "comment": "F(4)" },
    "fib5":  { "value": "5px",  "comment": "F(5)" },
    "fib8":  { "value": "8px",  "comment": "F(6)" },
    "fib13": { "value": "13px", "comment": "F(7)" },
    "fib21": { "value": "21px", "comment": "F(8)" },
    "fib34": { "value": "34px", "comment": "F(9)" },
    "fib55": { "value": "55px", "comment": "F(10)" }
  }
}
```

### 8. breath.* — Profile oddechowe

```json
{
  "breath": {
    "flow": {
      "entry_ms":     { "value": "618ms" },
      "deepening_ms": { "value": "618ms" },
      "silence_ms":   { "value": "618ms" },
      "return_ms":    { "value": "382ms" }
    },
    "focus": {
      "entry_ms":     { "value": "618ms" },
      "deepening_ms": { "value": "618ms" },
      "silence_ms":   { "value": "618ms" },
      "return_ms":    { "value": "382ms" }
    },
    "calm": {
      "entry_ms":     { "value": "1618ms" },
      "deepening_ms": { "value": "1000ms" },
      "silence_ms":   { "value": "2618ms" },
      "return_ms":    { "value": "618ms" }
    }
  }
}
```

---

## Reguły kontraktu

1. Każda wartość wizualna w kodzie musi być referencją do tokena.
2. Dodanie tokena wymaga: wyprowadzenia matematycznego + zapisu + audytu PCS.
3. Usunięcie tokena wymaga: ADR + migracji wszystkich referencji + audytu.
4. Zmiana wartości tokena wymaga: udokumentowania nowego wyprowadzenia matematycznego.
5. Tokeny nie mogą być nadpisywane lokalnym CSS bez ADR.
6. Wartości hexów w tokenach są informacyjne — implementacja korzysta z nazw.

