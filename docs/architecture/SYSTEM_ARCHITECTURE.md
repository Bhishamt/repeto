# System Architecture Document
**Product:** Repeato  
**Version:** 0.1 (Documentation Phase)  
**Date:** 2026-09-19  
**Status:** DRAFT — Awaiting review

---

## 1. High-Level Architecture

Repeato is a **client-rendered SPA** with a **Supabase BaaS backend**.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              React SPA (Vite + TypeScript)                  │  │
│  │                                                             │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │  │
│  │  │  Business     │  │  Customer    │  │  Public        │  │  │
│  │  │  Dashboard    │  │  App         │  │  Join Page     │  │  │
│  │  │  /dashboard/* │  │  /app/*      │  │  /join/:slug   │  │  │
│  │  └──────────────┘  └──────────────┘  └────────────────┘  │  │
│  │                                                             │  │
│  │  ┌────────────────────────────────────────────────────┐   │  │
│  │  │             Service Layer (api.ts)                   │   │  │
│  │  │         AuthContext (AuthContext.tsx)                 │   │  │
│  │  │         Adapter (adapter.ts)                         │   │  │
│  │  └────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼────────────────────────────────────┐
│                          Supabase                                 │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │  Auth        │  │  Database    │  │  Storage               │  │
│  │  (email pwd) │  │  (PostgreSQL │  │  (cafe-assets bucket)  │  │
│  │  (phone OTP) │  │   + RLS)     │  │                        │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               Realtime (reward_redemptions)               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                     Vercel (Deployment)                           │
│              main branch → production                             │
│              PRs → preview deployments                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Architecture

### Directory Structure

```
src/
├── App.tsx                    # Root router
├── main.tsx                   # App entry point
├── index.css                  # Global styles + design tokens
├── App.css                    # App-level styles
│
├── types/
│   └── index.ts               # All TypeScript domain interfaces
│
├── context/
│   └── AuthContext.tsx        # Global auth state + session management
│
├── services/
│   ├── supabase.ts            # Supabase client singleton
│   ├── api.ts                 # All data access functions
│   └── adapter.ts             # DB row ↔ TypeScript model adapters
│
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx # Role-based route guard
│   ├── ui/                    # Shared UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   └── domain/                # Domain-specific components
│       ├── BusinessSwitcher.tsx
│       ├── KpiCard.tsx
│       ├── QrCodeCard.tsx
│       ├── RewardFormModal.tsx
│       ├── RedemptionTicketModal.tsx
│       ├── StaffVerificationModal.tsx
│       └── WalletCard.tsx
│
├── data/
│   └── mockData.ts            # Development fallback data
│
└── pages/
    ├── LandingPage.tsx        # Public home page
    ├── JoinBusinessPage.tsx   # QR onboarding flow
    ├── BusinessOnboardingPage.tsx
    │
    ├── auth/
    │   └── AuthPage.tsx       # Business + Customer auth
    │
    ├── dashboard/             # Business Dashboard
    │   ├── DashboardLayout.tsx
    │   ├── OverviewView.tsx
    │   ├── CustomersView.tsx
    │   ├── MenuView.tsx
    │   ├── QrCodeView.tsx
    │   ├── PointsRulesView.tsx
    │   ├── RewardsView.tsx
    │   ├── TransactionsView.tsx
    │   ├── StaffVerificationView.tsx
    │   ├── AnalyticsView.tsx
    │   └── SettingsView.tsx
    │
    └── app/                   # Customer App
        ├── CustomerLayout.tsx
        ├── WalletView.tsx
        ├── BusinessesView.tsx
        ├── RewardsView.tsx
        ├── ActivityView.tsx
        └── ProfileView.tsx
```

### State Management

Repeato does not use a global state management library (Redux, Zustand). State is managed via:

1. **React Context** — `AuthContext` holds global authentication state, the current user, active Business, and Business list
2. **Local component state** — Page-level data (customers, transactions, rewards) is fetched via `useEffect` into local state
3. **Reactive Store (dev mode)** — `ReactiveStore` class in `api.ts` provides a simple pub/sub store for mock data when Supabase is not configured

> **OPEN DECISION — OQ-022:** As the application grows, consider whether a more formal state management solution (e.g. React Query for server state caching) is needed.

---

## 3. Supabase Architecture

Supabase provides four services used by Repeato:

| Service | Usage |
|---------|-------|
| **Auth** | Business Owner (email/password), Customer (phone/email OTP) |
| **Database** | PostgreSQL with RLS — all application data |
| **Storage** | `cafe-assets` bucket for logos and images |
| **Realtime** | Published table for live counter updates |

### Client Singleton Pattern

```typescript
// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
```

---

## 4. Authentication Architecture

### Business Owner Auth

```
Business Owner
     │
     ├─► /auth/business
     │         │
     │    [email + password]
     │         │
     │    supabase.auth.signInWithPassword()
     │         │
     │    onAuthStateChange() fires
     │         │
     │    handleSupabaseUserSession()
     │         │
     │    getMerchantBusinesses(userId)
     │         │
     │    If businesses → role = 'business_owner' → /dashboard
     │    If no businesses → role pending → /onboarding
```

### Customer Auth

```
Customer
     │
     ├─► /join/{slug} or /auth/customer
     │         │
     │    [phone number or email]
     │         │
     │    supabase.auth.signInWithOtp()
     │         │
     │    [OTP entered]
     │         │
     │    supabase.auth.verifyOtp()
     │         │
     │    onAuthStateChange() fires
     │         │
     │    handleSupabaseUserSession()
     │         │
     │    getMerchantBusinesses() → empty → role = 'customer'
     │         │
     │    getOrCreateCustomerRecord()
     │         │
     │    /app/wallet
```

### Role Determination

Role is determined by checking `business_members` table:
- User has rows in `business_members` → `business_owner` (or `business_staff` based on `role` column)
- User has no rows in `business_members` → `customer`

> **NOTE:** This role determination is done on the client side after session load. The database `business_members.role` column stores `owner` or `staff`, which maps to `business_owner` or `business_staff` in the frontend.

---

## 5. Authorization Architecture

### Route Guards

```tsx
// ProtectedRoute wraps dashboard routes
<ProtectedRoute allowedRoles={['business_owner', 'business_staff']}>
  <DashboardLayout />
</ProtectedRoute>

// Customer routes
<ProtectedRoute allowedRoles={['customer']}>
  <CustomerLayout />
</ProtectedRoute>
```

### RLS Layer (Database)

All authorization is additionally enforced at the database level. See SECURITY_RBAC_RLS.md for the complete RLS policy specification.

---

## 6. Multi-Tenant Architecture

Each Business is a **tenant**. Tenant isolation is enforced at three layers:

```
Layer 1: Application Layer
  → activeBusiness.id is set in AuthContext
  → All API calls use activeBusiness.id as the business_id filter

Layer 2: Service Layer
  → api.ts always includes .eq('business_id', businessId) on queries
  → Business ID comes from AuthContext, not from URL params or user input

Layer 3: Database Layer (RLS)
  → RLS policies verify business membership via auth.uid() lookup in business_members
  → Even if layers 1 and 2 are bypassed, the database rejects cross-tenant queries
```

### Business Isolation Flow

```
Business Owner (uid: abc) authenticated
         │
         ▼
AuthContext loads business_members for uid: abc
         │
         ▼
activeBusiness = Business A (id: biz_A)
         │
         ▼
Query: SELECT * FROM business_customers WHERE business_id = 'biz_A'
         │
         ▼
RLS checks: EXISTS (SELECT 1 FROM business_members 
              WHERE business_id = 'biz_A' AND user_id = auth.uid())
         │
         ▼
If uid: abc has no membership in biz_B → query returns empty even if business_id = 'biz_B' is injected
```

---

## 7. Database Interaction Architecture

```
Component
    │
    ├─► useEffect() → apiService.getBusinessCustomers(businessId)
    │
    ▼
api.ts (service layer)
    │
    ├─► if (isSupabaseConfigured && supabase) →
    │       supabase.from('business_customers')
    │              .select('*, customers(*)')
    │              .eq('business_id', businessId)
    │
    ├─► adapter.toBusinessCustomer(row) → TypeScript model
    │
    └─► return BusinessCustomer[]
    │
Component
    │
    └─► setState(customers)
```

### Adapter Pattern

```typescript
// src/services/adapter.ts
export const adapter = {
  toBusiness: (row: any): Business => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    logoUrl: row.logo_url,
    description: row.description,
    address: row.address,
    city: row.city,
    primaryColor: row.primary_color,
    createdAt: row.created_at,
  }),
  // ...
};
```

---

## 8. Customer Flow Architecture

```
Physical QR → /join/{slug}
                    │
              JoinBusinessPage
                    │
              ┌─────▼──────────────┐
              │ getBusinessBySlug  │ → businesses table (public read)
              └─────────────────────┘
                    │
              Business found? → display branding
                    │
              User authenticated?
                    │
              ┌─────┴────────────┐
              │ NO               │ YES
              ▼                  ▼
         AuthPage           Check membership
         (OTP flow)               │
              │            Already member?
              │                   │
              └──────────────┐ YES│ NO
                             ▼    ▼
                      Show balance │ Create business_customers
                                   │ Award welcome_points
                                   │ Create points_transactions (type: welcome)
                                   │
                                   ▼
                            /app/wallet
```

---

## 9. Business Flow Architecture

```
/auth/business → LoginPage
                    │
            supabase.auth.signInWithPassword
                    │
            onAuthStateChange
                    │
            getMerchantBusinesses(userId)
                    │
           ┌────────┴──────────────┐
           │ Has businesses?       │ No businesses?
           ▼                       ▼
    /dashboard/overview       /onboarding
           │                       │
    DashboardLayout           BusinessOnboardingPage
           │                       │
    OverviewView              registerNewBusiness()
    CustomersView             Creates:
    MenuView                  - businesses record
    PointsRulesView           - business_members record
    RewardsView               - loyalty_rules record
    TransactionsView          - products records
    StaffVerificationView     - rewards records
    AnalyticsView             - qr_codes record
    SettingsView                    │
                                    ▼
                              /dashboard/overview
```

---

## 10. Purchase Verification Architecture

> **⚠️ OPEN PRODUCT DECISION — OQ-001**

Purchase verification architecture cannot be finalised until the mechanism is decided.

**Placeholder architecture (staff manual entry — not confirmed as the chosen approach):**

```
Staff → StaffVerificationView (/dashboard/staff-counter)
              │
       [Select Customer by phone / name lookup]
              │
       [Enter purchase amount]
              │
       apiService.earnPointsForPurchase(businessId, customerId, amount, ...)
              │
       ┌──────┴─────────────────────────────────────────────┐
       │ 1. INSERT into purchases                            │
       │ 2. UPDATE business_customers.total_points           │
       │ 3. INSERT into points_transactions (type: 'earn')   │
       └─────────────────────────────────────────────────────┘
              │
       Customer's Points balance updated
```

This architecture will be redesigned once OQ-001 is resolved.

---

## 11. Points Calculation Architecture

```
Purchase event received (amount: ₹250)
              │
Fetch Loyalty Rules for businessId
    spend_per_point = 100
    points_per_spend_unit = 10
    visit_bonus_points = 10
              │
Calculate:
    base_points = floor(250 / 100) × 10 = 20
    bonus = 10
    total_points = 30
              │
Record:
    points_transactions: type=earn, points=30
    business_customers: total_points += 30
```

> **OPEN DECISION — OQ-014:** Whether to snapshot the Loyalty Rule at transaction time is not finalised. Currently, only the computed points value is stored, not the rule snapshot.

---

## 12. Reward Architecture

```
Customer requests Reward redemption
              │
Check: business_customers.total_points >= reward.points_cost
              │
If YES:
    ┌─────────────────────────────────────────────────────────┐
    │ ATOMIC OPERATION (must be all or nothing):               │
    │                                                          │
    │ 1. UPDATE business_customers                             │
    │       SET total_points = total_points - points_cost      │
    │       WHERE id = membership.id                           │
    │                                                          │
    │ 2. INSERT reward_redemptions                             │
    │       (business_id, customer_id, reward_id,              │
    │        code = RPT-XXXX-9999, status='pending',           │
    │        expires_at = NOW() + interval '24 hours')         │
    │                                                          │
    │ 3. INSERT points_transactions                            │
    │       (type='redeem', points=-cost, source=code)         │
    └─────────────────────────────────────────────────────────┘
              │
Display Redemption Ticket to Customer
```

> **CRITICAL:** These three operations must be atomic. If step 2 fails, step 1 must be rolled back. This requires either a Supabase RPC (Postgres function) or careful client-side orchestration with compensating writes.

> **OPEN DECISION — OQ-023:** Should the atomic redemption be implemented as a Postgres function (RPC) to guarantee atomicity, or handled via client-side compensation logic?

---

## 13. Redemption Verification Architecture

```
Staff → StaffVerificationView
              │
       [Enter code: RPT-CAFE-8821]
              │
       apiService.verifyRedemptionTicket(code, staffUserId)
              │
       supabase.from('reward_redemptions')
              .select('...')
              .eq('code', code.toUpperCase())
              .maybeSingle()
              │
       ┌──────────────────────────────────┐
       │ Validations:                      │
       │ - ticket exists?                  │
       │ - status === 'pending'?            │
       │ - expires_at > NOW()?             │
       │ - business_id === activeBusiness? │
       └──────────────────────────────────┘
              │
       If valid:
           UPDATE reward_redemptions
               SET status = 'redeemed',
                   redeemed_at = NOW(),
                   redeemed_by_staff_id = auth.uid()
              │
       Return success/failure to Staff UI
```

---

## 14. Storage Architecture

```
Business Owner uploads logo
              │
       [File selected in Settings or Onboarding]
              │
       supabase.storage
              .from('cafe-assets')
              .upload('businesses/{businessId}/logo.jpg', file)
              │
       Get public URL:
       supabase.storage
              .from('cafe-assets')
              .getPublicUrl('businesses/{businessId}/logo.jpg')
              │
       Store URL in businesses.logo_url
```

---

## 15. Realtime Architecture

```
reward_redemptions table published to supabase_realtime
              │
Staff Counter terminal subscribes:
supabase
  .channel('redemptions')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'reward_redemptions',
    filter: `business_id=eq.${businessId}`
  }, handler)
  .subscribe()
```

> **OPEN DECISION — OQ-019:** Whether Realtime subscription is used for counter UX or if polling is sufficient.

---

## 16. Security Boundaries

```
┌─────────────────────────────────────────────┐
│              PUBLIC BOUNDARY                  │
│  /                  (LandingPage)            │
│  /join/:slug        (JoinBusinessPage)       │
│  /auth              (AuthPage)               │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│          AUTHENTICATED CUSTOMER              │
│  /app/wallet        (WalletView)            │
│  /app/businesses    (BusinessesView)        │
│  /app/rewards       (RewardsView)           │
│  /app/activity      (ActivityView)          │
│  /app/profile       (ProfileView)           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│     AUTHENTICATED BUSINESS OWNER / STAFF    │
│  /dashboard/*       (DashboardLayout)       │
│  Staff: only /dashboard/staff-counter       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         DATABASE (Supabase RLS)              │
│  enforces all of the above at data level     │
└─────────────────────────────────────────────┘
```

---

## 17. Data Flow Summary

```
User Action (UI)
     │
     ▼
Component (React) → useEffect / event handler
     │
     ▼
AuthContext → provides user, role, activeBusiness
     │
     ▼
api.ts → Supabase query (with RLS enforcement)
     │
     ▼
adapter.ts → converts DB row to TypeScript model
     │
     ▼
Component → setState → re-render
```

---

## 18. Error Flow

```
Supabase query error
     │
     ▼
api.ts catches error
     │
     ▼
throws Error with human-readable message
     │
     ▼
Component catches via try/catch in useEffect
     │
     ├─► setError(message)
     ├─► Toast notification
     └─► Empty state or error state rendered
```

---

*Document version 0.1 — Architecture must be reviewed before implementation begins.*
