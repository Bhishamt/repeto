import React, { useState, useEffect } from 'react';
import { apiService, store } from '../../services/api';
import { Business, Reward, BusinessCustomer, RedemptionTicket } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { RedemptionTicketModal } from '../../components/domain/RedemptionTicketModal';
import { Gift, Sparkles, Lock, CheckCircle2 } from 'lucide-react';

export const RewardsView: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBizId, setActiveBizId] = useState<string>('biz_bluebird');
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [memberships, setMemberships] = useState<BusinessCustomer[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<RedemptionTicket | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const fetchWallet = () => {
    apiService.getCustomerWallet('cust_bhisham').then((d) => setMemberships(d.memberships));
  };

  useEffect(() => {
    apiService.getBusinesses().then((bList) => {
      setBusinesses(bList);
      if (bList.length > 0) setActiveBizId(bList[0].id);
    });
    fetchWallet();

    const unsub = store.subscribe(fetchWallet);
    return unsub;
  }, []);

  useEffect(() => {
    if (activeBizId) {
      apiService.getRewardsByBusiness(activeBizId).then(setRewards);
    }
  }, [activeBizId]);

  const activeBusiness = businesses.find((b) => b.id === activeBizId) || businesses[0];
  const activeMembership = memberships.find((m) => m.businessId === activeBizId);
  const currentPoints = activeMembership?.totalPoints ?? 0;

  const handleRedeem = async (reward: Reward) => {
    if (currentPoints < reward.pointsCost) return;
    setIsRedeeming(true);
    try {
      const ticket = await apiService.createRedemptionTicket(
        'cust_bhisham',
        reward.businessId,
        reward.id
      );
      setSelectedTicket(ticket);
      setIsTicketModalOpen(true);
      fetchWallet();
    } catch (err: any) {
      alert(err.message || 'Error redeeming reward');
    } finally {
      setIsRedeeming(false);
    }
  };

  if (!activeBusiness) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="pb-2 border-b border-[#3D281D]/10">
        <h1 className="text-2xl font-extrabold font-heading text-[#3D281D]">
          Unlockable Rewards
        </h1>
        <p className="text-xs text-[#57504B] font-medium mt-1">
          Select cafe to view available rewards.
        </p>
      </div>

      {/* Business Switcher Chips */}
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
                  : 'bg-[#EFE7DC] text-[#57504B]'
              }`}
            >
              <img src={biz.logoUrl} alt={biz.name} className="w-5 h-5 rounded-md object-cover" />
              <span>{biz.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold">
                {pts} pts
              </span>
            </button>
          );
        })}
      </div>

      {/* Points Banner */}
      <div className="p-4 bg-[#291A12] text-[#FDFBF7] rounded-2xl border border-white/10 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
            Available Balance
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-3xl font-extrabold font-heading text-white">{currentPoints}</span>
            <span className="text-xs text-amber-400 font-bold">pts at {activeBusiness.name}</span>
          </div>
        </div>
        <Gift className="w-8 h-8 text-amber-400 opacity-80" />
      </div>

      {/* Rewards List */}
      <div className="flex flex-col gap-4">
        {rewards.map((reward) => {
          const isUnlocked = currentPoints >= reward.pointsCost;
          const pct = Math.min(100, Math.round((currentPoints / reward.pointsCost) * 100));

          return (
            <Card
              key={reward.id}
              variant="glass"
              className={`p-5 border flex flex-col gap-4 transition-all ${
                isUnlocked ? 'border-amber-500/40 ring-1 ring-amber-500/20' : 'border-[#3D281D]/15 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      isUnlocked
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-[#EFE7DC] text-[#8C827A]'
                    }`}
                  >
                    {isUnlocked ? <Sparkles className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-[#3D281D]">
                      {reward.title}
                    </h3>
                    <p className="text-xs text-[#57504B]">{reward.description}</p>
                  </div>
                </div>

                <Badge variant={isUnlocked ? 'emerald' : 'gray'}>
                  {isUnlocked ? 'Unlocked' : `${reward.pointsCost - currentPoints} pts left`}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-semibold text-[#57504B]">
                  <span>Progress to Reward</span>
                  <span>{currentPoints} / {reward.pointsCost} pts</span>
                </div>
                <div className="w-full h-2.5 bg-[#EFE7DC] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-gradient-to-r from-[#3D281D] to-[#D97706] rounded-full transition-all duration-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  variant={isUnlocked ? 'amber' : 'outline'}
                  size="md"
                  onClick={() => handleRedeem(reward)}
                  disabled={!isUnlocked || isRedeeming}
                  className="w-full sm:w-auto"
                >
                  {isUnlocked ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{isRedeeming ? 'Redeeming...' : `Redeem for ${reward.pointsCost} Points`}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Need {reward.pointsCost} Points</span>
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <RedemptionTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        ticket={selectedTicket}
      />
    </div>
  );
};
