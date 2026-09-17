export type UserRole = 'customer' | 'business_owner' | 'business_staff' | 'platform_admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  activeBusinessId?: string; // For business owners/staff
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  description: string;
  address: string;
  city: string;
  primaryColor: string;
  bannerUrl?: string;
  createdAt: string;
}

export interface BusinessMember {
  id: string;
  businessId: string;
  userId: string;
  role: 'owner' | 'staff';
  createdAt: string;
}

export interface Customer {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface BusinessCustomer {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalPoints: number;
  totalVisits: number;
  lifetimeSpend: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinedAt: string;
  lastVisitAt: string;
}

export interface Category {
  id: string;
  businessId: string;
  name: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  businessId: string;
  categoryId?: string;
  categoryName?: string;
  name: string;
  description: string;
  price: number; // in ₹
  pointsEarned: number;
  isAvailable: boolean;
  imageUrl?: string;
}

export interface LoyaltyRule {
  id: string;
  businessId: string;
  spendPerPoint: number;       // e.g. ₹100
  pointsPerSpendUnit: number;  // e.g. 10 points
  welcomePoints: number;       // Instant bonus on joining
  visitBonusPoints: number;    // Bonus points per checkin/purchase
  minRedemptionPoints: number; // Minimum balance needed to redeem
  updatedAt: string;
}

export type TransactionType = 'earn' | 'redeem' | 'bonus' | 'welcome';

export interface Transaction {
  id: string;
  businessId: string;
  businessName: string;
  customerId: string;
  customerName: string;
  points: number; // Positive for earn/welcome, negative for redeem
  type: TransactionType;
  source: string; // e.g., 'Cold Coffee Purchase', 'Free Coffee Redemption', 'Welcome Bonus'
  referenceId?: string;
  createdAt: string;
}

export interface Reward {
  id: string;
  businessId: string;
  title: string;
  description: string;
  pointsCost: number;
  rewardType: 'free_item' | 'discount' | 'voucher';
  isActive: boolean;
  imageUrl?: string;
}

export type RedemptionStatus = 'pending' | 'redeemed' | 'expired';

export interface RedemptionTicket {
  id: string;
  businessId: string;
  businessName: string;
  customerId: string;
  customerName: string;
  rewardId: string;
  rewardTitle: string;
  pointsCost: number;
  code: string; // e.g. RPT-BLUE-8492
  status: RedemptionStatus;
  expiresAt: string;
  redeemedAt?: string;
  redeemedByStaffName?: string;
  createdAt: string;
}

export interface BusinessAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  repeatVisitRate: number; // percentage e.g. 68
  pointsIssued: number;
  pointsRedeemed: number;
  rewardsRedeemedCount: number;
  recentTransactionsCount: number;
  weeklyVisits: { day: string; visits: number }[];
  topProducts: { name: string; salesCount: number; pointsAwarded: number }[];
}
