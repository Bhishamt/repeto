-- ==============================================================================
-- REPEATO MULTI-TENANT RLS POLICIES & SECURITY UPDATES
-- ==============================================================================

-- 1. BUSINESS MEMBERS RLS POLICIES
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own business_members" ON public.business_members;
CREATE POLICY "Users view own business_members" ON public.business_members
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users insert own business_members" ON public.business_members;
CREATE POLICY "Users insert own business_members" ON public.business_members
    FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Owners manage business_members" ON public.business_members;
CREATE POLICY "Owners manage business_members" ON public.business_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.business_members bm
            WHERE bm.business_id = business_members.business_id
            AND bm.user_id = auth.uid()
            AND bm.role = 'owner'
        )
    );

-- 2. BUSINESSES TABLE POLICIES
DROP POLICY IF EXISTS "Authenticated insert business" ON public.businesses;
CREATE POLICY "Authenticated insert business" ON public.businesses
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. BUSINESS CUSTOMERS TABLE POLICIES (Tenant Isolated for Staff & Owners)
DROP POLICY IF EXISTS "Business staff view business customers" ON public.business_customers;
CREATE POLICY "Business staff view business customers" ON public.business_customers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_members.business_id = business_customers.business_id
            AND business_members.user_id = auth.uid()
        )
    );

-- 4. PURCHASES TABLE POLICIES
DROP POLICY IF EXISTS "Business staff manage purchases" ON public.purchases;
CREATE POLICY "Business staff manage purchases" ON public.purchases
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.business_members
            WHERE business_members.business_id = purchases.business_id
            AND business_members.user_id = auth.uid()
        )
    );
