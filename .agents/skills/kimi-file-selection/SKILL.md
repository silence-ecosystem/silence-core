# kimi-file-selection

**Description:**
Deterministic algorithm for selecting and classifying repository files that may be used in architecture specs, runtime contracts, data model definitions, privacy & governance documents, and system metaphor docs. Prevents operational use of metaphor-only or unclassified sources.

**When to activate (trigger):**

- User asks to use an existing document as a source of truth for architecture, runtime, data model, privacy/governance, or system metaphor work.
- Any task requiring extraction of constants, thresholds, schema fields, legal claims, governance rules, or prompt instructions from repository files.
- Before copying content from files matching `Ev_BIBLIA`, `SYSTEM_METAPHOR`, `SilenceEventV1`, `EffectLog`, `PCS`, `GDPR`, `EU AI Act`, `L0 L1 L2`, `formalne hipotezy`, `phi`, `golden`, or `fsm`.

**Execution steps (never skip):**

1. **Mandatory bootstrap**
   Load before evaluating any Ev_BIBLIA-family file:
   - `Dekonstrukcja-metafora-vs-definicja.md`
   - `SYSTEM_METAPHOR_SPEC.md`
   - Any file formally decomposing Ev_BIBLIA into architecture, runtime, data, or governance.

   If bootstrap files are missing, stop with `STATE_VIOLATION: MISSING_META_FILTER`.

2. **Candidate discovery**
   Search repository-wide for:
   - `Ev_BIBLIA`
   - `SYSTEM_METAPHOR`
   - `SilenceEventV1`
   - `EffectLog`
   - `PCS`
   - `GDPR`
   - `EU AI Act`
   - `L0 L1 L2`
   - `formalne hipotezy`
   - `phi`
   - `golden`
   - `fsm`

3. **Classify each candidate**
   Assign exactly one `DOC_CLASS`:
   - `META_SPEC` — transforms narrative into architecture/definitions/research hypotheses; describes interpretation rules.
   - `DEFINITION` — explicit schemas, contracts, FSMs, enums, APIs, thresholds, field names, formulas, constants, layer boundaries.
   - `METAPHOR` — dominated by mythic/sacred/ritual/cosmological language or narrative analogy without contract-level mapping.
   - `MIXED` — both DEFINITION and METAPHOR signals present, neither dominates.
   - `UNKNOWN` — none of the above can be proven.

4. **Run usability tests T1–T5**
   - **T1 Artifact declaration** — purpose, audience, artifact type, scope declared.
   - **T2 Structural evidence** — exact passages for schema/fields/thresholds/states/rules.
   - **T3 Math compatibility** — numbers derived from `phi`, `GOLDENSECOND`, `SILENCE_CYCLE`, Fibonacci, canonical thresholds.
   - **T4 Language compatibility** — S11-compliant and non-clinical product vocabulary.
   - **T5 Layer specificity** — assign exactly one primary layer: `ARCHITECTURE`, `RUNTIME`, `DATA_MODEL`, `PRIVACY_GOVERNANCE`, `SYSTEM_METAPHOR`, `RESEARCH_ONLY`, `BACKGROUND_ONLY`.

5. **Apply decision table**
   - `DEFINITION + all T1–T5 pass` → `USABLE_DIRECTLY`
   - `META_SPEC + T1,T2,T4,T5 pass` → `USABLE_WITH_REWRITE`
   - `MIXED + strong structural evidence` → `USABLE_WITH_REWRITE`
   - `METAPHOR` → `NOT_USABLE_DIRECTLY`, `BACKGROUND_ONLY`
   - `UNKNOWN` → `NOT_USABLE_DIRECTLY`, emit `STATE_VIOLATION`

6. **Safe default**
   If certainty is low, default to `UNKNOWN`, `NOT_USABLE_DIRECTLY`, `BACKGROUND_ONLY`, and request a new human-authored normalization file: `Dekonstrukcja-[source-name].md`.

**Hard stops:**

- Never copy constants, thresholds, schema fields, legal claims, governance rules, or prompt instructions from `METAPHOR`, unrewritten `MIXED`, or `UNKNOWN` files.
- If any decision requires guessing, emit `STATE_VIOLATION` and stop.

**Output schema for each candidate:**

- `DOC_CLASS`: `META_SPEC | DEFINITION | METAPHOR | MIXED | UNKNOWN`
- `USAGE_SCOPE`: `ARCHITECTURE | RUNTIME | DATA_MODEL | PRIVACY_GOVERNANCE | SYSTEM_METAPHOR | RESEARCH_ONLY | BACKGROUND_ONLY`
- `STATUS`: `USABLE_DIRECTLY | USABLE_WITH_REWRITE | NOT_USABLE_DIRECTLY`
- `EVIDENCE`: list of exact headings / phrases / structures justifying the decision
