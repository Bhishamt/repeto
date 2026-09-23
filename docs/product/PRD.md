# PRD — Product Requirements Document
**Product:** Repeato  
**Version:** 0.1 (Documentation Phase)  
**Date:** 2026-09-19  
**Status:** DRAFT — Awaiting review

---

## Terminology

The following terms are used consistently throughout all Repeato documents:

| Term | Definition |
|------|-----------|
| **Business** | A café, restaurant, or F&B establishment enrolled on the Repeato platform |
| **Business Owner** | A user who registered and manages a Business on Repeato |
| **Business Staff** | A user authorised by a Business Owner to operate the counter verification terminal |
| **Customer** | An end-user who joins a Business's loyalty programme |
| **Platform Admin** | A Repeato operator with elevated platform-wide access |
| **Tenant** | Synonymous with Business; each Business is an isolated tenant |
| **Membership** | A Customer's relationship with a specific Business loyalty programme |
| **Points** | The virtual currency issued by a Business to a Customer |
| **Reward** | A benefit a Customer may redeem by spending Points |
| **Redemption Ticket** | A time-limited single-use code generated when a Customer redeems a Reward |
| **Loyalty Rule** | The configuration set by a Business defining how Points are earned |
| **QR Code** | A scannable code unique to a Business used for Customer onboarding |

---

## 1. Product Overview

Repeato is a multi-tenant Customer Loyalty & Retention Platform designed for cafés and restaurants. It enables Businesses to convert first-time visitors into repeat customers by offering a digital loyalty programme accessible via QR code.

The platform has two distinct product surfaces:
1. **Business Product** — Dashboard and tools for Business Owners and Business Staff
2. **Customer Product** — Mobile-first web app for Customers

---

## 2. Product Vision

> *To make every café visit feel like a relationship — not a transaction.*

Repeato aims to replace paper punch cards and fragmented loyalty programmes with a seamless, digital-first loyalty system that works for both small independent cafés and growing F&B chains.

---

## 3. Problem Statement

### For Businesses
- Paper loyalty cards are easy to lose, forge, and offer no data
- Small cafés cannot afford expensive POS-integrated loyalty systems
- No visibility into which customers are returning, churning, or at-risk
- No mechanism to incentivise first-time visitors to return

### For Customers
- Managing multiple paper punch cards across different cafés is inconvenient
- No visibility into reward progress or points balance
- Redemption is manual and prone to errors or disputes

---

## 4. Opportunity

The café and restaurant segment in India is large, growing, and underserved by affordable loyalty tooling. Most existing solutions require expensive POS hardware or are designed for enterprise retail chains.

Repeato targets the mid-market café operator who wants a professional loyalty programme without complex setup or hardware investment.

---

## 5. Target Users

### Primary Users

**Business Owner**
- Owns or manages a café or restaurant
- Wants to increase repeat customer visits
- Limited technical knowledge but comfortable with web tools
- Values simplicity, affordability, and real results

**Customer**
- Frequent café visitor (1–4 times per week)
- Smartphone-native; expects seamless digital experience
- Motivated by tangible rewards (free drinks, discounts)
- Dislikes friction; will abandon a flow that requires too many steps

### Secondary Users

**Business Staff**
- Counter or floor staff at a Business
- Operates the redemption verification terminal
- Does not need access to business settings or analytics

**Platform Admin**
- Repeato team member
- Manages Business onboarding, platform health, and support

---

## 6. User Personas

### Persona A — "The Café Owner"
**Name:** Vikram  
**Age:** 34  
**Role:** Owner of a specialty coffee shop  
**Goal:** Increase the number of customers who return a second and third time  
**Pain:** Tried a WhatsApp-based points group — chaotic and unreliable  
**Expectation:** Something simple to set up in an afternoon, works on customers' phones, gives him a dashboard to see who his regulars are

### Persona B — "The Regular"
**Name:** Priya  
**Age:** 28  
**Role:** Marketing executive; visits 3–4 cafés per week  
**Goal:** Earn free drinks at her favourite spots without carrying a physical card  
**Pain:** Forgot her punch card at home, lost rewards she had already earned  
**Expectation:** Scan a QR code, see her points on her phone, redeem easily at the counter

### Persona C — "The Counter Staff"
**Name:** Rohan  
**Age:** 22  
**Role:** Barista / counter staff at a café  
**Goal:** Quickly verify a customer's redemption ticket without interrupting service  
**Pain:** Doesn't want to learn a complex system; needs something that works in 10 seconds  
**Expectation:** Enter or scan a code, get a clear green/red result

---

## 7. Business Goals

1. Increase average Customer visit frequency from once per month to 2+ times per month
2. Grow a Business's identifiable Customer database (phone/email)
3. Provide actionable retention intelligence to Business Owners
4. Reduce churn by making rewards attainable and motivating
5. Enable Businesses to launch a digital loyalty programme with zero hardware requirement

---

## 8. Customer Goals

1. Earn points effortlessly during normal café visits
2. See clear progress toward rewards
3. Redeem rewards easily without friction at the counter
4. Manage all café memberships in one place

---

## 9. Product Goals

1. Deliver a working loyalty loop: Visit → Join → Earn → Reward → Return → Repeat
2. Support multiple independent Businesses on the same platform with complete data isolation
3. Mobile-first Customer experience accessible via QR code scan
4. Business Owner dashboard accessible from any device
5. Minimal setup time for a new Business (target: under 30 minutes)

---

## 10. Core Loyalty Loop

```
VISIT
  ↓
JOIN (Customer scans Business QR → authenticates → joins programme)
  ↓
EARN (Purchase verified → Points calculated → Balance updated)
  ↓
REWARD (Points threshold reached → Reward unlocked)
  ↓
RETURN (Customer redeems Reward → Encouraged to return)
  ↓
REPEAT
```

---

## 11. Customer Journey

1. Customer visits a participating Business
2. Customer scans the Business's QR code (table standee, counter card, or window sticker)
3. Customer reaches the Business-specific join page (`/join/{business-slug}`)
4. Customer authenticates using phone number + OTP (or email OTP for fallback)
5. Customer is enrolled in that Business's loyalty programme (Membership created)
6. Welcome Points are awarded according to the Business's active Loyalty Rule
7. Customer makes a purchase
8. Purchase is verified (mechanism: **OPEN PRODUCT DECISION** — see OPEN_QUESTIONS.md)
9. Eligible Points are calculated based on active Loyalty Rule
10. Customer's Points balance is updated
11. Customer sees their progress toward available Rewards
12. A Reward becomes available when Points balance meets the Reward cost
13. Customer selects a Reward and initiates redemption
14. A Redemption Ticket (unique code) is generated, valid for 24 hours
15. Customer presents the code to Business Staff
16. Business Staff verifies the code at the Staff Counter terminal
17. Redemption is confirmed; code is marked as used (cannot be reused)
18. Customer is encouraged to return (next reward progress begins)

---

## 12. Business Journey

1. Business Owner discovers Repeato (via website, referral, or outreach)
2. Business Owner visits the Repeato website and learns about the product
3. Business Owner registers for an account (email + password)
4. Business Owner completes onboarding: Business details, initial menu/products, Loyalty Rules, initial Rewards
5. Business Owner generates and downloads QR code for physical placement
6. Business Owner monitors Customer sign-ups and activity via Dashboard
7. Business Owner adjusts Loyalty Rules and Rewards as needed
8. Business Owner uses analytics to identify at-risk customers and active segments
9. Business Staff is invited to operate the counter verification station

---

## 13. Customer Features (MVP)

| Feature | Description |
|---------|-------------|
| QR Onboarding | Scan a Business QR to reach the join page |
| Authentication | Phone number + OTP (primary); email OTP (fallback) |
| Join Programme | Enrol in a Business's loyalty programme |
| Points Balance | View current Points balance per Business |
| Reward Progress | Visual progress toward available Rewards |
| Rewards Catalogue | Browse available Rewards and their Point costs |
| Redemption | Initiate a Reward redemption, receive a Redemption Ticket |
| Activity Log | View all Points transactions across all memberships |
| Multi-Business | Hold memberships in multiple Businesses simultaneously |
| Profile | View and update personal profile |

---

## 14. Business Features (MVP)

| Feature | Description |
|---------|-------------|
| Business Authentication | Register and log in as a Business Owner |
| Business Onboarding | Set up Business profile, menu, Loyalty Rules, Rewards |
| Dashboard Overview | KPI summary: members, activity, Points issued/redeemed |
| Customer Management | View Customer directory with Points, visits, tier |
| Points Configuration | Set and update Loyalty Rules (earn rate, bonuses) |
| Rewards Builder | Create, edit, and deactivate Rewards |
| Purchase Verification | Verify purchases and award Points (mechanism: OPEN DECISION) |
| Redemption Verification | Verify Customer Redemption Tickets at counter |
| Transactions Ledger | View all Points transactions |
| Analytics | Basic analytics: visit trends, top customers, redemption rate |
| QR Code | Generate and download Business QR code |
| Settings | Update Business profile, branding |
| Multi-Business | Business Owner may own/manage multiple Businesses |

---

## 15. Public Website Features (MVP)

| Page | Purpose |
|------|---------|
| Home | Product hero, value proposition, CTA to get started |
| How It Works | Explain the Customer and Business journey simply |
| For Cafés & Restaurants | Business-focused benefits, features, pricing signals |
| About | Company story and mission |
| Contact / Get Started | Lead capture form or direct sign-up CTA |

> **OPEN REQUIREMENT:** The Public Website scope relative to the technical MVP is a priority decision. Documented here as a product requirement.

---

## 16. Reward System

- Each Business defines its own Rewards catalogue
- A Reward has a Point cost, title, description, and type (`free_item`, `discount`, `voucher`)
- A Reward may be active or inactive
- When a Customer's Points balance meets the Reward cost, the Reward is available
- Customer initiates redemption; a single-use Redemption Ticket is generated
- Redemption Tickets expire after 24 hours
- A used Redemption Ticket cannot be reused
- Points are deducted at the moment of Redemption Ticket creation

> **OPEN REQUIREMENT — OQ-009:** Whether Points should be deducted at ticket creation or at staff verification is a product decision. See OPEN_QUESTIONS.md.

---

## 17. Points System

- Each Business configures its own Points earning formula (Loyalty Rule)
- Formula: `Points = floor(purchase_amount / spend_per_point) × points_per_spend_unit`
- Example: ₹100 spend per unit, 10 points per unit → ₹250 purchase = 20 points
- Welcome Points may be awarded when a Customer first joins a Business
- Visit Bonus Points may be awarded per verified purchase
- Points are recorded in an immutable ledger (append-only)
- Historical Points transactions retain the context at time of transaction
- If Loyalty Rules change, historical transactions are NOT recalculated

---

## 18. QR Onboarding

- Each Business has exactly one unique QR code
- The QR code points to: `/join/{business-slug}`
- The join page displays Business branding (name, logo, colour)
- Customer authenticates on the join page
- After authentication, Customer is automatically enrolled in that Business's programme
- QR code scan count is tracked for analytics

---

## 19. Customer Authentication

- **Primary method:** Phone number + OTP
- **Fallback method:** Email + OTP
- Authentication is powered by Supabase Auth
- An already-authenticated Customer visiting another Business's join page is enrolled directly without re-authenticating
- Customers do not use password-based authentication
- Business Owners use email + password authentication

> **OPEN REQUIREMENT — OQ-002:** Phone OTP vs email OTP priority is a product decision (SMS cost and reliability concerns). See OPEN_QUESTIONS.md.

---

## 20. Purchase Verification Concept

> **⚠️ OPEN PRODUCT DECISION — OQ-001**

Purchase verification is the mechanism by which the system confirms a Customer made a real purchase at a Business before awarding Points.

This is a critical product decision that has NOT been finalised.

Possible approaches (not chosen):
1. Manual bill entry by Business Staff (staff inputs purchase amount at counter terminal)
2. Customer QR scanned by Business Staff (Customer shows a personal QR at checkout)
3. Bill/receipt code entered by Customer (Customer scans or enters a code from receipt)
4. POS system integration (automated via integration with the café's billing system)

**This decision must be made before implementation of the purchase flow.**

See OPEN_QUESTIONS.md — OQ-001.

---

## 21. Redemption Concept

1. Customer selects an available Reward from their Rewards Catalogue
2. System confirms sufficient Points balance
3. System deducts the Point cost and generates a unique Redemption Ticket
4. Ticket contains: unique code (e.g. `RPT-CAFE-8821`), reward details, expiry time
5. Customer presents the code to Business Staff
6. Business Staff enters the code into the Staff Counter terminal
7. System validates: code exists, code is unused, code is unexpired, code belongs to this Business
8. On success: code is marked `redeemed`, redemption is recorded with staff identity and timestamp
9. On failure: clear error message (invalid / expired / already used)

---

## 22. Multi-Business Concept

- The Repeato platform hosts multiple independent Businesses (tenants)
- Each Business operates as a fully isolated tenant
- A Customer may hold memberships in multiple Businesses
- A Customer's Points at Business A are entirely separate from their Points at Business B
- Business A cannot see, access, or modify Business B's data
- Tenant isolation is enforced at the database level (Row Level Security)

---

## 23. User Roles

| Role | Description |
|------|-------------|
| `customer` | End-user of the loyalty programme |
| `business_owner` | Owner of a Business; full access to their Business dashboard |
| `business_staff` | Staff member authorised by Business Owner; limited access (counter only) |
| `platform_admin` | Repeato platform operator; platform-wide access |

---

## 24. MVP Definition

**In Scope (MVP)**
- Business registration, authentication, and onboarding
- Business dashboard: overview, customers, points rules, rewards, transactions, analytics, QR, settings
- Customer authentication (phone/email OTP)
- Customer QR onboarding flow
- Customer membership and Points
- Rewards catalogue and Redemption Ticket generation
- Staff counter redemption verification
- Multi-tenant data isolation (RLS)

**Out of Scope (MVP)**
- Public marketing website (separate delivery decision)
- POS integration
- SMS/push notifications
- Multi-branch / multi-location per Business
- Tier-based reward gating (active tier enforcement)
- Referral programmes
- Paid plans / billing / commercial model
- Platform Admin dashboard

See MVP_SCOPE.md for the complete feature matrix.

---

## 25. Out of Scope

- POS hardware integration
- Native mobile apps (iOS / Android)
- SMS marketing campaigns
- Referral / affiliate programmes
- Subscription-based loyalty (monthly fee by Customer)
- WhatsApp / social login
- Offline mode
- Multi-currency support
- Platform-level analytics (cross-Business aggregate data)
- Automated customer win-back campaigns

---

## 26. Open Questions

See [`docs/decisions/OPEN_QUESTIONS.md`](../decisions/OPEN_QUESTIONS.md) for the complete list.

Critical items:
- **OQ-001** — Purchase verification mechanism (BLOCKING)
- **OQ-002** — Customer authentication method
- **OQ-003** — Staff workflow for purchase entry
- **OQ-004** — Point deduction timing
- **OQ-005** — Multi-branch support requirement

---

## 27. Success Criteria

| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| Businesses onboarded | ≥ 5 active Businesses |
| Customers per Business | ≥ 50 enrolled Customers |
| Repeat visit rate | ≥ 40% of enrolled Customers visit 2+ times |
| Redemption rate | ≥ 20% of enrolled Customers redeem at least one Reward |
| Business onboarding time | < 30 minutes |
| Customer join flow time | < 60 seconds from QR scan to Membership confirmed |

---

*Document version 0.1 — Documentation-first phase. Do not implement features until product decisions are finalised and this document is approved.*
