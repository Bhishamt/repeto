import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BusinessSwitcher } from '../../components/domain/BusinessSwitcher';
import { StaffVerificationModal } from '../../components/domain/StaffVerificationModal';
import { Button } from '../../components/ui/Button';
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  QrCode,
  Sparkles,
  Gift,
  Receipt,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { activeBusiness, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/dashboard/overview', icon: LayoutDashboard },
    { name: 'Customers', href: '/dashboard/customers', icon: Users },
    { name: 'Menu & Products', href: '/dashboard/menu', icon: UtensilsCrossed },
    { name: 'Dynamic QR Code', href: '/dashboard/qr', icon: QrCode },
    { name: 'Points & Rules', href: '/dashboard/points', icon: Sparkles },
    { name: 'Rewards', href: '/dashboard/rewards', icon: Gift },
    { name: 'Ledger', href: '/dashboard/transactions', icon: Receipt },
    { name: 'Staff Counter', href: '/dashboard/staff-counter', icon: ShieldCheck },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  if (!activeBusiness) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1615] flex font-body">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#F7F3EC] border-r border-[#3D281D]/15 p-5 shrink-0 justify-between">
        <div className="flex flex-col gap-6">
          {/* Top Brand Logo */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-[#3D281D] text-[#FDFBF7] flex items-center justify-center font-heading font-extrabold text-xl shadow-md">
              R
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl text-[#3D281D]">repeato</span>
              <span className="text-[9px] font-bold text-[#D97706] uppercase tracking-widest block leading-none">
                Business Portal
              </span>
            </div>
          </div>

          {/* Business Switcher Dropdown */}
          <BusinessSwitcher />

          {/* Staff Counter Quick Verify Button */}
          <Button
            variant="amber"
            size="sm"
            onClick={() => setIsStaffModalOpen(true)}
            className="w-full shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Customer Ticket</span>
          </Button>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#3D281D] text-[#FDFBF7] shadow-sm'
                      : 'text-[#57504B] hover:text-[#1A1615] hover:bg-[#EFE7DC]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D97706]' : 'text-[#8C827A]'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="pt-4 border-t border-[#3D281D]/10 flex flex-col gap-3">
          <a
            href={`/join/${activeBusiness.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between text-xs font-bold text-[#D97706] hover:underline px-2"
          >
            <span>View Public QR Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#3D281D] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.fullName?.charAt(0) || 'O'}
              </div>
              <div className="truncate">
                <span className="font-bold text-xs text-[#3D281D] truncate block">
                  {user?.fullName || 'Cafe Owner'}
                </span>
                <span className="text-[10px] text-[#8C827A] truncate block">Owner Account</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-[#8C827A] hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Mobile */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#F7F3EC] border-b border-[#3D281D]/15">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[#3D281D]">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <span className="font-heading font-bold text-lg text-[#3D281D] truncate">
              {activeBusiness.name}
            </span>
          </div>

          <Button variant="amber" size="sm" onClick={() => setIsStaffModalOpen(true)}>
            <ShieldCheck className="w-4 h-4" />
            <span>Verify</span>
          </Button>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#F7F3EC] border-b border-[#3D281D]/15 p-4 space-y-3">
            <BusinessSwitcher />
            <nav className="grid grid-cols-2 gap-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${
                    location.pathname === item.href ? 'bg-[#3D281D] text-white' : 'text-[#57504B]'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* View Outlet Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Counter Staff Verification Modal */}
      <StaffVerificationModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
      />
    </div>
  );
};
