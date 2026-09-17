import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { QrCodeCard } from '../../components/domain/QrCodeCard';

export const QrCodeView: React.FC = () => {
  const { activeBusiness } = useAuth();

  if (!activeBusiness) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-4xl mx-auto">
      <div className="pb-4 border-b border-[#3D281D]/10">
        <h1 className="text-3xl font-extrabold font-heading text-[#3D281D]">
          Dynamic Business QR Code
        </h1>
        <p className="text-xs text-[#57504B] font-medium mt-1">
          Every cafe gets a unique link and real QR code to display on table tents, menus, or cash counters.
        </p>
      </div>

      <QrCodeCard business={activeBusiness} />
    </div>
  );
};
