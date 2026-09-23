import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Transaction } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Receipt, Coffee, Gift, Sparkles } from 'lucide-react';

export const ActivityView: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      apiService.getCustomerWallet(user.id).then((d) => setTransactions(d.transactions));
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="pb-2 border-b border-[#3D281D]/10">
        <h1 className="text-2xl font-extrabold font-heading text-[#3D281D]">
          Universal Activity History
        </h1>
        <p className="text-xs text-[#57504B] font-medium mt-1">
          Complete ledger of points earned and rewards redeemed across all cafes.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {transactions.map((tx) => (
          <Card
            key={tx.id}
            variant="glass"
            className="p-4 border border-[#3D281D]/15 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                  tx.points > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {tx.points > 0 ? <Sparkles className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
              </div>

              <div>
                <span className="font-bold text-sm text-[#3D281D] block">{tx.businessName}</span>
                <span className="text-xs text-[#57504B] block">{tx.source}</span>
                <span className="text-[10px] text-[#8C827A]">
                  {new Date(tx.createdAt).toLocaleDateString()} at{' '}
                  {new Date(tx.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span
                className={`font-heading font-extrabold text-base ${
                  tx.points > 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {tx.points > 0 ? `+${tx.points}` : tx.points}
              </span>
              <span className="text-xs text-stone-600 font-bold block uppercase">pts</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
