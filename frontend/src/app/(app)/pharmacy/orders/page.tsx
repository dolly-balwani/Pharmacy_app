'use client';
import React, { useEffect, useState } from 'react';
import { Package, CheckCircle2, Clock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

export default function PharmacyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-100">Fulfillment & Dispensing Queue</h1>
          <p className="text-sm text-slate-400 mt-1">Verify prescriptions, approve medication dispensing, and track dispatch</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0d1527] border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Regulated Dispensing Protocol</span>
        </div>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <ThreeDCard className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4 text-cyan-400">
              <Package className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-slate-200 mb-1">No Orders in Queue</h3>
            <p className="text-sm text-slate-400">When customers accept your quotation, confirmed orders will appear here for verification and packing.</p>
          </ThreeDCard>
        ) : (
          orders.map(o => (
            <ThreeDCard key={o.id} className="p-5 hover:border-cyan-500/40 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold text-slate-100 font-mono">Order #{o.id.slice(0, 8)}</p>
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                        {o.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span><Clock className="w-3.5 h-3.5 inline mr-1 text-slate-500" />{timeAgo(o.created_at)}</span>
                      <span>•</span>
                      <span>Delivery: Koramangala, Bangalore</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-base font-bold text-cyan-300 font-mono">{formatCurrency(o.total_amount)}</span>
                  {o.status === 'awaiting_pharmacist_verification' && (
                    <button
                      onClick={async () => {
                        await api.post(`/orders/${o.id}/pharmacist-approval`, {
                          pharmacist_name: "Dr. R. Sharma, Reg. Pharmacist",
                          registration_number: "KA-PHARM-001"
                        });
                        api.get('/orders').then(r => setOrders(r.data));
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Pharmacist Sign-off</span>
                    </button>
                  )}
                  {o.status !== 'awaiting_pharmacist_verification' && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Verified & Approved</span>
                    </span>
                  )}
                </div>
              </div>
            </ThreeDCard>
          ))
        )}
      </div>
    </div>
  );
}
