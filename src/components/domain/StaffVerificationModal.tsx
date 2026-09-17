import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { apiService } from '../../services/api';
import { CheckCircle2, AlertTriangle, QrCode, Sparkles } from 'lucide-react';
import { RedemptionTicket } from '../../types';

interface StaffVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const StaffVerificationModal: React.FC<StaffVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; ticket?: RedemptionTicket } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await apiService.verifyRedemptionTicket(code, 'Counter Staff');
      setResult(res);
      if (res.success && onSuccess) {
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickTest = async () => {
    setCode('RPT-BLUE-8821');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Staff Redemption Counter">
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <div className="p-3 bg-[#FEF3C7] border border-[#D97706]/30 rounded-xl flex items-center gap-2 text-xs text-[#D97706] font-medium">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Enter or scan customer redemption code to validate reward claim.</span>
        </div>

        <Input
          label="Redemption Pass Code"
          placeholder="e.g. RPT-BLUE-8821"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-xs text-[#8C827A]">
          <span>Testing code?</span>
          <button
            type="button"
            onClick={handleQuickTest}
            className="text-[#D97706] font-bold hover:underline cursor-pointer"
          >
            Fill Demo Code (RPT-BLUE-8821)
          </button>
        </div>

        {result && (
          <div
            className={`p-4 rounded-xl border flex flex-col gap-1 text-xs animate-fade-in ${
              result.success
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {result.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              )}
              <span>{result.success ? 'Verification Successful!' : 'Verification Failed'}</span>
            </div>
            <p className="mt-1">{result.message}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3D281D]/10">
          <Button variant="ghost" type="button" onClick={onClose}>
            Close
          </Button>
          <Button variant="amber" type="submit" disabled={isSubmitting || !code}>
            <QrCode className="w-4 h-4" />
            <span>{isSubmitting ? 'Verifying...' : 'Verify & Mark Redeemed'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
