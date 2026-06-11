---
title: APP-portal
status: STABLE
classification: SSoT
sentinel: S11_ENFORCED
determinism_profile: audit
phi_anchor: true
---

# APP-portal

## Operational Mandate
Application layer consuming @silence/sdk strictly. No direct imports from 03_ee/.

## RULE-DOM-001
All logic must route through @silence/sdk surface.
