import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Business } from '../types';
import { apiService, store } from '../services/api';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  activeBusiness: Business | null;
  businesses: Business[];
  setActiveBusiness: (businessId: string) => void;
  loginCustomer: (phoneOrEmail: string, password?: string) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(isSupabaseConfigured ? null : DEFAULT_USER);
  const [role, setRole] = useState<UserRole>('business_owner');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBusiness, setActiveBusinessState] = useState<Business | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const supabaseUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Business User',
            role: 'business_owner',
            activeBusinessId: '',
          };
          setUser(supabaseUser);
          setRole('business_owner');
          const authBiz = await apiService.getAuthorizedBusinesses(session.user.id);
          setBusinesses(authBiz);
          if (authBiz.length > 0) {
            setActiveBusinessState(authBiz[0]);
            setUser({ ...supabaseUser, activeBusinessId: authBiz[0].id });
          } else {
            setActiveBusinessState(null);
          }
          return;
        } else {
          setUser(null);
          setBusinesses([]);
          setActiveBusinessState(null);
          return;
        }
      }

      // Offline / local fallback mode
      if (user && (role === 'business_owner' || role === 'business_staff')) {
        const authBiz = await apiService.getAuthorizedBusinesses(user.id);
        setBusinesses(authBiz);
        if (authBiz.length > 0) {
          setActiveBusinessState(authBiz[0]);
        }
      }
    };

    initAuth();
  }, []);

  const setActiveBusiness = (businessId: string) => {
    const found = businesses.find((b) => b.id === businessId);
    if (found) {
      setActiveBusinessState(found);
      if (user) {
        setUser({ ...user, activeBusinessId: found.id });
      }
    } else {
      console.warn(`Unauthorized attempt to switch to businessId: ${businessId}`);
    }
  };

  const loginCustomer = async (phoneOrEmail: string, password?: string) => {
    if (isSupabaseConfigured && supabase) {
      if (phoneOrEmail.includes('@') && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: phoneOrEmail,
          password: password || '',
        });
        if (error) {
          const signUpRes = await supabase.auth.signUp({
            email: phoneOrEmail,
            password: password || '',
          });
          if (signUpRes.error) throw signUpRes.error;
          if (signUpRes.data.user) {
            const customerUser: User = {
              id: signUpRes.data.user.id,
              email: phoneOrEmail,
              fullName: phoneOrEmail.split('@')[0],
              role: 'customer',
            };
            setUser(customerUser);
            setRole('customer');
            return;
          }
        }
        if (data.user) {
          const customerUser: User = {
            id: data.user.id,
            email: data.user.email || phoneOrEmail,
            fullName: data.user.user_metadata?.full_name || phoneOrEmail.split('@')[0],
            role: 'customer',
          };
          setUser(customerUser);
          setRole('customer');
          return;
        }
      }
    }

    const customerUser: User = {
      id: `usr_cust_${Date.now()}`,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail}@customer.local`,
      fullName: 'Customer User',
      phone: phoneOrEmail.includes('@') ? '+91 98765 43210' : phoneOrEmail,
      role: 'customer',
    };
    setUser(customerUser);
    setRole('customer');
  };

  const loginBusinessOwner = async (email: string, password?: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || '',
      });
      if (error) {
        throw error;
      }
      if (data.user) {
        const ownerUser: User = {
          id: data.user.id,
          email: data.user.email || email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          role: 'business_owner',
          activeBusinessId: '',
        };
        setUser(ownerUser);
        setRole('business_owner');
        const authBiz = await apiService.getAuthorizedBusinesses(data.user.id);
        setBusinesses(authBiz);
        if (authBiz.length > 0) {
          setActiveBusinessState(authBiz[0]);
          setUser({ ...ownerUser, activeBusinessId: authBiz[0].id });
        } else {
          setActiveBusinessState(null);
        }
      }
      return;
    }

    const ownerUser: User = {
      id: 'usr_owner_demo',
      email: email,
      fullName: email.split('@')[0],
      role: 'business_owner',
      activeBusinessId: '',
    };
    setUser(ownerUser);
    setRole('business_owner');
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setBusinesses([]);
    setActiveBusinessState(null);
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
