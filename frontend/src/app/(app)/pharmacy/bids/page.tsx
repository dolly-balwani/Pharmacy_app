'use client';
import React from 'react';
import { Gavel, CheckCircle2, Clock, Zap, Store } from 'lucide-react';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

export default function PharmacyBidsPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-100">Submitted Quotations</h1>
          <p className="text-sm text-slate-400 mt-1">Audit and track your pharmacy's competitive bids across active auctions</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0d1527] border border-cyan-500/20 px-3.5 py-1.5 rounded-full text-xs text-cyan-300">
          <Store className="w-3.5 h-3.5 text-cyan-400" />
          <span>Licensed Merchant Node</span>
        </div>
      </div>

      <ThreeDCard className="p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-400">
          <Gavel className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-slate-200 mb-1">Live Bids Syncing</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Quotations you submit through active broadcast requests will automatically appear here with pricing validation and customer selection status.
        </p>
        <a
          href="/pharmacy/requests"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
        >
          <span>View Live Broadcasts</span>
        </a>
      </ThreeDCard>
    </div>
  );
}
