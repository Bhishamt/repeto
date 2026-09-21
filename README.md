<div align="center">

  <h1>☕ Repeato</h1>
  <p><strong>Next-Gen Multi-Tenant Customer Loyalty & Retention SaaS for Cafes & F&B Businesses</strong></p>

  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database_%26_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Design System: Espresso Kinetic Glass](#-design-system-espresso-kinetic-glass)
- [Key Features](#-key-features)
  - [1. Multi-Tenant Architecture & Data Isolation](#1-multi-tenant-architecture--data-isolation)
  - [2. Merchant Business Dashboard](#2-merchant-business-dashboard)
  - [3. Customer Mobile Web App](#3-customer-mobile-web-app)
  - [4. Staff Counter Station & Fraud Prevention](#4-staff-counter-station--fraud-prevention)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Documentation & Specifications](#-documentation--specifications)
- [Database & Row Level Security (RLS) Schema](#-database--row-level-security-rls-schema)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Development Scripts](#-development-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## 💡 Overview

**Repeato** is a multi-tenant customer loyalty and retention SaaS designed specifically for modern cafes, coffee shops, and F&B establishments. It empowers merchants to digitize punch cards, manage point systems, customize reward tiers, generate dynamic tabletop QR standees, and gain deep customer analytics—all through an intuitive, high-performance web platform.

Customers enjoy a friction-free mobile web app experience where they can join loyalty programs in a single tap via QR codes, manage multiple cafe passes in an interactive 3D digital wallet, track reward progress in real-time, and redeem one-time single-use digital tickets at checkout.

---

## 🎨 Design System: Espresso Kinetic Glass

Repeato features a signature UI language called **Espresso Kinetic Glass**, combining warm cafe aesthetic tones with modern glassmorphism and tactile fluid animations.

* **Curated Color Palette**:
  * `Paper Base` (`#FDFBF7` / `#F7F3EC` / `#EFE7DC`): Warm, organic background canvas reminiscent of specialty parchment paper.
  * `Brand Ink` (`#1A1615` / `#57504B`): Crisp high-contrast typography for effortless legibility.
  * `Espresso Roast` (`#3D281D` / `#5C3E2E`): Deep rich roast accents used for primary CTA buttons and brand headers.
  * `Golden Amber` (`#D97706` / `#F59E0B`): Radiant loyalty highlights, progress rings, and star indicators.
  * `Aubergine Accent` (`#3B1F2B` / `#573142`): Elegant secondary tint for premium membership tiers.
* **Typography**:
  * **Headings**: `Space Grotesk` — expressive, modern geometric structure.
  * **Body & UI Elements**: `Manrope` — clean, highly readable visual hierarchy.
* **Localization**: Full native support for Indian Rupee (`₹` INR) formatted across menus, transaction ledgers, bill calculators, and reward rules.

---

## ✨ Key Features

### 1. Multi-Tenant Architecture & Data Isolation
* Complete multi-tenant scoping where each cafe operates as an isolated entity (`business_id`).
* Cross-tenant data isolation ensures points, customer directories, products, and rewards for one cafe (e.g. *Bluebird Coffee Co.*) are strictly separated from others (e.g. *Urban Brew Cafe*).

### 2. Merchant Business Dashboard (`/dashboard/...`)
* **Analytics & Overview**: Real-time KPI summary cards (Total Members, Active Customers, Repeat Visit Rate, Points Issued vs. Redeemed), recent member feeds, and footfall activity charts.
* **Customer Directory**: Complete searchable customer database displaying tier badges, total points balance, lifetime spend (₹), visit counts, and direct manual point adjustment modals.
* **Menu & Product Catalog**: Item management with live availability toggles, price settings (₹), and points earned per item.
* **Dynamic Tabletop QR Generator**: Built-in QR engine generating join links (`/join/{slug}`), with downloadable PNG assets and printable table-tent standee preview layouts.
* **Loyalty Rules Engine**: Customizable formula rules (spend unit, points per spend unit, welcome bonus, visit bonus, min redemption threshold) paired with an interactive **Live Rule Calculator**.
* **Rewards Management**: Flexible catalog to create, edit, toggle, or retire loyalty rewards with custom point costs.
* **Append-Only Points Ledger**: Audit log tracking all point earn, redemption, bonus, and welcome events.

### 3. Customer Mobile Web App (`/app/...`)
* **3D Multi-Business Wallet**: Interactive card stack showing all joined cafe memberships with active cafe switching and radial reward progress rings.
* **Cafes Directory**: Overview of member cafes, current point balances, and active promotions.
* **Rewards Catalog**: Visual progress bars showing locked vs. unlockable rewards.
* **1-Time Redemption Ticket Engine**: Modal ticket pass generating unique single-use redemptions (e.g., `RPT-BLUE-8821`), dynamic SVG QR codes, 24-hour countdown timers, and anti-fraud verification badges.
* **Universal Activity Ledger**: Comprehensive transaction timeline across all merchant memberships.

### 4. Staff Counter Station & Fraud Prevention
* Specialized terminal layout for counter staff to instantly verify 1-time ticket codes or credit points for in-store purchases.
* Time-bound single-use tickets prevent screenshot sharing or duplicate redemptions.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology / Library |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript 6 |
| **Build Tooling** | Vite 8 + ESBuild |
| **Styling & Design System** | Tailwind CSS v4 + Framer Motion |
| **Icons & Media** | Lucide React + QR Code React |
| **Routing** | React Router v7 |
| **Database & Auth** | Supabase (PostgreSQL + Row Level Security) |
| **Code Quality** | Oxlint + TypeScript Strict Mode |

---

## 📁 Project Directory Structure

```
repeto/
├── docs/                       # Comprehensive architecture & design docs
│   ├── architecture/           # System design & multi-tenant specs
│   ├── decisions/              # Architectural Decision Records (ADRs)
│   ├── design/                 # Espresso Kinetic Glass design guidelines
│   ├── product/                # Feature specs & roadmap
│   ├── requirements/           # Functional & non-functional requirements
│   ├── security/               # RLS policies & anti-fraud threat model
│   └── testing/                # Test suites & quality assurance plans
├── public/                     # Static assets and public resources
├── src/
│   ├── components/             # Reusable UI components & Espresso design system
│   │   ├── app/                # Customer mobile app specific components
│   │   ├── common/             # Modals, buttons, cards, badges
│   │   └── dashboard/          # Merchant dashboard widgets & charts
│   ├── data/                   # Mock data & fallback schemas
│   ├── lib/                    # Supabase client & utility helpers
│   ├── pages/                  # Page routes
│   │   ├── app/                # Customer mobile views (/app/*)
│   │   ├── auth/               # Merchant authentication & onboarding
│   │   └── dashboard/          # Merchant admin dashboard views (/dashboard/*)
│   ├── services/               # Dual-mode API services & data fetching
│   ├── types/                  # TypeScript interfaces & domain models
│   ├── App.tsx                 # Application router & route layout setup
│   ├── index.css               # Global styles & Tailwind configuration
│   └── main.tsx                # Application entry point
├── supabase/
│   └── migrations/             # SQL schema migrations & RLS policies
│       ├── 001_initial_schema.sql
│       └── 002_security_and_realtime.sql
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

---

## 📚 Documentation & Specifications

The project includes an in-depth documentation suite located in the [`docs/`](docs/) directory:

- 🏗️ **[Architecture](docs/architecture/)**: Multi-tenant database design, state management, and scalability strategies.
- 📋 **[Requirements](docs/requirements/)**: Functional specifications, user stories, and acceptance criteria.
- 🎨 **[Design System](docs/design/)**: Espresso Kinetic Glass design tokens, component standards, and motion principles.
- 🔒 **[Security](docs/security/)**: Row Level Security (RLS) definitions, authentication flows, and single-use QR ticket anti-fraud mechanisms.
- 🧪 **[Testing](docs/testing/)**: Quality assurance test plans, manual test cases, and verification strategies.
- 🎯 **[Product & ADRs](docs/product/)**: Product roadmap, domain models, and key architectural decision records ([`docs/decisions/`](docs/decisions/)).

---

## 🗄️ Database & Row Level Security (RLS) Schema

The database migration scripts are managed via Supabase SQL migrations:
- 📜 **Initial Schema**: [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) — Core multi-tenant tables, triggers, and indexes.
- 🛡️ **Security & Realtime Policies**: [`supabase/migrations/002_security_and_realtime.sql`](supabase/migrations/002_security_and_realtime.sql) — Enhanced tenant isolation RLS, owner permissions, staff access controls, and realtime subscriptions.

### Core Entities

1. `businesses`: Merchant identity, custom slug, branding colors, and logo.
2. `business_members`: Maps owners/staff to specific business tenants (`owner`, `staff`, `manager`).
3. `customers`: End-user customer profiles (name, phone, email).
4. `business_customers`: Multi-tenant customer relationship tracking points, visits, tier status, and total spend.
5. `products`: Merchant product catalog items with point earning potential.
6. `loyalty_rules`: Dynamic loyalty computation rules per merchant.
7. `points_transactions`: Immutable point transaction ledger (`earn`, `redeem`, `bonus`, `welcome`).
8. `rewards`: Merchant reward offerings and point costs.
9. `reward_redemptions`: One-time single-use redemption tickets with expiration timestamps.
10. `qr_codes`: Analytics-tracked tabletop QR codes.
11. `purchases`: Ledger tracking in-store purchase bills and point additions.

### Row Level Security (RLS) Guarantees

* **Merchant Isolation**: RLS policies enforce that business owners and staff can only view and edit records matching their assigned `business_id` (`business_members` verification).
* **Authenticated Business Creation**: Authenticated users can create business tenants and automatically claim ownership.
* **Customer Privacy**: End users can only read their own customer profile, point totals, and active redemption tickets.
* **Audit Trail Security**: Immutable transaction ledgers prevent retro-active point tampering or deletion.

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Bhishamt/repeto.git
   cd repeto
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Development Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite development server with hot module replacement |
| `npm run build` | Compiles TypeScript and builds production distribution in `dist/` |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs Oxlint linter check across codebase |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ for specialty cafes & F&B businesses.</sub>
</div>
