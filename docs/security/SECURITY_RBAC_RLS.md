# Security, RBAC & RLS Specification
**Product:** Repeato  
**Version:** 0.1 (Documentation Phase)  
**Date:** 2026-09-19  
**Status:** DRAFT — Awaiting review

---

## 1. Role Definitions

| Role | Code Value | Description |
|------|-----------|-------------|
| **Customer** | `customer` | End-user of the loyalty programme |
| **Business Owner** | `business_owner` | Registered owner of one or more Businesses |
| **Business Staff** | `business_staff` | Counter operator authorised by a Business Owner |
| **Platform Admin** | `platform_admin` | Repeato internal operator |

---

## 2. Permission Matrix

### 2.1 Business Owner Permissions

| Action | Allowed | Notes |
|--------|---------|-------|
| View their own Business profile | ✅ | |
| Edit their own Business profile | ✅ | |
| View another Business's profile | ❌ | RLS blocks this |
| Edit another Business's data | ❌ | RLS blocks this |
| Create Loyalty Rules | ✅ | For their Business only |
| Edit Loyalty Rules | ✅ | For their Business only |
| View Customers (their Business) | ✅ | |
| View Customers (other Business) | ❌ | RLS blocks this |
| Create Rewards | ✅ | For their Business only |
| Edit Rewards | ✅ | For their Business only |
| Delete Rewards | ✅ | Soft delete via `is_active = false` |
| Award Points to Customers | ✅ | For their Business only |
| Verify Redemptions | ✅ | For their Business only |
| View Transactions | ✅ | For their Business only |
| View Analytics | ✅ | For their Business only |
| Download QR Code | ✅ | For their Business only |
| Manage Business Settings | ✅ | For their Business only |
| Invite Business Staff | 🔶 OPEN | OQ-007: Staff invite workflow not finalised |
| View Platform-wide data | ❌ | Platform Admin only |

### 2.2 Business Staff Permissions

| Action | Allowed | Notes |
|--------|---------|-------|
| Access Staff Counter terminal | ✅ | |
| Verify Redemption Tickets | ✅ | For their assigned Business only |
| Award Points (purchase entry) | ✅ | For their assigned Business only; mechanism OPEN (OQ-001) |
| View Customer list | ❌ | Owner-only |
| Edit Loyalty Rules | ❌ | Owner-only |
| Manage Rewards | ❌ | Owner-only |
| View Transactions ledger | ❌ | Owner-only in MVP |
| View Analytics | ❌ | Owner-only |
| View/download QR Code | ✅ | |
| Edit Business Settings | ❌ | Owner-only |

### 2.3 Customer Permissions

| Action | Allowed | Notes |
|--------|---------|-------|
| View own profile | ✅ | |
| Edit own profile (name, email) | ✅ | |
| View own Points balance (per Business) | ✅ | |
| View own transaction history | ✅ | |
| Join a Business loyalty programme | ✅ | |
| View active Rewards (enrolled Business) | ✅ | |
| Create Redemption Ticket | ✅ | If balance is sufficient |
| View own Redemption Tickets | ✅ | |
| Access Business Dashboard | ❌ | |
| View other Customers' data | ❌ | |
| View another Customer's Points | ❌ | |
| Self-award Points | ❌ | Requires staff verification |
| View business analytics | ❌ | |

### 2.4 Platform Admin Permissions

| Action | Allowed | Notes |
|--------|---------|-------|
| View all Businesses | ✅ | |
| Manage all Businesses | ✅ | |
| View all Customers | ✅ | |
| Resolve disputes | ✅ | |
| Delete accounts | ✅ | |
| Access platform analytics | ✅ | |
| Bypass RLS | ✅ | Using service role key; never from browser |

> **NOTE:** Platform Admin access uses the Supabase **service role key**, which bypasses RLS. This key must never be exposed in the browser and must only be used in server-side operations or the Supabase Dashboard.

---

## 3. Tenant Isolation Rules

### Fundamental Rule

> **Business A must NEVER be able to read or modify Business B's data.**

This is enforced at three layers:
1. **Application Layer:** `activeBusiness.id` is set by the auth session; API calls use this ID
2. **Service Layer:** All queries explicitly filter by `business_id`
3. **Database Layer (RLS):** Policies verify `business_id` against the user's `business_members` entry

### Tenant Isolation by Table

| Table | Isolation Enforcement |
|-------|----------------------|
| `businesses` | RLS: Only members may write; all may read |
| `business_members` | RLS: Users see only their own membership rows |
| `customers` | RLS: Customers see only their own row |
| `business_customers` | RLS: Staff/Owner see only their Business's memberships; Customer sees only their own |
| `categories` | RLS: Staff/Owner see only their Business's categories |
| `products` | RLS: Staff/Owner see only their Business's products (auth); public sees active only |
| `loyalty_rules` | RLS: Owner manages their Business's rules; public can read |
| `points_transactions` | RLS: Staff/Owner see their Business's; Customer sees their own |
| `rewards` | RLS: Staff/Owner manage their Business's rewards; public sees active only |
| `reward_redemptions` | RLS: Staff/Owner see their Business's; Customer sees their own |
| `purchases` | RLS: Staff/Owner see their Business's purchases |
| `qr_codes` | RLS: Staff/Owner see their Business's QR record |

---

## 4. RLS Policy Specification

All RLS policies follow two helper patterns:

### Pattern A — Business Member Check
```sql
EXISTS (
  SELECT 1 FROM public.business_members
  WHERE business_members.business_id = [table].business_id
  AND business_members.user_id = auth.uid()
)
```

### Pattern B — Customer Self Check
```sql
EXISTS (
  SELECT 1 FROM public.customers
  WHERE customers.id = [table].customer_id
  AND customers.user_id = auth.uid()
)
```

### Pattern C — Direct User Check
```sql
user_id = auth.uid()
```

---

### RLS Policies by Table

#### `public.businesses`
```sql
-- Public read: anyone may view business profiles (for join page)
CREATE POLICY "Public businesses access" ON businesses
  FOR SELECT USING (true);

-- Write: only business members
CREATE POLICY "Business owners edit business" ON businesses
  FOR ALL USING (Pattern A);
```

#### `public.business_members`
```sql
-- User may view their own membership rows
CREATE POLICY "Business members self view" ON business_members
  FOR SELECT USING (user_id = auth.uid());
```

#### `public.customers`
```sql
-- Customer may view and edit their own profile
CREATE POLICY "Customer self view & edit" ON customers
  FOR ALL USING (user_id = auth.uid());

-- Customer may create their own profile
CREATE POLICY "Customer self insert" ON customers
  FOR INSERT WITH CHECK (user_id = auth.uid());
```

#### `public.business_customers`
```sql
-- Business staff/owner: full access to their Business's memberships
CREATE POLICY "Business staff manage business_customers" ON business_customers
  FOR ALL USING (Pattern A);

-- Customer: view their own memberships
CREATE POLICY "Customer view own business memberships" ON business_customers
  FOR SELECT USING (Pattern B);

-- Customer: may join a business (insert own record)
CREATE POLICY "Customer self join business" ON business_customers
  FOR INSERT WITH CHECK (Pattern B);
```

#### `public.products`
```sql
-- Public: view active products only
CREATE POLICY "Public products view" ON products
  FOR SELECT USING (is_available = true);

-- Business staff/owner: full management
CREATE POLICY "Business staff view products" ON products
  FOR ALL USING (Pattern A);
```

#### `public.loyalty_rules`
```sql
-- Public: read loyalty rules (needed to show welcome points on join page)
CREATE POLICY "Public loyalty rules view" ON loyalty_rules
  FOR SELECT USING (true);

-- Business owners: manage their own rules
CREATE POLICY "Business owners manage rules" ON loyalty_rules
  FOR ALL USING (Pattern A);
```

#### `public.points_transactions`
```sql
-- Business staff: view their business's transactions
CREATE POLICY "Business staff view transactions" ON points_transactions
  FOR SELECT USING (Pattern A);

-- Business staff: insert earn transactions
CREATE POLICY "Business staff insert transactions" ON points_transactions
  FOR INSERT WITH CHECK (Pattern A);

-- Customer: view their own transactions
CREATE POLICY "Customer view own transactions" ON points_transactions
  FOR SELECT USING (Pattern B);

-- Customer: insert (welcome bonus on join)
CREATE POLICY "Customer self insert transactions" ON points_transactions
  FOR INSERT WITH CHECK (Pattern B);
```

#### `public.rewards`
```sql
-- Public: view active rewards
CREATE POLICY "Public rewards view" ON rewards
  FOR SELECT USING (is_active = true);

-- Business staff/owner: manage their rewards
CREATE POLICY "Business staff view & manage rewards" ON rewards
  FOR ALL USING (Pattern A);
```

#### `public.reward_redemptions`
```sql
-- Business staff/owner: manage their business's redemptions
CREATE POLICY "Business staff manage redemptions" ON reward_redemptions
  FOR ALL USING (Pattern A);

-- Customer: view their own redemptions
CREATE POLICY "Customer view own redemptions" ON reward_redemptions
  FOR SELECT USING (Pattern B);

-- Customer: insert their own redemption tickets
CREATE POLICY "Customer self insert redemptions" ON reward_redemptions
  FOR INSERT WITH CHECK (Pattern B);
```

#### `public.purchases`
```sql
-- Business staff/owner: manage purchases
CREATE POLICY "Business staff manage purchases" ON purchases
  FOR ALL USING (Pattern A);
```

#### Storage: `cafe-assets` bucket
```sql
-- Public read
CREATE POLICY "Public Read Cafe Assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'cafe-assets');

-- Authenticated upload
CREATE POLICY "Authenticated Upload Cafe Assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cafe-assets' AND auth.role() = 'authenticated');

-- Authenticated update
CREATE POLICY "Authenticated Update Cafe Assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cafe-assets' AND auth.role() = 'authenticated');
```

> **SECURITY GAP — To Address:**  
> The current Storage RLS allows ANY authenticated user to upload to `cafe-assets`, not just Business Owners. The upload policy should be tightened to verify the uploader is a business member.

---

## 5. Authentication Security

| Requirement | Implementation |
|-------------|---------------|
| Business Owner login | Email + password via Supabase Auth (`signInWithPassword`) |
| Customer login | Phone or email OTP via Supabase Auth (`signInWithOtp`) |
| Session persistence | Supabase Auth manages JWT refresh tokens |
| Session expiry | Supabase Auth default; tokens auto-refreshed |
| Logout | `supabase.auth.signOut()` invalidates session |
| Password requirements | Minimum 8 characters (enforced at registration) |
| OTP validity | Supabase default (typically 5–10 minutes) |
| OTP re-request | Allowed after 30-second cooldown |

---

## 6. Session Handling

| Scenario | Behaviour |
|----------|-----------|
| Page refresh | Session is restored from Supabase Auth local storage |
| Session expiry | Auth listener fires `SIGNED_OUT`; user redirected to login |
| Multiple tabs | All tabs share the same session; logout in one tab propagates |
| Invalid token | Supabase Auth rejects the request; app re-routes to login |
| Cross-role access | `ProtectedRoute` checks role before rendering; DB RLS is the final gate |

---

## 7. Sensitive Operations

The following operations require elevated security attention:

| Operation | Security Measure |
|-----------|-----------------|
| Points awarding | Requires authenticated staff; staff ID is recorded on every purchase |
| Redemption verification | Staff ID recorded; ticket transitions to terminal state immediately |
| Loyalty rule changes | Owner-only; all changes take effect going forward (no backdating) |
| Business Settings changes | Owner-only |
| Customer data access | Scoped by RLS to the authenticated Business's customers |
| Platform Admin access | Service role key; never exposed to browser |

---

## 8. Points Manipulation Prevention

| Attack Vector | Prevention |
|---------------|-----------|
| Customer self-awarding points via API | No RLS policy allows customers to INSERT into `points_transactions` without being a business member, except for welcome bonus via a controlled code path |
| Staff awarding fraudulent points | Staff ID recorded; Business Owner can audit all transactions |
| Replay attacks on point awarding | Each purchase creates a unique purchase record; duplicate detection via timestamp + staff + amount heuristics (future improvement) |
| Manipulating `business_id` in API calls | RLS verifies `business_id` against the authenticated user's `business_members`; cross-business writes are rejected |

> **OPEN DECISION — OQ-025:** Whether to implement server-side validation of Points calculations via a Postgres function (to prevent client-side manipulation) or trust the client-calculated value.

---

## 9. Redemption Fraud Prevention

| Attack Vector | Prevention |
|---------------|-----------|
| Screenshot sharing of Redemption Ticket | Single-use code; staff verification marks it `redeemed` immediately |
| Using an expired ticket | `expires_at` check at verification time; auto-updates status to `expired` |
| Reusing an already-redeemed ticket | Status check: `redeemed` is a terminal state; cannot be re-verified |
| Manually crafting a ticket code | Codes are cryptographically random; the search space makes guessing impractical in 24h |
| Code brute-force attack | Rate limiting (OPEN DECISION — OQ-026: implement rate limiting on the verification endpoint) |
| Wrong-Business redemption | RLS and application-level check verify `business_id` on the ticket matches the staff's Business |

---

## 10. Secure Transaction IDs

| Entity | ID Type | Generation |
|--------|---------|-----------|
| All database records | UUID v4 | PostgreSQL `uuid_generate_v4()` — cryptographically random |
| Redemption Ticket codes | `RPT-XXXX-NNNN` | `crypto.getRandomValues()` in browser |

> **NOTE:** Redemption Ticket codes are intentionally human-readable (for counter entry). The code space is ~260,000 combinations per prefix. For a 24-hour window per single Business, the collision risk is low. See OQ-024 for discussion of high-volume scenarios.

---

## 11. Storage Access Security

| Operation | Allowed | Notes |
|-----------|---------|-------|
| Read any file in `cafe-assets` | ✅ Public | Business logos are public by design |
| Upload to `cafe-assets` | ✅ Authenticated only | SECURITY GAP: should be restricted to Business Members |
| Update files in `cafe-assets` | ✅ Authenticated only | Same gap as above |
| Delete files | ❌ Not currently defined | DECISION REQUIRED — OQ-027 |

---

## 12. Audit Requirements

| Record Type | Audit Fields |
|-------------|-------------|
| Points earned | `business_id`, `customer_id`, `points`, `type`, `source`, `created_at` |
| Points redeemed | `business_id`, `customer_id`, `points`, `type=redeem`, `source` (includes ticket code), `created_at` |
| Redemption verified | `redeemed_by_staff_id`, `redeemed_at`, `status=redeemed` |
| Purchase recorded | `verified_by_staff_id`, `amount`, `points_awarded`, `created_at` |

**Audit records must never be deleted or modified by any role except Platform Admin.**

---

## 13. Known Security Gaps (Pre-Launch TODOs)

| Gap | Severity | Resolution |
|-----|----------|-----------|
| Storage upload not restricted to business members | Medium | Tighten storage RLS policy |
| No rate limiting on OTP or redemption verification | Medium | Implement Supabase/Vercel rate limiting |
| Customer welcome bonus can theoretically be inserted by any authenticated customer for any business | Low | The insert policy checks `customer_id` but not `business_id` membership; add membership check |
| `total_points` denormalised balance can theoretically diverge from ledger sum | High | Implement atomic updates or triggers; see OQ-018 |
| Redemption ticket code space may be insufficient for high-volume businesses | Low | Increase code randomness for production; see OQ-024 |
| No server-side Points calculation validation | Medium | Consider Postgres RPC for points award; see OQ-025 |

---

*Document version 0.1 — Security specification must be reviewed by the development lead before any feature implementation begins.*
