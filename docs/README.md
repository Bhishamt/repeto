# Repeato Documentation Index

**Version:** 0.1  
**Phase:** Documentation-First  
**Date:** 2026-09-19

---

## Document Hierarchy

```
PRD
↓
BRD
↓
MVP Scope & Functional Requirements
↓
SRS
↓
TRD
↓
System Architecture
↓
Database Design
↓
UI/UX Specification
↓
Security / RBAC / RLS
↓
QA / Test Plan
```

---

## Documents

### /docs/product/

| Document | Purpose | Status |
|----------|---------|--------|
| [PRD.md](product/PRD.md) | What Repeato is; user personas; product goals; journeys; features; success criteria | DRAFT |
| [BRD.md](product/BRD.md) | Business requirements; loyalty rules; fraud concerns; commercial model questions | DRAFT |
| [MVP_SCOPE.md](product/MVP_SCOPE.md) | Exactly what is in/out of the MVP; functional requirements per feature | DRAFT |

### /docs/requirements/

| Document | Purpose | Status |
|----------|---------|--------|
| [SRS.md](requirements/SRS.md) | Software Requirements Specification with unique FR-XXX requirement IDs | DRAFT |
| [TRD.md](requirements/TRD.md) | Technical Requirements — how the SRS is implemented technically | DRAFT |

### /docs/architecture/

| Document | Purpose | Status |
|----------|---------|--------|
| [SYSTEM_ARCHITECTURE.md](architecture/SYSTEM_ARCHITECTURE.md) | System design; frontend structure; data flows; auth flows; multi-tenancy | DRAFT |
| [DATABASE_DESIGN.md](architecture/DATABASE_DESIGN.md) | Full database schema; all tables; RLS; relationships; audit fields; lifecycle | DRAFT |

### /docs/design/

| Document | Purpose | Status |
|----------|---------|--------|
| [UI_UX_SPECIFICATION.md](design/UI_UX_SPECIFICATION.md) | Every screen defined — Customer, Business, Staff, Public Website | DRAFT |

### /docs/security/

| Document | Purpose | Status |
|----------|---------|--------|
| [SECURITY_RBAC_RLS.md](security/SECURITY_RBAC_RLS.md) | Role permissions; RLS policies; tenant isolation rules; fraud prevention | DRAFT |

### /docs/testing/

| Document | Purpose | Status |
|----------|---------|--------|
| [QA_TEST_PLAN.md](testing/QA_TEST_PLAN.md) | All test cases including security, RLS, empty states, error states | DRAFT |

### /docs/decisions/

| Document | Purpose | Status |
|----------|---------|--------|
| [OPEN_QUESTIONS.md](decisions/OPEN_QUESTIONS.md) | All unresolved product and technical decisions with analysis | ACTIVE |
| [DECISION_LOG.md](decisions/DECISION_LOG.md) | Formally resolved decisions — date, rationale, impact | ACTIVE |

---

## Status Legend

| Status | Meaning |
|--------|---------|
| DRAFT | Written; not yet reviewed or approved |
| REVIEWED | Reviewed by stakeholder; feedback pending |
| APPROVED | Approved for implementation |
| ACTIVE | Living document; updated continuously |

---

## Key Terminology

All documents use consistent terminology defined in [PRD.md — Terminology](product/PRD.md#terminology).

| Term | Meaning |
|------|---------|
| Business | A café/restaurant enrolled on Repeato |
| Customer | End-user of the loyalty programme |
| Business Owner | Owner/manager of a Business |
| Business Staff | Counter staff at a Business |
| Platform Admin | Repeato internal operator |
| Membership | Customer's relationship with a Business |
| Points | Virtual currency per Business |
| Reward | Benefit redeemable with Points |
| Redemption Ticket | Single-use time-limited code |
| Loyalty Rule | Points earning configuration |

---

## Critical Open Decisions (Before Any Code)

| Priority | ID | Question |
|----------|----|---------|
| 🔴 BLOCKING | OQ-001 | Purchase verification mechanism |
| 🔴 BLOCKING | OQ-018 | Points balance atomicity |
| 🔴 BLOCKING | OQ-023 | Redemption atomicity (RPC vs client) |
| 🔴 CRITICAL | OQ-002 | Customer authentication method |
| 🔴 CRITICAL | OQ-007 | Staff invitation workflow |

See [OPEN_QUESTIONS.md](decisions/OPEN_QUESTIONS.md) for the full list.

---

## Git Baseline Recommendation

See the main repository README or ask the development team for the Git baseline report.

**Summary:** The initial commit (`c127113` — `feat: initial commit of Repeato multi-tenant customer loyalty platform`) dated **2026-09-17** is the appropriate baseline. It represents the first complete working state of the codebase with:
- Full database migration (`001_initial_schema.sql`)
- Complete initial frontend (all pages, components, services)
- Mock data system
- Supabase integration with fallback

Subsequent commits (Sep 18) add:
- Toast notification component
- Vite build config fix
- Connection verification diagnostics
- Migration `002_security_and_realtime.sql`
- License changes

**Recommendation:** Current HEAD (`99bd3bd`) is the correct starting point. The September 17 commit is the product baseline; the Sep 18 additions are all constructive improvements. No rollback is needed.

---

## What Should Happen Before Coding Begins

1. **Review and approve this documentation** — Product Owner reviews all 10 documents
2. **Resolve OQ-001** — Decide purchase verification mechanism (BLOCKING)
3. **Resolve OQ-018 and OQ-023** — Decide on atomicity strategy for Points and Redemptions (CRITICAL for data integrity)
4. **Resolve OQ-002** — Confirm customer auth method (phone vs email OTP)
5. **Confirm MVP scope** — Explicitly approve MVP_SCOPE.md feature list
6. **Review SECURITY_RBAC_RLS.md** — Address the identified security gaps before any feature work
7. **Plan implementation order** — Start with data model and RLS, then business auth, then customer flow
8. **Set up test environment** — Connect real Supabase project; run migrations; create test accounts

---

*This index is the entry point to all Repeato documentation. Start here before making any product or technical decision.*
