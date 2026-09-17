import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { BusinessCustomer } from '../../types';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Search, Users, Plus, Award } from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [customers, setCustomers] = useState<BusinessCustomer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<BusinessCustomer | null>(null);
  const [addPointsVal, setAddPointsVal] = useState('50');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCustomers = () => {
    if (activeBusiness) {
      apiService.getBusinessCustomers(activeBusiness.id).then(setCustomers);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [activeBusiness]);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerPhone.includes(searchTerm) ||
      c.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === 'ALL' || c.tier.toUpperCase() === tierFilter.toUpperCase();
    return matchesSearch && matchesTier;
  });

  const handleAddPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !activeBusiness) return;
    const pts = parseInt(addPointsVal) || 50;

    await apiService.earnPointsForPurchase(
      activeBusiness.id,
      selectedCustomer.customerId,
      pts * 10,
      `Manual Staff Bonus (${pts} pts)`
    );

    setIsModalOpen(false);
    fetchCustomers();
  };

  if (!activeBusiness) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#3D281D]/10">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-[#3D281D]">
            Customer Directory
          </h1>
          <p className="text-xs text-[#57504B] font-medium mt-1">
            Isolated customer list for {activeBusiness.name}.
          </p>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <Card variant="glass" className="p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone, or email..."
            className="w-full pl-10 pr-4 py-2 bg-[#FDFBF7] border border-[#3D281D]/20 rounded-xl text-sm focus:outline-none focus:border-[#3D281D]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-bold text-[#57504B] uppercase shrink-0">Tier:</span>
          <select
            className="px-3 py-2 bg-[#FDFBF7] border border-[#3D281D]/20 rounded-xl text-sm font-semibold text-[#3D281D]"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
          >
            <option value="ALL">All Tiers</option>
            <option value="BRONZE">Bronze</option>
            <option value="SILVER">Silver</option>
            <option value="GOLD">Gold</option>
          </select>
        </div>
      </Card>

      {/* Customer Table */}
      <Card variant="glass" className="p-0 overflow-hidden border border-[#3D281D]/15">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EFE7DC] text-[#3D281D] font-heading font-bold uppercase tracking-wider border-b border-[#3D281D]/10">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Tier</th>
                <th className="p-4">Visits</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4 text-right">Points Balance</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D281D]/10">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8C827A]">
                    No customers found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F7F3EC]/80 transition-colors">
                    <td className="p-4 font-bold flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#3D281D] text-white flex items-center justify-center font-bold text-xs">
                        {c.customerName.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#3D281D] block">{c.customerName}</span>
                        <span className="text-[10px] text-[#8C827A]">Joined {new Date(c.joinedAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#57504B] font-medium">
                      <div>{c.customerPhone}</div>
                      <div className="text-[10px] text-[#8C827A]">{c.customerEmail}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={c.tier === 'Gold' ? 'amber' : 'espresso'}>{c.tier}</Badge>
                    </td>
                    <td className="p-4 font-bold text-[#3D281D]">{c.totalVisits} Visits</td>
                    <td className="p-4 font-semibold text-[#3D281D]">₹{c.lifetimeSpend.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <span className="font-heading font-extrabold text-base text-[#3D281D]">
                        {c.totalPoints.toLocaleString()}
                      </span>
                      <span className="text-xs text-amber-600 font-bold ml-1">pts</span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomer(c);
                          setIsModalOpen(true);
                        }}
                      >
                        <Plus className="w-3.5 h-3.5 text-[#D97706]" />
                        <span>Add Points</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Points Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Add Bonus Points: ${selectedCustomer?.customerName}`}
      >
        <form onSubmit={handleAddPoints} className="flex flex-col gap-4">
          <Input
            label="Points Amount"
            type="number"
            value={addPointsVal}
            onChange={(e) => setAddPointsVal(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-[#3D281D]/10">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="amber" type="submit">
              <span>Award {addPointsVal} Points</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
