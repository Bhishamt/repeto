import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { ShieldCheck, CheckCircle2, AlertTriangle, Sparkles, QrCode } from 'lucide-react';
import { RedemptionTicket } from '../../types';

export const StaffVerificationView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; ticket?: RedemptionTicket } | null>(null);

  // Manual point addition form state for store purchases
  const [customerPhone, setCustomerPhone] = useState('');
  const [billAmount, setBillAmount] = useState('250');
  const [purchaseProduct, setPurchaseProduct] = useState('Signatory Cold Coffee');
  const [purchaseResult, setPurchaseResult] = useState<string | null>(null);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setIsVerifying(true);
    setResult(null);

    try {
      const res = await apiService.verifyRedemptionTicket(code, 'Counter Staff');
      setResult(res);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCreditPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness || !billAmount) return;
    const amount = parseFloat(billAmount) || 0;
    const tx = await apiService.earnPointsForPurchase(
      activeBusiness.id,
      'cust_bhisham',
      amount,
      purchaseProduct
    );
    setPurchaseResult(`Credited +${tx.points} pts for Bhisham Sharma (Bill ₹${amount})!`);
    setTimeout(() => setPurchaseResult(null), 3000);
  };

  if (!activeBusiness) return null;

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-4xl mx-auto">
      <div className="pb-4 border-b border-[#3D281D]/10">
        <h1 className="text-3xl font-extrabold font-heading text-[#3D281D]">
          Staff & POS Counter Station
        </h1>
        <p className="text-xs text-[#57504B] font-medium mt-1">
          Verify customer 1-time reward codes or issue points for in-store purchases at {activeBusiness.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1: Verify Redemption Code */}
        <Card variant="glass" className="p-6 border-2 border-[#3D281D]/15 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#3D281D]/10 text-[#3D281D]">
            <ShieldCheck className="w-5 h-5 text-[#D97706]" />
            <h3 className="font-heading font-bold text-lg">1-Time Ticket Verification</h3>
          </div>

          <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
            <Input
              label="Redemption Pass Code"
              placeholder="e.g. RPT-BLUE-8821"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-xs text-[#8C827A]">
              <span>Demo active code?</span>
              <button
                type="button"
                onClick={() => setCode('RPT-BLUE-8821')}
                className="text-[#D97706] font-bold hover:underline cursor-pointer"
              >
                Use RPT-BLUE-8821
              </button>
            </div>

            <Button variant="amber" size="md" type="submit" disabled={isVerifying || !code}>
              <QrCode className="w-4 h-4" />
              <span>{isVerifying ? 'Verifying...' : 'Verify Ticket & Burn Pass'}</span>
            </Button>

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
                  <span>{result.success ? 'Valid Ticket!' : 'Invalid Ticket'}</span>
                </div>
                <p className="mt-1">{result.message}</p>
              </div>
            )}
          </form>
        </Card>

        {/* Section 2: Credit Points for POS Store Bill */}
        <Card variant="glass" className="p-6 border-2 border-[#3D281D]/15 flex flex-col gap-5">
          <div className="flex items-center gap-2 pb-2 border-b border-[#3D281D]/10 text-[#3D281D]">
            <Sparkles className="w-5 h-5 text-[#D97706]" />
            <h3 className="font-heading font-bold text-lg">In-Store Purchase Points</h3>
          </div>

          <form onSubmit={handleCreditPoints} className="flex flex-col gap-4">
            <Input
              label="Customer Phone / ID"
              placeholder="+91 98765 43210 (Bhisham)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Bill Amount (₹)"
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                required
              />

              <Input
                label="Item Purchased"
                value={purchaseProduct}
                onChange={(e) => setPurchaseProduct(e.target.value)}
              />
            </div>

            <Button variant="primary" size="md" type="submit">
              <span>Credit Purchase Points</span>
            </Button>

            {purchaseResult && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold animate-fade-in">
                {purchaseResult}
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};
