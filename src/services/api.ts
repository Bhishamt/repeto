import {
  Business,
  Product,
  LoyaltyRule,
  Reward,
  Customer,
  BusinessCustomer,
  Transaction,
  RedemptionTicket,
  BusinessAnalytics
} from '../types';
import {
  INITIAL_BUSINESSES,
  INITIAL_PRODUCTS,
  INITIAL_LOYALTY_RULES,
  INITIAL_REWARDS,
  INITIAL_CUSTOMERS,
  INITIAL_BUSINESS_CUSTOMERS,
  INITIAL_TRANSACTIONS,
  INITIAL_REDEMPTIONS
} from '../data/mockData';
import { supabase, isSupabaseConfigured } from './supabase';

// Local Reactive State for Offline / Dual-Mode Operation
class ReactiveStore {
  businesses: Business[] = [...INITIAL_BUSINESSES];
  products: Product[] = [...INITIAL_PRODUCTS];
  loyaltyRules: Record<string, LoyaltyRule> = { ...INITIAL_LOYALTY_RULES };
  rewards: Reward[] = [...INITIAL_REWARDS];
  customers: Customer[] = [...INITIAL_CUSTOMERS];
  businessCustomers: BusinessCustomer[] = [...INITIAL_BUSINESS_CUSTOMERS];
  transactions: Transaction[] = [...INITIAL_TRANSACTIONS];
  redemptions: RedemptionTicket[] = [...INITIAL_REDEMPTIONS];

  private listeners: (() => void)[] = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((l) => l());
  }
}

export const store = new ReactiveStore();

export const apiService = {
  // --- BUSINESSES ---
  async getBusinesses(): Promise<Business[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('businesses').select('*');
      if (!error && data) return data as Business[];
    }
    return store.businesses;
  },

  async getBusinessBySlug(slug: string): Promise<Business | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('businesses').select('*').eq('slug', slug).single();
      if (!error && data) return data as Business;
    }
    return store.businesses.find((b) => b.slug === slug) || store.businesses[0];
  },

  async registerNewBusiness(
    businessInfo: { name: string; slug: string; description: string; address: string; city: string; logoUrl?: string },
    productsList: { name: string; price: number; pointsEarned: number; categoryName: string }[],
    rules: { spendPerPoint: number; pointsPerSpendUnit: number; welcomePoints: number }
  ): Promise<Business> {
    const newId = `biz_${Date.now()}`;
    const newBusiness: Business = {
      id: newId,
      slug: businessInfo.slug || businessInfo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: businessInfo.name,
      logoUrl: businessInfo.logoUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&q=80',
      description: businessInfo.description || 'Welcome to our loyalty rewards program!',
      address: businessInfo.address || 'Central High Street',
      city: businessInfo.city || 'Mumbai',
      primaryColor: '#3D281D',
      bannerUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('businesses').insert([newBusiness]);
    }

    store.businesses.push(newBusiness);

    // Add initial rules
    store.loyaltyRules[newId] = {
      id: `rule_${newId}`,
      businessId: newId,
      spendPerPoint: rules.spendPerPoint || 100,
      pointsPerSpendUnit: rules.pointsPerSpendUnit || 10,
      welcomePoints: rules.welcomePoints || 50,
      visitBonusPoints: 10,
      minRedemptionPoints: 100,
      updatedAt: new Date().toISOString(),
    };

    // Add initial products
    productsList.forEach((p, idx) => {
      store.products.push({
        id: `prod_${newId}_${idx}`,
        businessId: newId,
        categoryName: p.categoryName || 'General',
        name: p.name,
        description: `Delightful ${p.name} prepared fresh.`,
        price: Number(p.price),
        pointsEarned: Number(p.pointsEarned),
        isAvailable: true,
      });
    });

    // Add default rewards
    store.rewards.push(
      {
        id: `rew_${newId}_1`,
        businessId: newId,
        title: 'Free Welcome Drink',
        description: 'Enjoy a free drink on the house.',
        pointsCost: 100,
        rewardType: 'free_item',
        isActive: true,
      },
      {
        id: `rew_${newId}_2`,
        businessId: newId,
        title: '₹100 Voucher',
        description: 'Flat ₹100 discount on your bill.',
        pointsCost: 200,
        rewardType: 'discount',
        isActive: true,
      }
    );

    store.notify();
    return newBusiness;
  },

  // --- PRODUCTS / MENU ---
  async getProductsByBusiness(businessId: string): Promise<Product[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('business_id', businessId);
      if (!error && data) return data as Product[];
    }
    return store.products.filter((p) => p.businessId === businessId);
  },

  async saveProduct(product: Partial<Product> & { businessId: string }): Promise<Product> {
    let savedProduct: Product;
    if (product.id) {
      const idx = store.products.findIndex((p) => p.id === product.id);
      if (idx !== -1) {
        store.products[idx] = { ...store.products[idx], ...product };
        savedProduct = store.products[idx];
      } else {
        savedProduct = product as Product;
      }
    } else {
      savedProduct = {
        id: `prod_${Date.now()}`,
        businessId: product.businessId,
        name: product.name || 'New Item',
        description: product.description || '',
        price: Number(product.price || 0),
        pointsEarned: Number(product.pointsEarned || 10),
        categoryName: product.categoryName || 'Beverages',
        isAvailable: product.isAvailable !== false,
        imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&q=80',
      };
      store.products.push(savedProduct);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').upsert([savedProduct]);
    }

    store.notify();
    return savedProduct;
  },

  async deleteProduct(productId: string): Promise<void> {
    store.products = store.products.filter((p) => p.id !== productId);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('products').delete().eq('id', productId);
    }
    store.notify();
  },

  // --- LOYALTY RULES ---
  async getLoyaltyRules(businessId: string): Promise<LoyaltyRule> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('loyalty_rules').select('*').eq('business_id', businessId).single();
      if (!error && data) return data as LoyaltyRule;
    }
    return (
      store.loyaltyRules[businessId] || {
        id: `rule_${businessId}`,
        businessId,
        spendPerPoint: 100,
        pointsPerSpendUnit: 10,
        welcomePoints: 50,
        visitBonusPoints: 10,
        minRedemptionPoints: 100,
        updatedAt: new Date().toISOString(),
      }
    );
  },

  async updateLoyaltyRules(businessId: string, newRules: Partial<LoyaltyRule>): Promise<LoyaltyRule> {
    const existing = await this.getLoyaltyRules(businessId);
    const updated: LoyaltyRule = {
      ...existing,
      ...newRules,
      updatedAt: new Date().toISOString(),
    };
    store.loyaltyRules[businessId] = updated;

    if (isSupabaseConfigured && supabase) {
      await supabase.from('loyalty_rules').upsert([updated]);
    }

    store.notify();
    return updated;
  },

  // --- REWARDS ---
  async getRewardsByBusiness(businessId: string): Promise<Reward[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('rewards').select('*').eq('business_id', businessId);
      if (!error && data) return data as Reward[];
    }
    return store.rewards.filter((r) => r.businessId === businessId);
  },

  async saveReward(reward: Partial<Reward> & { businessId: string }): Promise<Reward> {
    let saved: Reward;
    if (reward.id) {
      const idx = store.rewards.findIndex((r) => r.id === reward.id);
      if (idx !== -1) {
        store.rewards[idx] = { ...store.rewards[idx], ...reward };
        saved = store.rewards[idx];
      } else {
        saved = reward as Reward;
      }
    } else {
      saved = {
        id: `rew_${Date.now()}`,
        businessId: reward.businessId,
        title: reward.title || 'New Reward',
        description: reward.description || '',
        pointsCost: Number(reward.pointsCost || 100),
        rewardType: reward.rewardType || 'free_item',
        isActive: reward.isActive !== false,
      };
      store.rewards.push(saved);
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('rewards').upsert([saved]);
    }

    store.notify();
    return saved;
  },

  async deleteReward(rewardId: string): Promise<void> {
    store.rewards = store.rewards.filter((r) => r.id !== rewardId);
    if (isSupabaseConfigured && supabase) {
      await supabase.from('rewards').delete().eq('id', rewardId);
    }
    store.notify();
  },

  // --- CUSTOMERS & MEMBERSHIPS ---
  async getBusinessCustomers(businessId: string): Promise<BusinessCustomer[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('business_customers').select('*').eq('business_id', businessId);
      if (!error && data) return data as BusinessCustomer[];
    }
    return store.businessCustomers.filter((bc) => bc.businessId === businessId);
  },

  async getCustomerWallet(customerId: string): Promise<{ customer: Customer; memberships: BusinessCustomer[]; transactions: Transaction[] }> {
    const customer = store.customers.find((c) => c.id === customerId || c.userId === customerId) || store.customers[0];
    const memberships = store.businessCustomers.filter((bc) => bc.customerId === customer.id);
    const transactions = store.transactions.filter((t) => t.customerId === customer.id);

    return { customer, memberships, transactions };
  },

  async joinBusiness(customerId: string, businessSlug: string): Promise<{ success: boolean; business: Business; pointsAdded: number }> {
    const business = await this.getBusinessBySlug(businessSlug);
    if (!business) throw new Error('Business not found');

    const customer = store.customers.find((c) => c.id === customerId || c.userId === customerId) || store.customers[0];
    const existingMembership = store.businessCustomers.find(
      (bc) => bc.businessId === business.id && bc.customerId === customer.id
    );

    const rules = await this.getLoyaltyRules(business.id);
    const welcomeBonus = rules.welcomePoints || 50;

    if (existingMembership) {
      return { success: true, business, pointsAdded: 0 };
    }

    const newMembership: BusinessCustomer = {
      id: `bc_${business.id}_${customer.id}`,
      businessId: business.id,
      customerId: customer.id,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      totalPoints: welcomeBonus,
      totalVisits: 1,
      lifetimeSpend: 0,
      tier: 'Bronze',
      joinedAt: new Date().toISOString(),
      lastVisitAt: new Date().toISOString(),
    };

    store.businessCustomers.push(newMembership);

    // Record Transaction
    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      businessId: business.id,
      businessName: business.name,
      customerId: customer.id,
      customerName: customer.fullName,
      points: welcomeBonus,
      type: 'welcome',
      source: `Welcome Joining Bonus at ${business.name}`,
      createdAt: new Date().toISOString(),
    };
    store.transactions.unshift(tx);

    store.notify();
    return { success: true, business, pointsAdded: welcomeBonus };
  },

  // --- REWARD REDEMPTION ---
  async createRedemptionTicket(customerId: string, businessId: string, rewardId: string): Promise<RedemptionTicket> {
    const customer = store.customers.find((c) => c.id === customerId || c.userId === customerId) || store.customers[0];
    const business = store.businesses.find((b) => b.id === businessId) || store.businesses[0];
    const reward = store.rewards.find((r) => r.id === rewardId);

    if (!reward) throw new Error('Reward not found');

    const membership = store.businessCustomers.find(
      (bc) => bc.businessId === businessId && bc.customerId === customer.id
    );

    if (!membership || membership.totalPoints < reward.pointsCost) {
      throw new Error('Insufficient points balance for this reward');
    }

    // Deduct points
    membership.totalPoints -= reward.pointsCost;

    // Generate Ticket Code
    const code = `RPT-${business.name.slice(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const ticket: RedemptionTicket = {
      id: `rd_${Date.now()}`,
      businessId,
      businessName: business.name,
      customerId: customer.id,
      customerName: customer.fullName,
      rewardId: reward.id,
      rewardTitle: reward.title,
      pointsCost: reward.pointsCost,
      code,
      status: 'pending',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    store.redemptions.unshift(ticket);

    // Add Ledger Transaction
    store.transactions.unshift({
      id: `tx_${Date.now()}`,
      businessId,
      businessName: business.name,
      customerId: customer.id,
      customerName: customer.fullName,
      points: -reward.pointsCost,
      type: 'redeem',
      source: `Redeemed: ${reward.title} (${code})`,
      createdAt: new Date().toISOString(),
    });

    store.notify();
    return ticket;
  },

  async verifyRedemptionTicket(code: string, staffName: string = 'Staff Duty'): Promise<{ success: boolean; ticket?: RedemptionTicket; message: string }> {
    const ticket = store.redemptions.find((r) => r.code.toUpperCase() === code.trim().toUpperCase());

    if (!ticket) {
      return { success: false, message: 'Invalid redemption code. Code not found.' };
    }

    if (ticket.status === 'redeemed') {
      return {
        success: false,
        ticket,
        message: `Already redeemed on ${new Date(ticket.redeemedAt || '').toLocaleTimeString()} by ${ticket.redeemedByStaffName || 'Staff'}. Cannot reuse code!`,
      };
    }

    if (new Date(ticket.expiresAt).getTime() < Date.now()) {
      ticket.status = 'expired';
      store.notify();
      return { success: false, ticket, message: 'Redemption ticket has expired.' };
    }

    // Mark as redeemed
    ticket.status = 'redeemed';
    ticket.redeemedAt = new Date().toISOString();
    ticket.redeemedByStaffName = staffName;

    store.notify();
    return {
      success: true,
      ticket,
      message: `Successfully verified and redeemed "${ticket.rewardTitle}" for ${ticket.customerName}!`,
    };
  },

  // --- STAFF POINT VERIFICATION / POS PURCHASE ---
  async earnPointsForPurchase(businessId: string, customerId: string, amount: number, productName?: string): Promise<Transaction> {
    const business = store.businesses.find((b) => b.id === businessId) || store.businesses[0];
    const customer = store.customers.find((c) => c.id === customerId) || store.customers[0];
    const rules = await this.getLoyaltyRules(businessId);

    const calculatedPoints = Math.floor((amount / rules.spendPerPoint) * rules.pointsPerSpendUnit);
    const totalPoints = calculatedPoints > 0 ? calculatedPoints : 10;

    let membership = store.businessCustomers.find(
      (bc) => bc.businessId === businessId && bc.customerId === customer.id
    );

    if (!membership) {
      membership = {
        id: `bc_${businessId}_${customer.id}`,
        businessId,
        customerId: customer.id,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        totalPoints: totalPoints,
        totalVisits: 1,
        lifetimeSpend: amount,
        tier: 'Bronze',
        joinedAt: new Date().toISOString(),
        lastVisitAt: new Date().toISOString(),
      };
      store.businessCustomers.push(membership);
    } else {
      membership.totalPoints += totalPoints;
      membership.totalVisits += 1;
      membership.lifetimeSpend += amount;
      membership.lastVisitAt = new Date().toISOString();
    }

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      businessId,
      businessName: business.name,
      customerId: customer.id,
      customerName: customer.fullName,
      points: totalPoints,
      type: 'earn',
      source: productName ? `Purchase: ${productName} (₹${amount})` : `Store Purchase (₹${amount})`,
      createdAt: new Date().toISOString(),
    };

    store.transactions.unshift(tx);
    store.notify();
    return tx;
  },

  // --- TRANSACTIONS ---
  async getTransactionsByBusiness(businessId: string): Promise<Transaction[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('points_transactions').select('*').eq('business_id', businessId);
      if (!error && data) return data as Transaction[];
    }
    return store.transactions.filter((t) => t.businessId === businessId);
  },

  // --- ANALYTICS ---
  async getBusinessAnalytics(businessId: string): Promise<BusinessAnalytics> {
    const customers = store.businessCustomers.filter((bc) => bc.businessId === businessId);
    const transactions = store.transactions.filter((t) => t.businessId === businessId);
    const redemptions = store.redemptions.filter((r) => r.businessId === businessId && r.status === 'redeemed');

    const totalCustomers = customers.length || 124;
    const activeCustomers = customers.filter((c) => c.totalVisits >= 2).length || 86;
    const repeatVisitRate = Math.round((activeCustomers / (totalCustomers || 1)) * 100);

    const pointsIssued = transactions
      .filter((t) => t.points > 0)
      .reduce((sum, t) => sum + t.points, 0);

    const pointsRedeemed = Math.abs(
      transactions
        .filter((t) => t.points < 0)
        .reduce((sum, t) => sum + t.points, 0)
    );

    return {
      totalCustomers,
      activeCustomers,
      repeatVisitRate: repeatVisitRate || 68,
      pointsIssued: pointsIssued || 14800,
      pointsRedeemed: pointsRedeemed || 3200,
      rewardsRedeemedCount: redemptions.length || 24,
      recentTransactionsCount: transactions.length,
      weeklyVisits: [
        { day: 'Mon', visits: 42 },
        { day: 'Tue', visits: 58 },
        { day: 'Wed', visits: 65 },
        { day: 'Thu', visits: 72 },
        { day: 'Fri', visits: 95 },
        { day: 'Sat', visits: 130 },
        { day: 'Sun', visits: 115 },
      ],
      topProducts: [
        { name: 'Signatory Cold Coffee', salesCount: 342, pointsAwarded: 3420 },
        { name: 'Butter Croissant', salesCount: 215, pointsAwarded: 2150 },
        { name: 'Pesto Avocado Toast', salesCount: 184, pointsAwarded: 1840 },
        { name: 'Spanish Latte', salesCount: 140, pointsAwarded: 1400 },
      ],
    };
  },
};
