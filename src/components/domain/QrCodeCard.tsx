import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Business } from '../../types';
import { Button } from '../ui/Button';
import { Copy, Download, Printer, Check, Sparkles, QrCode } from 'lucide-react';

interface QrCodeCardProps {
  business: Business;
}

export const QrCodeCard: React.FC<QrCodeCardProps> = ({ business }) => {
  const [copied, setCopied] = useState(false);
  const [showTableTent, setShowTableTent] = useState(false);

  // Dynamic join URL
  const joinUrl = `${window.location.origin}/join/${business.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Main QR Card */}
      <div className="bg-[#FDFBF7] border border-[#3D281D]/15 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#3D281D] via-[#D97706] to-[#3B1F2B]" />

        <div className="flex items-center gap-3 mb-4 mt-2">
          <img
            src={business.logoUrl}
            alt={business.name}
            className="w-10 h-10 rounded-xl object-cover border border-[#3D281D]/20 shadow-md"
          />
          <div className="text-left">
            <h3 className="font-heading font-bold text-base text-[#3D281D] leading-tight">
              {business.name}
            </h3>
            <p className="text-xs text-[#8C827A] font-medium">Scan & Join Loyalty</p>
          </div>
        </div>

        {/* Dynamic QR SVG */}
        <div className="p-4 bg-white border-2 border-[#3D281D]/20 rounded-2xl shadow-inner my-2 flex items-center justify-center relative group">
          <QRCodeSVG
            value={joinUrl}
            size={200}
            bgColor="#FFFFFF"
            fgColor="#1A1615"
            level="H"
            includeMargin={true}
            imageSettings={{
              src: business.logoUrl,
              x: undefined,
              y: undefined,
              height: 36,
              width: 36,
              excavate: true,
            }}
          />
        </div>

        {/* Dynamic Join Target URL */}
        <div className="mt-3 px-3 py-1.5 bg-[#F7F3EC] border border-[#3D281D]/10 rounded-lg max-w-full overflow-hidden text-ellipsis">
          <span className="text-xs font-mono text-[#57504B] select-all">{joinUrl}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2 mt-5 w-full flex-wrap">
          <Button variant="secondary" size="sm" onClick={handleCopyLink}>
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </Button>

          <Button variant="outline" size="sm" onClick={() => setShowTableTent(!showTableTent)}>
            <Printer className="w-4 h-4" />
            <span>{showTableTent ? 'Hide Table Tent' : 'Print Table Tent'}</span>
          </Button>
        </div>
      </div>

      {/* Printable Table Tent Preview */}
      {showTableTent && (
        <div className="bg-[#291A12] text-[#FDFBF7] p-8 rounded-2xl border-2 border-[#D97706]/40 shadow-2xl flex flex-col items-center text-center animate-fade-in print:bg-white print:text-black">
          <div className="flex items-center gap-2 text-amber-400 mb-2 font-semibold text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>Table Tent Standee Preview</span>
          </div>

          <div className="bg-[#FDFBF7] text-[#1A1615] p-6 rounded-xl border border-amber-500/30 max-w-sm w-full my-4 shadow-xl flex flex-col items-center">
            <img
              src={business.logoUrl}
              alt={business.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#3D281D] mb-3 shadow-md"
            />
            <h4 className="font-heading font-extrabold text-2xl text-[#3D281D] leading-tight">
              {business.name}
            </h4>
            <p className="text-xs font-bold text-[#D97706] uppercase tracking-wider mt-1">
              Scan To Join & Earn 50 Bonus Points!
            </p>

            <div className="my-5 p-3 bg-white border border-stone-300 rounded-xl shadow-md">
              <QRCodeSVG value={joinUrl} size={180} level="H" includeMargin={true} />
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-[#57504B]">
              <QrCode className="w-4 h-4 text-[#D97706]" />
              <span>No App Download Required</span>
            </div>
          </div>

          <Button variant="amber" size="md" onClick={handlePrint} className="mt-2">
            <Printer className="w-4 h-4" />
            <span>Print Table Tent Now</span>
          </Button>
        </div>
      )}
    </div>
  );
};
