import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { KpiCard } from '../../components/domain/KpiCard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Award,
  TrendingUp,
  Gift,
  ArrowRight,
  QrCode,
  ShieldCheck,
  Coffee,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { BusinessAnalytics, BusinessCustomer, Transaction } from '../../types';

export const OverviewView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<BusinessAnalytics | null>(null);
  const [customers, setCustomers] = useState<BusinessCustomer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (activeBusiness) {
      apiService.getBusinessAnalytics(activeBusiness.id).then(setAnalytics);
      apiService.getBusinessCustomers(activeBusiness.id).then(setCustomers);
      apiService.getTransactionsByBusiness(activeBusiness.id).then(setTransactions);
    }
  }, [activeBusiness]);

  if (!activeBusiness || !analytics) return null;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#3D281D]/10">
        <div>
          <Badge variant="amber" className="mb-2">
            Multi-Tenant Cafe Dashboard
          </Badge>
          <h1 className="text-3xl font-extrabold font-heading text-[#3D281D] tracking-tight">
            {activeBusiness.name} Overview
          </h1>
          <p className="text-xs text-[#57504B] font-medium mt-1">
            Real-time loyalty analytics, member balances, and recent ledger activity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/qr')}>
            <QrCode className="w-4 h-4 text-[#D97706]" />
            <span>Get QR Code</span>
          </Button>

          <Button variant="amber" size="sm" onClick={() => navigate('/dashboard/menu')}>
            <span>+ Add Menu Item</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard
          title="Total Loyalty Members"
          value={analytics.totalCustomers}
          change="+14%"
          isPositive={true}
          icon={<Users className="w-5 h-5 text-[#3D281D]" />}
          subtitle="Registered customers"
        />

        <KpiCard
          title="Repeat Visit Rate"
          value={`${analytics.repeatVisitRate}%`}
          change="+8%"
          isPositive={true}
          icon={<TrendingUp className="w-5 h-5 text-[#D97706]" />}
          subtitle="2+ visits in 30 days"
        />

        <KpiCard
          title="Total Points Issued"
          value={analytics.pointsIssued.toLocaleString()}
          change="+22%"
          isPositive={true}
          icon={<Award className="w-5 h-5 text-amber-600" />}
          subtitle="Earned by customers"
        />

        <KpiCard
          title="Points Redeemed"
          value={analytics.pointsRedeemed.toLocaleString()}
          change="+18%"
          isPositive={true}
          icon={<Gift className="w-5 h-5 text-rose-600" />}
          subtitle="Unlocked rewards"
        />
      </div>

      {/* Two Column Layout: Recent Members & Recent Transactions Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Customers */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-[#3D281D] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D97706]" />
              <span>Recent Cafe Members</span>
            </h3>
            <button
              onClick={() => navigate('/dashboard/customers')}
              className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({customers.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <Card variant="glass" className="p-0 overflow-hidden border border-[#3D281D]/15">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#EFE7DC] text-[#3D281D] font-heading font-bold uppercase tracking-wider border-b border-[#3D281D]/10">
                  <tr>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Tier</th>
                    <th className="p-3.5">Visits</th>
                    <th className="p-3.5 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3D281D]/10 text-[#1A1615]">
                  {customers.slice(0, 5).map((c) => (
                    <tr key={c.id} className="hover:bg-[#F7F3EC]/80 transition-colors">
                      <td className="p-3.5 font-bold flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#3D281D] text-white flex items-center justify-center font-bold text-xs">
                          {c.customerName.charAt(0)}
                        </div>
                        <div>
                          <span className="block font-semibold">{c.customerName}</span>
                          <span className="text-[10px] text-[#8C827A] font-normal">{c.customerPhone}</span>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <Badge variant={c.tier === 'Gold' ? 'amber' : 'espresso'}>{c.tier}</Badge>
                      </td>
                      <td className="p-3.5 font-semibold">{c.totalVisits} visits</td>
                      <td className="p-3.5 text-right font-extrabold text-[#3D281D] text-sm font-heading">
                        {c.totalPoints} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Recent Ledger Activity */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-[#3D281D] flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#D97706]" />
              <span>Points Ledger</span>
            </h3>
            <button
              onClick={() => navigate('/dashboard/transactions')}
              className="text-xs font-bold text-[#D97706] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <Card variant="glass" className="p-4 flex flex-col gap-3">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 bg-[#F7F3EC] rounded-xl border border-[#3D281D]/10"
              >
                <div>
                  <span className="font-bold text-xs text-[#3D281D] block">{tx.customerName}</span>
                  <span className="text-[10px] text-[#57504B]">{tx.source}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-heading font-extrabold text-sm ${
                      tx.points > 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                  </span>
                  <span className="text-[10px] text-[#8C827A] block uppercase font-bold">
                    {tx.type}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};
