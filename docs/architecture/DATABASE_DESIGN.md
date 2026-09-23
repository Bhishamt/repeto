# Database Design Document
**Product:** Repeato  
**Version:** 0.1 (Documentation Phase)  
**Date:** 2026-09-19  
**Status:** DRAFT — Awaiting review

> Derived from: `supabase/migrations/001_initial_schema.sql` and `002_security_and_realtime.sql`  
> Source documents: PRD.md, SRS.md, SYSTEM_ARCHITECTURE.md

---

## 1. Entity Model Overview

```
auth.users (Supabase Auth)
    │
    ├──► businesses (via business_members)
    │         │
    │         ├──► business_members (owner / staff)
    │         ├──► loyalty_rules
    │         ├──► products (via categories)
    │         ├──► categories
    │         ├──► rewards
    │         ├──► qr_codes
    │         │
    │         └──► business_customers ◄──────────┐
    │                    │                        │
    │                    │                        │
    ├──► customers ───────┘                        │
              │                                   │
              ├──► points_transactions ────────────┘ (via business_id + customer_id)
              │
              └──► reward_redemptions ──► rewards
```

---

## 2. Entity Relationships

| Relationship | Type | Notes |
|-------------|------|-------|
| auth.users → business_members | One-to-many | A user may own/staff multiple businesses |
| business_members → businesses | Many-to-one | Each member belongs to one business |
| businesses → loyalty_rules | One-to-one | Each business has exactly one rule set |
| businesses → products | One-to-many | Business owns its product catalogue |
| businesses → categories | One-to-many | Business owns its categories |
| businesses → rewards | One-to-many | Business owns its rewards catalogue |
| businesses → qr_codes | One-to-one | Each business has one QR record |
| customers → auth.users | One-to-one | One customer profile per auth user |
| customers ↔ businesses | Many-to-many | Via business_customers join table |
| business_customers → points_transactions | One-to-many | Each membership has many transactions |
| customers → reward_redemptions | One-to-many | A customer may have many redemption tickets |
| reward_redemptions → rewards | Many-to-one | Each redemption is for one reward |

---

## 3. Tables

### 3.1 `public.businesses`

The core tenant entity. Each row represents one Business on the platform.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT uuid_generate_v4() | Primary key |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | URL-safe identifier e.g. `bluebird-coffee` |
| `name` | VARCHAR(255) | NOT NULL | Display name e.g. "Bluebird Coffee Co." |
| `logo_url` | TEXT | nullable | Public URL to business logo |
| `description` | TEXT | nullable | Short description shown on join page |
| `address` | TEXT | nullable | Physical address |
| `city` | VARCHAR(100) | DEFAULT 'Mumbai' | City of operation |
| `primary_color` | VARCHAR(20) | DEFAULT '#3D281D' | Hex colour for branding |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes:** `idx_business_slug ON businesses(slug)`

**RLS:**
- SELECT: Public (anyone may read business profiles)
- ALL (INSERT, UPDATE, DELETE): Business members only (`business_members.user_id = auth.uid()`)

---

### 3.2 `public.business_members`

Maps Supabase auth users to their Business roles (owner or staff).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `business_id` | UUID | FK → businesses.id ON DELETE CASCADE | The Business |
| `user_id` | UUID | NOT NULL | References auth.users(id) |
| `role` | VARCHAR(50) | CHECK (role IN ('owner', 'staff')), NOT NULL | Role within the business |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |

**Constraints:** UNIQUE(business_id, user_id) — a user can only have one role per business

**Indexes:** `idx_business_members_user ON business_members(user_id)`

**RLS:**
- SELECT: User may view their own membership records
- ALL: Managed by application/admin (no self-service insert in MVP)

---

### 3.3 `public.customers`

Customer profile records linked to Supabase Auth users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `user_id` | UUID | UNIQUE, FK → auth.users(id) ON DELETE CASCADE | Auth user identity |
| `full_name` | VARCHAR(255) | NOT NULL | Customer's full name |
| `phone` | VARCHAR(20) | nullable | Phone number (primary auth identifier) |
| `email` | VARCHAR(255) | nullable | Email address (fallback auth identifier) |
| `avatar_url` | TEXT | nullable | Profile photo URL |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |

**RLS:**
- SELECT, UPDATE: Customer may only access their own record (`user_id = auth.uid()`)
- INSERT: Customer may create their own profile (`user_id = auth.uid()`)

---

### 3.4 `public.business_customers`

The loyalty membership junction table. Tracks a Customer's relationship and Points balance at a specific Business.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `business_id` | UUID | FK → businesses.id ON DELETE CASCADE | The Business |
| `customer_id` | UUID | FK → customers.id ON DELETE CASCADE | The Customer |
| `total_points` | INT | DEFAULT 0, CHECK (total_points >= 0) | Current Points balance |
| `total_visits` | INT | DEFAULT 0 | Count of verified purchase visits |
| `lifetime_spend` | DECIMAL(10,2) | DEFAULT 0.00 | Total spend in ₹ at this business |
| `tier` | VARCHAR(50) | DEFAULT 'Bronze' | Customer tier (Bronze/Silver/Gold/Platinum) |
| `joined_at` | TIMESTAMPTZ | DEFAULT NOW() | Date Customer joined the programme |
| `last_visit_at` | TIMESTAMPTZ | DEFAULT NOW() | Date of last recorded visit |

**Constraints:** UNIQUE(business_id, customer_id) — a customer may only have one membership per business

**Indexes:** `idx_business_customers_lookup ON business_customers(business_id, customer_id)`

**RLS:**
- SELECT: Customer may view their own memberships; Business Staff/Owner may view their Business's memberships
- INSERT: Customer may join (insert their own); Business Staff may insert on behalf
- UPDATE: Business Staff/Owner may update Points balance, visit count, etc.

> **IMPORTANT:** `total_points` is a **denormalised balance**. It must always equal the sum of all corresponding `points_transactions.points` for this (business_id, customer_id) pair. This invariant must be maintained atomically on every Points operation.

---

### 3.5 `public.categories`

Product categories for a Business's menu.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `business_id` | UUID | FK → businesses.id ON DELETE CASCADE | The Business |
| `name` | VARCHAR(100) | NOT NULL | Category name e.g. "Coffee & Espresso" |
| `sort_order` | INT | DEFAULT 0 | Display order |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**RLS:** Business Staff/Owner may manage their own categories.

---

### 3.6 `public.products`

Menu items for a Business. Each product may have a specific points-earned value.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `business_id` | UUID | FK → businesses.id ON DELETE CASCADE | The Business |
| `category_id` | UUID | FK → categories.id ON DELETE SET NULL, nullable | Optional category |
| `name` | VARCHAR(255) | NOT NULL | Product name |
| `description` | TEXT | nullable | Product description |
| `price` | DECIMAL(10,2) | NOT NULL | Price in ₹ |
| `points_earned` | INT | DEFAULT 0 | Fixed points earned when this item is purchased |
| `is_available` | BOOLEAN | DEFAULT TRUE | Whether item is active/visible |
| `image_url` | TEXT | nullable | Product photo URL |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes:** `idx_products_business ON products(business_id)`

**RLS:**
- SELECT (public): Active products only (`is_available = true`)
- ALL: Business Staff/Owner for their Business's products

---

### 3.7 `public.loyalty_rules`

Points earning configuration for a Business. One row per Business.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `business_id` | UUID | UNIQUE, FK → businesses.id ON DELETE CASCADE | The Business |
| `spend_per_point` | DECIMAL(10,2) | DEFAULT 100.00 | ₹ amount that earns one "point unit" |
| `points_per_spend_unit` | INT | DEFAULT 10 | Points earned per spend unit |
| `welcome_points` | INT | DEFAULT 50 | Points awarded on first join |
| `visit_bonus_points` | INT | DEFAULT 10 | Additional points per verified purchase |
| `min_redemption_points` | INT | DEFAULT 100 | Minimum balance required to redeem any reward |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**RLS:**
- SELECT (public): Anyone may read loyalty rules (required for join page)
- ALL: Business Owner may update their own rules

> **OPEN DECISION — OQ-014:** Whether to snapshot the active rule at points transaction time. Currently, rule changes affect all future transactions only. Historical transactions are not recalculated.

---

### 3.8 `public.points_transactions`

**Append-only ledger of all Points events.** This is the source of truth for Points history.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `business_id` | UUID | FK → businesses.id ON DELETE CASCADE | The Business |
| `customer_id` | UUID | FK → customers.id ON DELETE CASCADE | The Customer |
| `points` | INT | NOT NULL | Positive = earned; Negative = redeemed |
| `type` | VARCHAR(50) | CHECK (type IN ('earn', 'redeem', 'bonus', 'welcome')), NOT NULL | Transaction type |
| `source` | VARCHAR(100) | DEFAULT 'Purchase' | Human-readable source description |
| `reference_id` | VARCHAR(255) | nullable | Optional reference to related record (e.g. purchase ID, redemption code) |
| `metadata` | JSONB | DEFAULT '{}' | Additional context (future use) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Transaction timestamp |

**Indexes:** `idx_transactions_customer ON points_transactions(customer_id, business_id)`

**RLS:**
- SELECT: Customer may view their own transactions; Business Staff/Owner may view their Business's transactions
- INSERT: Business Staff may insert earn transactions; Customer may insert (welcome bonus on join)
- UPDATE/DELETE: **NOT PERMITTED** — this table is append-only

> **CRITICAL:** No row in `points_transactions` should ever be modified or deleted. This is the immutable audit trail.

---

### 3.9 `public.rewards`

Rewards catalogue for a Business.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `business_id` | UUID | FK → businesses.id ON DELETE CASCADE | The Business |
| `title` | VARCHAR(255) | NOT NULL | Reward title e.g. "Free Welcome Drink" |
| `description` | TEXT | nullable | Reward details |
| `points_cost` | INT | CHECK (points_cost > 0), NOT NULL | Points required to redeem |
| `reward_type` | VARCHAR(50) | DEFAULT 'free_item' | 'free_item', 'discount', or 'voucher' |
| `is_active` | BOOLEAN | DEFAULT TRUE | Whether reward is currently available |
| `image_url` | TEXT | nullable | Reward illustration |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**RLS:**
- SELECT (public): Active rewards only (`is_active = true`)
- ALL: Business Staff/Owner for their Business's rewards

---

### 3.10 `public.reward_redemptions`

One-time-use redemption tickets issued when a Customer redeems a Reward.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `business_id` | UUID | FK → businesses.id ON DELETE CASCADE | The Business |
| `customer_id` | UUID | FK → customers.id ON DELETE CASCADE | The Customer |
| `reward_id` | UUID | FK → rewards.id ON DELETE CASCADE | The Reward being redeemed |
| `code` | VARCHAR(20) | UNIQUE, NOT NULL | Human-readable code e.g. `RPT-CAFE-8821` |
| `status` | VARCHAR(50) | CHECK (status IN ('pending', 'redeemed', 'expired')), DEFAULT 'pending' | Ticket lifecycle state |
| `expires_at` | TIMESTAMPTZ | NOT NULL | Expiry (24 hours from creation) |
| `redeemed_at` | TIMESTAMPTZ | nullable | Timestamp when staff verified |
| `redeemed_by_staff_id` | UUID | FK → auth.users(id), nullable | Staff member who verified |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes:** `idx_redemptions_code ON reward_redemptions(code)`

**RLS:**
- SELECT: Customer may view their own tickets; Business Staff/Owner may view their Business's tickets
- INSERT: Customer may create their own redemption ticket
- UPDATE: Business Staff may update status to `redeemed`

**State Machine:**
```
pending ──► redeemed (by staff verification)
pending ──► expired (by expiry check on lookup)
redeemed → [terminal state; no further transitions]
expired → [terminal state; no further transitions]
```

> **CRITICAL:** The `UNIQUE` constraint on `code` prevents duplicate ticket codes. The status state machine prevents re-use of an already-redeemed ticket.

---

### 3.11 `public.purchases`

Audit record of every verified purchase. Created when Staff records a purchase for a Customer.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `business_id` | UUID | FK → businesses.id ON DELETE CASCADE | The Business |
| `customer_id` | UUID | FK → customers.id ON DELETE CASCADE | The Customer |
| `amount` | DECIMAL(10,2) | NOT NULL | Purchase amount in ₹ |
| `points_awarded` | INT | NOT NULL | Points calculated and awarded for this purchase |
| `receipt_number` | VARCHAR(100) | nullable | Optional receipt/bill reference number |
| `verified_by_staff_id` | UUID | nullable | Auth user ID of the staff who verified |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Purchase timestamp |

**RLS:**
- ALL: Business Staff/Owner may manage purchases for their Business

---

### 3.12 `public.qr_codes`

Tracks the QR code for each Business and scan analytics.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `business_id` | UUID | UNIQUE, FK → businesses.id ON DELETE CASCADE | The Business |
| `slug` | VARCHAR(100) | NOT NULL | The business slug (for URL construction) |
| `qr_target_url` | TEXT | NOT NULL | The full URL encoded in the QR |
| `scans_count` | INT | DEFAULT 0 | Running count of QR scans |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**RLS:** Business Staff/Owner may view and manage their own QR record.

---

### 3.13 `public.notifications`

> **OPEN REQUIREMENT — OQ-016:** In-app notifications are not confirmed for MVP.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `user_id` | UUID | FK → auth.users(id) ON DELETE CASCADE | Target user |
| `title` | VARCHAR(255) | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification body |
| `is_read` | BOOLEAN | DEFAULT FALSE | Read status |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**RLS:** A user may only read their own notifications.

---

## 4. Indexes Summary

| Index | Table | Columns | Purpose |
|-------|-------|---------|---------|
| `idx_business_slug` | businesses | slug | Fast QR join page lookup by slug |
| `idx_business_members_user` | business_members | user_id | Fast role lookup for authenticated user |
| `idx_business_customers_lookup` | business_customers | business_id, customer_id | Fast membership lookup |
| `idx_products_business` | products | business_id | Fast product list for a business |
| `idx_transactions_customer` | points_transactions | customer_id, business_id | Fast ledger queries |
| `idx_redemptions_code` | reward_redemptions | code | Fast code lookup at counter |

---

## 5. Business → Customer → Points Relationship

```
businesses (id: biz_A)
     │
     └──► business_customers (business_id: biz_A, customer_id: cust_1)
                   │
                   ├── total_points: 180  ← denormalised balance
                   ├── total_visits: 6
                   └── tier: 'Silver'

customers (id: cust_1)
     │
     └──► points_transactions WHERE business_id = biz_A AND customer_id = cust_1
               ┌─────────────────────────────────────────────────────┐
               │ id  │ type    │ points │ source                      │
               │─────│─────────│────────│─────────────────────────────│
               │ t1  │ welcome │ +50    │ Welcome Joining Bonus        │
               │ t2  │ earn    │ +30    │ Purchase: Latte (₹300)       │
               │ t3  │ earn    │ +20    │ Purchase: Croissant (₹200)   │
               │ t4  │ redeem  │ -100   │ Redeemed: Free Drink RPT-... │
               │ t5  │ earn    │ +20    │ Store Purchase (₹200)        │
               │ t6  │ earn    │ +20    │ Store Purchase (₹200)        │
               │ t7  │ earn    │ +20    │ Store Purchase (₹200)        │
               │ t8  │ earn    │ +20    │ Store Purchase (₹200)        │
               │─────────────────────────────────────────────────────│
               │ SUM: 50+30+20-100+20+20+20+20 = 80                  │
               └─────────────────────────────────────────────────────┘

INVARIANT: business_customers.total_points (180) ≠ SUM above (80)
→ This discrepancy indicates a data integrity issue; see OQ-018.
```

> **OPEN DECISION — OQ-018:** The `total_points` denormalised field must always match the sum of transactions. This requires either:
> - Atomic updates (update both tables in the same operation), or
> - A Postgres trigger that keeps `total_points` in sync, or
> - A scheduled reconciliation job

---

## 6. Data Lifecycle

| Entity | Created by | Updated by | Deleted by |
|--------|-----------|-----------|-----------|
| businesses | Business Owner (onboarding) | Business Owner (settings) | Platform Admin |
| business_members | System (onboarding / staff invite) | Platform Admin | Business Owner |
| customers | System (on first auth) | Customer (profile update) | Customer (account deletion) |
| business_customers | System (on QR join) | System (on purchase / points change) | Not deleted |
| products | Business Owner | Business Owner | Business Owner |
| categories | Business Owner | Business Owner | Business Owner |
| loyalty_rules | System (onboarding) | Business Owner | Not deleted (soft update via `updated_at`) |
| points_transactions | System (on earn/redeem/bonus/welcome) | **NEVER** | **NEVER** |
| rewards | Business Owner | Business Owner | Not deleted (deactivated via `is_active = false`) |
| reward_redemptions | System (on Customer redemption initiation) | System (on staff verification) | **NEVER** |
| purchases | System (on staff-verified purchase) | **NEVER** | **NEVER** |
| qr_codes | System (on business onboarding) | System (on scan) | Platform Admin |
| notifications | System | Customer (mark as read) | Customer |

---

## 7. Historical Data Behaviour

### Points Transactions (Ledger Integrity)

- All points transactions are **immutable once created**
- If Loyalty Rules change after transactions exist, the old transactions are NOT recalculated
- The `metadata` JSONB column may be used in future to snapshot the active rule at transaction time (OPEN DECISION — OQ-014)

### Redemption Tickets

- A redemption ticket transitions from `pending` → `redeemed` or `expired`
- Both `redeemed` and `expired` are terminal states — they cannot be changed back to `pending`
- Expired tickets remain in the database as audit records

### Rewards (Soft Delete)

- Rewards are never deleted; they are deactivated via `is_active = false`
- This preserves historical redemption references to the reward record

---

## 8. Audit Fields

All major tables include `created_at` timestamps. The following tables include additional audit tracking:

| Table | Audit Fields |
|-------|-------------|
| `purchases` | `verified_by_staff_id`, `created_at` |
| `reward_redemptions` | `redeemed_by_staff_id`, `redeemed_at`, `created_at` |
| `points_transactions` | `type`, `source`, `reference_id`, `created_at` |
| `loyalty_rules` | `updated_at` |
| `businesses` | `updated_at` |

---

## 9. RLS Requirements Summary

| Table | Business Isolation | Customer Isolation |
|-------|------------------|-------------------|
| businesses | ✅ Owner/Staff may manage their own | Public read |
| business_members | ✅ Own records only | N/A |
| customers | N/A | ✅ Own record only |
| business_customers | ✅ Staff/Owner for their business | ✅ Customer sees own memberships |
| categories | ✅ Staff/Owner for their business | N/A |
| products | ✅ Staff/Owner for their business | Public read (active only) |
| loyalty_rules | ✅ Owner for their business | Public read |
| points_transactions | ✅ Staff/Owner for their business | ✅ Customer sees own transactions |
| rewards | ✅ Staff/Owner for their business | Public read (active only) |
| reward_redemptions | ✅ Staff/Owner for their business | ✅ Customer sees own tickets |
| purchases | ✅ Staff/Owner for their business | N/A |
| qr_codes | ✅ Staff/Owner for their business | N/A |
| notifications | N/A | ✅ Own notifications only |

---

## 10. Transaction / Reference IDs

| Entity | ID Format | Generated by |
|--------|-----------|-------------|
| All tables | UUID v4 | `uuid_generate_v4()` (PostgreSQL) |
| Redemption Ticket codes | `RPT-XXXX-NNNN` (human-readable) | `crypto.getRandomValues()` in browser |

> **SECURITY NOTE:** Redemption Ticket codes are human-readable for counter staff to type. The code space is small (`RPT-[A-Z]{4}-[1000-9999]` = ~60,000 combinations), which is adequate for a single Business's 24-hour window but should be revisited for high-volume Businesses. See OQ-024.

---

*Document version 0.1 — Database design must be reviewed and approved before schema migrations are applied to production.*
