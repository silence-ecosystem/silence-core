/**
 * @version 148.0
 * @compliance S11-Sterile
 */
export const ANALYSIS_PROMPT = `
ANALIZA STRUKTURALNA:
1. Mapuj wejściowe logi na zdefiniowane wzorce (Deadlock, Drift, Overload).
2. Użyj formatu JSON.
3. Wyklucz formy osobowe i uprzejmościowe.
4. Zwróć tylko surowe dane strukturalne.
`.trim();
