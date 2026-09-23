import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Business, BusinessCustomer } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Store, QrCode, ChevronRight, MapPin, Sparkles } from 'lucide-react';

export const BusinessesView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [memberships, setMemberships] = useState<BusinessCustomer[]>([]);

  useEffect(() => {
    apiService.getBusinesses().then(setBusinesses);
    if (user) {
      apiService.getCustomerWallet(user.id).then((d) => setMemberships(d.memberships));
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="pb-2 border-b border-[#3D281D]/10">
        <h1 className="text-2xl font-extrabold font-heading text-[#3D281D]">
          Joined Cafe Directory
        </h1>
        <p className="text-xs text-[#57504B] mt-1 font-medium">
          Multi-tenant loyalty points remain strictly separate per business.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {businesses.map((biz) => {
          const mem = memberships.find((m) => m.businessId === biz.id);
          const pts = mem?.totalPoints ?? 0;
          const tier = mem?.tier || 'Bronze';

          return (
            <Card
              key={biz.id}
              variant="glass"
              className="p-5 border border-[#3D281D]/15 flex flex-col gap-4 hover:border-[#D97706]/40 transition-all cursor-pointer"
              onClick={() => navigate(`/join/${biz.slug}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={biz.logoUrl}
                    alt={biz.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#3D281D]/15 shadow-sm"
                  />
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#3D281D] leading-tight">
                      {biz.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-[#8C827A] mt-0.5">
                      <MapPin className="w-3 h-3 text-[#D97706]" />
                      <span>{biz.address}, {biz.city}</span>
                    </div>
                  </div>
                </div>

                <Badge variant="amber">{tier}</Badge>
              </div>

              <p className="text-xs text-[#57504B] line-clamp-2">{biz.description}</p>

              <div className="pt-3 border-t border-[#3D281D]/10 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold font-heading text-[#3D281D]">
                    {pts.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#D97706] font-bold ml-1">pts</span>
                </div>

                <Button variant="secondary" size="sm">
                  <QrCode className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Scan / Open</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
