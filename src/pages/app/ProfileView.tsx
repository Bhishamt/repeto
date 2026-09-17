import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, Phone, Mail, Store, LogOut, ShieldCheck } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, devSwitchRole, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="pb-2 border-b border-[#3D281D]/10">
        <h1 className="text-2xl font-extrabold font-heading text-[#3D281D]">
          Customer Account
        </h1>
        <p className="text-xs text-[#57504B] font-medium mt-1">
          Digital wallet profile and platform preferences.
        </p>
      </div>

      <Card variant="glass" className="p-6 border border-[#3D281D]/15 flex flex-col items-center text-center gap-4">
        <img
          src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80'}
          alt={user?.fullName}
          className="w-20 h-20 rounded-full object-cover border-4 border-[#3D281D] shadow-xl"
        />

        <div>
          <h3 className="font-heading font-extrabold text-xl text-[#3D281D]">
            {user?.fullName || 'Bhisham Sharma'}
          </h3>
          <Badge variant="amber" className="mt-1">
            Customer Wallet User
          </Badge>
        </div>

        <div className="w-full flex flex-col gap-2 pt-4 border-t border-[#3D281D]/10 text-xs text-left">
          <div className="flex items-center gap-3 p-3 bg-[#F7F3EC] rounded-xl">
            <Phone className="w-4 h-4 text-[#D97706]" />
            <span className="font-medium text-[#3D281D]">{user?.phone || '+91 98765 43210'}</span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#F7F3EC] rounded-xl">
            <Mail className="w-4 h-4 text-[#D97706]" />
            <span className="font-medium text-[#3D281D]">{user?.email || 'bhisham@example.com'}</span>
          </div>
        </div>
      </Card>

      {/* Switch Portal Demo Card */}
      <Card variant="dark" className="p-5 border-2 border-amber-500/30 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-amber-400">
          <Store className="w-5 h-5" />
          <h4 className="font-heading font-bold text-base text-white">Switch to Business Owner Portal</h4>
        </div>
        <p className="text-xs text-amber-200/80">
          Want to test the cafe dashboard, add menu products, or adjust loyalty rules?
        </p>

        <Button
          variant="amber"
          size="md"
          onClick={() => {
            devSwitchRole('business_owner');
            navigate('/dashboard/overview');
          }}
          className="w-full mt-1"
        >
          <span>Open Business Owner Portal</span>
        </Button>
      </Card>

      <Button
        variant="outline"
        size="md"
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="w-full"
      >
        <LogOut className="w-4 h-4 text-rose-600" />
        <span className="text-rose-600 font-bold">Sign Out</span>
      </Button>
    </div>
  );
};
