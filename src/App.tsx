import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { JoinBusinessPage } from './pages/JoinBusinessPage';
import { AuthPage } from './pages/auth/AuthPage';
import { BusinessOnboardingPage } from './pages/BusinessOnboardingPage';

// Business Dashboard Layout & Views
import { DashboardLayout } from './pages/dashboard/DashboardLayout';
import { OverviewView } from './pages/dashboard/OverviewView';
import { CustomersView } from './pages/dashboard/CustomersView';
import { MenuView } from './pages/dashboard/MenuView';
import { QrCodeView } from './pages/dashboard/QrCodeView';
import { PointsRulesView } from './pages/dashboard/PointsRulesView';
import { RewardsView as DashboardRewardsView } from './pages/dashboard/RewardsView';
import { TransactionsView } from './pages/dashboard/TransactionsView';
import { StaffVerificationView } from './pages/dashboard/StaffVerificationView';
import { AnalyticsView } from './pages/dashboard/AnalyticsView';
import { SettingsView } from './pages/dashboard/SettingsView';

// Customer Mobile App Layout & Views
import { CustomerLayout } from './pages/app/CustomerLayout';
import { WalletView } from './pages/app/WalletView';
import { BusinessesView } from './pages/app/BusinessesView';
import { RewardsView as CustomerRewardsView } from './pages/app/RewardsView';
import { ActivityView } from './pages/app/ActivityView';
import { ProfileView } from './pages/app/ProfileView';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/join/:businessSlug" element={<JoinBusinessPage />} />

          {/* Auth Routes */}
          <Route path="/auth" element={<AuthPage initialMode="business" />} />
          <Route path="/auth/customer" element={<AuthPage initialMode="customer" />} />
          <Route path="/auth/business" element={<AuthPage initialMode="business" />} />

          {/* Business Onboarding */}
          <Route path="/onboarding" element={<BusinessOnboardingPage />} />

          {/* Business Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/overview" replace />} />
            <Route path="overview" element={<OverviewView />} />
            <Route path="customers" element={<CustomersView />} />
            <Route path="menu" element={<MenuView />} />
            <Route path="qr" element={<QrCodeView />} />
            <Route path="points" element={<PointsRulesView />} />
            <Route path="rewards" element={<DashboardRewardsView />} />
            <Route path="transactions" element={<TransactionsView />} />
            <Route path="staff-counter" element={<StaffVerificationView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>

          {/* Customer Mobile App Routes */}
          <Route path="/app" element={<CustomerLayout />}>
            <Route index element={<Navigate to="/app/wallet" replace />} />
            <Route path="wallet" element={<WalletView />} />
            <Route path="businesses" element={<BusinessesView />} />
            <Route path="rewards" element={<CustomerRewardsView />} />
            <Route path="activity" element={<ActivityView />} />
            <Route path="profile" element={<ProfileView />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
