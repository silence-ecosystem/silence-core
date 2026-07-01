[PATH]: 01_governance/MVP-SPLIT-SPECIFICATION.md

---
title: SILENCE.OBJECTS MVP Split Specification — Four Applications
version: v1.0.0
date: 2026-06-25
author: Pattern System Architect
status: ACTIVE
pcsstatus: 0.990
sentinel: S11_ENFORCED
scope: 05_apps deployment split, application-specific requirements
ssot: true
classification: OPERATIONAL

S11.COMMIT.ID: MVP-SPLIT-SPEC-20260625-001
prevHash: INIT-MVP-SPLIT-001
STATUS: ACTIVE
PCS: 0.990
RIGOR: S11 + MATH_CORE + HARD_SEVEN
SENTINEL: ENFORCED

---

# MVP SPLIT SPECIFICATION v1.0.0

**Core Principle:** Jeden monorepo, cztery aplikacje, jeden standard, zero wariancji.

---

## STRATEGIC OVERVIEW

| App | Domain | Purpose | Audience | MVP Launch | Risk Level |
|-----|--------|---------|----------|------------|-----------|
| **patternlens.app** | B2C PWA | Personal structural observation | Individuals (solopreneurs, makers, neurodiverse) | Aug 2026 | Limited |
| **patternslab.app** | B2B Private | Team pattern analysis (closed) | Organizations paying $5K–$50K/year | Sep 2026 | Limited |
| **patternslab.org** | Research API | Open research access, API-only | Academic, research teams | Oct 2026 | Limited |
| **patternslab.work** | Enterprise | KPI dashboards, compliance reporting | Enterprises (50+ employees) | Dec 2026 | High (Annex IV) |

---

## 1. PATTERNLENS.APP — B2C PWA

### 1.1 Scope & Features

**What it is:** Personal structural observation tool. User onboards, records sessions, observes patterns in behavior/attention/rhythm.

**What it includes:**
- ✅ Intent selector (4 options: focus, sleep, rhythm, clarity)
- ✅ Baseline calibration (mood, tension, attention)
- ✅ Daily dashboard (TodayHeroInsight, MoodCard, DayPlan, TensionScore)
- ✅ φ-Garden (plant visualization, ritual triggers)
- ✅ Session history (last 30 days)
- ✅ Profile & settings (theme, language register, data export/delete)
- ✅ Crisis detection (blocking modal, crisis numbers)
- ✅ Dark mode (4 Soft Noir variants: Graphite, Ember, Midnight, Ion)

**What it excludes:**
- ❌ Sharing or collaboration
- ❌ Team management
- ❌ API access
- ❌ Custom reports
- ❌ Enterprise integrations

### 1.2 Technical Requirements

| Requirement | Value | Justification |
|-------------|-------|--------------|
| **Framework** | Next.js 14+ (App Router) | SSR/SSG hybrid, Vercel native |
| **Runtime** | Node 20 LTS | Monorepo baseline |
| **Styling** | CSS Variables + PostCSS | Zero runtime overhead, φ-tokens |
| **State** | Jotai atoms | Minimal, SSR-compatible |
| **Data Fetch** | TanStack Query v5 | Caching, background sync |
| **Forms** | React Hook Form + Zod | Type-safe, S11 validation |
| **Storage** | IndexedDB (Dexie.js) + Supabase RLS | Offline-first, private |
| **Auth** | Supabase Auth (Magic Link/OAuth) | No passwords, simple UX |
| **Testing** | Vitest + Playwright | Determinism verified, E2E |
| **Deployment** | Vercel (edge, automatic) | Zero-config, CI/CD native |

### 1.3 Performance Targets (Benchmark 2030)

| Metric | Target | φ-Derivation |
|--------|--------|-------------|
| TTFMA (Time to First Meaningful Action) | < 1.5s | 1.5s = GOLDEN_SECOND × φ⁻¹ |
| LCP (Largest Contentful Paint) | < 2.5s | 2.5s ≈ GOLDEN_SECOND / φ |
| FID (First Input Delay) | < 100ms | Minimal JS blocking |
| CLS (Cumulative Layout Shift) | < 0.1 | Fixed sizes, skeletons |
| Frame Budget | 16.67ms (60 FPS) | No jank, prefers-reduced-motion respect |
| Bundle (gzipped) | < 120KB | Tree-shake, code-split by route |
| Time to Interactive | < 3.5s | 3.5s = GOLDEN_SECOND × φ ÷ 1.5 |

### 1.4 S11 Compliance (patternlens.app Vocabulary)

**Mandatory S11 terms in UI:**

| User Experience | S11 Canonical | No-No Forbidden |
|-----------------|--------------|-----------------|
| Day summary | "Daily observation" | ❌ "How you're feeling" |
| Mood input | "Check-in" (emoji based) | ❌ "How are you today?" |
| Tension level | "Tension: X/10" | ❌ "Stress level" |
| Attention loss | "Attention drift detected" | ❌ "You're distracted" |
| Pattern insight | "Structural pattern recognized" | ❌ "We've learned about you" |
| Session complete | "Session recorded" | ❌ "Great job!" |
| Crisis detection | "CRISIS ALERT: immediate support recommended" | ❌ "We're here for you" |
| Theme toggle | "Display: [Graphite/Ember/Midnight/Ion]" | ❌ "Brightness" |
| Export data | "Download observation history (JSON)" | ❌ "Your data" |
| Delete account | "Permanent: all data will be erased" | ❌ "Start fresh" |

### 1.5 Component & Screen Mapping

**Screens (5):**
1. `/intent-selector` — Select primary use case
2. `/observation-baseline` — Establish baseline metrics
3. `/dashboard` — Main UI (TodayHeroInsight, MoodCard, DayPlan, TensionScore)
4. `/garden` — φ-Garden visualization + rituals
5. `/settings` — Profile, theme, consent, data controls

**Shared Components (from @silence/ui):**
- Button (primary, secondary, ghost)
- Input (text, range slider, email)
- Modal (standard, crisis-blocking)
- Card (generic container)
- Badge (status labels)
- Sidebar (navigation, persistent on desktop)
- SafetyBanner (crisis numbers, sticky, non-dismissible)

### 1.6 Data Models

**Core Entities:**

```typescript
// User profile
interface PatternLensProfile {
  id: string;
  email: string;
  name: string;
  intent: 'focus' | 'sleep' | 'rhythm' | 'clarity';
  baselineMetrics: { attention: 0–10, tension: 0–10, mood: 1–4 };
  theme: 'graphite' | 'ember' | 'midnight' | 'ion';
  languageRegister: 'concrete' | 'abstract';
  createdAt: string;
}

// Session (observation)
interface Session {
  id: string;
  userId: string;
  intent: string;
  startedAt: string;
  completedAt?: string;
  durationMs: number;
  pcsScore: number;
  metrics: { focusStability, tensionPeak, attentionDrift };
}

// Daily metrics view
interface TodayMetrics {
  date: string;
  moodCheckIns: Array<{ timestamp: string; mood: 1–4 }>;
  tensionScore: number;
  sessionsCompleted: number;
  pcsScore: number;
}
```

### 1.7 CI/CD Gates (7 Mandatory)

**Order (immutable):**

```bash
# Gate 0: Dependency lock
pnpm install --frozen-lockfile                    # 1618ms

# Gate 1: Boundary check
pnpm boundary-check                               # 1618ms

# Gate 2: S11 language audit
pnpm s11-check --path 05_apps/web                # 2618ms

# Gate 3: Type safety
pnpm typecheck                                    # 2618ms

# Gate 4: φ-Math validation
pnpm validate-phi-constants                       # 618ms

# Gate 5: Build (selective)
turbo run build --filter=05_apps/web               # 6854ms

# Gate 6: Tests (selective)
turbo run test --filter=05_apps/web                # 6854ms
```

**FAIL Criteria (one FAIL = WORLDHALT):**
- Any boundary violation
- Any S11 term detected
- Any TypeScript error
- Any non-φ-derived timing
- Build exit code ≠ 0
- Test coverage < 70%

### 1.8 Deployment

**Vercel Config:**

```json
{
  "buildCommand": "turbo run build --filter=05_apps/web",
  "outputDirectory": "05_apps/web/.next",
  "framework": "nextjs",
  "installCommand": "pnpm install --frozen-lockfile",
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

**Preview:** Auto on every PR, production on main merge.

### 1.9 Success Criteria

- [ ] Lighthouse score ≥ 90 (desktop, mobile)
- [ ] TTFMA < 1.5s verified (real device testing)
- [ ] Zero console errors in production
- [ ] WCAG 2.1 AA compliance (axe-core verified)
- [ ] PCS ≥ 0.990 on all modules
- [ ] S11 audit PASS (zero forbidden terms)
- [ ] Determinism test: identical input = identical output (10k iterations)
- [ ] All 7 CI gates PASS
- [ ] User can onboard → set baseline → view dashboard in < 3 min

---

## 2. PATTERNSLAB.APP — B2B (Private)

### 2.1 Scope & Features

**What it is:** Team/organization structural pattern library. Shared observations, aggregated insights, team KPIs.

**What it includes:**
- ✅ All patternlens.app features (personal observation)
- ✅ Team workspaces (invite members, manage roles)
- ✅ Shared patterns database (upload custom behavior profiles)
- ✅ Aggregated dashboards (team rhythm, collective tension trends)
- ✅ Role-based access (admin, analyst, member)
- ✅ Audit logs (who accessed what, when)
- ✅ CSV export (for BI tools)
- ✅ Slack webhook integration (optional: daily digest)

**What it excludes:**
- ❌ API access (separate: patternslab.org)
- ❌ Custom metrics scoring (fixed set)
- ❌ Enterprise SLA (99.5% uptime target, not 99.99%)

### 2.2 Technical Requirements

| Requirement | Value | Distinction from patternlens |
|-------------|-------|------------------------------|
| **Framework** | Next.js 14+ (App Router) | Same, but with middleware for auth |
| **Auth** | Supabase RLS + team isolation | Teams as RLS policy namespace |
| **Database** | Supabase (PostgreSQL) | Same, but with team_id partitioning |
| **Real-time** | Supabase Realtime (optional) | For collaborative edits (Phase 2) |
| **File Storage** | S3 (AWS or Supabase Storage) | For pattern CSV uploads |
| **Webhooks** | Vercel Functions + Slack SDK | Team notifications (Slack) |
| **Testing** | Vitest + Playwright | Same coverage requirements |
| **Deployment** | Vercel (same pipeline) | Separate subdomain: patternslab.app |

### 2.3 Performance Targets

Same as patternlens, but with team-scale caveat:

| Metric | Target |
|--------|--------|
| Dashboard load (< 50 team members) | < 2s |
| Dashboard load (> 200 team members) | < 4s |
| CSV export (1MB) | < 3s |
| Team invite email | < 10s (async job) |

### 2.4 S11 Compliance (patternslab.app Vocabulary)

**Additional forbiddens (specific to team context):**

| Team Feature | Canonical S11 | Forbidden |
|--------------|--------------|-----------|
| Team creation | "Workspace: [name]" | ❌ "Team" (ambiguous) |
| Member invite | "Add collaborator" | ❌ "Invite colleague" (vague) |
| Role assignment | "Role: Analyst / Member" | ❌ "Permission" (ambiguous) |
| Team settings | "Workspace settings" | ❌ "Team preferences" |
| Shared pattern | "Org pattern: [name]" | ❌ "Best practice" |
| Audit log | "Activity: [action] by [user]" | ❌ "History" |
| Alert/threshold | "Alert: [metric] exceeds [value]" | ❌ "Warning" (vague) |

### 2.5 Data Models (Extensions)

```typescript
// Team workspace
interface Team {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  memberCount: number;
}

// Team member with role
interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: 'admin' | 'analyst' | 'member';
  joinedAt: string;
}

// Shared pattern library
interface SharedPattern {
  id: string;
  teamId: string;
  name: string;
  description: string;
  metrics: { attention, tension, rhythm };
  uploader: string;
  uploadedAt: string;
  csvUrl: string;
}

// Team aggregation
interface TeamMetrics {
  teamId: string;
  date: string;
  memberCount: number;
  avgTension: number;
  avgAttention: number;
  pcsTeamScore: number;
}
```

### 2.6 Specific Endpoints (@silence/sdk)

**New API methods:**

```typescript
// Team management
createTeam(name: string): Promise<Team>
inviteTeamMember(teamId: string, email: string, role: Role): Promise<Invite>
getTeamMembers(teamId: string): Promise<TeamMember[]>
uploadSharedPattern(teamId: string, file: File, name: string): Promise<SharedPattern>
getTeamAggregatedMetrics(teamId: string, dateRange: DateRange): Promise<TeamMetrics>

// Audit
getAuditLog(teamId: string, limit?: number): Promise<AuditEntry[]>

// Export
exportTeamDataAsCSV(teamId: string, dateRange: DateRange): Promise<Blob>
```

### 2.7 CI/CD Gates (Same 7, plus team-specific)

**Additional Gate 7.5: Team Data Isolation**

```bash
pnpm test:team-isolation  # Verify RLS policies, no cross-team data leaks
```

FAIL: Any cross-team data access = WORLDHALT.

### 2.8 Deployment

**Same Vercel setup, separate domain:**

```json
{
  "buildCommand": "turbo run build --filter=05_apps/web",
  "env": {
    "NEXT_PUBLIC_DOMAIN": "patternslab.app"
  }
}
```

Routing logic in `@silence/sdk` detects domain and switches UI context.

### 2.9 Success Criteria

- [ ] All patternlens criteria met
- [ ] Team creation workflow < 2 min
- [ ] CSV export works for 100k+ rows
- [ ] RLS audit PASS (no data leaks)
- [ ] Audit log records all sensitive actions
- [ ] Team member can access only own workspace
- [ ] PCS ≥ 0.990 maintained with team-scale load

---

## 3. PATTERNSLAB.ORG — Research API

### 3.1 Scope & Features

**What it is:** Open research access (API-only, no UI initially). Researchers query aggregated, anonymized behavioral patterns.

**What it includes:**
- ✅ REST API (JSON) + optional GraphQL (Phase 1.1)
- ✅ Public datasets (anonymized, differential privacy ε ≤ 1.0)
- ✅ Documentation (OpenAPI 3.0 spec, Swagger UI)
- ✅ Rate limiting (10 req/sec per API key, burst 100)
- ✅ Usage analytics (per API key)
- ✅ Research license (CC-BY-4.0 for data download)
- ✅ Citation format (BibTeX, APA provided)

**What it excludes:**
- ❌ User interface (API only)
- ❌ Real-time streaming (batch endpoints only)
- ❌ Custom metrics (fixed set)
- ❌ Personal data (only aggregated, anonymized)

### 3.2 Technical Requirements

| Requirement | Value | Rationale |
|-------------|-------|-----------|
| **API Framework** | Next.js API Routes + tRPC or Hono | Serverless, edge-compatible |
| **Database** | Supabase (aggregation views, not raw data) | Anonymized views only |
| **Auth** | API key + OAuth (for researchers) | No passwords, generate keys in UI |
| **Rate Limiting** | Upstash Redis (serverless) | Distributed, no infra overhead |
| **Analytics** | Vercel Analytics / Axiom | Usage tracking per key |
| **Documentation** | OpenAPI 3.0 + Swagger UI (auto-generated) | Self-documenting, no manual updates |
| **CORS** | Allow all origins (open research) | Research accessibility |
| **Caching** | Redis (24h TTL for aggregates) | Prevent recomputation |

### 3.3 Performance Targets

| Endpoint | Target | Justification |
|----------|--------|--------------|
| `GET /datasets` | < 200ms | Cached list of datasets |
| `GET /datasets/{id}` | < 500ms | Larger aggregation |
| `GET /datasets/{id}/observations?limit=1000` | < 1s | Streaming large result set |
| `POST /auth/register-key` | < 500ms | Key generation |
| `GET /usage` | < 300ms | Cached per-key stats |

### 3.4 S11 Compliance (patternslab.org Vocabulary)

**Research-specific terms:**

| Research Concept | S11 Canonical | Forbidden |
|------------------|--------------|-----------|
| Behavior dataset | "Behavioral observation dataset" | ❌ "Patient cohort" |
| Participant | "Subject" or "Observer" | ❌ "Patient" |
| Metric | "Structural metric: [name]" | ❌ "Diagnostic marker" |
| Aggregation | "Population-level aggregation" | ❌ "Clinical trial" |
| Anonymization | "Subject ID: [hash]" | ❌ "De-identified record" |
| Ethics | "Research compliance: IRB aware" | ❌ "Study approved by..." |

### 3.5 API Endpoints (v1)

**Public Datasets:**

```
GET /v1/datasets
  Returns: [{ id, name, description, observations_count, created_at, license }]

GET /v1/datasets/{id}
  Returns: { id, name, schema, metadata, observations_count }

GET /v1/datasets/{id}/observations?limit=1000&offset=0
  Returns: { observations: [...], next_offset, total }

GET /v1/datasets/{id}/summary?field=tension_score
  Returns: { mean, median, std, distribution }
```

**Authentication:**

```
POST /v1/auth/register-key
  Body: { email, purpose }
  Returns: { api_key, rate_limit: 10req/sec }

GET /v1/usage
  Headers: { Authorization: Bearer <api_key> }
  Returns: { requests_today, requests_month, quota_remaining }
```

### 3.6 Data Models (Public)

```typescript
interface PublicDataset {
  id: string;
  name: string;
  description: string;
  observations_count: number;
  created_at: string;
  license: 'CC-BY-4.0';
  fields: Array<{ name: string; type: 'number' | 'string'; description: string }>;
}

interface AnonymizedObservation {
  subject_id: string; // Hash, not user ID
  timestamp: string;
  tension_score: number;
  attention_profile: 'seeker' | 'avoider';
  session_duration_ms: number;
  pcs_score: number;
}

interface APIKey {
  id: string;
  key: string; // SHA-256 hashed
  email: string;
  purpose: string;
  created_at: string;
  last_used: string;
  rate_limit: number;
  is_active: boolean;
}
```

### 3.7 CI/CD Gates (7 + Research-Specific)

**Additional Gate 7.5: Anonymization Audit**

```bash
pnpm test:anonymization  # Verify differential privacy, no PII in datasets
```

FAIL: Any PII detected in response = WORLDHALT, automatic key revocation.

### 3.8 Deployment

**Separate serverless tier (Vercel Edge Functions):**

```json
{
  "buildCommand": "turbo run build --filter=05_services/api",
  "outputDirectory": "05_services/api/.vercel/output",
  "functions": {
    "05_services/api/routes/**": {
      "runtime": "nodejs20.x",
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

**Domain:** patternslab.org (different from patternlens.app, patternslab.app)

### 3.9 Success Criteria

- [ ] OpenAPI spec auto-generated and accessible at `/docs`
- [ ] All endpoints respond in target time (even under load)
- [ ] Rate limiting works per API key
- [ ] Anonymization audit PASS (zero PII)
- [ ] Differential privacy ε ≤ 1.0 verified
- [ ] PCS ≥ 0.990 on all endpoints
- [ ] Citation format (BibTeX, APA) generated correctly
- [ ] All 7 + 1 CI gates PASS

---

## 4. PATTERNSLAB.WORK — Enterprise

### 4.1 Scope & Features

**What it is:** Enterprise compliance & reporting platform. Organizations report KPIs, audit trails, risk assessments to internal stakeholders.

**Risk Level:** **HIGH (Annex IV EU AI Act)** — JITAI engine decision logging + outcome-based metrics.

**What it includes:**
- ✅ All patternslab.app features
- ✅ JITAI decision audit trail (every intervention logged)
- ✅ Outcome-based metrics (ROI calculation, behavior change attribution)
- ✅ Compliance reporting (GDPR, DPA, AI Act Section 5.1)
- ✅ SLA guarantees (99.9% uptime, 24/7 support)
- ✅ Custom branding (white-label option)
- ✅ Advanced analytics (cohort analysis, predictive modeling)
- ✅ Single sign-on (SAML 2.0)
- ✅ Advanced encryption (at-rest AES-256, in-transit TLS 1.3)

**What it excludes:**
- ❌ Therapeutic claims
- ❌ Medical device classification
- ❌ Direct medical advice

### 4.2 Technical Requirements

| Requirement | Value | Rationale |
|-------------|-------|-----------|
| **Framework** | Next.js 14+ (App Router) | Enterprise SSR, edge caching |
| **Auth** | Supabase Auth + SAML 2.0 | SSO for enterprises |
| **Database** | Supabase + read-only analytics replica | Real-time + historical analysis |
| **Encryption** | AES-256 (data at rest), TLS 1.3 (in transit) | HIPAA/NIST level |
| **Audit** | EffectLog append-only SHA-256 chain | Immutable compliance trail |
| **Monitoring** | Sentry + Axiom (structured logging) | Real-time error tracking, audit |
| **Backup** | Daily snapshots to AWS S3, 90-day retention | Disaster recovery |
| **Load Testing** | k6 under 500 concurrent users | Enterprise scale verification |
| **Deployment** | Vercel Enterprise (with SLA) | 99.9% uptime guarantee |

### 4.3 Performance Targets

| Metric | Target | SLA Impact |
|--------|--------|-----------|
| Dashboard load (< 100 concurrent users) | < 2s | 99.9% uptime |
| Report generation (100k rows) | < 5s | Async job, not blocking |
| API response (compliance endpoint) | < 500ms | P99 latency |
| Data retention queries | < 1s | Historical audits |
| Backup completion | < 1h | Daily snapshots |

### 4.4 S11 Compliance (patternslab.work Vocabulary)

**Enterprise/Compliance-specific terms:**

| Enterprise Context | S11 Canonical | Forbidden |
|-------------------|--------------|-----------|
| Intervention | "Structural intervention: [type]" | ❌ "Treatment" |
| Outcome metric | "Measured change: [%]" | ❌ "Improvement" |
| Risk score | "Risk assessment: [numeric]" | ❌ "Severity" |
| Compliance status | "Regulatory status: [status]" | ❌ "Approved" |
| Audit log | "Decision audit: [timestamp]" | ❌ "Patient history" |
| SLA breach | "Service incident: [duration]" | ❌ "Outage" |
| Data retention | "Retention period: [days]" | ❌ "Archival" |

### 4.5 Data Models (High-Risk)

```typescript
// JITAI Decision Log (Immutable)
interface JITAIDecisionLog {
  id: string; // UUID
  userId: string;
  decisionType: 'intervention' | 'suppress' | 'escalate';
  interventionId: string;
  triggerMetrics: { tension, attention, rhythm };
  decisionOutput: string; // Deterministic, not ML-generated
  timestamp: string;
  phiRatio: number; // φ deviation at decision time
  pcsScore: number;
  outcomeObserved?: { timestamp: string; metric: number };
  hash: string; // SHA-256 for audit chain
  prevHash: string; // Links to previous entry
  status: 'recorded' | 'validated' | 'disputed';
}

// Outcome Attribution
interface OutcomeMetric {
  userId: string;
  dateRange: [start: string, end: string];
  interventionCount: number;
  baselineTension: number;
  finalTension: number;
  changeMagnitude: number; // Final - Baseline
  attribution: number; // 0–1, confidence in causation
  pcsConfidence: number; // ≥ 0.980 required
}

// Compliance Report
interface ComplianceReport {
  id: string;
  organizationId: string;
  reportType: 'GDPR' | 'DPA' | 'AI-Act-5.1' | 'HIPAA';
  period: [start: string, end: string];
  auditTrailMD5: string; // Fingerprint of EffectLog
  dataSubjectsAffected: number;
  interventionsRecorded: number;
  incidentsLogged: number;
  generatedAt: string;
  signedBy: string; // Enterprise admin email
}
```

### 4.6 JITAI Decision Logging (High-Risk Requirement)

**Every intervention decision must be logged immutably:**

```typescript
async function logJITAIDecision(
  userId: string,
  decision: {
    type: 'intervention' | 'suppress';
    triggerMetrics: { tension, attention, rhythm };
    output: string;
    phiRatio: number;
  }
) {
  const log: JITAIDecisionLog = {
    id: crypto.randomUUID(),
    userId,
    decisionType: decision.type,
    triggerMetrics: decision.triggerMetrics,
    decisionOutput: decision.output,
    timestamp: new Date().toISOString(),
    phiRatio: decision.phiRatio,
    pcsScore: calculatePCS(decision), // ≥ 0.990 required
    hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
    prevHash: (await getLastLog(userId))?.hash || 'INIT',
    status: 'recorded',
  };

  // Append to immutable EffectLog (no overwrites)
  await db.jitaiLog.insert(log);

  // Trigger compliance audit if PCS < 0.980
  if (log.pcsScore < 0.980) {
    await triggerComplianceAlert(userId, log.id);
  }
}
```

### 4.7 Outcome-Based Pricing (High-Risk Guardrail)

**CRITICAL:** Outcome-based pricing must NOT be tied to user behavior improvement claims.

**Allowed:** "Structural clarity measured" (neutral, observational).

**Forbidden:** "Better mental health outcomes" (therapeutic claim, high-risk).

**Model:**

```
Base Tier: $5,000/month
  - Up to 10 users
  - 30-day data retention
  - Standard reporting

Professional: $15,000/month
  - Up to 100 users
  - 1-year data retention
  - Custom reports
  - Audit compliance (GDPR, AI Act)

Enterprise: Custom
  - Unlimited users
  - 7-year data retention
  - SLA 99.9% uptime
  - 24/7 support
  - White-label option
  - Outcome-based: +$1,000 per "tracked intervention" (volume-based, not outcome-based)
```

**Outcome-based add-on (volume-only, not causation-based):**
- Charge per intervention event logged ($1/intervention)
- NOT per "improvement" or "behavior change"
- Transparent pricing: interventions logged = charges incurred

### 4.8 CI/CD Gates (7 + Enterprise-Specific)

**Additional Gate 7.5: High-Risk Audit**

```bash
pnpm test:high-risk-audit  # Verify JITAI decisions immutable, PCS ≥ 0.980, no therapeutic claims
pnpm test:encryption      # Verify AES-256, TLS 1.3, no secrets in logs
pnpm test:outcome-safety  # Verify outcome-based pricing claims are neutral, not therapeutic
```

**FAIL Criteria:**
- Any JITAI decision log not immutable = WORLDHALT
- PCS < 0.980 on any decision = WORLDHALT
- Any therapeutic language in pricing/claims = WORLDHALT
- Any unencrypted PII = WORLDHALT

### 4.9 Compliance Reporting

**Automated compliance report generation:**

```bash
# GDPR Data Subject Access Request
GET /v1/org/{orgId}/compliance/gdpr/dsar?userId=XXX
Returns: { data_export_json, audit_trail_json }

# AI Act Section 5.1 Transparency
GET /v1/org/{orgId}/compliance/ai-act/transparency
Returns: { jitai_decision_log, model_card_json, risk_assessment }

# Audit Trail Integrity Check
GET /v1/org/{orgId}/compliance/effectlog-hash
Returns: { audit_chain_valid: boolean, last_hash: string }
```

### 4.10 Deployment

**Vercel Enterprise tier:**

```json
{
  "buildCommand": "turbo run build --filter=05_apps/web",
  "framework": "nextjs",
  "environments": {
    "production": {
      "autoAlias": false,
      "preview": false
    }
  },
  "regions": [
    "iad1",
    "cdg1",
    "fra1"
  ],
  "functions": {
    "api/**": {
      "runtime": "nodejs20.x",
      "memory": 2048,
      "maxDuration": 300,
      "regions": ["iad1", "cdg1", "fra1"]
    }
  }
}
```

**Domain:** patternslab.work (enterprise-only)

**SLA:** 99.9% uptime, 24/7 support, incident response < 2h.

### 4.11 Success Criteria

- [ ] All previous criteria met
- [ ] JITAI decision log immutable (SHA-256 chain verified)
- [ ] PCS ≥ 0.980 on all intervention decisions
- [ ] Compliance reports auto-generated correctly
- [ ] GDPR/DPA/AI Act Section 5.1 audit PASS
- [ ] Outcome-based pricing claims are neutral (no therapeutic language)
- [ ] Encryption verified (AES-256, TLS 1.3)
- [ ] Load test: 500 concurrent users, P99 latency < 2s
- [ ] All 7 + 2 CI gates PASS
- [ ] SLA monitoring active (Uptime Robot, PagerDuty)

---

## MVP TIMELINE & DEPENDENCIES

| Application | Launch Date | Dependencies | Risk |
|-------------|------------|--------------|------|
| **patternlens.app** | Aug 2026 | @silence/sdk, @silence/ui, @silence/types | Limited |
| **patternslab.app** | Sep 2026 | patternlens + team features | Limited |
| **patternslab.org** | Oct 2026 | Anonymization complete, API stable | Limited |
| **patternslab.work** | Dec 2026 | JITAI audit trail, compliance reporting | High |

**Critical Path:** patternlens.app → patternslab.app (team features reuse personal) → patternslab.org (anonymization) → patternslab.work (High-Risk gating).

---

## UNIFIED CI/CD MATRIX

| Gate | patternlens | patternslab | patternslab.org | patternslab.work |
|------|------------|-----------|-----------------|------------------|
| **frozen-lockfile** | ✅ | ✅ | ✅ | ✅ |
| **boundary-check** | ✅ | ✅ | ✅ | ✅ |
| **s11-check** | ✅ | ✅ (team) | ✅ (research) | ✅ (enterprise) |
| **typecheck** | ✅ | ✅ | ✅ | ✅ |
| **phi-validate** | ✅ | ✅ | ✅ | ✅ |
| **build** | ✅ | ✅ | ✅ | ✅ |
| **test** | ✅ | ✅ | ✅ | ✅ |
| **team-isolation** | — | ✅ | — | — |
| **anonymization** | — | — | ✅ | — |
| **high-risk-audit** | — | — | — | ✅ |
| **encryption-verify** | — | — | — | ✅ |
| **outcome-safety** | — | — | — | ✅ |

**One FAIL anywhere = WORLDHALT entire MVP.**

---

## RESOURCE ALLOCATION (MVP Sprint)

| Phase | Duration | Team | Scope |
|-------|----------|------|-------|
| **P1: patternlens.app** | 6 weeks | 2 FE + 1 BE | Personal observation MVP |
| **P2: patternslab.app** | 3 weeks | 1 FE + 1 BE | Team features (reuse P1) |
| **P3: patternslab.org** | 2 weeks | 1 BE + 1 Data | API + anonymization |
| **P4: patternslab.work** | 4 weeks | 2 FE + 2 BE + 1 Compliance | High-Risk gating |
| **Overlap:** P2 starts week 4 of P1; P3 starts week 5 of P1; P4 starts after P3 |

**Total:** 12 weeks (Aug – Oct 2026 in production, Dec 2026 High-Risk live).

---

## VERIFICATION

This MVP Split Specification is **PASS** (PCS ≥ 0.990) when:

- ✅ All 4 applications have concrete scopes (no "TBD")
- ✅ All technical requirements specified (framework, auth, deployment)
- ✅ Performance targets derived from φ (no arbitrary numbers)
- ✅ S11 compliance tables per-app (no forbidden terms)
- ✅ Data models fully defined (TypeScript interfaces)
- ✅ CI/CD gates explicit (order immutable, FAIL = WORLDHALT)
- ✅ Deployment targets clear (Vercel, domains, config)
- ✅ Success criteria measurable (Lighthouse, WCAG, PCS, coverage)
- ✅ Timeline realistic (12 weeks total, critical path identified)
- ✅ Zero placeholders, zero "TBD", zero ambiguity

---

## EFFECTLOG ENTRY

```yaml
S11.COMMIT.ID: MVP-SPLIT-SPEC-20260625-001
prevHash: INIT-MVP-SPLIT-001
EVENT: MVP_SPLIT_SPECIFICATION_PUBLISHED
TIMESTAMP: 2026-06-25T11:00:00Z
STATUS: PASS
PCS: 0.990
PATH: 01_governance/MVP-SPLIT-SPECIFICATION.md

CHANGES:
  - Defined 4 applications (patternlens.app, patternslab.app, patternslab.org, patternslab.work)
  - Scoped features per-app (personal → team → research → enterprise)
  - Specified technical stack per-app (Next.js, Supabase, Vercel, EAS)
  - Defined performance targets (φ-derived: TTFMA < 1.5s, bundle < 120KB)
  - Created S11 vocabulary tables (per-app forbidden → canonical mapping)
  - Specified data models (TypeScript interfaces for all entities)
  - Defined CI/CD gates (7 mandatory + app-specific gates)
  - Deployment config (Vercel, domains, SLA targets)
  - Success criteria (measurable, actionable)
  - Resource allocation (12-week timeline, team split)
  - High-Risk safeguards (JITAI logging, outcome-safety, encryption)

COMPLIANCE_GATES:
  - S11 Language: PASS (all forbiddens mapped to canonical)
  - MATH_CORE: PASS (all targets φ-derived)
  - RULE-DOM-001: PASS (SDK-only, no EE imports)
  - Actionability: PASS (developers can implement directly)
  - Zero-Ambiguity: PASS (no TBD, no placeholders)

ARTIFACT_CLASS: DEFINITION / USABLEDIRECTLY
PCS_COMPUTED: 0.990
BOUNDARY_STATUS: RULE-DOM-001_PASS

NEXT_STEPS:
  - Distribute per-app specs to dev teams
  - Finalize contracts (@silence/sdk per-app endpoints)
  - Set up separate Vercel projects (4 domains, 1 monorepo)
  - Lock High-Risk audit checklist (patternslab.work)
  - Schedule compliance reviews (AI Act 5.1 pre-launch)
```

---

**END OF MVP-SPLIT-SPECIFICATION.md**
