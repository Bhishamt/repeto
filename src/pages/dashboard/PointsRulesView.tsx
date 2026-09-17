import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { LoyaltyRule } from '../../types';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Sparkles, Calculator, Check, RefreshCw } from 'lucide-react';

export const PointsRulesView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [rules, setRules] = useState<LoyaltyRule | null>(null);
  const [spendPerPoint, setSpendPerPoint] = useState('100');
  const [pointsPerSpendUnit, setPointsPerSpendUnit] = useState('10');
  const [welcomePoints, setWelcomePoints] = useState('50');
  const [visitBonusPoints, setVisitBonusPoints] = useState('10');
  const [minRedemptionPoints, setMinRedemptionPoints] = useState('100');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Interactive Purchase Calculator state
  const [samplePurchase, setSamplePurchase] = useState('450');

  useEffect(() => {
    if (activeBusiness) {
      apiService.getLoyaltyRules(activeBusiness.id).then((r) => {
        setRules(r);
        setSpendPerPoint(r.spendPerPoint.toString());
        setPointsPerSpendUnit(r.pointsPerSpendUnit.toString());
        setWelcomePoints(r.welcomePoints.toString());
        setVisitBonusPoints((r.visitBonusPoints || 10).toString());
        setMinRedemptionPoints((r.minRedemptionPoints || 100).toString());
      });
    }
  }, [activeBusiness]);

  const handleSaveRules = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness) return;
    setIsSaving(true);
    try {
      const updated = await apiService.updateLoyaltyRules(activeBusiness.id, {
        spendPerPoint: parseFloat(spendPerPoint) || 100,
        pointsPerSpendUnit: parseInt(pointsPerSpendUnit) || 10,
        welcomePoints: parseInt(welcomePoints) || 50,
        visitBonusPoints: parseInt(visitBonusPoints) || 10,
        minRedemptionPoints: parseInt(minRedemptionPoints) || 100,
      });
      setRules(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  // Live calculation
  const sampleAmount = parseFloat(samplePurchase) || 0;
  const unitSpend = parseFloat(spendPerPoint) || 100;
  const unitPoints = parseInt(pointsPerSpendUnit) || 10;
  const calculatedEarned = Math.floor((sampleAmount / unitSpend) * unitPoints);

  if (!activeBusiness) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-5xl mx-auto">
      <div className="pb-4 border-b border-[#3D281D]/10">
        <h1 className="text-3xl font-extrabold font-heading text-[#3D281D]">
          Loyalty Rules & Engine
        </h1>
        <p className="text-xs text-[#57504B] font-medium mt-1">
          Configure points per ₹ spend, welcome bonuses, and test your rules with the live calculator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Rules Config Form */}
        <div className="lg:col-span-7">
          <Card variant="glass" className="p-6 border border-[#3D281D]/15">
            <form onSubmit={handleSaveRules} className="flex flex-col gap-5">
              <div className="flex items-center gap-2 pb-2 border-b border-[#3D281D]/10">
                <Sparkles className="w-5 h-5 text-[#D97706]" />
                <h3 className="font-heading font-bold text-lg text-[#3D281D]">
                  Configure Earning Formula
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Spend Unit (₹)"
                  type="number"
                  value={spendPerPoint}
                  onChange={(e) => setSpendPerPoint(e.target.value)}
                  helperText="e.g. ₹100 spend"
                  required
                />

                <Input
                  label="Points Earned"
                  type="number"
                  value={pointsPerSpendUnit}
                  onChange={(e) => setPointsPerSpendUnit(e.target.value)}
                  helperText="e.g. 10 points"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <Input
                  label="Welcome Bonus Points"
                  type="number"
                  value={welcomePoints}
                  onChange={(e) => setWelcomePoints(e.target.value)}
                  helperText="Instant on scanning QR"
                  required
                />

                <Input
                  label="Min Redemption Balance"
                  type="number"
                  value={minRedemptionPoints}
                  onChange={(e) => setMinRedemptionPoints(e.target.value)}
                  helperText="Points needed to redeem"
                  required
                />
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Loyalty rules updated successfully for {activeBusiness.name}!</span>
                </div>
              )}

              <div className="pt-4 border-t border-[#3D281D]/10 flex justify-end">
                <Button variant="primary" size="md" type="submit" disabled={isSaving}>
                  <span>{isSaving ? 'Saving Rules...' : 'Save Loyalty Rules'}</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Live Example Purchase Calculator */}
        <div className="lg:col-span-5">
          <Card variant="dark" className="p-6 border-2 border-amber-500/30 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Calculator className="w-5 h-5" />
              <h3 className="font-heading font-bold text-lg text-white">Live Rule Preview</h3>
            </div>

            <p className="text-xs text-amber-200/80">
              Test how your current points formula behaves for customer orders.
            </p>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-semibold text-amber-300 uppercase">
                Simulated Customer Bill (₹)
              </label>
              <input
                type="number"
                value={samplePurchase}
                onChange={(e) => setSamplePurchase(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-2xl font-extrabold font-heading text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10 flex flex-col gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Points Calculation Result
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold font-heading text-amber-400">
                  +{calculatedEarned}
                </span>
                <span className="text-sm text-white font-bold">Points Awarded</span>
              </div>
              <span className="text-xs text-stone-300">
                Formula: (₹{sampleAmount} / ₹{unitSpend}) × {unitPoints} pts
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
