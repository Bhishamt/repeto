import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { RedemptionTicket } from '../../types';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface RedemptionTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: RedemptionTicket | null;
}

export const RedemptionTicketModal: React.FC<RedemptionTicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
}) => {
  const [timeLeft, setTimeLeft] = useState('23:59:59');

  useEffect(() => {
    if (!ticket) return;

    const timer = setInterval(() => {
      const diff = new Date(ticket.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [ticket]);

  if (!ticket) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Redemption Pass">
      <div className="flex flex-col items-center text-center p-2">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="amber" className="px-3 py-1 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>One-Time Redemption Ticket</span>
          </Badge>
        </div>

        <h3 className="font-heading font-extrabold text-2xl text-[#3D281D]">
          {ticket.rewardTitle}
        </h3>
        <p className="text-xs text-[#8C827A] mt-1 font-medium">{ticket.businessName}</p>

        {/* QR Code */}
        <div className="my-6 p-4 bg-white border-2 border-[#3D281D]/20 rounded-2xl shadow-lg relative">
          <QRCodeSVG value={ticket.code} size={180} level="M" />
        </div>

        {/* Dynamic Code Display */}
        <div className="w-full bg-[#291A12] text-white p-4 rounded-xl shadow-inner border border-white/10 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block mb-1">
            Redemption Pass Code
          </span>
          <span className="font-mono text-2xl font-extrabold tracking-widest text-amber-400 select-all">
            {ticket.code}
          </span>
        </div>

        {/* Expiry Timer */}
        <div className="flex items-center justify-between w-full p-3 bg-[#F7F3EC] rounded-xl border border-[#3D281D]/10 text-xs font-semibold text-[#57504B]">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#D97706]" />
            <span>Pass Expires In:</span>
          </div>
          <span className="font-mono font-bold text-sm text-[#3D281D]">{timeLeft}</span>
        </div>

        {/* Status Indicator */}
        <div className="mt-4 pt-3 border-t border-[#3D281D]/10 w-full flex items-center justify-center gap-2 text-xs">
          {ticket.status === 'redeemed' ? (
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Redeemed by {ticket.redeemedByStaffName || 'Staff'}!</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[#8C827A]">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span>Show this screen to cafe staff to claim item</span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
