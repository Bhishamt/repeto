import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { WalletCard } from '../../components/domain/WalletCard';
import { RedemptionTicketModal } from '../../components/domain/RedemptionTicketModal';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Gift,
  QrCode,
  ArrowRight,
  TrendingUp,
  Receipt,
  Coffee,
  Check,
} from 'lucide-react';
import { Business, BusinessCustomer, Transaction, RedemptionTicket } from '../../types';

export const WalletView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBizId, setActiveBizId] = useState<string>('');
  const [memberships, setMemberships] = useState<BusinessCustomer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<RedemptionTicket | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadWalletData = async () => {
      setIsLoading(true);
      try {
        const bList = await apiService.getBusinesses();
        if (!isMounted) return;
        setBusinesses(bList);

        if (user) {
          const data = await apiService.getCustomerWallet(user.id);
          if (!isMounted) return;
          setMemberships(data.memberships);
          setTransactions(data.transactions);

          if (data.memberships.length > 0) {
            setActiveBizId(data.memberships[0].businessId);
          } else if (bList.length > 0) {
            setActiveBizId(bList[0].id);
          }
        } else if (bList.length > 0) {
          setActiveBizId(bList[0].id);
        }
      } catch (err) {
        console.error('Error loading customer wallet:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadWalletData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const activeBusiness = businesses.find((b) => b.id === activeBizId) || businesses[0];
  const activeMembership = memberships.find((m) => m.businessId === activeBizId);

  const points = activeMembership?.totalPoints ?? 0;
  const nextRewardCost = 100;
  const progressPct = Math.min(100, Math.round((points / nextRewardCost) * 100));

  if (isLoading) {
    return (
      <div className="p-12 text-center text-[#8C827A] font-medium text-xs flex flex-col items-center justify-center gap-2">
        <Coffee className="w-8 h-8 text-[#D97706] animate-bounce" />
        <span>Loading Customer Wallet...</span>
      </div>
    );
  }

  if (!activeBusiness) {
    return (
      <div className="p-8 text-center bg-[#F7F3EC] rounded-2xl border border-[#3D281D]/15 flex flex-col gap-3 items-center my-6">
        <Coffee className="w-10 h-10 text-[#D97706]" />
        <h3 className="font-heading font-bold text-base text-[#3D281D]">No Partner Cafes Found</h3>
        <p className="text-xs text-[#57504B]">Scan a cafe QR code to join their loyalty program and start earning points!</p>
        <Button variant="amber" size="sm" onClick={() => navigate('/join/bluebird-coffee')}>
          <span>Explore Partner Cafes</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Business Chip Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {businesses.map((biz) => {
          const isSelected = biz.id === activeBizId;
          const mem = memberships.find((m) => m.businessId === biz.id);
          const pts = mem?.totalPoints ?? 0;

          return (
            <button
              key={biz.id}
              onClick={() => setActiveBizId(biz.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'bg-[#3D281D] text-[#FDFBF7] shadow-md ring-2 ring-[#D97706]/40'
                  : 'bg-[#EFE7DC] text-[#57504B] hover:bg-[#E2D6C5]'
              }`}
            >
              <img
                src={biz.logoUrl}
                alt={biz.name}
                className="w-5 h-5 rounded-md object-cover"
              />
              <span>{biz.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-amber-500 text-white' : 'bg-stone-300 text-stone-700'}`}>
                {pts} pts
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Cafe Wallet Card */}
      <WalletCard
        business={activeBusiness}
        membership={activeMembership}
        isActive={true}
        onOpenQr={() => navigate(`/join/${activeBusiness.slug}`)}
      />

      {/* Progress to Next Reward Card */}
      <Card variant="glass" className="p-5 flex flex-col gap-3 border border-[#3D281D]/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#D97706]" />
            <h3 className="font-heading font-bold text-base text-[#3D281D]">Next Reward Progress</h3>
          </div>
          <Badge variant="amber">{progressPct}% Unlocked</Badge>
        </div>

        <div className="flex items-center justify-between text-xs text-[#57504B] font-semibold">
          <span>Free Specialty Coffee</span>
          <span>{points} / {nextRewardCost} pts</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-[#EFE7DC] rounded-full overflow-hidden p-0.5 border border-[#3D281D]/10">
          <div
            style={{ width: `${progressPct}%` }}
            className="h-full bg-gradient-to-r from-[#3D281D] via-[#D97706] to-amber-500 rounded-full transition-all duration-700"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-[#8C827A]">
            {points >= nextRewardCost ? '🎉 Reward Ready to Redeem!' : `Earn ${nextRewardCost - points} more pts to unlock`}
          </span>

          <Button
            variant="amber"
            size="sm"
            onClick={() => navigate('/app/rewards')}
          >
            <span>View Rewards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>

      {/* Recent Earning History Feed */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-[#3D281D] flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#D97706]" />
            <span>Recent Point Activity</span>
          </h3>
          <button
            onClick={() => navigate('/app/activity')}
            className="text-xs font-bold text-[#D97706] hover:underline"
          >
            View All
          </button>
        </div>

        <Card variant="glass" className="p-3 flex flex-col gap-2">
          {transactions.slice(0, 3).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-[#F7F3EC] rounded-xl border border-[#3D281D]/10"
            >
              <div>
                <span className="font-bold text-xs text-[#3D281D] block">{tx.businessName}</span>
                <span className="text-[10px] text-[#57504B]">{tx.source}</span>
              </div>
              <div className="text-right">
                <span
                  className={`font-heading font-extrabold text-sm ${
                    tx.points > 0 ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                </span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Pass Ticket Modal */}
      <RedemptionTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        ticket={selectedTicket}
      />
    </div>
  );
};
