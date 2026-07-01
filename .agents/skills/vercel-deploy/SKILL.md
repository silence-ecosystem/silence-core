# vercel-deploy

**Description:**
Enforces the immutable `VERCEL_DEPLOYMENT_GUIDE.md` contract before any Vercel production deployment. Guarantees S11 sterility, φ-rigor timing, boundary integrity (RULE-DOM-001), and core determinism. This skill is the single gatekeeper for all production deploys.

**When to activate (trigger):**

- User says: "deploy to Vercel", "vercel --prod", "production deploy", "push to production", "deploy patternlens", or "deploy garden"
- Any change touching `05_apps/`, `06_infrastructure/`, or `04_packages/core/`
- Before suggesting or running any `vercel` command targeting production

**Execution steps (never skip):**

1. **Read the immutable contract**
   ```bash
   cat 06_infrastructure/VERCEL_DEPLOYMENT_GUIDE.md
   ```
