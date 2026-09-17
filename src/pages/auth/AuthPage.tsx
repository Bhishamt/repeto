import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';
import { Store, User as UserIcon, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const AuthPage: React.FC<{ initialMode?: 'customer' | 'business' }> = ({
  initialMode = 'business',
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'business'>(initialMode);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const { loginCustomer, loginBusinessOwner, devSwitchRole } = useAuth();
  const navigate = useNavigate();

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
    } else {
      await loginCustomer(phoneOrEmail || '+91 98765 43210');
      devSwitchRole('customer');
      navigate('/app/wallet');
    }
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginBusinessOwner(phoneOrEmail || 'owner@bluebirdcoffee.com');
    devSwitchRole('business_owner');
    navigate('/dashboard/overview');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center p-4 font-body relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#3D281D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6">
          <div
            className="inline-flex items-center gap-2 cursor-pointer mb-2"
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 rounded-xl bg-[#3D281D] flex items-center justify-center text-[#FDFBF7] font-heading font-extrabold text-lg">
              R
            </div>
            <span className="font-heading font-extrabold text-2xl text-[#3D281D]">repeato</span>
          </div>
          <p className="text-xs text-[#57504B] font-medium">Customer Loyalty & Cafe SaaS Platform</p>
        </div>

        <Card variant="glass" className="p-6 border-2 border-[#3D281D]/15 shadow-2xl">
          {/* Role Picker Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#EFE7DC] rounded-xl mb-6 border border-[#3D281D]/10">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'customer'
                  ? 'bg-[#3D281D] text-[#FDFBF7] shadow-md'
                  : 'text-[#57504B] hover:text-[#1A1615]'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>I'm a Customer</span>
            </button>

            <button
              onClick={() => setActiveTab('business')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'business'
                  ? 'bg-[#3D281D] text-[#FDFBF7] shadow-md'
                  : 'text-[#57504B] hover:text-[#1A1615]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>I Run a Cafe</span>
            </button>
          </div>

          {activeTab === 'customer' ? (
            <form onSubmit={handleCustomerSubmit} className="flex flex-col gap-4">
              <h2 className="font-heading font-bold text-xl text-[#3D281D]">Customer Sign In</h2>

              {!otpSent ? (
                <>
                  <Input
                    label="Mobile Phone or Email"
                    placeholder="+91 98765 43210"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    required
                  />
                  <Button variant="amber" size="md" type="submit" className="w-full">
                    <span>Send Verification OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="p-3 bg-[#FEF3C7] rounded-xl text-xs text-[#D97706] font-medium">
                    OTP sent to {phoneOrEmail || '+91 98765 43210'}. Enter 4-digit code.
                  </div>
                  <Input
                    label="Enter OTP Code"
                    placeholder="8492"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                  />
                  <Button variant="amber" size="md" type="submit" className="w-full">
                    <span>Verify & Open Wallet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </>
              )}

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#3D281D]/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#FDFBF7] px-2 text-[#8C827A]">Or quick demo access</span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => {
                  loginCustomer('+91 98765 43210');
                  devSwitchRole('customer');
                  navigate('/app/wallet');
                }}
              >
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>Sign In as Demo Customer (Bhisham)</span>
              </Button>
            </form>
          ) : (
            <form onSubmit={handleBusinessSubmit} className="flex flex-col gap-4">
              <h2 className="font-heading font-bold text-xl text-[#3D281D]">Cafe Owner & Staff Portal</h2>

              <Input
                label="Work Email"
                placeholder="owner@bluebirdcoffee.com"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button variant="primary" size="md" type="submit" className="w-full">
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/onboarding')}
                  className="text-[#D97706] font-bold hover:underline cursor-pointer"
                >
                  Register New Business?
                </button>
                <span className="text-[#8C827A]">Forgot password?</span>
              </div>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#3D281D]/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#FDFBF7] px-2 text-[#8C827A]">Quick Demo Sign In</span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => {
                  loginBusinessOwner('owner@bluebirdcoffee.com');
                  devSwitchRole('business_owner');
                  navigate('/dashboard/overview');
                }}
              >
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>Sign In as Bluebird Coffee Owner</span>
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
