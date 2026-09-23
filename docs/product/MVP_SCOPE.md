# MVP Scope & Functional Requirements
**Product:** Repeato  
**Version:** 0.1 (Documentation Phase)  
**Date:** 2026-09-19  
**Status:** DRAFT — Awaiting review

---

## MVP Scope Summary

The Repeato MVP delivers a functional loyalty loop for cafés and restaurants:
- Business Owners can onboard, configure, and manage their loyalty programme
- Customers can join, earn Points, and redeem Rewards
- Business Staff can verify Redemptions at the counter
- All data is isolated per Business (multi-tenant)

---

## Feature Matrix

| Feature | MVP Status | Priority | Notes |
|---------|-----------|----------|-------|
| Business registration | ✅ IN SCOPE | P0 | |
| Business authentication | ✅ IN SCOPE | P0 | Email + password |
| Business onboarding wizard | ✅ IN SCOPE | P0 | |
| Business dashboard (overview) | ✅ IN SCOPE | P0 | |
| Customer management | ✅ IN SCOPE | P0 | |
| Points configuration (Loyalty Rules) | ✅ IN SCOPE | P0 | |
| Rewards builder | ✅ IN SCOPE | P0 | |
| Purchase verification | ✅ IN SCOPE | P0 | ⚠️ Mechanism OPEN DECISION |
| Redemption verification (counter) | ✅ IN SCOPE | P0 | |
| Transactions ledger | ✅ IN SCOPE | P1 | |
| Analytics (basic) | ✅ IN SCOPE | P1 | |
| QR code generation | ✅ IN SCOPE | P0 | |
| Business settings | ✅ IN SCOPE | P1 | |
| Business Staff management | 🔶 PARTIAL | P1 | Staff invite flow is OPEN |
| Customer QR onboarding | ✅ IN SCOPE | P0 | |
| Customer authentication (OTP) | ✅ IN SCOPE | P0 | ⚠️ Phone vs email OPEN |
| Customer join programme | ✅ IN SCOPE | P0 | |
| Customer Points balance | ✅ IN SCOPE | P0 | |
| Customer Reward progress | ✅ IN SCOPE | P0 | |
| Customer Rewards catalogue | ✅ IN SCOPE | P0 | |
| Customer redemption + ticket | ✅ IN SCOPE | P0 | |
| Customer activity log | ✅ IN SCOPE | P1 | |
| Customer profile | ✅ IN SCOPE | P1 | |
| Multi-Business wallet (Customer) | ✅ IN SCOPE | P1 | |
| Public marketing website | 🔶 SEPARATE | — | Not blocking MVP |
| POS integration | ❌ OUT OF SCOPE | — | Future version |
| SMS push campaigns | ❌ OUT OF SCOPE | — | Future version |
| Multi-branch / multi-location | ❌ OUT OF SCOPE | — | Future version |
| Referral programme | ❌ OUT OF SCOPE | — | Future version |
| Subscription billing | ❌ OUT OF SCOPE | — | Future version |
| Platform Admin dashboard | ❌ OUT OF SCOPE | — | Future version |
| Points expiry | ❌ OUT OF SCOPE | — | Future version |
| Churn prediction | ❌ OUT OF SCOPE | — | Future version |
| Tier-based reward gating | ❌ OUT OF SCOPE | — | Tiers tracked but not actively gated |
| Native mobile apps | ❌ OUT OF SCOPE | — | Future version |

---

## Functional Requirements by Feature

---

### F-001: Business Registration

**Purpose:** Allow a Business Owner to create a Repeato account

**User:** Business Owner (unauthenticated)

**Preconditions:** User is on the registration page

**Main Flow:**
1. User enters email address and password
2. User submits registration form
3. System creates an auth account via Supabase Auth
4. System redirects to Business Onboarding wizard

**Expected Behaviour:**
- Email must be unique; duplicate email shows a clear error
- Password must meet minimum security requirements (defined in SRS)
- No email verification step is required in MVP (OPEN DECISION — OQ-013)

**Success Condition:** Auth account is created; user is authenticated and redirected to onboarding

**Failure Conditions:**
- Email already in use → error message: "An account with this email already exists"
- Invalid email format → validation error inline
- Weak password → validation error inline
- Network error → generic retry error

**Dependencies:** Supabase Auth

**Priority:** P0

---

### F-002: Business Authentication

**Purpose:** Allow a returning Business Owner or Staff to log in

**User:** Business Owner, Business Staff

**Preconditions:** User has a registered account

**Main Flow:**
1. User enters email and password
2. System verifies credentials via Supabase Auth
3. System loads user's Business memberships
4. System redirects to Business Dashboard

**Expected Behaviour:**
- If user has no Business memberships, redirect to Onboarding
- If user has Business memberships, load the primary Business dashboard
- If user has multiple Businesses, allow selection (Business Switcher)

**Success Condition:** User is authenticated and on the Business Dashboard

**Failure Conditions:**
- Invalid credentials → error: "Invalid email or password"
- Account not found → same error (do not reveal which field is wrong for security)
- Network failure → retry message

**Dependencies:** Supabase Auth, `business_members` table

**Priority:** P0

---

### F-003: Business Onboarding

**Purpose:** Guide a new Business Owner through setting up their Business

**User:** Business Owner (newly registered, no Business yet)

**Preconditions:** User is authenticated; has no active Business memberships

**Main Flow:**
1. User enters Business name, description, address, city
2. User uploads Business logo (optional in MVP)
3. User adds initial menu items (name, price, points earned per item)
4. User sets initial Loyalty Rules (earn rate, welcome points)
5. User reviews and confirms
6. System creates: Business record, Business Member (owner role), Loyalty Rules, initial Products, initial Rewards, QR Code record
7. System redirects to Business Dashboard

**Expected Behaviour:**
- All required fields must be validated before submission
- Slug is auto-generated from Business name (with uniqueness check)
- Initial Rewards are pre-populated with sensible defaults

**Success Condition:** Business is created; user lands on Dashboard with first QR available

**Failure Conditions:**
- Business name already exists (slug conflict) → prompt to adjust name
- Upload failure for logo → proceed without logo (use placeholder)
- Network failure → allow retry without losing form data

**Dependencies:** `businesses`, `business_members`, `loyalty_rules`, `products`, `rewards`, `qr_codes` tables

**Priority:** P0

---

### F-004: Business Dashboard Overview

**Purpose:** Provide Business Owner with a summary of key metrics

**User:** Business Owner

**Preconditions:** Business exists and user is authenticated

**Main Flow:**
1. Dashboard loads with KPI cards
2. KPIs shown: Total Members, Active Members (2+ visits), Repeat Visit Rate, Points Issued, Points Redeemed
3. Recent member activity feed is shown
4. Weekly visit trend chart is shown

**Expected Behaviour:**
- Data is real (sourced from Supabase) when connected; fallback to mock values in dev mode
- Empty state if no Customers have joined yet

**Success Condition:** Business Owner can see their loyalty programme performance at a glance

**Failure Conditions:**
- Data fetch failure → show error with retry option; do not show stale data as live

**Dependencies:** `business_customers`, `points_transactions`, `reward_redemptions` tables

**Priority:** P0

---

### F-005: Customer Management

**Purpose:** Allow Business Owner to view and manage their Customers

**User:** Business Owner

**Preconditions:** Business has enrolled Customers

**Main Flow:**
1. Business Owner opens Customers view
2. List of enrolled Customers is displayed with: name, phone, Points balance, visit count, tier, last visit date
3. Business Owner can search by name or phone
4. Business Owner can click a Customer to see their detail (transactions, Points history)

**Expected Behaviour:**
- List sorted by most recently joined by default
- Search filters the list in real time
- Customer data must only be for this Business (RLS enforced)

**Success Condition:** Business Owner can find any Customer and see their loyalty status

**Failure Conditions:**
- Empty state when no Customers have joined
- Fetch failure → error message with retry

**Dependencies:** `business_customers`, `customers` tables; RLS

**Priority:** P0

---

### F-006: Points Configuration (Loyalty Rules)

**Purpose:** Allow Business Owner to define how Points are earned at their Business

**User:** Business Owner

**Preconditions:** Business exists

**Main Flow:**
1. Business Owner opens Points Rules view
2. Current rules are displayed
3. Business Owner edits: Spend Per Point Unit, Points Per Spend Unit, Welcome Points, Visit Bonus Points, Minimum Redemption Points
4. Business Owner saves
5. Live Rule Calculator updates in real time to show impact

**Expected Behaviour:**
- Rules are saved to `loyalty_rules` table for this Business only
- Changes take effect on all future transactions immediately
- Historical transactions are NOT retroactively recalculated

**Success Condition:** Updated Loyalty Rules are saved and confirmed

**Failure Conditions:**
- Invalid values (e.g. 0 points per unit) → validation error
- Save failure → error with retry

**Dependencies:** `loyalty_rules` table; RLS (business owner only)

**Priority:** P0

---

### F-007: Rewards Builder

**Purpose:** Allow Business Owner to create and manage Rewards

**User:** Business Owner

**Preconditions:** Business exists

**Main Flow:**
1. Business Owner opens Rewards view
2. List of Rewards with status (active/inactive) is shown
3. Business Owner creates a new Reward: title, description, point cost, reward type (free_item / discount / voucher)
4. Business Owner can edit or deactivate an existing Reward

**Expected Behaviour:**
- Deactivating a Reward hides it from the Customer Rewards catalogue
- Existing unredeemed tickets for a deactivated Reward remain valid
- At least one active Reward must exist for Customers to redeem

**Success Condition:** Rewards catalogue is configured and visible to eligible Customers

**Failure Conditions:**
- Point cost ≤ 0 → validation error
- Empty title → validation error

**Dependencies:** `rewards` table; RLS (business owner only)

**Priority:** P0

---

### F-008: Purchase Verification & Points Awarding

> **⚠️ MECHANISM IS AN OPEN PRODUCT DECISION — OQ-001**

**Purpose:** Record a verified Customer purchase and award the corresponding Points

**User:** Business Staff (or Business Owner)

**Preconditions:**
- Customer is an enrolled Member of this Business
- Purchase amount is known
- Purchase verification mechanism has been decided (OPEN DECISION)

**Main Flow (placeholder — mechanism TBD):**
1. Staff accesses the counter/verification terminal
2. Staff identifies the Customer (by phone number, name lookup, or Customer QR — TBD)
3. Staff enters the purchase amount
4. System calculates Points: `floor(amount / spend_per_point) × points_per_spend_unit + visit_bonus`
5. Points are awarded to Customer's balance
6. Purchase record is created in `purchases` table
7. Points transaction is appended to `points_transactions` ledger

**Expected Behaviour:**
- Points calculation uses the Business's current active Loyalty Rule at transaction time
- The Loyalty Rule snapshot should ideally be stored with the transaction (DECISION REQUIRED — OQ-014)
- Staff identity is recorded on the purchase record

**Success Condition:** Customer's Points balance is increased; Purchase record exists

**Failure Conditions:**
- Customer not found → error: "Customer not enrolled at this Business"
- Amount ≤ 0 → validation error
- Calculation error → no Points awarded; error shown

**Dependencies:** `purchases`, `points_transactions`, `business_customers`, `loyalty_rules` tables; RLS

**Priority:** P0

---

### F-009: Redemption Verification (Staff Counter)

**Purpose:** Allow Business Staff to verify and confirm a Customer's Redemption Ticket

**User:** Business Staff, Business Owner

**Preconditions:**
- Customer has a valid Redemption Ticket with a pending code
- Staff is authenticated and on the counter terminal

**Main Flow:**
1. Staff enters the Redemption Ticket code (e.g. `RPT-CAFE-8821`)
2. System looks up the code
3. System validates: code exists, is `pending`, is not expired, belongs to this Business
4. On success: code is marked `redeemed`; staff identity and timestamp recorded
5. Staff sees a clear success confirmation with reward details and Customer name
6. On failure: staff sees a clear error (invalid / expired / already used / wrong Business)

**Expected Behaviour:**
- Code lookup must be case-insensitive
- Expired tickets must be auto-expired on lookup
- A redeemed ticket must NEVER be re-redeemable, even if staff presses submit twice

**Success Condition:** Redemption is confirmed; Customer has received their Reward

**Failure Conditions:**
- Code not found → "Invalid code. This ticket does not exist."
- Already redeemed → "This ticket was already used on [date/time]."
- Expired → "This ticket has expired."
- Wrong Business → "This ticket belongs to a different Business."

**Dependencies:** `reward_redemptions`, `rewards`, `customers`, `business_members` tables; RLS; Supabase Realtime (optional)

**Priority:** P0

---

### F-010: Customer QR Onboarding

**Purpose:** Allow a Customer to scan a Business QR code and join the loyalty programme

**User:** Customer (unauthenticated or authenticated)

**Preconditions:** Customer has a smartphone; Business QR code is available

**Main Flow:**
1. Customer scans QR code (directs to `/join/{business-slug}`)
2. Join page loads with Business branding
3. If Customer is not authenticated:
   a. Customer enters phone number (or email)
   b. OTP is sent
   c. Customer enters OTP
   d. Authentication succeeds
4. If Customer is already authenticated: skip to step 5
5. System checks if Customer is already enrolled at this Business
6. If not enrolled: system creates Membership; awards Welcome Points
7. If already enrolled: system shows current Points balance and membership status
8. Customer lands on their wallet/membership view for this Business

**Expected Behaviour:**
- The join page must display the correct Business's name, logo, and colour
- QR scan count must be incremented
- Welcome Points transaction must be created in the ledger

**Success Condition:** Customer is enrolled; Welcome Points are awarded; Customer can see their membership

**Failure Conditions:**
- Invalid business slug → 404 / "Business not found" page
- OTP delivery failure → retry option
- OTP expiry → allow re-request
- Network failure → informative error

**Dependencies:** `businesses`, `customers`, `business_customers`, `points_transactions`, `qr_codes`, `loyalty_rules` tables; Supabase Auth

**Priority:** P0

---

### F-011: Customer Authentication

**Purpose:** Authenticate a Customer using phone number or email OTP

**User:** Customer (unauthenticated)

**Preconditions:** Customer has a phone number or email address

**Main Flow (Phone OTP):**
1. Customer enters phone number
2. System sends OTP via SMS (via Supabase Auth)
3. Customer enters OTP
4. System verifies OTP
5. Customer is authenticated

**Main Flow (Email OTP):**
1. Customer enters email address
2. System sends OTP/magic link via email (via Supabase Auth)
3. Customer clicks link or enters OTP
4. Customer is authenticated

**Expected Behaviour:**
- OTP is valid for 5–10 minutes (Supabase default)
- On successful authentication, check if a Customer profile exists; create one if not
- A Customer who returns to the same Business does not re-authenticate if session is active

**Success Condition:** Customer is authenticated with a valid session

**Failure Conditions:**
- Invalid OTP → "Incorrect code. Please try again."
- Expired OTP → "Code has expired. Request a new one."
- SMS delivery failure → fallback to email OTP

**Dependencies:** Supabase Auth; `customers` table

**Priority:** P0

---

### F-012: Customer Rewards & Redemption

**Purpose:** Allow a Customer to browse available Rewards and redeem one using Points

**User:** Customer (authenticated, enrolled in Business)

**Preconditions:**
- Customer is enrolled in at least one Business
- Customer has a Points balance ≥ minimum Reward cost

**Main Flow:**
1. Customer opens Rewards view for a Business
2. Available Rewards are listed with point cost and progress bar
3. Customer selects a Reward
4. System confirms Customer has sufficient Points
5. System deducts Points; creates Redemption Ticket with unique code and 24-hour expiry
6. System displays Redemption Ticket with code and QR representation
7. Customer presents the ticket at the Business counter for verification

**Expected Behaviour:**
- Rewards with insufficient Points are shown as locked (with progress indicator)
- The Redemption Ticket screen must be clearly readable at counter distance
- The ticket shows: business name, reward title, Customer name, code, expiry time

**Success Condition:** Redemption Ticket is created; Points are deducted; Customer can present the ticket

**Failure Conditions:**
- Insufficient Points → "You need X more points to unlock this reward."
- Reward no longer active → "This reward is no longer available."
- Network failure during ticket creation → Points must NOT be deducted if ticket creation fails (atomicity requirement)

**Dependencies:** `rewards`, `reward_redemptions`, `business_customers`, `points_transactions` tables; RLS

**Priority:** P0

---

### F-013: Customer Activity Log

**Purpose:** Allow a Customer to view all their Points transactions across all Businesses

**User:** Customer (authenticated)

**Preconditions:** Customer is authenticated

**Main Flow:**
1. Customer opens Activity view
2. List of all Points transactions is shown in reverse chronological order
3. Each transaction shows: date, Business name, transaction type, Points delta, source description

**Expected Behaviour:**
- Transactions span all Business memberships the Customer holds
- Filter by Business is optional in MVP

**Success Condition:** Customer can see a full history of their Points activity

**Failure Conditions:**
- Empty state if no transactions exist
- Fetch failure → error with retry

**Dependencies:** `points_transactions`, `businesses`, `customers` tables; RLS

**Priority:** P1

---

### F-014: QR Code Generation

**Purpose:** Allow Business Owner to view and download their Business QR code

**User:** Business Owner

**Preconditions:** Business exists

**Main Flow:**
1. Business Owner opens QR view
2. QR code is displayed (generated from the join URL `/join/{business-slug}`)
3. Business Owner downloads QR as PNG image
4. QR scan count is displayed

**Expected Behaviour:**
- QR code is generated in the browser using a QR library
- Download produces a print-quality PNG
- QR scan count is a read-only metric from the `qr_codes` table

**Success Condition:** QR code is available for download and physical deployment

**Failure Conditions:**
- QR record not found → auto-create on Business creation (handled in onboarding)

**Dependencies:** `qr_codes` table; QR Code React library

**Priority:** P0

---

### F-015: Basic Analytics

**Purpose:** Provide Business Owner with key retention metrics

**User:** Business Owner

**Preconditions:** Business exists; at least some Customer activity has occurred

**Main Flow:**
1. Business Owner opens Analytics view
2. Dashboard shows: Total Customers, Active Customers (2+ visits), Repeat Visit Rate
3. Points Issued, Points Redeemed, Rewards Redeemed count
4. Weekly visit activity chart
5. Top Customers list

**Expected Behaviour:**
- All metrics are computed from real Supabase data
- No mock data in production

**Success Condition:** Business Owner can understand their programme's performance

**Failure Conditions:**
- Empty state if no data
- Fetch failure → error message

**Dependencies:** `business_customers`, `points_transactions`, `reward_redemptions` tables

**Priority:** P1

---

## Out of Scope for MVP

| Feature | Reason |
|---------|--------|
| POS system integration | Requires Business-specific technical integration work |
| SMS push marketing campaigns | Requires carrier API setup and cost management |
| Multi-branch / multi-location | Architectural complexity; deferred |
| Customer tier-based reward gating | Tiers are tracked but not actively enforced in MVP |
| Customer referral programme | Future growth feature |
| Points expiry | Business policy decision not finalised |
| Platform Admin dashboard | Internal tooling; not required for MVP launch |
| Business Staff invitation workflow | Staff management pattern not finalised (OQ-007) |
| Native iOS / Android app | PWA / mobile web is sufficient for MVP |
| Automated win-back campaigns | Future feature |
| Subscription billing | Commercial model not finalised |

---

*Document version 0.1 — Documentation-first phase. Feature scope must be approved before implementation begins.*
