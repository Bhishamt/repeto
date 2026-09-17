import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Reward } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { RewardFormModal } from '../../components/domain/RewardFormModal';
import { Plus, Gift, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

export const RewardsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  const fetchRewards = () => {
    if (activeBusiness) {
      apiService.getRewardsByBusiness(activeBusiness.id).then(setRewards);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [activeBusiness]);

  const handleSaveReward = async (rewardData: Partial<Reward>) => {
    if (!activeBusiness) return;
    await apiService.saveReward({ ...rewardData, businessId: activeBusiness.id });
    fetchRewards();
  };

  const handleDeleteReward = async (rewardId: string) => {
    if (confirm('Are you sure you want to delete this reward?')) {
      await apiService.deleteReward(rewardId);
      fetchRewards();
    }
  };

  const handleToggleActive = async (reward: Reward) => {
    if (!activeBusiness) return;
    await apiService.saveReward({
      ...reward,
      businessId: activeBusiness.id,
      isActive: !reward.isActive,
    });
    fetchRewards();
  };

  if (!activeBusiness) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#3D281D]/10">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-[#3D281D]">
            Rewards Program
          </h1>
          <p className="text-xs text-[#57504B] font-medium mt-1">
            Configure unlockable rewards and points cost for {activeBusiness.name}.
          </p>
        </div>

        <Button
          variant="amber"
          size="md"
          onClick={() => {
            setEditingReward(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Reward</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <Card
            key={reward.id}
            variant="glass"
            className={`flex flex-col justify-between p-6 border border-[#3D281D]/15 ${
              !reward.isActive ? 'opacity-60 bg-[#F7F3EC]' : ''
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-[#FEF3C7] text-[#D97706] rounded-xl border border-[#D97706]/30">
                  <Gift className="w-6 h-6" />
                </div>
                <Badge variant={reward.isActive ? 'emerald' : 'gray'}>
                  {reward.isActive ? 'Active Reward' : 'Inactive'}
                </Badge>
              </div>

              <h3 className="font-heading font-extrabold text-xl text-[#3D281D]">
                {reward.title}
              </h3>
              <p className="text-xs text-[#57504B]">{reward.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#3D281D]/10 flex items-center justify-between">
              <div>
                <span className="text-2xl font-extrabold font-heading text-[#3D281D]">
                  {reward.pointsCost}
                </span>
                <span className="text-xs font-bold text-[#D97706] ml-1">pts</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(reward)}
                  className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                    reward.isActive
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-stone-200 text-stone-600 border-stone-300'
                  }`}
                >
                  {reward.isActive ? 'Active' : 'Disabled'}
                </button>

                <button
                  onClick={() => {
                    setEditingReward(reward);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-[#57504B] hover:text-[#3D281D] hover:bg-[#EFE7DC] rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteReward(reward.id)}
                  className="p-2 text-[#57504B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <RewardFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReward}
        reward={editingReward}
        businessId={activeBusiness.id}
      />
    </div>
  );
};
