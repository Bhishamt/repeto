import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, ChevronDown, Check, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BusinessSwitcher: React.FC = () => {
  const { activeBusiness, businesses, setActiveBusiness } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!activeBusiness) return null;

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-2.5 bg-[#F7F3EC] hover:bg-[#EFE7DC] border border-[#3D281D]/15 rounded-xl text-left transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={activeBusiness.logoUrl}
            alt={activeBusiness.name}
            className="w-8 h-8 rounded-lg object-cover border border-[#3D281D]/15 shrink-0"
          />
          <div className="truncate">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A] block leading-none mb-1">
              Active Business
            </span>
            <span className="font-heading font-bold text-sm text-[#3D281D] truncate block">
              {activeBusiness.name}
            </span>
          </div>
        </div>
        {businesses.length > 1 && (
          <ChevronDown className={`w-4 h-4 text-[#57504B] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#FDFBF7] border border-[#3D281D]/15 rounded-xl shadow-xl overflow-hidden animate-fade-in p-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A] px-3 py-1.5">
            Your Businesses
          </div>
          {businesses.map((biz) => {
            const isSelected = biz.id === activeBusiness.id;
            return (
              <button
                key={biz.id}
                onClick={() => {
                  setActiveBusiness(biz.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full p-2.5 rounded-lg text-left text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#3D281D] text-[#FDFBF7]'
                    : 'text-[#1A1615] hover:bg-[#F7F3EC]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <img
                    src={biz.logoUrl}
                    alt={biz.name}
                    className="w-6 h-6 rounded-md object-cover border border-white/20 shrink-0"
                  />
                  <span className="truncate">{biz.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
              </button>
            );
          })}

          <div className="border-t border-[#3D281D]/10 mt-1 pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/onboarding');
              }}
              className="flex items-center gap-2 w-full p-2 rounded-lg text-xs font-bold text-[#D97706] hover:bg-[#FEF3C7] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Business</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
