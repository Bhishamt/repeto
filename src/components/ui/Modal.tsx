import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1615]/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FDFBF7] border border-[#3D281D]/15 rounded-2xl shadow-2xl overflow-hidden p-6 animate-scale-up">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#3D281D]/10">
          <h3 className="text-xl font-bold font-heading text-[#3D281D]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#8C827A] hover:text-[#1A1615] hover:bg-[#3D281D]/5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
