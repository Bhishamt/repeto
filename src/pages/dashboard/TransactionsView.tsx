import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Transaction } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Receipt, Search, Filter } from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    if (activeBusiness) {
      apiService.getTransactionsByBusiness(activeBusiness.id).then(setTransactions);
    }
  }, [activeBusiness]);

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  if (!activeBusiness) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="pb-4 border-b border-[#3D281D]/10">
        <h1 className="text-3xl font-extrabold font-heading text-[#3D281D]">
          Points Ledger & Audit History
        </h1>
        <p className="text-xs text-[#57504B] font-medium mt-1">
          Immutable ledger of all points earned, welcome bonuses, and reward redemptions.
        </p>
      </div>

      {/* Filter Bar */}
      <Card variant="glass" className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name or description..."
            className="w-full pl-10 pr-4 py-2 bg-[#FDFBF7] border border-[#3D281D]/20 rounded-xl text-sm focus:outline-none focus:border-[#3D281D]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#8C827A]" />
          <select
            className="px-3 py-2 bg-[#FDFBF7] border border-[#3D281D]/20 rounded-xl text-sm font-semibold text-[#3D281D]"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Ledger Types</option>
            <option value="EARN">Purchase Earn</option>
            <option value="REDEEM">Redemption</option>
            <option value="WELCOME">Welcome Bonus</option>
          </select>
        </div>
      </Card>

      {/* Ledger Table */}
      <Card variant="glass" className="p-0 overflow-hidden border border-[#3D281D]/15">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EFE7DC] text-[#3D281D] font-heading font-bold uppercase tracking-wider border-b border-[#3D281D]/10">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Type</th>
                <th className="p-4">Transaction Details</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4 text-right">Points Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D281D]/10">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#8C827A]">
                    No ledger records match the search.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#F7F3EC]/80 transition-colors">
                    <td className="p-4 font-bold text-[#3D281D]">{tx.customerName}</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          tx.type === 'earn'
                            ? 'emerald'
                            : tx.type === 'redeem'
                            ? 'aubergine'
                            : 'amber'
                        }
                      >
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium text-[#57504B]">{tx.source}</td>
                    <td className="p-4 text-[#8C827A]">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`font-heading font-extrabold text-base ${
                          tx.points > 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
