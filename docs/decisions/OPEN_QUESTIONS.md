# Open Questions & Decision Log
**Product:** Repeato  
**Version:** 0.1 (Documentation Phase)  
**Date:** 2026-09-19  
**Status:** ACTIVE — Decisions pending

> This is the central registry of all unresolved product and technical decisions.  
> **Do NOT begin implementation of any feature that depends on an OPEN decision until that decision is recorded here as DECIDED.**

---

## Decision Entry Format

Each entry contains:
- **ID** — Unique question identifier
- **Question** — The specific decision needed
- **Why it matters** — What breaks or cannot proceed without this decision
- **Possible Options** — Options under consideration (not exhaustive)
- **Impact** — What downstream work this blocks
- **Decision** — The chosen answer (OPEN until decided)
- **Decision Date** — When this was decided
- **Status** — OPEN / DECIDED / DEFERRED

---

## OQ-001 — Purchase Verification Mechanism

**Question:**  
What is the mechanism by which the system confirms a Customer made a real purchase at a Business before awarding Points?

**Why it matters:**  
Without a verified purchase trigger, any Customer (or staff member) can self-award Points fraudulently. This is the most critical fraud prevention decision in the entire product.

**Possible Options:**

| Option | Description | Fraud Risk | Staff Friction | Customer Friction |
|--------|-------------|------------|----------------|-------------------|
| A | Manual bill entry by Staff | Medium | Low — 10 sec | None |
| B | Customer QR scanned by Staff | Low | Requires scanner/phone | Customer must open app |
| C | Bill receipt code entered by Customer | Medium — codes shareable | None for staff | Customer enters code |
| D | POS integration | Very Low — automated | None (automated) | None |
| E | Staff enters Customer phone → amount | Medium | Low | None |

**Impact:**  
Blocks:
- F-008 (Purchase Verification functional requirement)
- FR-PURCH-001 to FR-PURCH-007 (SRS)
- Staff Counter terminal implementation
- Points earning architecture finalisation

**Decision:** Option E — Staff looks up Customer by phone/name; enters purchase amount; system calculates and awards Points. See [DL-001 in DECISION_LOG.md](DECISION_LOG.md#dl-001--purchase-verification-mechanism).

**Decision Date:** 2026-09-19

**Status:** ✅ DECIDED

---

## OQ-002 — Customer Authentication Method (Phone vs Email OTP)

**Question:**  
Should the primary Customer authentication method be phone OTP (SMS) or email OTP?

**Why it matters:**  
Phone OTP via SMS requires a third-party SMS provider (Supabase integrates Twilio). SMS delivery is not 100% reliable and has ongoing cost per OTP. Email OTP is free but requires the Customer to have email access on their phone.

**Possible Options:**

| Option | Description | Cost | Reliability |
|--------|-------------|------|-------------|
| A | Phone OTP (SMS) is primary | Per-SMS cost | Variable (carrier dependent) |
| B | Email OTP is primary | Free | High (but requires email access) |
| C | Both available; user chooses | Higher implementation | Combined reliability |

**Impact:**  
- CA-001 (Join Page) screen design
- FR-CAUTH-001, FR-CAUTH-002 (SRS)
- Supabase Auth configuration (phone vs email provider)

**Decision:** OPEN

**Decision Date:** —

**Status:** 🟡 OPEN

---

## OQ-003 — Staff Workflow for Purchase Entry

**Question:**  
Once the purchase verification mechanism (OQ-001) is decided, how exactly does Business Staff identify the Customer at the counter?

**Sub-questions:**
- Does the Customer show their phone (with QR or phone number visible)?
- Does the Staff type the Customer's phone number to look them up?
- Does the System display a customer search in the counter terminal?
- Can Staff award Points without finding the Customer in the system?

**Depends on:** OQ-001

**Decision:** OPEN — cannot decide until OQ-001 is resolved

**Status:** 🟡 OPEN (blocked by OQ-001)

---

## OQ-004 — Point Deduction Timing for Redemption

**Question:**  
Should Points be deducted from the Customer's balance at the moment the Redemption Ticket is created, or at the moment the Staff verifies the ticket?

**Options:**

| Option | Description | Risk |
|--------|-------------|------|
| A | Deduct at ticket creation (current implementation) | Customer may lose Points if ticket expires unused |
| B | Deduct at staff verification | Points not deducted until reward is physically given; requires a different flow |

**Current behaviour:** Points deducted at ticket creation (Option A).

**Impact:**
- FR-REDEEM-002 (SRS)
- Redemption Ticket atomicity logic
- Customer-facing copy ("Points are reserved when you generate your ticket")

**Decision:** OPEN — currently defaulting to Option A but not formally decided

**Status:** 🟡 OPEN

---

## OQ-005 — Multi-Branch / Multi-Location Support

**Question:**  
If a Business has multiple physical branches, should they share one loyalty programme (one `businesses` record) or have separate loyalty programmes per branch?

**Options:**

| Option | Description |
|--------|-------------|
| A | Each branch = separate Business entity | Fully isolated; simple |
| B | One Business, multiple locations; Points earned at any branch | Requires location concept in data model |

**Impact:**
- Database design (`businesses`, `business_customers`, `purchases`)
- QR code design (one QR per branch or one QR for all?)
- Analytics (per-branch or aggregate)

**Decision:** DEFERRED — Out of scope for MVP. Each Business entity = one location.

**Status:** 🔵 DEFERRED to post-MVP

---

## OQ-006 — Duplicate / Fake Purchase Prevention

**Question:**  
How do we prevent a Staff member from recording the same bill twice, or a Customer from colluding with Staff to record fake purchases?

**Depends on:** OQ-001 (purchase verification mechanism)

**Possible approaches:**
- Receipt number uniqueness check
- Audit log review by Business Owner
- Transaction cooldown period (e.g. max 1 earn transaction per 30 minutes per customer)

**Decision:** OPEN — depends on OQ-001

**Status:** 🟡 OPEN (blocked by OQ-001)

---

## OQ-007 — Staff Invitation / Access Management Workflow

**Question:**  
How does a Business Owner grant Business Staff access to the counter terminal?

**Options:**
- Business Owner enters staff email; system sends invite email
- Business Owner creates a shared staff login (not recommended — audit trail lost)
- Staff self-registers with a Business-specific invite code
- Business Owner manually inserts staff member via the dashboard

**Impact:**
- `business_members` table (role='staff')
- Staff invite email template
- Staff access flow in AuthContext
- MVP scope (is staff invite in MVP or deferred?)

**Decision:** OPEN — partially deferred. Staff invite is marked as partial scope in MVP_SCOPE.md.

**Status:** 🟡 OPEN

---

## OQ-008 — Refund and Points Reversal Policy

**Question:**  
If a Customer's purchase is refunded at the Business, should the Points awarded for that purchase be reversed?

**Options:**
- A: Yes — Staff can reverse a Points transaction; creates a negative transaction in ledger
- B: No — Points earned are kept; refunds do not affect Points
- C: Case-by-case at Business Owner discretion

**Impact:**
- `points_transactions` schema (need a `type = 'reversal'` or `type = 'adjustment'`?)
- Business Owner UI (need a "Reverse Points" action?)
- SRS functional requirements for Points ledger

**Decision:** OPEN

**Status:** 🟡 OPEN

---

## OQ-009 — Redemption Ticket Cancellation by Customer

**Question:**  
Should a Customer be able to cancel a Redemption Ticket and receive their Points back?

**Current behaviour:** Points are deducted at ticket creation; no cancellation mechanism exists.

**Options:**
- A: No cancellation; Points are permanently deducted at ticket creation
- B: Cancellation allowed within a short window (e.g. 5 minutes after creation)
- C: Cancellation allowed at any time while ticket is in `pending` state

**Impact:**
- `reward_redemptions` table (need a `cancelled` status?)
- Points reversal logic
- Customer-facing UI (cancel button on ticket screen)

**Decision:** OPEN — currently defaulting to No Cancellation (Option A)

**Status:** 🟡 OPEN

---

## OQ-010 — Commercial / Pricing Model

**Question:**  
What is Repeato's business model? How are Businesses charged?

**Options:**
- Freemium (free tier + paid tiers)
- Flat subscription (monthly fee per Business)
- Per-transaction or per-Customer fee
- Hybrid

**Impact:**
- Platform Admin dashboard requirements
- Billing / subscription infrastructure
- Customer count limits, feature gates

**Decision:** DEFERRED — Out of scope for MVP phase.

**Status:** 🔵 DEFERRED to post-MVP

---

## OQ-011 — Points Expiry Policy

**Question:**  
Do Loyalty Points expire? If so, when and how?

**Options:**
- No expiry (points never expire)
- Fixed expiry (e.g. 12 months from last activity)
- Rolling expiry (e.g. 6 months of inactivity)

**Impact:**
- `points_transactions` schema
- Background job for expiry events
- Customer-facing communication

**Decision:** DEFERRED — Points do not expire in MVP.

**Status:** 🔵 DEFERRED to post-MVP

---

## OQ-012 — Offline Operation at Counter Terminal

**Question:**  
If the Business's internet connection drops, can the Staff Counter still verify redemptions?

**Impact:**
- This would require local caching of recent redemption codes
- High complexity and security risk

**Decision:** OPEN — Current design requires internet connection. Offline mode is not in MVP scope.

**Status:** 🟡 OPEN — Likely DEFERRED

---

## OQ-013 — Email Verification on Business Owner Registration

**Question:**  
Should a newly registered Business Owner be required to verify their email address before accessing the dashboard?

**Options:**
- A: Yes — standard practice; reduces fake accounts
- B: No — reduce friction for MVP; verify later

**Current behaviour:** Not enforced in current implementation.

**Impact:**
- Supabase Auth configuration (`confirm_email` setting)
- Onboarding flow (handle "check your email" step)

**Decision:** OPEN

**Status:** 🟡 OPEN

---

## OQ-014 — Loyalty Rule Snapshot at Transaction Time

**Question:**  
Should the active Loyalty Rule parameters be stored with each Points transaction, so that historical transactions always reflect the rules that applied at the time?

**Options:**
- A: No snapshot — store only computed `points` value (current implementation)
- B: Store rule snapshot in `metadata` JSONB column of `points_transactions`

**Impact:**
- `points_transactions.metadata` column usage
- Historical reporting accuracy
- Database storage (slightly larger per row)

**Current behaviour:** Only computed Points value is stored (Option A).

**Decision:** OPEN — Option A is the default; Option B may be added as an enhancement

**Status:** 🟡 OPEN

---

## OQ-015 — Error Monitoring / Logging Tool

**Question:**  
What tool should be used for production error monitoring?

**Candidates:** Sentry, LogRocket, PostHog, custom logging

**Impact:** TR-LOG-002 (TRD); production deployment configuration

**Decision:** OPEN

**Status:** 🟡 OPEN

---

## OQ-016 — In-App Notification System

**Question:**  
Should there be an in-app notification system (e.g. "You earned 20 points!")?

**Options:**
- A: Toast-only (current — brief, non-persistent)
- B: Persistent notification centre in the Customer app
- C: None for MVP

**Decision:** OPEN — Currently Toast-only notifications are implemented.

**Status:** 🟡 OPEN

---

## OQ-017 — File Upload Size Limit

**Question:**  
What is the maximum file size for Business logo and banner uploads?

**Candidates:** 2 MB, 5 MB, 10 MB

**Impact:** Storage configuration; client-side validation

**Decision:** OPEN

**Status:** 🟡 OPEN

---

## OQ-018 — Points Balance Consistency (Denormalised vs Ledger)

**Question:**  
How do we guarantee that `business_customers.total_points` always equals the sum of the `points_transactions` ledger for that customer/business pair?

**Options:**
- A: Atomic client-side updates (current — update both in same async block; no true atomicity)
- B: PostgreSQL trigger that keeps `total_points` in sync with the ledger
- C: Supabase RPC (Postgres function) wrapping both writes in a transaction
- D: Recompute `total_points` from ledger on every query (no denormalisation)

**Impact:**
- FR-CONS-001, FR-CONS-002, FR-CONS-004 (SRS)
- Database design
- Risk of data inconsistency (currently medium risk with Option A)

**Decision:** Hybrid — Supabase RPC (Postgres functions) for all Points writes; `total_points` retained as a fast-read denormalised cache. See [DL-002 in DECISION_LOG.md](DECISION_LOG.md#dl-002--points-balance-consistency).

**Decision Date:** 2026-09-19

**Status:** ✅ DECIDED

---

## OQ-019 — Realtime Subscription for Counter Terminal

**Question:**  
Should the Staff Counter terminal use Supabase Realtime to receive live updates when a redemption ticket is verified, or is page-refresh / manual-submit sufficient?

**Impact:** TR-RT-002 (TRD); UX complexity

**Decision:** OPEN

**Status:** 🟡 OPEN

---

## OQ-020 — Supabase Plan Selection

**Question:**  
Will Repeato use the Supabase Free tier or a paid plan for production?

**Impact:**
- Storage limits, connection limits, backup frequency
- TR-BCK-001 (TRD)

**Decision:** OPEN

**Status:** 🟡 OPEN

---

## OQ-021 — SMS OTP Provider and Cost

**Question:**  
Which SMS provider is used for phone OTP (via Supabase Auth), and what is the cost per OTP?

**Current Supabase default:** Twilio

**Impact:**
- Production readiness for Customer phone authentication
- Per-OTP cost at scale

**Decision:** OPEN

**Status:** 🟡 OPEN

---

## OQ-022 — State Management Library

**Question:**  
Should a formal state management library (e.g. React Query, Zustand, TanStack Query) be added?

**Current approach:** React Context + local component state

**Impact:**
- Server-state caching (avoids redundant refetches)
- Developer experience for complex data flows

**Decision:** OPEN — likely DEFERRED to post-MVP unless pain points arise during development

**Status:** 🔵 OPEN — low priority

---

## OQ-023 — Atomicity for Redemption Operation

**Question:**  
Should the three-step redemption operation (deduct points → create ticket → log transaction) be implemented as a PostgreSQL RPC function to guarantee atomicity?

**Current implementation:** Client-side sequential writes (not truly atomic)

**Impact:**
- FR-REDEEM-003 (SRS) — atomicity requirement
- Risk: partial state on network failure (points deducted, ticket not created)

**Decision:** Yes — `create_redemption()` and `verify_redemption()` Postgres RPC functions. Ticket code generated in the browser; passed as parameter. See [DL-003 in DECISION_LOG.md](DECISION_LOG.md#dl-003--redemption-atomicity).

**Decision Date:** 2026-09-19

**Status:** ✅ DECIDED

---

## OQ-024 — Redemption Code Space for High-Volume Businesses

**Question:**  
The current code format `RPT-[XXXX]-[1000-9999]` gives ~60,000+ combinations per prefix. Is this sufficient for production use?

**Analysis:**
- Per 24-hour window per business, if 100 redemptions occur: 100/60,000 = 0.17% collision chance
- For very high-volume businesses: may need to increase randomness

**Decision:** OPEN — low priority for MVP; revisit if volume justifies

**Status:** 🟡 OPEN — low priority

---

## OQ-025 — Server-Side Points Calculation Validation

**Question:**  
Should Points calculations be validated server-side (via Postgres function) to prevent client-side manipulation?

**Options:**
- A: Trust client-calculated values (current)
- B: Recalculate in a Postgres function; reject mismatches

**Impact:** Security posture for Points awarding

**Decision:** OPEN

**Status:** 🟡 OPEN

---

## OQ-026 — Rate Limiting on Verification Endpoint

**Question:**  
Should the redemption code verification endpoint be rate-limited to prevent brute-force code guessing?

**Options:**
- Vercel Edge middleware rate limiting
- Supabase function rate limiting
- No rate limiting (rely on code space size)

**Decision:** OPEN

**Status:** 🟡 OPEN

---

## OQ-027 — Storage Delete Policy

**Question:**  
Who can delete files from the `cafe-assets` Storage bucket, and when should old files be cleaned up?

**Impact:** Storage costs; Storage RLS policies

**Decision:** OPEN

**Status:** 🟡 OPEN

---

## Summary: Open Decisions by Priority

### 🔴 BLOCKING (must decide before any implementation)

| ID | Question |
|----|----------|
| OQ-001 | Purchase verification mechanism |
| OQ-018 | Points balance consistency (atomicity) |
| OQ-023 | Redemption atomicity (RPC vs client) |

### 🔴 CRITICAL (must decide before MVP launch)

| ID | Question |
|----|----------|
| OQ-002 | Customer authentication method |
| OQ-003 | Staff customer identification workflow |
| OQ-007 | Staff invitation workflow |
| OQ-013 | Email verification on registration |

### 🟡 IMPORTANT (should decide early)

| ID | Question |
|----|----------|
| OQ-004 | Point deduction timing |
| OQ-006 | Duplicate purchase prevention |
| OQ-008 | Refund and Points reversal |
| OQ-009 | Ticket cancellation |
| OQ-014 | Loyalty rule snapshot |
| OQ-015 | Error monitoring tool |
| OQ-016 | In-app notifications |
| OQ-017 | File upload size limit |
| OQ-019 | Realtime for counter |
| OQ-020 | Supabase plan |
| OQ-021 | SMS OTP provider |
| OQ-025 | Server-side calculation validation |
| OQ-026 | Rate limiting |

### 🔵 DEFERRED (post-MVP)

| ID | Question |
|----|----------|
| OQ-005 | Multi-branch support |
| OQ-010 | Commercial model |
| OQ-011 | Points expiry |
| OQ-022 | State management library |

---

*This document must be updated as decisions are made. Record the decision, rationale, and date.*
