import React from 'react';
import { useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Wallet, Store, Gift, Receipt, User, QrCode } from 'lucide-react';

export const CustomerLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const tabs = [
    { name: 'Wallet', href: '/app/wallet', icon: Wallet },
    { name: 'Cafes', href: '/app/businesses', icon: Store },
    { name: 'Rewards', href: '/app/rewards', icon: Gift },
    { name: 'Activity', href: '/app/activity', icon: Receipt },
    { name: 'Profile', href: '/app/profile', icon: User },
  ];

  if (!user) {
    return <Navigate to="/auth/customer" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1615] flex flex-col justify-between font-body max-w-md mx-auto border-x border-[#3D281D]/10 shadow-2xl relative">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#3D281D]/10 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/app/wallet')}>
          <div className="w-8 h-8 rounded-xl bg-[#3D281D] text-[#FDFBF7] flex items-center justify-center font-heading font-extrabold text-base shadow-sm">
            R
          </div>
          <div>
            <span className="font-heading font-extrabold text-lg text-[#3D281D] leading-tight block">
              repeato
            </span>
            <span className="text-[9px] font-bold text-[#D97706] uppercase tracking-widest block leading-none">
              Customer Wallet
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/join/bluebird-coffee')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FEF3C7] text-[#D97706] rounded-xl text-xs font-bold border border-[#D97706]/30 hover:bg-[#D97706] hover:text-white transition-all cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan QR</span>
        </button>
      </header>

      {/* Main Mobile App Scroll Content */}
      <main className="flex-1 p-4 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-[#F7F3EC]/95 backdrop-blur-md border-t border-[#3D281D]/15 px-2 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.href;
          const Icon = tab.icon;
          return (
            <button
              key={tab.name}
              onClick={() => navigate(tab.href)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#3D281D] font-bold scale-105'
                  : 'text-[#8C827A] hover:text-[#57504B]'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-[#3D281D] text-amber-400 shadow-sm' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase tracking-wider">{tab.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
