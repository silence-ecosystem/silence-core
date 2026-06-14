[PATH]: 01_governance/AGENTS/KIMI_QUICK_CARD_RULES_PATCH.md

---

# Kimi Quick Card — Absolutne reguły

## Zakres normatywny

Ta sekcja ustanawia obowiązkowe reguły wykonawcze dla Kimi przy implementacji MVP SILENCE.OBJECTS. Źródłami prawdy są wyłącznie: `silence-mvp-reference.md.md`, `SILENCE-MVP-COMMAND-CENTER-BRIEF.md.md` oraz `SOFT_NOIR_TOKEN_CONTRACT.md`. [1][2][3]

Kimi nie interpretuje tych dokumentów swobodnie, nie rozszerza ich zakresu i nie wprowadza lokalnych wyjątków. W przypadku niejednoznaczności wdrożenie zostaje zatrzymane do czasu potwierdzenia zgodności z plikami źródłowymi. [2][1]

## Reguły treści i semantyki

Zabroniony jest język diagnostyczny, terapeutyczny, doradczy oraz język przypisujący trwałe cechy osobie. Dozwolona jest wyłącznie analiza struktury doświadczenia zgodna z sekcjami `ABSOLUTE RULES`, `CRITICAL CONSTRAINTS` oraz `SYSTEM PROMPT Compressed` w pliku `silence-mvp-reference.md.md`. [1]

Każdy raport musi być zbudowany z dokładnie czterech faz: `Kontekst`, `Napięcie`, `Znaczenie`, `Funkcja`. Każda faza musi zawierać treść zgodną z definicją faz oraz jawny `confidence score` w przedziale `0.0–1.0`. [1][2]

Treść raportu nie może interpretować osoby, stawiać rozpoznań ani sugerować zaleceń. Jeśli model jest niepewny, nie zmienia trybu języka na psychologiczny — oznacza niższą pewność i zachowuje język neutralny, techniczny oraz mechaniczny. [1]

## Forbidden language

UI, prompty, komunikaty błędów, odpowiedzi modelu i teksty marketingowe nie mogą zawierać słów ani konstrukcji z forbidden list. Kanoniczne źródła tej reguły to sekcja `FORBIDDEN WORDS GREP LIST` w `silence-mvp-reference.md.md` oraz sekcja `SUPER-PROMPT COPY RULES MANDATORY / Forbidden Words Delete All Instances` w `SILENCE-MVP-COMMAND-CENTER-BRIEF.md.md`. [1][2]

Zakaz obejmuje między innymi słowa i konstrukcje typu: `avoid`, `struggle`, `needs`, `should`, `trauma`, `trigger`, `diagnosis`, a także copy o charakterze care/support takim jak `help`, `support`, `heal`, `care`, `recovery`, `wellness`, `self-care`, `trust`, `you’re not alone`. Lista nie jest sugestią redakcyjną; jest bramką PASS/FAIL dla kodu i treści. [1][2]

Jeżeli dowolny tekst nie przechodzi tej reguły, nie może zostać zmergowany. Zamiast poprawiania „na wyczucie” należy wrócić do plików źródłowych i przepisać copy do trybu systemowego. [2][1]

## Reguły copy UI

Każdy tekst UI musi przejść checklistę zgodności z `SILENCE-MVP-COMMAND-CENTER-BRIEF.md.md`. Tekst jest dopuszczalny tylko wtedy, gdy używa języka systemowego (`Object`, `Tension`, `Function`, `Pattern`), nie obiecuje rezultatów, nie używa framingu opiekuńczego, zachowuje sprawczość użytkownika i stosuje jawne nazwy operacji. [2]

Jeżeli choć jedna odpowiedź w checklistcie „Compliance Checklist Before Any UI Launches” jest negatywna, tekst nie wchodzi do produktu. Ta reguła dotyczy także CTA, komunikatów paywalla, stanów pustych, błędów, modalów, onboarding copy i disclaimerów. [2]

## Reguły wizualne Soft-Noir

Warstwa wizualna MVP nie może być implementowana jako dowolny „ciemny motyw”. Obowiązuje kontrakt `SOFT_NOIR_TOKEN_CONTRACT.md`, który wymaga konsumpcji kanonicznych tokenów Soft‑Noir dla kolorów, czasu, motion, spacingu, typografii, stanów i accessibility. [3]

Komponent nie może zawierać literalnych hexów, magic numbers dla spacingu, czasu ani easingów. Dopuszczalne są wyłącznie tokeny z domen `neutrals.softnoir.*`, `theme.embersilence.*`, `theme.graphitedrift.*`, `theme.midnightpaper.*`, `theme.ionhaze.*`, domen czasu Golden Second oraz spacing oparty o kroki Fibonacci. [3]

Implementacja jest niezgodna, jeśli pomija `prefers-reduced-motion`, wprowadza lokalne nadpisania motywu lub używa wartości takich jak `#000000`, `#FFFFFF` albo innych literalnych parametrów poza kontraktem. [3]

## Reguła zatrzymania

Jeżeli Kimi nie jest pewna, czy tekst, komponent, token, flow lub feature są zgodne z regułami, nie wdraża ich. Zatrzymuje zmianę i wraca do trzech plików normatywnych: `silence-mvp-reference.md.md`, `SILENCE-MVP-COMMAND-CENTER-BRIEF.md.md`, `SOFT_NOIR_TOKEN_CONTRACT.md`. [1][2][3]

Brak pewności nie uprawnia do improwizacji. W tym systemie brak zgodności oznacza blokadę wdrożenia. [2][3]
