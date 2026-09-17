-- ==============================================================================
-- REPEATO MULTI-TENANT SAAS LOYALTY PLATFORM SCHEMA & RLS POLICIES
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BUSINESSES TABLE
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    description TEXT,
    address TEXT,
    city VARCHAR(100) DEFAULT 'Mumbai',
    primary_color VARCHAR(20) DEFAULT '#3D281D',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BUSINESS MEMBERS TABLE (Role Mapping for Business Owners & Staff)
CREATE TABLE IF NOT EXISTS public.business_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- References auth.users(id)
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, user_id)
);

-- 3. CUSTOMERS TABLE (Customer Profile linked to Auth)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BUSINESS CUSTOMERS TABLE (Multi-Tenant Customer Loyalty Relationship)
CREATE TABLE IF NOT EXISTS public.business_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    total_points INT DEFAULT 0 CHECK (total_points >= 0),
    total_visits INT DEFAULT 0,
    lifetime_spend DECIMAL(10, 2) DEFAULT 0.00,
    tier VARCHAR(50) DEFAULT 'Bronze',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id, customer_id)
);

-- 5. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PRODUCTS TABLE (Menu Management per Business)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    points_earned INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. LOYALTY RULES TABLE
CREATE TABLE IF NOT EXISTS public.loyalty_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID UNIQUE NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    spend_per_point DECIMAL(10, 2) DEFAULT 100.00, -- e.g. ₹100 spend
    points_per_spend_unit INT DEFAULT 10,           -- e.g. 10 points
    welcome_points INT DEFAULT 50,                  -- Instant joining bonus
    visit_bonus_points INT DEFAULT 10,              -- Per visit bonus
    min_redemption_points INT DEFAULT 100,          -- Minimum points required to redeem
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. POINTS TRANSACTIONS LEDGER TABLE (Append-Only Ledger)
CREATE TABLE IF NOT EXISTS public.points_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    points INT NOT NULL, -- Positive for earn, negative for redemption
    type VARCHAR(50) NOT NULL CHECK (type IN ('earn', 'redeem', 'bonus', 'welcome')),
    source VARCHAR(100) DEFAULT 'Purchase',
    reference_id VARCHAR(255),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. REWARDS TABLE
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points_cost INT NOT NULL CHECK (points_cost > 0),
    reward_type VARCHAR(50) DEFAULT 'free_item', -- 'free_item', 'discount', 'voucher'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. REWARD REDEMPTIONS TABLE (One-Time Code Execution)
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
    code VARCHAR(20) UNIQUE NOT NULL, -- e.g., 'RPT-BLUE-9482'
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'redeemed', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    redeemed_at TIMESTAMP WITH TIME ZONE,
    redeemed_by_staff_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. VISITS / PURCHASES AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    points_awarded INT NOT NULL,
    receipt_number VARCHAR(100),
    verified_by_staff_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. QR CODES TABLE
CREATE TABLE IF NOT EXISTS public.qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID UNIQUE NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL,
    qr_target_url TEXT NOT NULL,
    scans_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_business_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_business_members_user ON public.business_members(user_id);
CREATE INDEX IF NOT EXISTS idx_business_customers_lookup ON public.business_customers(business_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_products_business ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_transactions_customer ON public.points_transactions(customer_id, business_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_code ON public.reward_redemptions(code);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ FOR BUSINESS PROFILES & QR TARGETS
CREATE POLICY "Public businesses access" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Public products view" ON public.products FOR SELECT USING (is_available = true);
CREATE POLICY "Public rewards view" ON public.rewards FOR SELECT USING (is_active = true);
CREATE POLICY "Public loyalty rules view" ON public.loyalty_rules FOR SELECT USING (true);

-- BUSINESS OWNERS & STAFF POLICIES
CREATE POLICY "Business owners edit business" ON public.businesses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_members.business_id = businesses.id
            AND business_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Business staff view products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_members.business_id = products.business_id
            AND business_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Business staff view & manage rewards" ON public.rewards
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_members.business_id = rewards.business_id
            AND business_members.user_id = auth.uid()
        )
    );

CREATE POLICY "Business staff view transactions" ON public.points_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_members.business_id = points_transactions.business_id
            AND business_members.user_id = auth.uid()
        )
    );

-- CUSTOMER SPECIFIC POLICIES
CREATE POLICY "Customer self view & edit" ON public.customers
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Customer view own business memberships" ON public.business_customers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customers
            WHERE customers.id = business_customers.customer_id
            AND customers.user_id = auth.uid()
        )
    );

CREATE POLICY "Customer view own transactions" ON public.points_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.customers
            WHERE customers.id = points_transactions.customer_id
            AND customers.user_id = auth.uid()
        )
    );

CREATE POLICY "Customer view own redemptions" ON public.reward_redemptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.customers
            WHERE customers.id = reward_redemptions.customer_id
            AND customers.user_id = auth.uid()
        )
    );
