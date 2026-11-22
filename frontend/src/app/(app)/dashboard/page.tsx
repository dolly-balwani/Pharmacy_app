'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Upload, Gavel, Package, TrendingDown, MapPin, ArrowRight, Sparkles, Clock, ChevronRight, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { ThreeDCard } from '@/components/ui/ThreeDCard';
import { PillVisual3D } from '@/components/ui/PillVisual3D';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/orders').then((r) => setOrders(r.data.slice(0, 5))).catch(() => {});
    api.get('/auctions').then((r) => setAuctions(r.data.filter((a: any) => a.status === 'active'))).catch(() => {});
  }, []);

  const statusColor: Record<string, string> = {
    delivered: 'bg-emerald-400',
    out_for_delivery: 'bg-cyan-400',
    pharmacist_approved: 'bg-blue-400',
    awaiting_pharmacist_verification: 'bg-amber-400',
    preparing_order: 'bg-purple-400',
    pharmacy_selected: 'bg-indigo-400',
  };
  const statusLabel: Record<string, string> = {
    delivered: 'Delivered',
    out_for_delivery: 'In Transit',
    pharmacist_approved: 'Approved by Pharmacist',
    awaiting_pharmacist_verification: 'Awaiting Pharmacist Sign-Off',
    preparing_order: 'Packing Medication',
    pharmacy_selected: 'Order Confirmed',
  };

  return (
    <div className="max-w-5xl space-y-7">
      {/* 3D Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/70 border border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-500/10"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
          <div className="md:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              AI Reverse Marketplace
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0] || 'User'}
            </h2>
            <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
              Upload your handwritten doctor prescription. Let verified pharmacies compete with their best quotations in real-time.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/prescriptions"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-heading font-extrabold text-sm rounded-xl hover:opacity-95 shadow-lg shadow-cyan-500/25 transition-all"
              >
                <Upload className="w-4 h-4" /> Upload Prescription <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auctions"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl transition-all"
              >
                <Gavel className="w-4 h-4 text-cyan-400" /> Live Auctions
              </Link>
            </div>
          </div>

          <div className="md:col-span-4 hidden md:flex items-center justify-center">
            <PillVisual3D size="md" />
          </div>
        </div>
      </motion.div>

      {/* 3D Dynamic Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Auctions', value: auctions.length.toString(), icon: Gavel, glow: 'rgba(56, 189, 248, 0.3)', textColor: 'text-cyan-400' },
          { label: 'Completed Orders', value: orders.length.toString(), icon: Package, glow: 'rgba(16, 185, 129, 0.3)', textColor: 'text-emerald-400' },
          { label: 'Avg. Bill Savings', value: '23%', icon: TrendingDown, glow: 'rgba(168, 85, 247, 0.3)', textColor: 'text-purple-400' },
          { label: 'Chemists Nearby', value: '5', icon: MapPin, glow: 'rgba(245, 158, 11, 0.3)', textColor: 'text-amber-400' },
        ].map((s, i) => (
          <ThreeDCard key={s.label} glowColor={s.glow}>
            <div className="p-5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                <s.icon className={`w-5 h-5 ${s.textColor}`} />
              </div>
              <p className="text-3xl font-heading font-extrabold text-white tracking-tight">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{s.label}</p>
            </div>
          </ThreeDCard>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            href: '/prescriptions',
            icon: Upload,
            title: 'Upload Prescription',
            desc: 'Extract handwritten doctor medications with AI OCR',
            glow: 'rgba(56, 189, 248, 0.25)',
          },
          {
            href: '/auctions',
            icon: Gavel,
            title: 'Live Bidding Room',
            desc: 'Watch local chemists bid with real-time discounts',
            glow: 'rgba(16, 185, 129, 0.25)',
          },
          {
            href: '/orders',
            icon: Package,
            title: 'Track Orders & Delivery',
            desc: 'Monitor registered pharmacist approval & courier dispatch',
            glow: 'rgba(168, 85, 247, 0.25)',
          },
        ].map((a) => (
          <Link key={a.href} href={a.href}>
            <ThreeDCard glowColor={a.glow} className="h-full cursor-pointer">
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                    <a.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="font-heading font-bold text-white text-base mb-1">{a.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{a.desc}</p>
                </div>
                <div className="mt-5 flex items-center text-xs font-bold text-cyan-400 gap-1">
                  Open <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </ThreeDCard>
          </Link>
        ))}
      </div>

      {/* Recent Orders List */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/40">
          <h3 className="font-heading font-bold text-white text-sm">Recent Orders</h3>
          <Link href="/orders" className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-medium">No orders placed yet.</p>
            <p className="text-xs text-slate-500 mt-1">Upload a prescription to receive bids and confirm an order.</p>
            <Link
              href="/prescriptions"
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-cyan-950 border border-cyan-800 text-cyan-300 rounded-xl text-xs font-bold hover:bg-cyan-900 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Prescription
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Package className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Order #{o.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-slate-400">{timeAgo(o.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-white">{formatCurrency(o.total_amount)}</p>
                  <div className="flex items-center gap-1.5 mt-1 justify-end">
                    <span className={`w-2 h-2 rounded-full ${statusColor[o.status] || 'bg-slate-500'}`} />
                    <span className="text-xs text-slate-300 font-medium">{statusLabel[o.status] || o.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
