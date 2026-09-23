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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginCustomer, loginBusinessOwner } = useAuth();
  const navigate = useNavigate();

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await loginCustomer(phoneOrEmail, password);
      navigate('/app/wallet');
    } catch (err: any) {
      setError(err.message || 'Customer authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await loginBusinessOwner(phoneOrEmail, password);
      navigate('/dashboard/overview');
    } catch (err: any) {
      setError(err.message || 'Business authentication failed. Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
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
              onClick={() => {
                setActiveTab('customer');
                setError('');
              }}
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
              onClick={() => {
                setActiveTab('business');
                setError('');
              }}
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

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {activeTab === 'customer' ? (
            <form onSubmit={handleCustomerSubmit} className="flex flex-col gap-4">
              <h2 className="font-heading font-bold text-xl text-[#3D281D]">Customer Sign In</h2>

              <Input
                label="Email or Mobile Phone"
                placeholder="customer@example.com"
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

              <Button variant="amber" size="md" type="submit" disabled={isLoading} className="w-full">
                <span>{isLoading ? 'Signing In...' : 'Sign In to Customer Wallet'}</span>
                <ArrowRight className="w-4 h-4" />
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

              <Button variant="primary" size="md" type="submit" disabled={isLoading} className="w-full">
                <span>{isLoading ? 'Signing In...' : 'Sign In to Dashboard'}</span>
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
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
