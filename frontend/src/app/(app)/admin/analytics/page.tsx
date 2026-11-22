'use client';
import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Clock, Users, Store, ShieldCheck } from 'lucide-react';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

export default function AdminAnalyticsPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-100">Marketplace Analytics & Economics</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time metrics on customer savings, reverse bidding competition, and order fulfillment</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0d1527] border border-cyan-500/20 px-3.5 py-1.5 rounded-full text-xs text-cyan-300">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>Average Customer Savings: 22.4%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Bid Reduction', val: '22.4%', sub: 'vs MRP retail pricing', icon: DollarSign, color: 'text-emerald-400' },
          { label: 'Avg Fulfillment Time', val: '28 min', sub: 'Prescription to delivery', icon: Clock, color: 'text-cyan-400' },
          { label: 'Bids per Auction', val: '3.6', sub: 'Competitive quotes avg', icon: Store, color: 'text-purple-400' },
          { label: 'Prescription Verification', val: '99.8%', sub: 'Pharmacist sign-off', icon: ShieldCheck, color: 'text-emerald-400' },
        ].map(item => (
          <ThreeDCard key={item.label} className="p-5">
            <div className="w-10 h-10 rounded-xl bg-[#0d1527] border border-white/5 flex items-center justify-center mb-3">
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-2xl font-heading font-bold text-slate-100">{item.val}</p>
            <p className="text-xs font-semibold text-slate-300 mt-0.5">{item.label}</p>
            <p className="text-[11px] text-slate-500 mt-1">{item.sub}</p>
          </ThreeDCard>
        ))}
      </div>

      <ThreeDCard className="p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-400">
          <BarChart3 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-slate-200 mb-1">Live Marketplace Telemetry Active</h3>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Transaction volume, pharmacy competition heatmaps, and price-elasticity analytics are dynamically tracked as real-time auctions proceed.
        </p>
      </ThreeDCard>
    </div>
  );
}
