import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Reward } from '../../types';

interface RewardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rewardData: Partial<Reward>) => Promise<void>;
  reward?: Reward | null;
  businessId: string;
}

export const RewardFormModal: React.FC<RewardFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  reward,
  businessId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pointsCost, setPointsCost] = useState('');
  const [rewardType, setRewardType] = useState<'free_item' | 'discount' | 'voucher'>('free_item');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (reward) {
      setTitle(reward.title);
      setDescription(reward.description || '');
      setPointsCost(reward.pointsCost.toString());
      setRewardType(reward.rewardType);
      setIsActive(reward.isActive);
    } else {
      setTitle('');
      setDescription('');
      setPointsCost('');
      setRewardType('free_item');
      setIsActive(true);
    }
  }, [reward, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !pointsCost) return;
    setIsSubmitting(true);
    try {
      await onSave({
        id: reward?.id,
        businessId,
        title,
        description,
        pointsCost: parseInt(pointsCost) || 100,
        rewardType,
        isActive,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reward ? 'Edit Loyalty Reward' : 'Create New Reward'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Reward Title"
          placeholder="e.g. Free Specialty Coffee"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#57504B] tracking-wide uppercase">
            Description
          </label>
          <textarea
            className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#3D281D]/20 rounded-xl text-sm text-[#1A1615] placeholder:text-[#8C827A] focus:outline-none focus:border-[#3D281D]"
            rows={2}
            placeholder="What does the customer unlock?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Points Cost"
            type="number"
            placeholder="100"
            value={pointsCost}
            onChange={(e) => setPointsCost(e.target.value)}
            helperText="Points required to redeem"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#57504B] tracking-wide uppercase">
              Reward Category
            </label>
            <select
              className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#3D281D]/20 rounded-xl text-sm text-[#1A1615] focus:outline-none focus:border-[#3D281D]"
              value={rewardType}
              onChange={(e) => setRewardType(e.target.value as any)}
            >
              <option value="free_item">Free Item / Drink</option>
              <option value="discount">Flat Discount (₹ Off)</option>
              <option value="voucher">Special Voucher</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#F7F3EC] rounded-xl border border-[#3D281D]/10 my-1">
          <div>
            <span className="text-sm font-bold text-[#3D281D] block">Reward Active</span>
            <span className="text-xs text-[#57504B]">Customers can see and redeem this reward</span>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#3D281D] rounded cursor-pointer"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3D281D]/10">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="amber" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : reward ? 'Update Reward' : 'Create Reward'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
