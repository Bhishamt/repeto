import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { WalletCard } from '../components/domain/WalletCard';
import { INITIAL_BUSINESSES } from '../data/mockData';
import {
  QrCode,
  Sparkles,
  ShieldCheck,
  Zap,
  Coffee,
  Store,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Smartphone,
  ArrowRight,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const bluebird = INITIAL_BUSINESSES[0];
  const urbanbrew = INITIAL_BUSINESSES[1];
  const fitzone = INITIAL_BUSINESSES[2];

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1615] flex flex-col font-body">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#3D281D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-[#3D281D] flex items-center justify-center text-[#FDFBF7] font-heading font-extrabold text-xl shadow-md">
              R
            </div>
            <div>
              <span className="font-heading font-extrabold text-2xl text-[#3D281D] tracking-tight">
                repeato
              </span>
              <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-widest block leading-none">
                Espresso Kinetic Glass
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#57504B]">
            <a href="#how-it-works" className="hover:text-[#3D281D] transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-[#3D281D] transition-colors">
              For Businesses
            </a>
            <a href="#customers" className="hover:text-[#3D281D] transition-colors">
              For Customers
            </a>
            <a href="#security" className="hover:text-[#3D281D] transition-colors">
              Security & RLS
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth/customer')}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/auth/business')}>
              For Cafes & F&B
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7DC] border border-[#3D281D]/15 w-fit">
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              <span className="text-xs font-bold text-[#3D281D] tracking-wide uppercase">
                Multi-Tenant Cafe Loyalty SaaS
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-[#3D281D] tracking-tight leading-[1.1]">
              Turn Every Sip & Bite Into{' '}
              <span className="bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#3B1F2B] bg-clip-text text-transparent">
                Lifelong Loyalty
              </span>
            </h1>

            <p className="text-lg text-[#57504B] leading-relaxed max-w-2xl font-normal">
              Repeato empowers cafes and F&B businesses to deploy custom loyalty programs with table-tent QR codes, automated points ledgers, and fraud-proof one-time reward redemptions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button variant="primary" size="lg" onClick={() => navigate('/auth/business')}>
                <span>Launch Your Cafe Program</span>
                <ChevronRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/join/bluebird-coffee')}
              >
                <QrCode className="w-5 h-5 text-[#D97706]" />
                <span>Test QR Scan Demo</span>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-[#3D281D]/10 text-xs font-bold text-[#8C827A] uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Multi-Tenant RLS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Currency in ₹</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1-Time Redemption Code</span>
              </div>
            </div>
          </div>

          {/* Hero Floating Wallet Stack Demo */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full max-w-md mx-auto space-y-4">
              <div className="transform rotate-[-2deg] transition-transform duration-500 hover:rotate-0">
                <WalletCard
                  business={bluebird}
                  membership={{
                    id: '1',
                    businessId: bluebird.id,
                    customerId: 'c1',
                    customerName: 'Bhisham Sharma',
                    customerPhone: '+91 9876543210',
                    customerEmail: 'bhisham@example.com',
                    totalPoints: 650,
                    totalVisits: 14,
                    lifetimeSpend: 6500,
                    tier: 'Gold',
                    joinedAt: '',
                    lastVisitAt: '',
                  }}
                  isActive={true}
                  onOpenQr={() => navigate('/join/bluebird-coffee')}
                />
              </div>

              <div className="transform rotate-[3deg] transition-transform duration-500 hover:rotate-0 opacity-95">
                <WalletCard
                  business={urbanbrew}
                  membership={{
                    id: '2',
                    businessId: urbanbrew.id,
                    customerId: 'c1',
                    customerName: 'Bhisham Sharma',
                    customerPhone: '+91 9876543210',
                    customerEmail: 'bhisham@example.com',
                    totalPoints: 320,
                    totalVisits: 6,
                    lifetimeSpend: 3200,
                    tier: 'Silver',
                    joinedAt: '',
                    lastVisitAt: '',
                  }}
                  onOpenQr={() => navigate('/join/urban-brew-cafe')}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Table Tent Demo Section */}
      <section id="qr-demo" className="py-20 bg-[#F7F3EC] border-y border-[#3D281D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="amber" className="mb-3">
              Dynamic Table Tent System
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#3D281D]">
              Scan to Join in 3 Seconds
            </h2>
            <p className="text-base text-[#57504B] mt-2">
              No app store downloads required. Customers scan your cafe table-tent QR code and immediately unlock welcome points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Table Tent Graphic */}
            <Card variant="dark" className="flex flex-col items-center text-center p-8 border-2 border-amber-500/30">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-white">Bluebird Coffee Table Standee</h3>
              <p className="text-xs text-amber-200 mt-1 mb-6">Scan QR with phone camera</p>

              <div className="p-4 bg-white rounded-2xl border-4 border-amber-400 shadow-2xl mb-6 cursor-pointer" onClick={() => navigate('/join/bluebird-coffee')}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    window.location.origin + '/join/bluebird-coffee'
                  )}`}
                  alt="QR Code Demo"
                  className="w-44 h-44"
                />
              </div>

              <Button
                variant="amber"
                size="md"
                onClick={() => navigate('/join/bluebird-coffee')}
              >
                <span>Simulate Scan (/join/bluebird-coffee)</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>

            {/* Steps Breakdown */}
            <div className="flex flex-col gap-6 text-left">
              <div className="flex items-start gap-4 p-4 bg-[#FDFBF7] rounded-xl border border-[#3D281D]/10">
                <div className="w-10 h-10 rounded-xl bg-[#3D281D] text-amber-400 flex items-center justify-center font-bold font-heading shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg text-[#3D281D]">Dynamic Cafe Slug</h4>
                  <p className="text-sm text-[#57504B] mt-1">
                    Every cafe gets a unique link like <code className="text-[#D97706] font-mono">/join/bluebird-coffee</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#FDFBF7] rounded-xl border border-[#3D281D]/10">
                <div className="w-10 h-10 rounded-xl bg-[#3D281D] text-amber-400 flex items-center justify-center font-bold font-heading shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg text-[#3D281D]">Instant Joining Bonus</h4>
                  <p className="text-sm text-[#57504B] mt-1">
                    Customer logs in with phone or email and immediately claims 50 welcome points.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#FDFBF7] rounded-xl border border-[#3D281D]/10">
                <div className="w-10 h-10 rounded-xl bg-[#3D281D] text-amber-400 flex items-center justify-center font-bold font-heading shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg text-[#3D281D]">Isolated Multi-Cafe Wallet</h4>
                  <p className="text-sm text-[#57504B] mt-1">
                    Points earned at Bluebird Coffee never mix with Urban Brew Cafe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Businesses: 6 Capabilities */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="espresso" className="mb-3">
              Engineered For F&B Growth
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-[#3D281D]">
              Everything Your Cafe Needs to Retain Customers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card variant="glass" className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#3D281D]/10 text-[#3D281D] flex items-center justify-center mb-1">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#3D281D]">Multi-Tenant Isolation</h3>
              <p className="text-sm text-[#57504B]">
                Database-level PostgreSQL Row Level Security guarantees cafe data remains strictly isolated.
              </p>
            </Card>

            <Card variant="glass" className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center mb-1">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#3D281D]">Menu & Product Management</h3>
              <p className="text-sm text-[#57504B]">
                Set prices, customize points earned per item, manage categories, and toggle item availability in real-time.
              </p>
            </Card>

            <Card variant="glass" className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#3B1F2B]/10 text-[#3B1F2B] flex items-center justify-center mb-1">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#3D281D]">Configurable Rules Engine</h3>
              <p className="text-sm text-[#57504B]">
                Define rules like ₹100 = 10 points or ₹50 = 5 points with instant live purchase preview calculators.
              </p>
            </Card>

            <Card variant="glass" className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#3D281D]">1-Time Passcodes</h3>
              <p className="text-sm text-[#57504B]">
                Prevent fraud with one-time redemption codes and QR passes verified by counter staff.
              </p>
            </Card>

            <Card variant="glass" className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-1">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#3D281D]">Retention Analytics</h3>
              <p className="text-sm text-[#57504B]">
                Track repeat visit rates, points velocity, top redeemed items, and customer lifetime spend.
              </p>
            </Card>

            <Card variant="glass" className="flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center mb-1">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#3D281D]">Customer Mobile App</h3>
              <p className="text-sm text-[#57504B]">
                Mobile-first wallet experience with radial progress rings and instant reward unlocking.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-[#291A12] text-[#FDFBF7] py-16 border-t border-[#FDFBF7]/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-heading font-extrabold text-xl">
              R
            </div>
            <div>
              <span className="font-heading font-bold text-2xl tracking-tight text-white">repeato</span>
              <p className="text-xs text-amber-200/70">Multi-tenant Cafe Loyalty Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="amber" size="md" onClick={() => navigate('/dashboard/overview')}>
              Open Owner Dashboard
            </Button>
            <Button variant="secondary" size="md" onClick={() => navigate('/app/wallet')}>
              Open Customer Wallet
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};
