import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Business } from '../types';
import { apiService, store } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  activeBusiness: Business | null;
  businesses: Business[];
  setActiveBusiness: (businessId: string) => void;
  loginCustomer: (phoneOrEmail: string) => Promise<void>;
  loginBusinessOwner: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  devSwitchRole: (role: UserRole) => void;
  refreshData: () => void;
}

const DEFAULT_USER: User = {
  id: 'usr_customer_demo',
  email: 'bhisham@example.com',
  fullName: 'Bhisham Sharma',
  phone: '+91 98765 43210',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
  role: 'business_owner',
  activeBusinessId: 'biz_bluebird',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [role, setRole] = useState<UserRole>('business_owner');
  const [businesses, setBusinesses] = useState<Business[]>(store.businesses);
  const [activeBusiness, setActiveBusinessState] = useState<Business | null>(store.businesses[0] || null);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setBusinesses([...store.businesses]);
      if (activeBusiness) {
        const found = store.businesses.find((b) => b.id === activeBusiness.id);
        if (found) setActiveBusinessState(found);
      }
    });

    apiService.getBusinesses().then((bList) => {
      setBusinesses(bList);
      if (bList.length > 0 && !activeBusiness) {
        setActiveBusinessState(bList[0]);
      }
    });

    return unsubscribe;
  }, [activeBusiness]);

  const setActiveBusiness = (businessId: string) => {
    const found = businesses.find((b) => b.id === businessId);
    if (found) {
      setActiveBusinessState(found);
      if (user) {
        setUser({ ...user, activeBusinessId: found.id });
      }
    }
  };

  const loginCustomer = async (phoneOrEmail: string) => {
    const customerUser: User = {
      id: 'usr_customer_demo',
      email: phoneOrEmail.includes('@') ? phoneOrEmail : 'bhisham@example.com',
      fullName: 'Bhisham Sharma',
      phone: phoneOrEmail.includes('@') ? '+91 98765 43210' : phoneOrEmail,
      role: 'customer',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
    };
    setUser(customerUser);
    setRole('customer');
  };

  const loginBusinessOwner = async (email: string) => {
    const ownerUser: User = {
      id: 'usr_owner_demo',
      email: email || 'owner@bluebirdcoffee.com',
      fullName: 'Vikramaditya (Owner)',
      role: 'business_owner',
      activeBusinessId: businesses[0]?.id || 'biz_bluebird',
    };
    setUser(ownerUser);
    setRole('business_owner');
    if (businesses.length > 0) {
      setActiveBusinessState(businesses[0]);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const devSwitchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'customer') {
      setUser({
        id: 'usr_customer_demo',
        email: 'bhisham@example.com',
        fullName: 'Bhisham Sharma',
        phone: '+91 98765 43210',
        role: 'customer',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80',
      });
    } else if (newRole === 'business_owner' || newRole === 'business_staff') {
      setUser({
        id: 'usr_owner_demo',
        email: 'owner@bluebirdcoffee.com',
        fullName: 'Vikramaditya (Owner)',
        role: newRole,
        activeBusinessId: activeBusiness?.id || 'biz_bluebird',
      });
    } else if (newRole === 'platform_admin') {
      setUser({
        id: 'usr_admin',
        email: 'admin@repeato.io',
        fullName: 'Repeato SuperAdmin',
        role: 'platform_admin',
      });
    }
  };

  const refreshData = () => {
    store.notify();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        activeBusiness,
        businesses,
        setActiveBusiness,
        loginCustomer,
        loginBusinessOwner,
        logout,
        devSwitchRole,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
