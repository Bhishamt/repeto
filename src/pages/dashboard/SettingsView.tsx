import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Toast } from '../../components/ui/Toast';
import { Settings, ShieldCheck, Users, Check, AlertTriangle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [name, setName] = useState(activeBusiness?.name || '');
  const [logoUrl, setLogoUrl] = useState(activeBusiness?.logoUrl || '');
  const [address, setAddress] = useState(activeBusiness?.address || '');
  const [city, setCity] = useState(activeBusiness?.city || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeBusiness) {
      activeBusiness.name = name;
      activeBusiness.logoUrl = logoUrl;
      activeBusiness.address = address;
      activeBusiness.city = city;
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  if (!activeBusiness) return null;

  return (
    <div className="flex flex-col gap-8 animate-fade-in max-w-4xl mx-auto">
      <div className="pb-4 border-b border-[#3D281D]/10">
        <h1 className="text-3xl font-extrabold font-heading text-[#3D281D]">
          Business & Team Settings
        </h1>
        <p className="text-xs text-[#57504B] font-medium mt-1">
          Manage cafe branding, address details, and counter staff access permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Business Profile Settings */}
        <div className="md:col-span-8">
          <Card variant="glass" className="p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-2 border-b border-[#3D281D]/10">
              <Settings className="w-5 h-5 text-[#D97706]" />
              <h3 className="font-heading font-bold text-lg text-[#3D281D]">
                Cafe Profile & Branding
              </h3>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <Input
                label="Cafe Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Logo Image URL"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              {saved && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Business settings saved successfully!</span>
                </div>
              )}

              <div className="pt-4 border-t border-[#3D281D]/10 flex justify-end">
                <Button variant="primary" size="md" type="submit">
                  <span>Save Changes</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Staff Members List */}
        <div className="md:col-span-4">
          <Card variant="glass" className="p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#3D281D]/10">
              <Users className="w-5 h-5 text-[#D97706]" />
              <h3 className="font-heading font-bold text-lg text-[#3D281D]">Staff Members</h3>
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="p-3 bg-[#F7F3EC] rounded-xl flex items-center justify-between border border-[#3D281D]/10">
                <div>
                  <span className="font-bold text-[#3D281D] block">Vikramaditya</span>
                  <span className="text-[10px] text-[#8C827A]">Owner</span>
                </div>
                <Badge variant="amber">Owner</Badge>
              </div>

              <div className="p-3 bg-[#F7F3EC] rounded-xl flex items-center justify-between border border-[#3D281D]/10">
                <div>
                  <span className="font-bold text-[#3D281D] block">Ramesh (Counter Staff)</span>
                  <span className="text-[10px] text-[#8C827A]">Counter Staff</span>
                </div>
                <Badge variant="espresso">Staff</Badge>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full mt-2">
              <span>+ Invite Staff Member</span>
            </Button>
          </Card>
        </div>
      </div>

      {saved && (
        <Toast
          message="Business settings saved successfully!"
          type="success"
          onClose={() => setSaved(false)}
        />
      )}
    </div>
  );
};
