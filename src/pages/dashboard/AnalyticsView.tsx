import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { BusinessAnalytics } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { BarChart3, TrendingUp, Users, Award, Coffee, RefreshCw } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [analytics, setAnalytics] = useState<BusinessAnalytics | null>(null);

  useEffect(() => {
    if (activeBusiness) {
      apiService.getBusinessAnalytics(activeBusiness.id).then(setAnalytics);
    }
  }, [activeBusiness]);

  if (!activeBusiness || !analytics) return null;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="pb-4 border-b border-[#3D281D]/10">
        <h1 className="text-3xl font-extrabold font-heading text-[#3D281D]">
          Retention & Loyalty Analytics
        </h1>
        <p className="text-xs text-[#57504B] font-medium mt-1">
          Deep customer visit frequency, points velocity, and top selling loyalty products for {activeBusiness.name}.
        </p>
      </div>

      {/* Top Stat Strips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="glass" className="p-6">
          <span className="text-xs font-bold text-[#8C827A] uppercase tracking-wider">
            Repeat Visit Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold font-heading text-[#3D281D]">
              {analytics.repeatVisitRate}%
            </span>
            <Badge variant="emerald">+8% MoM</Badge>
          </div>
          <p className="text-xs text-[#57504B] mt-2">
            {analytics.activeCustomers} out of {analytics.totalCustomers} members returned 2+ times.
          </p>
        </Card>

        <Card variant="glass" className="p-6">
          <span className="text-xs font-bold text-[#8C827A] uppercase tracking-wider">
            Points Velocity Ratio
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold font-heading text-[#D97706]">
              {Math.round((analytics.pointsRedeemed / (analytics.pointsIssued || 1)) * 100)}%
            </span>
            <Badge variant="amber">High Engagement</Badge>
          </div>
          <p className="text-xs text-[#57504B] mt-2">
            {analytics.pointsRedeemed.toLocaleString()} points redeemed vs {analytics.pointsIssued.toLocaleString()} issued.
          </p>
        </Card>

        <Card variant="glass" className="p-6">
          <span className="text-xs font-bold text-[#8C827A] uppercase tracking-wider">
            Total Rewards Redeemed
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold font-heading text-[#3B1F2B]">
              {analytics.rewardsRedeemedCount}
            </span>
            <Badge variant="aubergine">Redemptions</Badge>
          </div>
          <p className="text-xs text-[#57504B] mt-2">Claimed at counter using one-time tickets.</p>
        </Card>
      </div>

      {/* Visual Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Visit Frequency Bar Strip */}
        <div className="lg:col-span-7">
          <Card variant="glass" className="p-6 flex flex-col gap-6">
            <h3 className="font-heading font-bold text-xl text-[#3D281D] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#D97706]" />
              <span>Weekly Customer Footfall</span>
            </h3>

            <div className="flex items-end justify-between h-48 pt-6 px-4 gap-4 border-b border-[#3D281D]/10">
              {analytics.weeklyVisits.map((item) => {
                const maxVisits = 140;
                const heightPct = Math.round((item.visits / maxVisits) * 100);
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[10px] font-extrabold text-[#3D281D] opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.visits}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[28px] bg-gradient-to-t from-[#3D281D] to-[#D97706] rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                    />
                    <span className="text-xs font-bold text-[#8C827A]">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Top Points Earning Menu Products */}
        <div className="lg:col-span-5">
          <Card variant="glass" className="p-6 flex flex-col gap-4">
            <h3 className="font-heading font-bold text-xl text-[#3D281D] flex items-center gap-2">
              <Coffee className="w-5 h-5 text-[#D97706]" />
              <span>Top Loyalty Products</span>
            </h3>

            <div className="flex flex-col gap-3">
              {analytics.topProducts.map((prod, idx) => (
                <div
                  key={prod.name}
                  className="flex items-center justify-between p-3 bg-[#F7F3EC] rounded-xl border border-[#3D281D]/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#3D281D] text-white flex items-center justify-center text-xs font-bold font-heading">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-[#3D281D] block">{prod.name}</span>
                      <span className="text-[10px] text-[#57504B]">{prod.salesCount} orders</span>
                    </div>
                  </div>
                  <span className="font-heading font-extrabold text-sm text-[#D97706]">
                    +{prod.pointsAwarded} pts
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
