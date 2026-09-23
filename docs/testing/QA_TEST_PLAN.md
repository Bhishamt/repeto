# QA / Test Plan
**Product:** Repeato  
**Version:** 0.1 (Documentation Phase)  
**Date:** 2026-09-19  
**Status:** DRAFT — Awaiting review

> Test IDs follow the format: `[AREA]-[NNN]`

---

## 1. Test Strategy

| Test Type | Coverage |
|-----------|---------|
| Functional (happy path) | All features in MVP_SCOPE.md |
| Negative / error path | All failure conditions from SRS.md |
| Security / tenant isolation | All cross-tenant and cross-role scenarios |
| Authentication | Business Owner and Customer auth flows |
| RLS verification | Direct database-level cross-tenant query attempts |
| UI / responsive | Mobile (375px) and desktop (1024px) |
| Empty state | All documented empty states |
| Regression | Re-run all P0 tests after any significant change |
| Database persistence | Points and redemption state survive page refresh |

---

## 2. Test Environment Setup

**Required:**
- Supabase project connected (real, not mock)
- Two separate test Business accounts (Business A and Business B)
- Two separate test Customer accounts
- Migrations 001 and 002 applied to test Supabase project

**Test Accounts:**
- `business_a@test.com` — owner of "Business A"
- `business_b@test.com` — owner of "Business B"
- `staff_a@test.com` — staff of "Business A"
- Customer phone: test phone number configured in Supabase
- Customer email: `customer1@test.com`

---

## 3. Authentication Tests

### Business Owner Authentication

| Test ID | Precondition | Steps | Expected | Status |
|---------|-------------|-------|----------|--------|
| AUTH-001 | No account | Register with valid email + password | Account created; redirect to /onboarding | |
| AUTH-002 | Account exists | Login with correct credentials | Redirect to /dashboard | |
| AUTH-003 | Account exists | Login with incorrect password | Error: "Invalid email or password" | |
| AUTH-004 | Account exists | Login with unknown email | Same error (no field disclosure) | |
| AUTH-005 | Account exists | Register with existing email | Error: "Email already in use" | |
| AUTH-006 | — | Register with too-short password | Validation error inline | |
| AUTH-007 | Logged in | Click logout | Session cleared; redirect to / | |
| AUTH-008 | Session active | Refresh page | Session restored; stay on dashboard | |

### Customer Authentication

| Test ID | Precondition | Steps | Expected | Status |
|---------|-------------|-------|----------|--------|
| AUTH-009 | No account | Enter valid phone on join page | OTP sent | |
| AUTH-010 | — | Enter correct OTP | Customer authenticated; profile created | |
| AUTH-011 | — | Enter incorrect OTP | Error: "Incorrect code" | |
| AUTH-012 | — | Let OTP expire | Error: "Code expired. Request a new one." | |
| AUTH-013 | — | Request OTP resend | New OTP sent (after 30s cooldown) | |
| AUTH-014 | Already logged in | Navigate to /join/:slug | Skip auth; go directly to join flow | |
| AUTH-015 | — | Enter invalid phone format | Validation error | |

---

## 4. Customer QR Onboarding Tests

| Test ID | Precondition | Steps | Expected | Status |
|---------|-------------|-------|----------|--------|
| QR-001 | Valid business slug | Navigate to /join/bluebird-coffee | Join page loads with correct Business branding | |
| QR-002 | Invalid slug | Navigate to /join/nonexistent | "Business not found" error page | |
| QR-003 | Unauthenticated | Navigate to join page | Auth flow presented | |
| QR-004 | First visit | Complete auth on join page | Membership created; welcome points awarded | |
| QR-005 | Already enrolled | Navigate to join page (same slug) | "You're already a member" screen; shows current balance | |
| QR-006 | Check DB | Verify after QR-004 | `business_customers` row created; `points_transactions` row with type=welcome | |
| QR-007 | QR scan count | Navigate to join page | `qr_codes.scans_count` incremented by 1 | |

---

## 5. Customer Flow Tests

| Test ID | Precondition | Steps | Expected | Status |
|---------|-------------|-------|----------|--------|
| CUST-001 | Enrolled customer | Open /app/wallet | Membership card(s) shown with correct balance | |
| CUST-002 | No memberships | Open /app/wallet | Empty state with QR scan instruction | |
| CUST-003 | Balance ≥ reward cost | Open /app/rewards → select reward | "Redeem" button enabled | |
| CUST-004 | Balance < reward cost | Open /app/rewards | Reward shown as locked; progress bar shown | |
| CUST-005 | Eligible | Confirm redemption | Points deducted; Redemption Ticket shown | |
| CUST-006 | Ticket displayed | Wait 24h or expire ticket manually | Ticket shows expired state | |
| CUST-007 | Activity log | Open /app/activity | All transactions shown in reverse chronological order | |
| CUST-008 | Profile | Open /app/profile → update name | Name updated; toast shown | |
| CUST-009 | Multi-business | Enrolled in 2 businesses | Both cards shown in wallet; balances independent | |

---

## 6. Business Owner Flow Tests

| Test ID | Precondition | Steps | Expected | Status |
|---------|-------------|-------|----------|--------|
| BIZ-001 | New account | Complete onboarding wizard | Business created; all entities present in DB | |
| BIZ-002 | Business exists | Open /dashboard/overview | KPIs displayed | |
| BIZ-003 | Customers exist | Open /dashboard/customers | Customer list shown with correct data | |
| BIZ-004 | — | Search by customer name | Filtered results | |
| BIZ-005 | — | Open /dashboard/menu → Add Product | Product saved to DB | |
| BIZ-006 | — | Toggle product availability | `is_available` updated in DB | |
| BIZ-007 | — | Open /dashboard/points → Edit rules → Save | Rules updated; toast shown | |
| BIZ-008 | — | Use Live Rule Calculator | Preview updates in real time | |
| BIZ-009 | — | Add a Reward | Reward visible in Customer rewards catalogue | |
| BIZ-010 | — | Deactivate a Reward | Reward no longer shown in Customer catalogue | |
| BIZ-011 | — | Open /dashboard/qr | QR code displayed; download works | |
| BIZ-012 | — | Open /dashboard/settings → Update name → Save | Business name updated; toast shown | |
| BIZ-013 | Customers and transactions | Open /dashboard/analytics | Correct KPIs displayed | |

---

## 7. Purchase and Points Tests

| Test ID | Precondition | Steps | Expected | Status |
|---------|-------------|-------|----------|--------|
| PTS-001 | Customer enrolled | Staff records purchase of ₹200 | Points = floor(200/100)×10+10 = 30 earned | |
| PTS-002 | — | Check DB | `purchases` row created; `points_transactions` earn row created | |
| PTS-003 | — | Check wallet | Customer's balance in `business_customers.total_points` increased | |
| PTS-004 | Rules change | Update rules; then record purchase | New points calculated with new rules | |
| PTS-005 | Rules change | Check old transactions | Old transaction values unchanged | |
| PTS-006 | Customer not enrolled | Staff enters unenrolled customer | Error: "Customer not enrolled at this Business" | |
| PTS-007 | — | Enter purchase amount = 0 | Validation error; no purchase recorded | |
| PTS-008 | Welcome points | Customer joins Business | `welcome_points` from Loyalty Rule awarded as type=welcome transaction | |

---

## 8. Reward and Redemption Tests

| Test ID | Precondition | Steps | Expected | Status |
|---------|-------------|-------|----------|--------|
| RED-001 | Balance ≥ reward cost | Customer redeems reward | Ticket created; points deducted | |
| RED-002 | DB check | After RED-001 | `reward_redemptions` row: status=pending; `points_transactions` row: type=redeem | |
| RED-003 | Balance < reward cost | Customer attempts redemption | Error: "Insufficient points" | |
| RED-004 | Pending ticket | Staff enters correct code at counter | Ticket status = redeemed; staff ID recorded | |
| RED-005 | Already redeemed ticket | Staff re-enters same code | Error: "Already redeemed on [time]" | |
| RED-006 | Expired ticket | Staff enters expired code | Error: "Ticket has expired" | |
| RED-007 | Invalid code | Staff enters non-existent code | Error: "Invalid code. Ticket not found." | |
| RED-008 | Atomic operation | Simulate failure after points deducted but before ticket created | Points must be returned (no partial state) | |
| RED-009 | Points not deducted | Redemption fails entirely | Customer's balance unchanged | |

---

## 9. QR Tests

| Test ID | Precondition | Steps | Expected | Status |
|---------|-------------|-------|----------|--------|
| QRC-001 | Business exists | Open /dashboard/qr | QR code renders correctly | |
| QRC-002 | — | QR code scanned | Browser opens /join/{slug} | |
| QRC-003 | — | Click "Download QR" | PNG file downloaded | |
| QRC-004 | Join page scanned | Scan count | `qr_codes.scans_count` incremented | |

---

## 10. RLS / Tenant Isolation Tests

> **These are the most critical security tests.**

| Test ID | Setup | Attempt | Expected | Status |
|---------|-------|---------|----------|--------|
| RLS-001 | User = Business A owner | Query `business_customers` without `business_id` filter | Only Business A's customers returned | |
| RLS-002 | User = Business A owner | Query `business_customers WHERE business_id = biz_B` | Empty result (RLS blocks) | |
| RLS-003 | User = Business A owner | INSERT `business_customers` with `business_id = biz_B` | Error: RLS violation | |
| RLS-004 | User = Business A owner | Query `points_transactions WHERE business_id = biz_B` | Empty result (RLS blocks) | |
| RLS-005 | User = Business A owner | Query `reward_redemptions WHERE business_id = biz_B` | Empty result (RLS blocks) | |
| RLS-006 | User = Business A owner | UPDATE `loyalty_rules WHERE business_id = biz_B` | Error: RLS violation | |
| RLS-007 | User = Customer | Query `business_customers` | Only their own membership rows returned | |
| RLS-008 | User = Customer | Query `points_transactions` | Only their own transactions returned | |
| RLS-009 | User = Customer | INSERT into `business_customers` for another customer | Error: RLS violation |  |
| RLS-010 | User = Customer | Query `purchases` | Empty / error: no customer read policy on purchases | |
| RLS-011 | User = Business Staff | Query `business_customers WHERE business_id = biz_B` | Empty (not a member of biz_B) | |
| RLS-012 | Unauthenticated | Query `business_customers` | Empty / error: no anon policy | |
| RLS-013 | Unauthenticated | Query `businesses` | Returns all business profiles (public read) | |
| RLS-014 | Unauthenticated | Query `products WHERE is_available = true` | Returns active products (public) | |
| RLS-015 | Unauthenticated | Query `products WHERE is_available = false` | Returns nothing (RLS filters) | |

---

## 11. Security Tests

| Test ID | Attack | Expected | Status |
|---------|--------|----------|--------|
| SEC-001 | Customer navigates to /dashboard/overview | Redirected to login or customer app | |
| SEC-002 | Business Owner navigates to /app/wallet | Redirected or role error | |
| SEC-003 | Unauthenticated user navigates to /dashboard | Redirected to /auth | |
| SEC-004 | Customer manually POSTs a `points_transactions` insert with high points value | RLS blocks if not a business member; welcome bonus policy checked | |
| SEC-005 | Business A staff enters Business B redemption code | Error: "This ticket belongs to a different Business" | |
| SEC-006 | Business A owner attempts to update Business B settings | RLS violation | |
| SEC-007 | Customer attempts to redeem an already-redeemed ticket | Error: "Already redeemed" | |
| SEC-008 | Customer fabricates a Redemption code manually | Code not found in DB | |
| SEC-009 | Customer manually manipulates `business_id` in API call | RLS blocks; returns empty or error | |
| SEC-010 | Unauthenticated user POSTs to join business | Auth check fails; redirect to login | |

---

## 12. UI Tests

| Test ID | Screen | Test | Expected | Status |
|---------|--------|------|----------|--------|
| UI-001 | All | Load on 375px wide mobile | No horizontal overflow; all actions usable | |
| UI-002 | Customer wallet | Load on iOS Safari | Cards render; no layout breakage | |
| UI-003 | Redemption Ticket | Display ticket code | Code legible at counter distance (60cm) | |
| UI-004 | Business Dashboard | Load on 1024px desktop | Sidebar visible; content area fills | |
| UI-005 | Join page | Business branding applied | Correct logo, name, primary colour displayed | |
| UI-006 | All forms | Submit with empty required fields | Validation errors inline; no network call | |
| UI-007 | All async actions | Simulate slow network (throttle) | Loading states shown | |
| UI-008 | Toast notifications | Save settings | Toast appears and disappears | |

---

## 13. Empty State Tests

| Test ID | Screen | Condition | Expected | Status |
|---------|--------|-----------|----------|--------|
| EMPTY-001 | Customer Wallet | No memberships | "Scan a café QR to get started!" message | |
| EMPTY-002 | Customer Rewards | No active rewards at Business | "No rewards available yet" message | |
| EMPTY-003 | Customer Activity | No transactions | "No activity yet" message | |
| EMPTY-004 | Business Customers | No enrolled customers | "No customers yet" message + QR CTA | |
| EMPTY-005 | Business Rewards | No rewards created | "Add your first reward" CTA | |
| EMPTY-006 | Business Transactions | No transactions | "No transactions yet" message | |
| EMPTY-007 | Business Analytics | No data | "Not enough data yet" message | |

---

## 14. Error State Tests

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| ERR-001 | Supabase not configured | App falls back to mock data; no crash | |
| ERR-002 | Network offline | Loading state → timeout → user-friendly error message | |
| ERR-003 | Invalid business slug on join page | "Business not found" error page; no crash | |
| ERR-004 | OTP send failure | "Failed to send OTP" error; retry available | |
| ERR-005 | Redemption fails during creation | Points not deducted; error message shown | |
| ERR-006 | Dashboard data fetch failure | Error message shown; retry option available | |

---

## 15. Database Persistence Tests

| Test ID | Action | Test | Expected | Status |
|---------|--------|------|----------|--------|
| DB-001 | Customer joins business | Refresh page | Membership still shown; welcome points visible | |
| DB-002 | Business Owner updates Loyalty Rules | Refresh page | New rules shown | |
| DB-003 | Redemption Ticket verified | Refresh dashboard | Ticket shows as redeemed | |
| DB-004 | Points awarded | Refresh customer wallet | Updated balance shown | |
| DB-005 | Reward deactivated | Customer refreshes rewards page | Reward no longer shown | |
| DB-006 | Check ledger integrity | Sum `points_transactions` for customer/business | Must equal `business_customers.total_points` | |

---

## 16. Regression Test Suite (Post-Change Checklist)

Run these tests after any significant code change:

- [ ] AUTH-001, AUTH-002, AUTH-009, AUTH-010
- [ ] QR-001, QR-004
- [ ] CUST-005 (redemption)
- [ ] RED-004, RED-005, RED-006
- [ ] PTS-001, PTS-002
- [ ] RLS-001, RLS-002, RLS-007, RLS-008
- [ ] SEC-001, SEC-002, SEC-007
- [ ] DB-006 (ledger integrity)

---

*Document version 0.1 — Test plan must be reviewed and executed before MVP launch.*
