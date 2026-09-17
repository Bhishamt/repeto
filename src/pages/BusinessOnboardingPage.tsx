import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Store, Coffee, Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export const BusinessOnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { setActiveBusiness, devSwitchRole } = useAuth();

  // Step 1 State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');

  // Step 2 State (Products)
  const [p1Name, setP1Name] = useState('Cold Coffee');
  const [p1Price, setP1Price] = useState('180');
  const [p1Points, setP1Points] = useState('18');

  const [p2Name, setP2Name] = useState('Butter Croissant');
  const [p2Price, setP2Price] = useState('150');
  const [p2Points, setP2Points] = useState('15');

  // Step 3 State (Rules)
  const [spendPerPoint, setSpendPerPoint] = useState('100');
  const [pointsPerSpendUnit, setPointsPerSpendUnit] = useState('10');
  const [welcomePoints, setWelcomePoints] = useState('50');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }
  };

  const handleComplete = async () => {
    if (!name) return;
    setIsSubmitting(true);

    try {
      const newBiz = await apiService.registerNewBusiness(
        { name, slug, description, address, city },
        [
          { name: p1Name, price: parseFloat(p1Price) || 180, pointsEarned: parseInt(p1Points) || 18, categoryName: 'Beverages' },
          { name: p2Name, price: parseFloat(p2Price) || 150, pointsEarned: parseInt(p2Points) || 15, categoryName: 'Bakery' },
        ],
        {
          spendPerPoint: parseFloat(spendPerPoint) || 100,
          pointsPerSpendUnit: parseInt(pointsPerSpendUnit) || 10,
          welcomePoints: parseInt(welcomePoints) || 50,
        }
      );

      setActiveBusiness(newBiz.id);
      devSwitchRole('business_owner');
      navigate('/dashboard/qr');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center items-center p-4 font-body relative overflow-hidden">
      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-6">
          <Badge variant="amber" className="mb-2">
            3-Step Setup Wizard
          </Badge>
          <h1 className="font-heading font-extrabold text-3xl text-[#3D281D]">
            Set Up Your Cafe Loyalty Program
          </h1>
          <p className="text-xs text-[#57504B] mt-1">
            Launch your multi-tenant loyalty SaaS in less than 2 minutes.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 1 ? 'bg-[#3D281D] text-[#FDFBF7]' : 'bg-[#EFE7DC] text-[#8C827A]'
              }`}
            >
              1
            </div>
            <span className="text-xs font-semibold text-[#3D281D] hidden sm:inline">Cafe Info</span>
          </div>

          <div className="h-0.5 flex-1 bg-[#EFE7DC] mx-3" />

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 2 ? 'bg-[#3D281D] text-[#FDFBF7]' : 'bg-[#EFE7DC] text-[#8C827A]'
              }`}
            >
              2
            </div>
            <span className="text-xs font-semibold text-[#3D281D] hidden sm:inline">First Products</span>
          </div>

          <div className="h-0.5 flex-1 bg-[#EFE7DC] mx-3" />

          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                step >= 3 ? 'bg-[#3D281D] text-[#FDFBF7]' : 'bg-[#EFE7DC] text-[#8C827A]'
              }`}
            >
              3
            </div>
            <span className="text-xs font-semibold text-[#3D281D] hidden sm:inline">Points Rule</span>
          </div>
        </div>

        <Card variant="glass" className="p-6 border-2 border-[#3D281D]/15 shadow-2xl">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-heading font-bold text-lg text-[#3D281D]">Step 1: Business Profile</h3>

              <Input
                label="Cafe / Restaurant Name"
                placeholder="e.g. Roasters Cafe"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />

              <Input
                label="Unique QR Slug (/join/{slug})"
                placeholder="roasters-cafe"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                helperText="Used for customer QR scanning link"
                required
              />

              <Input
                label="Address & Landmark"
                placeholder="12 Bandra West, Hill Road"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#57504B] uppercase">Branding Color</label>
                  <div className="flex items-center gap-2 p-2 bg-[#F7F3EC] rounded-xl border border-[#3D281D]/15">
                    <div className="w-6 h-6 rounded-md bg-[#3D281D]" />
                    <span className="text-xs font-mono text-[#3D281D] font-bold">Espresso (#3D281D)</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#3D281D]/10">
                <Button variant="primary" size="md" onClick={() => setStep(2)} disabled={!name}>
                  <span>Next: Add Menu Items</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-heading font-bold text-lg text-[#3D281D]">Step 2: Add First Menu Items</h3>

              <div className="p-3 bg-[#F7F3EC] rounded-xl border border-[#3D281D]/10">
                <span className="text-xs font-bold text-[#3D281D] block mb-2">Item 1</span>
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Item Name" value={p1Name} onChange={(e) => setP1Name(e.target.value)} />
                  <Input placeholder="Price ₹" type="number" value={p1Price} onChange={(e) => setP1Price(e.target.value)} />
                  <Input placeholder="Points" type="number" value={p1Points} onChange={(e) => setP1Points(e.target.value)} />
                </div>
              </div>

              <div className="p-3 bg-[#F7F3EC] rounded-xl border border-[#3D281D]/10">
                <span className="text-xs font-bold text-[#3D281D] block mb-2">Item 2</span>
                <div className="grid grid-cols-3 gap-2">
                  <Input placeholder="Item Name" value={p2Name} onChange={(e) => setP2Name(e.target.value)} />
                  <Input placeholder="Price ₹" type="number" value={p2Price} onChange={(e) => setP2Price(e.target.value)} />
                  <Input placeholder="Points" type="number" value={p2Points} onChange={(e) => setP2Points(e.target.value)} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#3D281D]/10">
                <Button variant="ghost" size="md" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button variant="primary" size="md" onClick={() => setStep(3)}>
                  <span>Next: Loyalty Rule</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-heading font-bold text-lg text-[#3D281D]">Step 3: Loyalty Rules & Bonus</h3>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Spend per Point Unit (₹)"
                  type="number"
                  value={spendPerPoint}
                  onChange={(e) => setSpendPerPoint(e.target.value)}
                  helperText="e.g. ₹100 spend"
                />
                <Input
                  label="Points Earned per Unit"
                  type="number"
                  value={pointsPerSpendUnit}
                  onChange={(e) => setPointsPerSpendUnit(e.target.value)}
                  helperText="e.g. 10 points"
                />
              </div>

              <Input
                label="Welcome Joining Bonus Points"
                type="number"
                value={welcomePoints}
                onChange={(e) => setWelcomePoints(e.target.value)}
                helperText="Instant bonus customer gets upon scanning table QR"
              />

              <div className="p-4 bg-[#FEF3C7] rounded-xl border border-[#D97706]/30 text-xs text-[#D97706] font-medium flex items-center gap-2">
                <Sparkles className="w-5 h-5 shrink-0" />
                <span>Summary Rule: Every ₹{spendPerPoint} spend earns {pointsPerSpendUnit} pts. New customers get +{welcomePoints} bonus points instantly!</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#3D281D]/10">
                <Button variant="ghost" size="md" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button variant="amber" size="lg" onClick={handleComplete} disabled={isSubmitting}>
                  <Check className="w-5 h-5" />
                  <span>{isSubmitting ? 'Creating Cafe...' : 'Launch Cafe & Get QR'}</span>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
