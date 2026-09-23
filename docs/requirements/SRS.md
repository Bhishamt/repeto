# SRS — Software Requirements Specification
**Product:** Repeato  
**Version:** 0.1 (Documentation Phase)  
**Date:** 2026-09-19  
**Status:** DRAFT — Awaiting review

> All terms follow the Terminology table in PRD.md. Requirement IDs are globally unique within this document.

---

## 1. System Overview

Repeato is a multi-tenant web application providing:
1. A **Business Product** (dashboard, management tools) for Business Owners and Business Staff
2. A **Customer Product** (mobile-first web app) for Customers
3. A **QR Onboarding Flow** that bridges physical Business visits and digital loyalty participation

The system is built on:
- Frontend: React + TypeScript (Vite build)
- Backend: Supabase (PostgreSQL, Row Level Security, Supabase Auth, Supabase Storage)
- Deployment: Vercel

---

## 2. Functional Requirements

### 2.1 Business Authentication

**FR-BAUTH-001**  
The system must allow a Business Owner to register using an email address and password.

**FR-BAUTH-002**  
The system must allow a returning Business Owner or Business Staff member to authenticate using email and password.

**FR-BAUTH-003**  
On successful authentication, the system must load the authenticated user's Business membership records to determine their role and active Business.

**FR-BAUTH-004**  
If an authenticated user has no Business memberships, the system must redirect them to the Business Onboarding wizard.

**FR-BAUTH-005**  
If an authenticated user has one or more Business memberships, the system must redirect them to the Business Dashboard.

**FR-BAUTH-006**  
The system must prevent an unauthenticated user from accessing any protected Business dashboard route.

**FR-BAUTH-007**  
The system must support a Business Owner managing multiple Businesses by providing a Business Switcher component.

---

### 2.2 Business Onboarding

**FR-BONB-001**  
The system must guide a new Business Owner through a multi-step onboarding wizard.

**FR-BONB-002**  
The onboarding wizard must collect: Business name, slug, description, address, city, and optional logo URL.

**FR-BONB-003**  
The system must auto-generate a unique slug from the Business name. If the slug already exists, the system must notify the user and prompt them to modify it.

**FR-BONB-004**  
The onboarding wizard must allow the Business Owner to add initial menu items (name, price, points earned per item).

**FR-BONB-005**  
The onboarding wizard must allow the Business Owner to set initial Loyalty Rules (spend_per_point, points_per_spend_unit, welcome_points).

**FR-BONB-006**  
On completion of onboarding, the system must create the following records atomically:
- Business record
- Business Member record (owner role, linked to authenticated user)
- Loyalty Rules record
- Initial Products (if provided)
- Default Rewards
- QR Code record

**FR-BONB-007**  
On completion of onboarding, the system must redirect the Business Owner to the Business Dashboard.

---

### 2.3 Business Dashboard

**FR-BDASH-001**  
The Business Dashboard must be accessible only to authenticated users with a `business_owner` or `business_staff` role for the active Business.

**FR-BDASH-002**  
The Dashboard must display a Navigation sidebar with links to: Overview, Customers, Menu, QR Code, Points Rules, Rewards, Transactions, Staff Counter, Analytics, Settings.

**FR-BDASH-003**  
The Dashboard Overview must display the following KPI cards:
- Total Customers (enrolled Members)
- Active Customers (Members with 2+ visits)
- Repeat Visit Rate (%)
- Points Issued (total)
- Points Redeemed (total)

**FR-BDASH-004**  
The Dashboard must display a Recent Activity feed showing the latest Points transactions.

**FR-BDASH-005**  
The Dashboard must display a Weekly Visit Activity chart.

---

### 2.4 Customer Management

**FR-CUST-001**  
The system must display a list of all Customers enrolled in the active Business.

**FR-CUST-002**  
Each Customer record in the list must show: full name, phone number, Points balance, visit count, tier, last visit date, join date.

**FR-CUST-003**  
The system must allow the Business Owner to search the Customer list by name or phone number.

**FR-CUST-004**  
The system must only return Customers for the authenticated user's active Business. A Business must not see Customers of another Business.

**FR-CUST-005**  
The Customer list must display an empty state when no Customers have enrolled.

---

### 2.5 Customer Authentication (OTP)

**FR-CAUTH-001**  
The system must allow a Customer to authenticate using their phone number via OTP.

**FR-CAUTH-002**  
The system must allow a Customer to authenticate using their email address via OTP as a fallback.

**FR-CAUTH-003**  
The system must use Supabase Auth to send and verify OTPs.

**FR-CAUTH-004**  
On successful authentication, the system must check if a Customer profile record exists. If no profile exists, the system must create one.

**FR-CAUTH-005**  
A Customer who is already authenticated and navigates to a Business join page must not be prompted to re-authenticate.

**FR-CAUTH-006**  
The OTP input field must accept a 6-digit numeric code.

**FR-CAUTH-007**  
The system must handle OTP expiry gracefully and allow the Customer to request a new OTP.

---

### 2.6 Customer QR Onboarding

**FR-QR-001**  
The system must expose a public route at `/join/{business-slug}` that serves the Business-specific join page.

**FR-QR-002**  
The join page must display the correct Business name, logo, description, and branding colour based on the slug.

**FR-QR-003**  
If the business slug does not exist, the system must display a clear "Business not found" error page.

**FR-QR-004**  
The join page must guide an unauthenticated Customer through authentication before enrollment.

**FR-QR-005**  
On successful authentication and enrollment, the system must create a `business_customers` record linking the Customer and the Business.

**FR-QR-006**  
If the Customer is already enrolled at this Business, the system must display their current Points balance and membership status — not re-enroll them.

**FR-QR-007**  
On first enrollment, the system must award Welcome Points as configured in the Business's active Loyalty Rule.

**FR-QR-008**  
The Welcome Points award must create a transaction of type `welcome` in the `points_transactions` ledger.

**FR-QR-009**  
The system must increment the `scans_count` field on the QR Code record for the Business on each scan (best-effort; failure must not block enrollment).

---

### 2.7 Points Rules & Configuration

**FR-POINT-001**  
The system must calculate Points for a purchase using the formula:  
`Points = floor(purchase_amount / spend_per_point) × points_per_spend_unit`

**FR-POINT-002**  
The Points calculation must use the active Loyalty Rule of the Business at the time of the transaction.

**FR-POINT-003**  
The system must allow a Business Owner to update the Loyalty Rule for their Business.

**FR-POINT-004**  
Updating a Loyalty Rule must NOT retroactively change previously earned Points.

**FR-POINT-005**  
The system must enforce that `spend_per_point > 0` and `points_per_spend_unit > 0`.

**FR-POINT-006**  
The system must enforce that `min_redemption_points > 0`.

**FR-POINT-007**  
A Live Rule Calculator must allow Business Owners to preview the effect of rule changes before saving.

**FR-POINT-008**  
Visit Bonus Points must be added to the Points total on each verified purchase transaction.

---

### 2.8 Purchase Verification

> **⚠️ Mechanism is OPEN PRODUCT DECISION — OQ-001. Requirements below are preliminary.**

**FR-PURCH-001**  
The system must record a Purchase when a Customer's purchase is verified at a Business.

**FR-PURCH-002**  
A Purchase record must include: business_id, customer_id, purchase amount, points_awarded, verified_by_staff_id, and created_at.

**FR-PURCH-003**  
The system must award Points to the Customer's balance upon recording a verified Purchase.

**FR-PURCH-004**  
The system must append a Points transaction of type `earn` to the `points_transactions` ledger for each verified Purchase.

**FR-PURCH-005**  
A Purchase may only be recorded for a Customer who is enrolled at the Business.

**FR-PURCH-006**  
The staff member who verified the purchase must be recorded on the Purchase record.

**FR-PURCH-007**  
The Business Staff must be able to look up a Customer by phone number or name at the counter terminal.

> **OPEN:** Additional requirements will be defined once the purchase verification mechanism (OQ-001) is decided.

---

### 2.9 Rewards

**FR-REWARD-001**  
The system must allow a Business Owner to create Rewards with: title, description, points_cost, reward_type, and active status.

**FR-REWARD-002**  
The system must allow a Business Owner to edit an existing Reward.

**FR-REWARD-003**  
The system must allow a Business Owner to deactivate a Reward. A deactivated Reward must not appear in the Customer Rewards catalogue.

**FR-REWARD-004**  
The Customer Rewards catalogue must display all active Rewards for the enrolled Business.

**FR-REWARD-005**  
The Customer Rewards catalogue must show which Rewards are achievable (balance ≥ points_cost) and which are locked (balance < points_cost).

**FR-REWARD-006**  
For locked Rewards, the system must display a progress indicator showing the Points required vs. Points held.

**FR-REWARD-007**  
The system must enforce that `points_cost > 0` for all Rewards.

---

### 2.10 Redemption

**FR-REDEEM-001**  
The system must allow an eligible Customer (sufficient Points balance) to initiate a Reward redemption.

**FR-REDEEM-002**  
Before creating a Redemption Ticket, the system must confirm the Customer has sufficient Points balance.

**FR-REDEEM-003**  
Upon creating a Redemption Ticket, the system must atomically:
- Deduct the Reward point cost from the Customer's `business_customers.total_points`
- Create a `reward_redemptions` record with status `pending`
- Append a `points_transactions` record of type `redeem`

If any of these operations fail, all must be rolled back (no partial state).

**FR-REDEEM-004**  
The Redemption Ticket must have a unique code that cannot be trivially guessed (cryptographically generated).

**FR-REDEEM-005**  
The Redemption Ticket code format must be human-readable (e.g. `RPT-CAFE-8821`) for counter staff to enter manually.

**FR-REDEEM-006**  
The Redemption Ticket must expire 24 hours after creation.

**FR-REDEEM-007**  
The system must display the Redemption Ticket to the Customer with: code, QR representation, Business name, Reward title, Customer name, expiry countdown.

**FR-REDEEM-008**  
Staff verification of a Redemption Ticket must be idempotent: submitting the same code twice must not create a second redemption event.

**FR-REDEEM-009**  
On successful verification, the system must update the Redemption Ticket status to `redeemed`, record the `redeemed_at` timestamp, and record the `redeemed_by_staff_id`.

**FR-REDEEM-010**  
The system must reject a Redemption Ticket if its status is `redeemed` with a clear error message.

**FR-REDEEM-011**  
The system must reject a Redemption Ticket if it has expired, and must update its status to `expired`.

**FR-REDEEM-012**  
A Redemption Ticket must only be verifiable by the Business it was issued for. A code from Business A must be rejected by Business B.

---

### 2.11 Activity Log

**FR-ACT-001**  
The system must display a Customer's complete Points transaction history across all Business memberships.

**FR-ACT-002**  
Each transaction entry must show: date, Business name, transaction type (earn / redeem / bonus / welcome), Points delta, and source description.

**FR-ACT-003**  
Transactions must be displayed in reverse chronological order (most recent first).

**FR-ACT-004**  
The Customer Activity Log must be scoped to the authenticated Customer. A Customer must not see another Customer's transactions.

---

### 2.12 Customer Profile

**FR-PROF-001**  
The system must display the authenticated Customer's profile: name, phone, email, avatar.

**FR-PROF-002**  
The system must allow the Customer to update their profile name.

**FR-PROF-003**  
The Customer must be able to view all their active Business memberships from their profile.

---

### 2.13 Business Settings

**FR-SET-001**  
The system must allow a Business Owner to update: Business name, description, address, city, logo URL, primary colour.

**FR-SET-002**  
Settings changes must only affect the authenticated user's active Business.

**FR-SET-003**  
The system must confirm to the user when settings are saved successfully.

---

### 2.14 QR Code

**FR-QRC-001**  
Each Business must have exactly one QR Code record in the system.

**FR-QRC-002**  
The QR Code must encode the URL: `{base_url}/join/{business-slug}`.

**FR-QRC-003**  
The QR Code display view must allow the Business Owner to download the QR as a PNG image.

**FR-QRC-004**  
The QR Code view must display the current scan count for the Business.

---

### 2.15 Analytics

**FR-ANAL-001**  
The Analytics view must display the following metrics for the active Business:
- Total enrolled Customers
- Active Customers (2+ visits)
- Repeat Visit Rate (%)
- Total Points Issued
- Total Points Redeemed
- Total Rewards Redeemed

**FR-ANAL-002**  
The Analytics view must display a weekly visit activity chart.

**FR-ANAL-003**  
All analytics data must be scoped to the active Business only.

---

## 3. Non-Functional Requirements

**NFR-PERF-001**  
Dashboard pages must load within 3 seconds on a standard broadband connection.

**NFR-PERF-002**  
Redemption Ticket verification must complete within 2 seconds.

**NFR-RESP-001**  
The Customer product must be fully usable on a mobile device (screen width 375px+).

**NFR-RESP-002**  
The Business Dashboard must be usable on a desktop browser (screen width 1024px+).

**NFR-AVAIL-001**  
The platform must target 99% uptime for the Customer-facing join and redemption flows.

**NFR-SEC-001**  
All communication between the client and Supabase must be over HTTPS.

**NFR-SEC-002**  
Row Level Security must be enabled on all tables containing Business or Customer data.

**NFR-ACC-001**  
All interactive elements must be keyboard-accessible.

---

## 4. Authentication Requirements

**FR-AUTH-001**  
Business Owner authentication must use Supabase Auth email + password.

**FR-AUTH-002**  
Customer authentication must use Supabase Auth OTP (phone or email).

**FR-AUTH-003**  
Session tokens must be managed by Supabase Auth and refreshed automatically.

**FR-AUTH-004**  
Logout must invalidate the active session token.

**FR-AUTH-005**  
Protected routes must redirect unauthenticated users to the appropriate login page.

**FR-AUTH-006**  
The system must distinguish between Customer and Business Owner session types and route accordingly.

---

## 5. Authorization Requirements

**FR-AUTHZ-001**  
A Business Owner must only be able to access data for Businesses they own or are a member of.

**FR-AUTHZ-002**  
A Business Staff member must only be able to access the counter verification terminal. They must not access: customer lists, loyalty rules, rewards configuration, settings, or analytics.

**FR-AUTHZ-003**  
A Customer must only be able to access their own profile, Points balance, transactions, and Redemption Tickets.

**FR-AUTHZ-004**  
A Customer must not be able to access the Business Dashboard under any circumstances.

**FR-AUTHZ-005**  
A Business Owner must not be able to access or modify another Business's data.

**FR-AUTHZ-006**  
Authorization must be enforced at the database level (RLS) in addition to the application level.

---

## 6. Security Requirements

**FR-SEC-001**  
Business A must never be able to read Business B's Customer data, Points transactions, Redemptions, Rewards, or Loyalty Rules.

**FR-SEC-002**  
Redemption Ticket codes must be generated using a cryptographically secure random number generator.

**FR-SEC-003**  
The system must not allow a Customer to award themselves Points without staff-verified purchase confirmation.

**FR-SEC-004**  
The system must reject any request where the `business_id` in the request does not match the authenticated user's Business membership.

**FR-SEC-005**  
Expired session tokens must be rejected; the user must be redirected to re-authenticate.

**FR-SEC-006**  
All database write operations (Points awards, Redemptions, Purchases) must be logged with the authenticated user's ID.

---

## 7. Validation Rules

**VR-BUSINESS-001** Business name: required; min 2 characters; max 100 characters  
**VR-BUSINESS-002** Business slug: required; alphanumeric + hyphens only; min 2; max 50; globally unique  
**VR-BUSINESS-003** Primary colour: valid CSS hex colour code if provided  
**VR-LOYALTY-001** spend_per_point: required; > 0; numeric  
**VR-LOYALTY-002** points_per_spend_unit: required; > 0; integer  
**VR-LOYALTY-003** welcome_points: required; ≥ 0; integer  
**VR-LOYALTY-004** min_redemption_points: required; > 0; integer  
**VR-REWARD-001** Reward title: required; min 2; max 100 characters  
**VR-REWARD-002** points_cost: required; > 0; integer  
**VR-CUSTOMER-001** Phone number: must be a valid phone number format  
**VR-CUSTOMER-002** Email: must be a valid email format if provided  
**VR-PURCHASE-001** Purchase amount: required; > 0; decimal (2dp)  
**VR-OTP-001** OTP: required; 6-digit numeric  

---

## 8. Error Handling

**ERR-001**  
All user-facing errors must display a human-readable message. Technical error details must not be shown to end users.

**ERR-002**  
All API errors must be logged to the browser console in development. In production, errors must be logged to an error monitoring system (OPEN DECISION — OQ-015: error monitoring tool).

**ERR-003**  
Network failures must show a retry option to the user.

**ERR-004**  
Form validation errors must be displayed inline, adjacent to the failing field.

**ERR-005**  
Empty states (no data) must be displayed with a helpful message and a relevant CTA.

---

## 9. Empty States

| Page | Empty State Message |
|------|---------------------|
| Customers list | "No customers have joined yet. Share your QR code to get started!" |
| Transactions list | "No transactions yet. Points will appear here as customers make purchases." |
| Rewards list (business) | "No rewards configured. Add your first reward to attract customers!" |
| Rewards list (customer) | "No rewards available at this Business yet." |
| Activity log (customer) | "No activity yet. Join a Business and make your first purchase!" |
| Analytics | "Not enough data yet. Analytics will appear once customers start visiting." |

---

## 10. Session Behaviour

**FR-SESS-001**  
Authenticated sessions must persist across browser refreshes.

**FR-SESS-002**  
On session expiry, the user must be redirected to the appropriate login page.

**FR-SESS-003**  
Session state must be managed by Supabase Auth; the application must not store session tokens in localStorage manually.

**FR-SESS-004**  
Multiple tabs sharing the same session must remain consistent.

---

## 11. Notification Requirements

> **OPEN REQUIREMENT — OQ-016**

In-app notifications (e.g. "You earned 20 points!") are desirable but not confirmed for MVP.

SMS/push notifications are out of scope for MVP.

A simple Toast notification system is implemented for UI feedback (save success, error).

---

## 12. Storage Requirements

**FR-STOR-001**  
Business logos and banner images must be stored in Supabase Storage (bucket: `cafe-assets`).

**FR-STOR-002**  
The `cafe-assets` bucket must be publicly readable.

**FR-STOR-003**  
Only authenticated users may upload to the `cafe-assets` bucket.

**FR-STOR-004**  
File size limits must be enforced: images max 5 MB (DECISION REQUIRED — OQ-017: exact limit).

---

## 13. Data Consistency Requirements

**FR-CONS-001**  
Points deduction (Redemption) and Redemption Ticket creation must be atomic. Partial state (Points deducted, ticket not created) is not acceptable.

**FR-CONS-002**  
Points awarded (Purchase earn) and Purchase record creation must be atomic.

**FR-CONS-003**  
The `points_transactions` ledger is append-only. Existing transaction records must never be modified or deleted.

**FR-CONS-004**  
The `total_points` field in `business_customers` must always equal the sum of all Points transactions for that Customer at that Business. (OPEN QUESTION — OQ-018: whether to compute from ledger or maintain a denormalized balance.)

---

## 14. Audit Requirements

**FR-AUDIT-001**  
Every Points transaction must record: `business_id`, `customer_id`, `points`, `type`, `source`, `created_at`.

**FR-AUDIT-002**  
Every Purchase record must record: `business_id`, `customer_id`, `amount`, `points_awarded`, `verified_by_staff_id`, `created_at`.

**FR-AUDIT-003**  
Every Redemption record must record: `business_id`, `customer_id`, `reward_id`, `code`, `status`, `redeemed_by_staff_id`, `redeemed_at`, `created_at`.

**FR-AUDIT-004**  
Audit records must not be modifiable by Business Owners or Business Staff.

---

*Document version 0.1 — Documentation-first phase. Requirements must be reviewed and approved before implementation.*
