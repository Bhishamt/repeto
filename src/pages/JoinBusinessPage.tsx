import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Business, LoyaltyRule } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Sparkles, Coffee, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const JoinBusinessPage: React.FC = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  const navigate = useNavigate();
  const { loginCustomer } = useAuth();

  const [business, setBusiness] = useState<Business | null>(null);
  const [rules, setRules] = useState<LoyaltyRule | null>(null);
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinedSuccess, setJoinedSuccess] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);

  useEffect(() => {
    if (businessSlug) {
      apiService.getBusinessBySlug(businessSlug).then((b) => {
        if (b) {
          setBusiness(b);
          apiService.getLoyaltyRules(b.id).then(setRules);
        }
      });
    }
  }, [businessSlug]);

  if (!business) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="text-center">
          <Coffee className="w-12 h-12 text-[#D97706] animate-bounce mx-auto mb-3" />
          <p className="text-[#3D281D] font-bold">Loading Cafe Loyalty Program...</p>
        </div>
      </div>
    );
  }

  const welcomePoints = rules?.welcomePoints || 50;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;
    setIsSubmitting(true);

    try {
      await loginCustomer(phoneOrEmail);
      const res = await apiService.joinBusiness('cust_bhisham', business.slug);
      setPointsAwarded(res.pointsAdded || welcomePoints);
      setJoinedSuccess(true);
      setTimeout(() => {
        navigate('/app/wallet');
      }, 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center p-4 relative font-body overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#D97706]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#3B1F2B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Header Card */}
        <Card variant="glass" className="p-6 border-2 border-[#3D281D]/15 shadow-2xl text-center">
          {/* Banner Graphic */}
          <div className="relative h-28 -mx-6 -top-6 rounded-t-xl overflow-hidden mb-4 bg-[#291A12]">
            {business.bannerUrl ? (
              <img
                src={business.bannerUrl}
                alt={business.name}
                className="w-full h-full object-cover opacity-60"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-[#291A12] via-transparent to-transparent" />
          </div>

          <div className="relative -mt-16 flex flex-col items-center">
            <img
              src={business.logoUrl}
              alt={business.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-[#FDFBF7] shadow-xl mb-3"
            />
            <h1 className="font-heading font-extrabold text-2xl text-[#3D281D] tracking-tight">
              {business.name}
            </h1>
            <p className="text-xs text-[#57504B] mt-1 px-4">{business.description}</p>
            <p className="text-xs font-semibold text-[#8C827A] mt-1">{business.address}, {business.city}</p>
          </div>

          {/* Welcome Bonus Callout */}
          <div className="mt-6 p-4 bg-[#FEF3C7] border border-[#D97706]/30 rounded-2xl flex flex-col items-center gap-1 animate-pulse">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Instant Scan Welcome Offer</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold font-heading text-[#3D281D]">
                +{welcomePoints}
              </span>
              <span className="text-sm font-bold text-[#D97706]">Bonus Points</span>
            </div>
            <span className="text-[11px] text-[#57504B]">Unlocked instantly on joining today!</span>
          </div>

          {/* Form / Success Screen */}
          {joinedSuccess ? (
            <div className="py-8 flex flex-col items-center gap-3 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-[#3D281D]">
                Welcome to {business.name}!
              </h3>
              <p className="text-xs text-[#57504B]">
                Added <strong className="text-emerald-700">+{pointsAwarded} points</strong> to your mobile wallet.
              </p>
              <span className="text-xs font-bold text-[#D97706] mt-2">
                Redirecting to your digital wallet...
              </span>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="mt-6 flex flex-col gap-4 text-left">
              <Input
                label="Mobile Phone or Email"
                placeholder="+91 98765 43210 or email"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                required
              />

              <Button variant="amber" size="lg" type="submit" disabled={isSubmitting} className="w-full">
                <span>{isSubmitting ? 'Unlocking Points...' : `Claim ${welcomePoints} Points & Join`}</span>
                <ArrowRight className="w-5 h-5" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C827A] pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>No password required. Points stored securely in Repeato Wallet.</span>
              </div>
            </form>
          )}
        </Card>

        {/* Powered By Repeato Footer */}
        <div className="text-center mt-6">
          <span className="text-xs text-[#8C827A] font-semibold">
            Powered by <strong className="text-[#3D281D]">Repeato Loyalty Platform</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
