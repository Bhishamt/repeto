# BRD — Business Requirements Document
**Product:** Repeato  
**Version:** 0.1 (Documentation Phase)  
**Date:** 2026-09-19  
**Status:** DRAFT — Awaiting review

> Refer to PRD.md for Terminology definitions. All terms used here follow the Terminology table in the PRD.

---

## 1. Business Problem

Small and mid-sized cafés and restaurants in India lack affordable, practical tools to:

1. Identify and retain returning customers
2. Reward loyal customers systematically and fairly
3. Build a verified database of their customer base
4. Measure the effectiveness of their retention efforts

Paper punch cards are unreliable, forgeable, and non-digital. Enterprise loyalty platforms are too expensive or too complex for an independent café operator. WhatsApp-based manual systems are chaotic and unscalable.

The result: most cafés treat every customer as a first-time visitor, missing significant revenue from repeat visits.

---

## 2. Business Objectives

| Objective | Description |
|-----------|-------------|
| BO-01 | Enable Businesses to launch a fully functional digital loyalty programme within one working day |
| BO-02 | Increase average Customer visit frequency at participating Businesses |
| BO-03 | Provide Businesses with an identified, contactable customer database |
| BO-04 | Reduce loyalty fraud compared to paper punch cards |
| BO-05 | Enable Businesses to understand their customer retention performance via data |
| BO-06 | Build a scalable multi-tenant platform that can support many Businesses simultaneously |

---

## 3. Stakeholders

| Stakeholder | Role | Interest |
|-------------|------|---------|
| Business Owner | Primary paying user | Set up, manage, and benefit from the loyalty programme |
| Business Staff | Operational user | Verify redemptions and record purchases quickly |
| Customer | End beneficiary | Earn and redeem rewards easily |
| Repeato Platform Team | Product and operations | Build and operate the platform; ensure quality and growth |

---

## 4. Business Users

### Business Owner
- Registers the Business on the platform
- Configures Loyalty Rules (earn rate, welcome bonus, minimum redemption threshold)
- Creates and manages the Rewards catalogue
- Invites and manages Business Staff
- Monitors the Customer directory and analytics dashboard
- Downloads and deploys QR codes for physical placement in the Business
- May own and manage multiple Businesses (e.g. chain operator)

### Business Staff
- Operates the counter verification terminal during business hours
- Verifies Customer Redemption Tickets
- Records purchases for Points awarding (mechanism: OPEN DECISION — OQ-001)
- Cannot access business settings, customer lists, or financial data beyond the counter station

---

## 5. Customer Business Journey

1. Customer discovers Business via physical QR code placement
2. Customer scans QR; is directed to the Business's join page
3. Customer authenticates (phone OTP or email OTP)
4. Customer is enrolled in the Business loyalty programme (Membership created)
5. Welcome Points are awarded based on Business's active Loyalty Rule
6. Customer accumulates Points via verified purchases
7. Customer monitors Points balance and Reward progress via the Customer app
8. Customer initiates a Reward redemption when eligible
9. Customer receives a time-limited Redemption Ticket
10. Customer presents Redemption Ticket at counter; staff verifies and confirms

---

## 6. Merchant Business Journey

1. Business Owner discovers Repeato
2. Business Owner registers (email + password)
3. Business Owner completes onboarding wizard:
   - Business name, address, city, logo upload
   - Initial product / menu items (name, price, points earned per item)
   - Loyalty Rules (earn rate, welcome bonus, minimum redemption points)
   - Initial Rewards (title, description, point cost, reward type)
4. Onboarding complete; QR code available for download
5. Business Owner deploys QR standees at physical locations
6. Business Owner monitors new Customer registrations via dashboard
7. Business Owner tracks transactions, redemptions, and analytics
8. Business Owner adjusts Loyalty Rules and Rewards as business needs evolve
9. Business Owner grants Staff access to counter terminal as needed

---

## 7. Loyalty Business Model

- Repeato is a B2B SaaS platform targeting café and restaurant operators
- The Business is the primary customer of Repeato; Customers are the end beneficiaries
- **OPEN DECISION — OQ-010:** The commercial model (freemium, fixed subscription, per-transaction fee, tiered plans) has not been finalised and is out of scope for the MVP phase
- In the MVP phase, no billing or payment processing is implemented
- The loyalty programme itself is B2B2C: Repeato → Business → Customer

---

## 8. Points Earning Rules

Business rules for Points earning:

| Rule | Description |
|------|-------------|
| BR-POINT-01 | Points are earned only on verified purchases |
| BR-POINT-02 | Each Business defines its own earn rate (Loyalty Rule) |
| BR-POINT-03 | The earn formula is: `floor(purchase_amount / spend_per_point) × points_per_spend_unit` |
| BR-POINT-04 | Minimum purchase amount to earn any points is determined by `spend_per_point` |
| BR-POINT-05 | Welcome Points are a one-time bonus awarded on first join; not repeatable |
| BR-POINT-06 | Visit Bonus Points may be awarded per verified purchase transaction |
| BR-POINT-07 | Points have no monetary value and cannot be exchanged for cash |
| BR-POINT-08 | Points are non-transferable between Customers |
| BR-POINT-09 | Points are non-transferable between Businesses |
| BR-POINT-10 | Points do not expire in the MVP phase (OPEN DECISION — OQ-011) |
| BR-POINT-11 | Points earned under a historical Loyalty Rule are NOT recalculated when Rules change |

---

## 9. Reward Rules

| Rule | Description |
|------|-------------|
| BR-REWARD-01 | Each Business defines its own Rewards catalogue |
| BR-REWARD-02 | A Reward costs a defined number of Points to redeem |
| BR-REWARD-03 | A Customer must have sufficient Points balance to initiate a Redemption |
| BR-REWARD-04 | Rewards may be `free_item`, `discount`, or `voucher` type |
| BR-REWARD-05 | A Business may deactivate a Reward at any time |
| BR-REWARD-06 | A deactivated Reward cannot be newly redeemed; existing unredeemed tickets are unaffected |
| BR-REWARD-07 | Rewards are per-Business; a Reward at Business A cannot be redeemed at Business B |
| BR-REWARD-08 | A Business must have at least one active Reward for the Redemption flow to function |

---

## 10. Redemption Rules

| Rule | Description |
|------|-------------|
| BR-REDEEM-01 | A Redemption Ticket is generated when a Customer initiates a Reward redemption |
| BR-REDEEM-02 | Points are deducted from the Customer's balance at Redemption Ticket creation |
| BR-REDEEM-03 | A Redemption Ticket has a unique code that cannot be guessed or replicated |
| BR-REDEEM-04 | A Redemption Ticket is valid for 24 hours from creation |
| BR-REDEEM-05 | A Redemption Ticket can only be used once |
| BR-REDEEM-06 | An expired or already-redeemed ticket must be clearly rejected |
| BR-REDEEM-07 | Redemption must be verified by Business Staff at the counter terminal |
| BR-REDEEM-08 | A Redemption Ticket is Business-scoped; it cannot be redeemed at a different Business |
| BR-REDEEM-09 | The staff member who verified a redemption must be recorded |
| BR-REDEEM-10 | A Customer cannot cancel or reverse a Redemption Ticket once created (OPEN DECISION — OQ-009) |

---

## 11. Purchase Verification Business Requirement

> **⚠️ OPEN PRODUCT DECISION — OQ-001**

### Why it matters

Purchase verification is the mechanism that prevents Customers from awarding themselves Points without making a real purchase. Without a reliable verification mechanism, the loyalty system is trivially fraudulent.

### What needs to be verified

- The Customer did make a real purchase at the Business
- The purchase occurred on the current visit (not a past bill, not a future bill)
- The purchase amount is accurate (to compute correct Points)
- The verification was authorised by the Business (not self-asserted by the Customer)

### Implications of each approach

| Approach | Fraud Risk | Staff Workflow Impact | Customer Workflow Impact |
|----------|------------|----------------------|--------------------------|
| Manual bill entry by Staff | Medium — trusts staff honesty | Adds ~10 seconds at counter | None; transparent to Customer |
| Customer QR scanned by Staff | Low — QR is tied to identity | Staff needs scanner or phone | Customer must display QR app |
| Bill receipt code entry | Medium — codes may be shared | Customer must enter code themselves | Adds step for Customer |
| POS integration | Low to None — automated | Requires POS compatibility | Transparent to Customer |

### Decision required

The Business Owner and Repeato product team must decide which mechanism to implement before the purchase flow is built.

See OPEN_QUESTIONS.md — OQ-001.

---

## 12. Customer Retention Goals

- **Primary goal:** Increase the percentage of Customers who visit a Business 2 or more times
- Loyalty programme should create an ongoing incentive to return before rewards are exhausted
- Reward thresholds should be attainable within a reasonable number of visits (e.g. 5–10 visits for a free drink)
- Business Owners should be able to see which Customers are at risk of churning (low visit frequency)

> **OPEN REQUIREMENT:** Churn prediction / at-risk Customer flagging is a future feature, not MVP.

---

## 13. Customer Data Requirements

The following Customer data must be collected and maintained:

| Data Field | Required | Purpose |
|------------|----------|---------|
| Phone number | Required (primary) | Authentication (OTP), identity |
| Email address | Optional | Fallback authentication |
| Full name | Required | Identification in dashboard |
| Avatar / photo | Optional | Profile display |
| Business memberships | Required | Loyalty programme participation |
| Points balance (per Business) | Required | Reward eligibility |
| Visit count (per Business) | Required | Retention analytics |
| Lifetime spend (per Business) | Required | Analytics; tier calculation |
| Tier (per Business) | Required | Reward visibility and gamification |
| Join date (per Business) | Required | Retention analytics |
| Last visit date (per Business) | Required | Churn analysis |

> **OPEN REQUIREMENT:** Whether Customer email is required or fully optional at join time is a product decision related to authentication method choice. See OQ-002.

---

## 14. Business Data Requirements

The following Business data must be maintained:

| Data Field | Required | Purpose |
|------------|----------|---------|
| Business name | Required | Display; QR join page |
| Business slug | Required | URL routing for QR join page |
| Logo | Required | Branding on join page and Customer app |
| Description | Optional | Displayed on Customer-facing pages |
| Address | Required | Identification |
| City | Required | Identification |
| Primary colour | Optional | Branding customisation |
| Banner image | Optional | Branding on join page |
| Loyalty Rules (per Business) | Required | Points calculation |
| Rewards catalogue | Required | Redemption functionality |
| Products / menu | Required for purchase-based earning | Points assignment per item |
| QR code record | Required | QR scan tracking |
| Business members (owners, staff) | Required | Access control |

---

## 15. Multi-Business Requirements

| Requirement | Description |
|-------------|-------------|
| MBR-01 | Each Business must be completely isolated from every other Business |
| MBR-02 | A Business Owner may own and manage multiple Businesses |
| MBR-03 | Business Staff must be scoped to their assigned Business only |
| MBR-04 | A Customer may hold memberships in multiple Businesses simultaneously |
| MBR-05 | A Customer's Points at Business A must never affect their Points at Business B |
| MBR-06 | A Business must not be able to view or access another Business's Customer directory |
| MBR-07 | A Business must not be able to view or access another Business's Points transactions |
| MBR-08 | A Business must not be able to view or access another Business's Redemptions |
| MBR-09 | Tenant isolation must be enforced at the database level, not only at the application level |

> **OPEN REQUIREMENT — OQ-005:** Multi-location / multi-branch support (e.g. a Business with multiple physical outlets sharing the same loyalty programme) is not in scope for MVP. See OPEN_QUESTIONS.md.

---

## 16. Roles and Responsibilities

| Role | Platform Responsibility |
|------|------------------------|
| Business Owner | Configure and manage their Business; deploy QR; monitor analytics |
| Business Staff | Verify redemptions; record purchases (if mechanism supports it) |
| Customer | Participate in loyalty programme; redeem rewards; maintain profile |
| Platform Admin | Onboard new Businesses; resolve disputes; monitor platform health |

---

## 17. Business Constraints

| Constraint | Description |
|------------|-------------|
| BC-01 | No POS hardware is required; the platform must work entirely via web/smartphone |
| BC-02 | The system must work within the Supabase free or low-cost tier for early stage |
| BC-03 | Setup must not require technical expertise from the Business Owner |
| BC-04 | The Customer join flow must work on a standard smartphone browser |
| BC-05 | Redemption verification must work without internet dependency at the counter (DECISION REQUIRED — OQ-012) |
| BC-06 | The commercial model must not require upfront hardware purchase by the Business |

---

## 18. Fraud and Abuse Concerns

| Concern | Description | Mitigation |
|---------|-------------|------------|
| FC-01 | Customer self-awards Points without purchase | Purchase verification mechanism (OQ-001) |
| FC-02 | Customer reuses an expired Redemption Ticket | Ticket expiry check at verification time |
| FC-03 | Customer reuses an already-redeemed Ticket | Ticket status check at verification time (append-only state machine) |
| FC-04 | Customer shares a Redemption Ticket with another person | Ticket is single-use; verification marks it immediately |
| FC-05 | Staff awards Points fraudulently | Staff identity recorded on every Points transaction; audit log |
| FC-06 | Business A accesses Business B data | RLS policies at the database level (FR-SEC-001) |
| FC-07 | Customer or external actor manipulates `business_id` | RLS policies reject cross-tenant operations |
| FC-08 | Customer creates a fake Redemption Ticket manually | Codes are generated cryptographically; guessable codes are rejected |
| FC-09 | Customer or attacker replays a used Ticket code | Status check: `redeemed` tickets are permanently rejected |

---

## 19. Refund Considerations

> **OPEN DECISION — OQ-008**

If a Customer's purchase is refunded at the Business:

- Should the Points awarded for that purchase be reversed?
- Who initiates the Points reversal? (Business Staff or Business Owner?)
- How should this be reflected in the Points ledger? (Append a negative transaction, or delete the original?)

**This is an open business decision.** Repeato must define a refund policy before the purchase flow is implemented.

The current system does not have a refund/reversal mechanism.

---

## 20. Branch / Multi-Location Considerations

> **OPEN REQUIREMENT — OQ-005**

A Business that operates multiple physical locations (branches) presents the following question:

- Do all branches share one loyalty programme and one QR code? Or does each branch have its own?
- Can a Customer earn Points at Branch A and redeem at Branch B?
- Are the analytics separated per branch or aggregated?

**This is out of scope for MVP.** Each Business entity on Repeato currently represents a single location. Multi-location support is a future requirement.

---

## 21. Commercial / Business Model Questions

> **OPEN DECISION — OQ-010**

The following commercial questions are unresolved:

1. What is the Repeato pricing model? (Freemium, subscription, per-transaction?)
2. Is there a limit on the number of Customers per Business in the free tier?
3. Is there a limit on active Rewards per Business?
4. What happens when a Business cancels their Repeato subscription? (Customer data, existing Points?)
5. Does Repeato charge the Business for SMS OTP delivery costs?

These questions must be resolved before the platform is opened to paying customers.

---

## 22. Business KPIs

The following KPIs define platform and Business success:

| KPI | Description | Owner |
|-----|-------------|-------|
| New Customer Enrollments | Count of new Memberships created per Business per week | Business |
| Repeat Visit Rate | % of enrolled Customers who visit 2+ times | Business |
| Points Issued | Total Points awarded per Business | Business |
| Points Redeemed | Total Points spent in Redemptions per Business | Business |
| Redemption Rate | % of Memberships that have at least one completed Redemption | Business |
| Active Businesses | Count of Businesses with at least one Customer transaction in the last 30 days | Platform |
| Platform Customer Count | Total unique authenticated Customers across all Businesses | Platform |
| Loyalty Programme Engagement | Average Points balance across active Memberships | Business / Platform |

---

## 23. Open Business Decisions

| ID | Decision | Status |
|----|----------|--------|
| OQ-001 | Purchase verification mechanism | OPEN — BLOCKING |
| OQ-002 | Customer authentication method (phone vs email OTP) | OPEN |
| OQ-003 | Staff workflow for purchase entry | OPEN |
| OQ-004 | Point deduction timing (ticket creation vs staff verification) | OPEN |
| OQ-005 | Multi-branch / multi-location support | DEFERRED to post-MVP |
| OQ-006 | Fraud prevention for purchase self-reporting | OPEN — depends on OQ-001 |
| OQ-007 | Staff invitation / access management workflow | OPEN |
| OQ-008 | Refund and Points reversal policy | OPEN |
| OQ-009 | Redemption Ticket cancellation by Customer | OPEN |
| OQ-010 | Commercial / pricing model | DEFERRED to post-MVP |
| OQ-011 | Points expiry policy | DEFERRED to post-MVP |
| OQ-012 | Offline operation at counter terminal | OPEN |

See OPEN_QUESTIONS.md for full analysis of each.

---

*Document version 0.1 — Documentation-first phase. Business decisions must be resolved before implementation begins.*
