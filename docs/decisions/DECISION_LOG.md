# Decision Log
**Product:** Repeato  
**Version:** 0.1  
**Date:** 2026-09-19  
**Status:** ACTIVE

> This log records all formally made decisions.  
> When a decision in OPEN_QUESTIONS.md is resolved, record it here and mark it DECIDED there.

---

## Decision Timeline

| Date | ID | Title | Status |
|------|----|-------|--------|
| 2026-09-19 | DL-001 | Purchase Verification Mechanism | ✅ DECIDED |
| 2026-09-19 | DL-002 | Points Balance Consistency | ✅ DECIDED |
| 2026-09-19 | DL-003 | Redemption Atomicity | ✅ DECIDED |

---

## DL-001 — Purchase Verification Mechanism

**Source:** OQ-001  
**Date:** 2026-09-19  
**Status:** ✅ DECIDED

**Question:**  
What is the mechanism by which the system confirms a Customer made a real purchase at a Business before awarding Points?

**Decision:**  
**Option E — Staff identifies Customer by phone number and enters the purchase amount.**

Staff at the counter asks the Customer for their registered phone number. Staff opens the counter terminal, looks up the Customer by phone (or name), enters the purchase bill amount in ₹, and submits. The system calculates Points using the active Loyalty Rule and awards them.

**Rationale:**
- Matches the real-world café loyalty UX that customers already understand (how Starbucks, local café punch cards, etc. work)
- Zero Customer friction — Customer does not need to open an app at the counter
- Zero hardware dependency — works on any device with a browser
- Lowest implementation effort — the `purchases` table schema already supports this exactly
- Fraud risk (insider staff fraud) is the same as any loyalty programme; Business Owners can audit all staff transactions in the Transactions view
- Works even if the Customer's phone is dead or they forgot to bring it

**Consequences:**
- `purchases.verified_by_staff_id` records the staff member on every purchase
- Customer lookup must support search by phone and by name in `StaffVerificationView`
- Optional: add `purchases.receipt_number` as a nullable audit field (not enforced; at Business Owner's discretion)
- Optional future hardening: transaction frequency heuristics to detect anomalous staff behaviour
- POS integration (Option D) is deferred to post-MVP as a premium feature

**Blocks cleared:** F-008, FR-PURCH-001 to FR-PURCH-007, Staff Counter terminal implementation

---

## DL-002 — Points Balance Consistency

**Source:** OQ-018  
**Date:** 2026-09-19  
**Status:** ✅ DECIDED

**Question:**  
How do we guarantee that `business_customers.total_points` always equals the sum of all `points_transactions` entries for that (customer_id, business_id) pair?

**Decision:**  
**Hybrid approach: Supabase RPC (Postgres functions) for all Points writes; `total_points` retained as a fast-read denormalised cache.**

All operations that modify Points (join, earn, redeem, welcome bonus) are implemented as named Postgres functions called via `supabase.rpc()`. Each function wraps all related database writes inside a single Postgres transaction (`BEGIN/COMMIT`). The `total_points` column in `business_customers` is updated inside these functions. A `reconcile_total_points()` admin function is provided to repair any divergence discovered.

**Rationale:**
- Sequential client-side HTTP requests (current implementation) are not atomic — a network failure between any two steps produces corrupt state (ghost points or lost points)
- A Postgres trigger (Option B) would solve the ledger/balance sync but would not make the `purchases` INSERT and balance UPDATE atomic with each other — only one of the three steps is covered by the trigger
- The RPC approach covers all steps in one database transaction — if any step fails, all are rolled back by Postgres
- `total_points` is retained (not dropped) because it provides O(1) balance reads for the wallet and eligibility checks; without it, every balance display requires a SUM over potentially thousands of transaction rows
- If `total_points` diverges, the ledger (append-only `points_transactions`) is always the source of truth; `reconcile_total_points()` resets it from the ledger sum

**RPC functions to implement:**
- `join_business(p_business_id, p_customer_id, p_welcome_points)` — used by QR join flow
- `earn_points(p_business_id, p_customer_id, p_amount, p_points, p_staff_id, p_source)` — used by Staff Counter
- `create_redemption(p_business_id, p_customer_id, p_reward_id, p_ticket_code, p_expires_at)` — used by Customer reward redemption
- `verify_redemption(p_code, p_staff_id, p_business_id)` — used by Staff Counter verification
- `reconcile_total_points(p_business_id, p_customer_id)` — admin/repair tool

**Blocks cleared:** FR-CONS-001, FR-CONS-002, FR-CONS-004

---

## DL-003 — Redemption Atomicity

**Source:** OQ-023  
**Date:** 2026-09-19  
**Status:** ✅ DECIDED

**Question:**  
Should the three-step redemption operation be implemented as a PostgreSQL function (RPC) to guarantee atomicity?

**Decision:**  
**Yes — `create_redemption()` Postgres function (RPC).**

The current sequential three-step redemption (deduct points → create ticket → log transaction) is replaced by a single `supabase.rpc('create_redemption', {...})` call. All three database writes happen inside one Postgres transaction. The ticket code is generated in the browser before calling the RPC and passed as a parameter. The `FOR UPDATE` row lock on `business_customers` prevents concurrent over-redemption. The `UNIQUE` constraint on `reward_redemptions.code` makes the call idempotent on retry.

**Rationale:**
- The current worst-case failure mode is: Customer's points deducted, ticket never created — the Customer loses points for nothing
- Client-side compensation writes (Option B) are fragile — the compensation itself can fail, and they create confusing paired records in the audit ledger
- The Postgres function approach eliminates the failure mode entirely: either all three writes commit, or none do
- `FOR UPDATE` on the membership row prevents a race condition where two concurrent redemption requests both read a sufficient balance and both create tickets, resulting in a negative balance
- The `UNIQUE` constraint on `reward_redemptions.code` provides retry-safety: if the RPC times out and the client retries with the same code, the second call fails with a unique violation, which the client interprets as "ticket was already created — look it up by code"

**Additional: `verify_redemption()` RPC for staff counter:**
The staff verification step (mark ticket as `redeemed`) is also implemented as an RPC function `verify_redemption(p_code, p_staff_id, p_business_id)`. This ensures status transitions are atomic and enforces the business_id boundary check at the database level.

**Blocks cleared:** FR-REDEEM-003 (atomicity requirement)

