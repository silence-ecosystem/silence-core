# DEPLOYMENT CONFIG MATRIX

**Project:** SILENCE.OBJECTS MVP  
**Version:** 0.1.0-mvp  
**Date:** 2026-06-10  
**Classification:** SSoT

---

## 1. ENVIRONMENT DIMENSIONS

| Dimension | Dev | Staging | Production |
|-----------|-----|---------|------------|
| `NODE_ENV` | `development` | `production` | `production` |
| `NEXT_TELEMETRY_DISABLED` | `1` | `1` | `1` |
| `SILENCE_TELEMETRY_ADAPTER` | `console` | `batch` | `batch` |
| `SILENCE_ENGINE_VERIFY_MODE` | `skip` | `verify` | `verify` |
| `SILENCE_DEBUG_QUOTA` | `true` | `false` | `false` |
| `SILENCE_LOG_LEVEL` | `debug` | `info` | `error` |
| Robots policy | `disallow: /` | `disallow: /` | `allow: /` |
| CSP enforcement | Meta tag (lenient) | CDN header (strict) | CDN header (strict) |
| Signing key | Auto-generated file | CI secret mount | HSM |

---

## 2. APP: 05_apps/garden

### 2.1 Build Configuration

| Parameter | Value |
|-----------|-------|
| Output mode | `export` (static HTML) |
| Dist directory | `dist/` |
| Images | `unoptimized: true` |
| Transpile packages | `@silence/phi`, `@silence/telemetry`, `@silence/jitai`, `@silence/core` |

### 2.2 Hosting Requirements (Static Export)

Since `output: 'export'` produces static HTML, the following MUST be configured at the CDN / edge layer:

| Header | Value | Required |
|--------|-------|----------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | ✅ |
| `Content-Security-Policy` | See `app/layout.tsx` + stricter CDN override | ✅ |
| `X-Content-Type-Options` | `nosniff` | ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=(), payment=()` | ✅ |
| `X-Frame-Options` | `DENY` | ✅ |
| `Cache-Control` (HTML) | `public, max-age=0, must-revalidate` | ✅ |
| `Cache-Control` (static assets) | `public, max-age=31536000, immutable` | ✅ |

### 2.3 Secret Injection

| Secret | Source | Consumed by |
|--------|--------|-------------|
| `ENGINE_SIGNING_KEY_PUB` | GitHub Secret / HSM | `garden/app` (WASM verify) |
| `SILENCE_TELEMETRY_BATCH_ENDPOINT` | GitHub Secret | `@silence/telemetry` (batch adapter flush) |

**Zero secrets are baked into the client bundle.** All secrets are injected at build time via environment variables or fetched at runtime from secure endpoints.

---

## 3. ENGINE: 04_packages/@silence/engine

### 3.1 Build Configuration

| Parameter | Value |
|-----------|-------|
| Profile | `release` |
| `opt-level` | `3` |
| `lto` | `true` |
| `strip` | `true` |
| `panic` | `"abort"` |
| `codegen-units` | `1` |
| Target (native) | Host triple |
| Target (WASM) | `wasm32-unknown-unknown` |

### 3.2 Signing Pipeline

| Step | Tool | Output |
|------|------|--------|
| 1. Build | `cargo build --release` | `target/release/engine-cli` |
| 2. Hash | `openssl dgst -sha256` | `<artifact>.hash` |
| 3. Sign | `openssl pkeyutl -sign` (Ed25519) | `<artifact>.sig` |
| 4. Encode | `base64` | `<artifact>.sig.b64` |
| 5. Verify | `openssl pkeyutl -verify` | Console OK / FAIL |

### 3.3 Key Storage

| Environment | Storage | Access |
|-------------|---------|--------|
| Dev | `01_governance/RELEASE_KEYS/` (file) | Local filesystem |
| Staging | GitHub Secret (`ENGINE_SIGNING_KEY_PEM`) | CI runner mount |
| Production | HSM (YubiHSM 2 or AWS CloudHSM) | ops-lead only |

---

## 4. TELEMETRY

| Adapter | Dev | Staging | Production |
|---------|-----|---------|------------|
| `console` | ✅ Default | ❌ | ❌ |
| `noop` | ✅ Test mode | ❌ | ❌ |
| `batch` | ❌ | ✅ Default | ✅ Default |

**Batch adapter config:**
- `flushIntervalMs`: 5000
- `maxBatchSize`: 100
- Endpoint: injected via `SILENCE_TELEMETRY_BATCH_ENDPOINT`

---

## 5. COMPLIANCE MAPPING

| Requirement | Config location | Verification |
|-------------|-----------------|--------------|
| EU AI Act Annex IV — informed consent | `ConsentsScreen.tsx` + `robots.ts` | Manual review |
| EU AI Act Annex IV — transparency | `next.config.js` headers + `layout.tsx` CSP | Static analysis |
| EU AI Act Annex IV — post-market monitoring | `batchAdapter` telemetry flush | Runtime check |
| S11 linguistic sterility | `s11-check` | CI gate |
| RULE-DOM-001 boundary enforcement | `boundary-check` | CI gate |
| Determinism contract | `cargo test --release` | CI gate |
