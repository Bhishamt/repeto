# UI/UX Specification
**Product:** Repeato  
**Version:** 0.1 (Documentation Phase)  
**Date:** 2026-09-19  
**Status:** DRAFT — Awaiting review

---

## Design Principles

1. **Mobile-first** for the Customer product; desktop-first for the Business Dashboard
2. **Premium & Minimal** — warm café-inspired aesthetics; no clutter
3. **Clear hierarchy** — most important action always visible
4. **QR & Points CTA** prominent at all times for Customer
5. **Readable reward progress** — always show how far a Customer is from their next reward
6. **Consistent spacing and typography** throughout

### Design System: Espresso Kinetic Glass

**Colour Palette:**

| Token | Value | Usage |
|-------|-------|-------|
| Paper Base | `#FDFBF7` / `#F7F3EC` / `#EFE7DC` | Background surfaces |
| Brand Ink | `#1A1615` / `#57504B` | Body text |
| Espresso Roast | `#3D281D` / `#5C3E2E` | CTA buttons, brand headers |
| Golden Amber | `#D97706` / `#F59E0B` | Loyalty highlights, progress rings, stars |
| Aubergine Accent | `#3B1F2B` / `#573142` | Premium tiers |

**Typography:**
- Headings: `Space Grotesk` — expressive geometric
- Body / UI: `Manrope` — clean, readable

**Currency:** Indian Rupee (₹ INR) throughout all monetary displays

---

## PART 1: PUBLIC WEBSITE

---

### Screen: PW-001 — Home Page

**Purpose:** Introduce Repeato to potential Business Owners; drive sign-up CTA

**User Role:** Unauthenticated public visitor

**Entry Point:** `/` or direct URL

**Navigation:** Top navbar with links to How It Works, For Cafés, About, Contact. CTA button: "Get Started"

**Components:**
- Hero section: headline, sub-headline, CTA button ("Start Free"), hero image/illustration
- Features strip: 3–4 icons with brief descriptions (QR onboarding, Points engine, Rewards, Analytics)
- How it works preview: simplified 3-step visual (Scan → Earn → Redeem)
- Social proof / trust section (placeholder for testimonials)
- Footer: links to all pages, copyright

**Buttons:** "Get Started" → `/auth/business` ; "Learn More" → `/how-it-works`

**Mobile Behaviour:** Single column; hero image collapses below text; CTA full-width

**Desktop Behaviour:** Two-column hero layout; feature grid 4-across

---

### Screen: PW-002 — How It Works

**Purpose:** Explain the loyalty loop to both Customers and Business Owners

**User Role:** Public

**Components:**
- Two-tab layout: "For Customers" / "For Businesses"
- Customer flow: step-by-step visual (Scan QR → Join → Earn → Redeem)
- Business flow: step-by-step visual (Onboard → Place QR → Monitor → Grow)
- Visual icons for each step

---

### Screen: PW-003 — For Cafés & Restaurants

**Purpose:** Business-focused benefits page to convert interested owners

**Components:**
- Value propositions: Zero hardware, instant setup, real analytics
- Feature list with icons
- Sample dashboard screenshot
- CTA: "Start your loyalty programme today"

---

### Screen: PW-004 — Contact / Get Started

**Purpose:** Lead capture for interested Businesses

**Components:**
- Form: Name, Business name, Email, Phone (optional), Message
- CTA button: "Send Message"
- Direct link to Business registration

**Validation:**
- Name: required
- Business name: required
- Email: required, valid format
- Message: required

**Success State:** "Thanks! We'll be in touch within 24 hours."
**Error State:** Inline field validation errors; generic submission error if server fails

---

## PART 2: CUSTOMER APP

---

### Screen: CA-001 — Join Page (QR Landing)

**Purpose:** First screen a Customer sees after scanning the Business QR code

**User Role:** Unauthenticated or authenticated Customer

**Entry Point:** `/join/{business-slug}` (via QR code scan)

**Components:**
- Business logo (top, centred)
- Business name (heading)
- "Join {Business Name}'s loyalty programme" — subheading
- Brief description of the loyalty programme (welcome points teaser)
- Phone number input (primary) with OTP flow trigger
- "Or use email instead" toggle
- "Already a member? Sign in" text link

**Forms:**
- Phone field: `tel` input, international format, placeholder "+91 XXXXXXXXXX"
- "Send OTP" button

**Loading State:** Spinner on OTP send button; "Sending…" label

**Success State:** OTP input appears; "Enter the 6-digit code sent to {phone}"

**Error States:**
- Invalid phone → "Please enter a valid phone number"
- OTP send failure → "Failed to send OTP. Try again."
- OTP incorrect → "Incorrect code. Please try again."
- OTP expired → "Code expired. Request a new one."
- Business not found → Full-screen "This business could not be found."

**Mobile Behaviour:** Full-screen card layout; single column; Business branding colour applied to header band

**Desktop Behaviour:** Centred card (max 480px); same layout

---

### Screen: CA-002 — OTP Verification

**Purpose:** Verify Customer's OTP after requesting one

**Components:**
- "Enter your 6-digit code" heading
- 6-digit OTP input (auto-focus; number keyboard on mobile)
- "Verify" button
- "Resend code" link (visible after 30 seconds)
- "Back" link to return to phone input

**Buttons:** "Verify" (primary); "Resend code" (text link)

**Loading State:** "Verifying…" on button

**Error State:** Inline: "Incorrect code. Please check and try again."

**Mobile Behaviour:** Keyboard-optimised; OTP input spans most of screen width

---

### Screen: CA-003 — Welcome / Already Member

**Purpose:** Show outcome after successful authentication on the join page

**Components (First Join):**
- ✅ Success animation or icon
- "Welcome to {Business Name}! 🎉"
- "+{welcome_points} Welcome Points added to your wallet"
- "View your loyalty card" CTA → `/app/wallet`

**Components (Already Member):**
- "You're already a member! 👋"
- Current Points balance for this Business
- "View your rewards" CTA → `/app/rewards`

**Mobile Behaviour:** Full-screen; CTA full-width at bottom

---

### Screen: CA-004 — Wallet View

**Purpose:** Customer's home screen showing all Business memberships as loyalty cards

**User Role:** Authenticated Customer

**Entry Point:** `/app/wallet` (default after login)

**Navigation:** Bottom tab bar (Wallet, Businesses, Rewards, Activity, Profile)

**Components:**
- Page heading: "My Loyalty Cards"
- Card stack: 3D-stacked loyalty cards, one per Business membership
- Each card shows:
  - Business logo
  - Business name
  - Points balance (large number)
  - Tier badge (Bronze / Silver / Gold / Platinum)
  - Reward progress ring (% toward next reward)
- Tap card → expand details or navigate to that Business's rewards
- "Join another Business" card at bottom of stack (links to QR scanning instruction)

**Empty State:** "You haven't joined any loyalty programmes yet. Scan a café QR to get started!"

**Loading State:** Skeleton cards (animated placeholder)

**Error State:** "Couldn't load your cards. Pull down to refresh."

**Mobile Behaviour:** Vertical card stack; tap to expand; swipe to cycle through cards

---

### Screen: CA-005 — Businesses View

**Purpose:** Overview of all Businesses the Customer has joined

**User Role:** Authenticated Customer

**Entry Point:** `/app/businesses`

**Components:**
- List of Business cards, each showing:
  - Business logo
  - Business name
  - City
  - Current Points balance at that Business
  - Tier badge
  - "View Rewards" button

**Empty State:** "You haven't joined any loyalty programmes yet."

**Mobile Behaviour:** Vertical card list; single column

---

### Screen: CA-006 — Rewards View

**Purpose:** Show all available Rewards across all memberships

**User Role:** Authenticated Customer

**Entry Point:** `/app/rewards`

**Components:**
- Filter by Business (dropdown or horizontal tab strip) — shows "All" by default
- For each Business section:
  - Business name / logo header
  - Reward cards:
    - Reward image (if available)
    - Reward title and description
    - Points cost
    - Progress bar: Customer's current balance / points_cost
    - "Redeem" button (enabled if balance ≥ points_cost)
    - "Locked" indicator with points needed if balance is insufficient

**Empty State:** "No rewards available yet. Keep earning points!"

**Redeem Flow (inline modal or bottom sheet):**
- "Confirm Redemption" modal
  - Reward title
  - Points to be deducted
  - "Confirm & Redeem" button
  - "Cancel" button

**After Successful Redemption:**
- Redemption Ticket screen appears (see CA-007)

---

### Screen: CA-007 — Redemption Ticket

**Purpose:** Display the Redemption Ticket for the Customer to present at counter

**User Role:** Authenticated Customer

**Entry Point:** After successful Reward redemption

**Components:**
- Ticket card (distinct visual design — premium border, stamp aesthetic)
- Business logo + name
- Reward title (large)
- Customer name
- Redemption code (large, monospaced): `RPT-CAFE-8821`
- QR code representation of the redemption code
- Expiry countdown timer: "Expires in: 23:47:12"
- "✅ Single-use | Anti-fraud protected" badge
- Instructions: "Show this screen to the staff at {Business Name}"
- "Close" or "Back to Rewards" button

**Behaviour:**
- Screen must remain awake (request `WakeLock` API if available)
- Countdown timer updates in real time
- On expiry: ticket shown as expired with clear visual indicator

**Error State:** If ticket creation failed — "Something went wrong. Your points were not deducted. Please try again."

---

### Screen: CA-008 — Activity Log

**Purpose:** Show Customer's complete Points transaction history

**User Role:** Authenticated Customer

**Entry Point:** `/app/activity`

**Components:**
- Page heading: "My Activity"
- Optional: filter by Business
- Timeline list of transactions:
  - Date and time
  - Business logo (small)
  - Transaction type icon (+ for earn, - for redeem)
  - Points delta (coloured: green for earn, red for redeem)
  - Source description e.g. "Purchase: Latte (₹250)" or "Redeemed: Free Drink"

**Empty State:** "No activity yet. Make your first purchase to start earning!"

**Mobile Behaviour:** Scrollable timeline; sticky month grouping headers

---

### Screen: CA-009 — Profile View

**Purpose:** Allow Customer to view and edit their profile

**User Role:** Authenticated Customer

**Entry Point:** `/app/profile`

**Components:**
- Avatar (placeholder or uploaded)
- Full name (editable)
- Phone number (read-only — authentication identity)
- Email address (editable)
- "My Memberships" summary list (count of businesses joined)
- "Sign Out" button

**Forms:**
- Name field: editable
- Email field: editable

**Validation:**
- Name: required; max 100 chars
- Email: valid email format

**Success State:** Toast: "Profile updated successfully"
**Error State:** Toast: "Failed to update profile. Please try again."

---

## PART 3: BUSINESS DASHBOARD

---

### Screen: BD-001 — Authentication

**Purpose:** Business Owner or Staff login

**User Role:** Unauthenticated business user

**Entry Point:** `/auth/business`

**Tabs:** "Sign In" / "Create Account"

**Sign In Form:**
- Email input
- Password input
- "Sign In" button
- "Forgot password?" link

**Sign Up Form:**
- Full name input
- Email input
- Password input
- Confirm password input
- "Create Account" button

**Validation:**
- Email: required, valid format
- Password: required, min 8 characters

**Error States:**
- Invalid credentials → "Invalid email or password."
- Email taken → "An account with this email already exists."
- Weak password → "Password must be at least 8 characters."

---

### Screen: BD-002 — Business Onboarding Wizard

**Purpose:** Guide new Business Owner through initial setup

**User Role:** Authenticated Business Owner (no businesses yet)

**Entry Point:** `/onboarding` (redirect after first login)

**Wizard Steps:**

**Step 1 — Business Info:**
- Business name (required)
- Description (optional)
- Address (required)
- City (required)
- Logo URL (optional for MVP; or file upload)
- Slug (auto-generated from name; editable)

**Step 2 — Add Menu Items:**
- Add up to 10 initial menu items
- Each: Name, Price (₹), Points Earned per item
- "Add Item" button; "Remove" per row
- Skip option

**Step 3 — Set Loyalty Rules:**
- Spend Per Point Unit (₹): default 100
- Points Per Spend Unit: default 10
- Welcome Points: default 50
- Live Calculator preview: "If customer spends ₹500, they earn X points"

**Step 4 — Review & Launch:**
- Summary of all settings
- "Launch My Programme" button

**Loading State:** "Setting up your programme…" with progress indicator on final submit

**Success State:** Redirect to `/dashboard/overview` with welcome message

---

### Screen: BD-003 — Dashboard Overview

**Purpose:** KPI summary and activity feed for Business Owner

**User Role:** Business Owner

**Entry Point:** `/dashboard/overview`

**Components:**
- Business name + logo (top bar) + Business Switcher (if multi-business)
- KPI Cards row:
  - Total Members
  - Active Members (2+ visits)
  - Repeat Visit Rate (%)
  - Points Issued
  - Points Redeemed
- Recent Members feed (latest 5 new joins)
- Weekly Visit Activity chart (bar chart, 7 days)

**Empty State (no customers):**
- "No customers yet. Your QR code is ready — place it in your café to start!"
- Prominent QR code download CTA

---

### Screen: BD-004 — Customers View

**Purpose:** View and manage the enrolled Customer base

**User Role:** Business Owner

**Entry Point:** `/dashboard/customers`

**Components:**
- Search bar: search by name or phone
- Customer table:
  - Customer avatar (placeholder)
  - Full name
  - Phone number
  - Points balance (with tier badge)
  - Total visits
  - Lifetime spend (₹)
  - Last visit date
  - Join date
- Click row → Customer detail panel or modal (optional for MVP)

**Empty State:** "No customers yet."

**Permissions:**
- Business Owner: full view
- Business Staff: no access to this view

---

### Screen: BD-005 — Menu View

**Purpose:** Manage the Business's product catalogue

**User Role:** Business Owner

**Entry Point:** `/dashboard/menu`

**Components:**
- "Add Item" button (top right)
- Product list grouped by category:
  - Product image (small)
  - Product name
  - Price (₹)
  - Points earned
  - Availability toggle
  - Edit / Delete actions
- Product Form Modal (create / edit):
  - Name, Description, Price, Category, Points Earned, Image URL, Availability toggle

**Validation (modal):**
- Name: required
- Price: required, > 0
- Points Earned: required, ≥ 0

---

### Screen: BD-006 — Points Rules View

**Purpose:** Configure the Loyalty Rules for Points earning

**User Role:** Business Owner

**Entry Point:** `/dashboard/points`

**Components:**
- Current rules display (editable)
- Fields:
  - Spend Per Point (₹): e.g. 100
  - Points Per Spend Unit: e.g. 10
  - Welcome Bonus Points: e.g. 50
  - Visit Bonus Points: e.g. 10
  - Minimum Redemption Points: e.g. 100
- Live Rule Calculator:
  - Input: "Customer spends ₹___"
  - Output: "They earn ___ points"
- "Save Changes" button
- Toast on save success/failure

**Validation:**
- All fields required; must be numeric; Spend Per Point > 0; Points Per Spend Unit > 0

---

### Screen: BD-007 — Rewards View

**Purpose:** Manage the Rewards catalogue for the Business

**User Role:** Business Owner

**Entry Point:** `/dashboard/rewards`

**Components:**
- "Add Reward" button
- Reward list:
  - Reward image (optional)
  - Title and description
  - Points cost
  - Reward type badge
  - Active/Inactive toggle
  - Edit / Delete actions
- Reward Form Modal:
  - Title, Description, Points Cost, Reward Type (dropdown), Image URL, Active toggle

**Empty State:** "No rewards configured yet. Add your first reward!"

---

### Screen: BD-008 — Transactions View

**Purpose:** View the full Points transaction ledger for the Business

**User Role:** Business Owner

**Entry Point:** `/dashboard/transactions`

**Components:**
- Search / filter by Customer name, date range, type
- Transaction list:
  - Date/time
  - Customer name
  - Transaction type badge (earn / redeem / bonus / welcome)
  - Points (+ or -)
  - Source description

**Empty State:** "No transactions yet."

---

### Screen: BD-009 — Staff Counter Terminal

**Purpose:** Allow Business Staff to verify redemption tickets and record purchases

**User Role:** Business Owner, Business Staff

**Entry Point:** `/dashboard/staff-counter`

**Components:**
- Tab 1: "Verify Redemption"
  - Large code input field: "Enter ticket code e.g. RPT-CAFE-8821"
  - "Verify" button
  - Result display:
    - ✅ Success: Customer name, reward title, green confirmation
    - ❌ Failure: Error message (invalid / expired / already used)

- Tab 2: "Award Points" *(mechanism TBD — OQ-001)*
  - Customer lookup (phone or name search)
  - Purchase amount input (₹)
  - Points preview: "This will award X points"
  - "Award Points" button

**Permissions:** Accessible to both `business_owner` and `business_staff` roles

**Loading State:** "Verifying…" spinner during lookup

---

### Screen: BD-010 — Analytics View

**Purpose:** Retention metrics and engagement overview

**User Role:** Business Owner

**Entry Point:** `/dashboard/analytics`

**Components:**
- KPI Cards: Total Customers, Active Rate, Repeat Visit Rate, Points Issued, Points Redeemed, Rewards Redeemed
- Weekly Visit Chart (bar chart)
- Top Products section (product name, sales count, points awarded)
- Top Customers section (by lifetime spend or visits)

---

### Screen: BD-011 — QR Code View

**Purpose:** Display and download the Business's loyalty QR code

**User Role:** Business Owner, Business Staff

**Entry Point:** `/dashboard/qr`

**Components:**
- QR code visual (large, centred)
- Join URL displayed below QR
- "Download QR (PNG)" button
- Scan count: "This QR has been scanned X times"
- Print preview (table standee layout)

---

### Screen: BD-012 — Business Settings

**Purpose:** Update Business profile and branding

**User Role:** Business Owner

**Entry Point:** `/dashboard/settings`

**Components:**
- Business Name (editable)
- Slug (editable; with uniqueness warning)
- Description (editable)
- Address (editable)
- City (editable)
- Logo URL (editable; image preview)
- Primary Colour picker (hex input + colour preview)
- "Save Changes" button
- Toast on save success

---

## PART 4: STAFF WORKFLOW

The Staff workflow is a subset of the Business Dashboard, restricted to:

1. `/dashboard/staff-counter` — the counter terminal (BD-009)
2. `/dashboard/qr` — QR viewing (BD-011)

Business Staff cannot access: Customers, Menu, Points Rules, Rewards, Transactions, Analytics, Settings.

**Key Staff UX Principles:**
- The counter terminal must be simple enough to operate in 10 seconds
- Code entry field must be large, with auto-uppercase
- Success/failure feedback must be unmistakable (green / red)
- The view should work on a mounted tablet at counter height

---

## Empty States Summary

| Screen | Empty State |
|--------|-------------|
| CA-004 Wallet | "Scan a café QR code to join your first loyalty programme!" |
| CA-006 Rewards | "Keep earning points to unlock rewards!" |
| CA-008 Activity | "No activity yet. Visit a café and make your first purchase!" |
| BD-003 Overview | "No customers yet. Place your QR code to get started!" |
| BD-004 Customers | "No customers have joined yet." |
| BD-007 Rewards | "Add your first reward to attract customers!" |
| BD-008 Transactions | "No transactions yet." |
| BD-010 Analytics | "Not enough data yet. Analytics appear once customers start visiting." |

---

*Document version 0.1 — UI/UX specification must be reviewed before design or implementation work begins.*
