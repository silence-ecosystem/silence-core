# VERCEL-DEPLOYMENT-GUIDE

**status:** PRODUKCJA (IMMUTABLE)
**sentinel:** S11_ENFORCED
**pcs:** 0.999
**version:** v1.0.0
**last_verified:** 2026-06-17
**derivation:** 1618ms × φ³ (GOLDENSECOND × φ³)

> **NARUSZENIE TEGO PLIKU** wymaga nowego ADR w `01_governance/decisions/` + nowa wersja pliku.
> Plik jest **niezmienny** po zatwierdzeniu. Zmiany tylko przez wersjonowanie.

---

### DEPLOYMENT QUICK REFERENCE

Proces wdrażania aplikacji (np. `patternlens` / `garden`) na Vercel **musi** odbywać się w rygorze **8-root monorepo** z `pnpm` + `Turborepo`.

#### 1. Inicjalizacja środowiska

```bash
# Upewnij się, że workspace obejmuje aplikacje
pnpm install
```
