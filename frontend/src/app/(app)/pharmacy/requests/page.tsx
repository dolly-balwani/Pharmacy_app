'use client';
import React, { useEffect, useState } from 'react';
import { Gavel, Clock, AlertCircle, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

export default function PharmacyRequestsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  useEffect(() => {
    api.get('/auctions').then(r => setAuctions(r.data.filter((a: any) => a.status === 'active'))).catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
            <h1 className="text-2xl font-heading font-bold text-slate-100">Prescription Broadcast Network</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">Real-time incoming prescription requests from verified nearby patients</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0d1527] border border-cyan-500/20 px-3 py-1.5 rounded-full text-xs text-cyan-300">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Automated 15-Minute Quotation Windows</span>
        </div>
      </div>

      {auctions.length === 0 ? (
        <ThreeDCard className="p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <Gavel className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-slate-200 mb-1">Listening for Prescription Broadcasts</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            When verified patients within your 2km radius submit prescriptions, live bidding requests will instantly stream here.
          </p>
        </ThreeDCard>
      ) : (
        <div className="space-y-4">
          {auctions.map(a => (
            <ThreeDCard key={a.id} className="p-5 hover:border-cyan-500/40 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Gavel className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-100 text-base">Prescription Broadcast #{a.id.slice(0, 8)}</p>
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                        Active Bidding
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span><Clock className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />{a.duration_minutes || 15} min auction</span>
                      <span>•</span>
                      <span>{a.total_bids_received || 0} competitive bids logged</span>
                    </p>
                  </div>
                </div>
                <a
                  href={`/auctions?prescription_id=${a.prescription_id}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                >
                  <span>Open Bidding Console</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </ThreeDCard>
          ))}
        </div>
      )}
    </div>
  );
}
