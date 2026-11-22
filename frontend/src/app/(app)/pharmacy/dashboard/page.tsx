'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Gavel, Award, AlertCircle, CheckCircle2, TrendingUp, Clock, Store } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

export default function PharmacyDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/orders').then((r) => setOrders(r.data)).catch(() => {});
    api.get('/auctions').then((r) => setAuctions(r.data)).catch(() => {});
  }, []);

  const activeAuctions = auctions.filter((a) => a.status === 'active');
  const pendingOrders = orders.filter((o) => o.status === 'awaiting_pharmacist_verification');

  return (
    <div className="max-w-5xl space-y-7">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Store className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            Pharmacy Merchant Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor incoming prescription broadcasts, quotation win rates, and order fulfillment.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Broadcasts', value: activeAuctions.length, icon: Gavel, glow: 'rgba(56, 189, 248, 0.3)', textColor: 'text-cyan-400' },
          { label: 'Awaiting Pharmacist Sign-Off', value: pendingOrders.length, icon: AlertCircle, glow: 'rgba(245, 158, 11, 0.3)', textColor: 'text-amber-400' },
          { label: 'Total Orders', value: orders.length, icon: Package, glow: 'rgba(16, 185, 129, 0.3)', textColor: 'text-emerald-400' },
          { label: 'Auction Win Rate', value: '67%', icon: Award, glow: 'rgba(168, 85, 247, 0.3)', textColor: 'text-purple-400' },
        ].map((s) => (
          <ThreeDCard key={s.label} glowColor={s.glow}>
            <div className="p-5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                <s.icon className={`w-5 h-5 ${s.textColor}`} />
              </div>
              <p className="text-3xl font-heading font-black text-white tracking-tight">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{s.label}</p>
            </div>
          </ThreeDCard>
        ))}
      </div>

      {/* Pending Pharmacist Verification Action Queue */}
      {pendingOrders.length > 0 && (
        <div className="glass-card rounded-2xl border border-amber-500/30 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-amber-950/30 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <h3 className="font-heading font-bold text-white text-sm">
              Pharmacist Verification Required
            </h3>
            <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full font-bold ml-auto">
              {pendingOrders.length} Pending Approval
            </span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {pendingOrders.map((o) => (
              <div key={o.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading font-bold text-white text-base">
                      Order #{o.id.slice(0, 8).toUpperCase()}
                    </p>
                    <span className="text-xs text-cyan-400 font-extrabold">{formatCurrency(o.total_amount)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Customer Address: {o.delivery_address || '162 Example St, NY / Bangalore'} · Received {timeAgo(o.created_at)}
                  </p>
                </div>

                <button
                  onClick={async () => {
                    await api.post(`/orders/${o.id}/pharmacist-approval`, {
                      pharmacist_name: 'Dr. Anand Reddy',
                      registration_number: 'KA-PHARM-001',
                      notes: 'Verified prescription and medication safety.',
                    });
                    api.get('/orders').then((r) => setOrders(r.data)).catch(() => {});
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-heading font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve as Pharmacist (KA-PHARM-001)
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <h3 className="font-heading font-bold text-white text-sm">Recent Fulfillments</h3>
        </div>
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-10 h-10 text-slate-700 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No pharmacy orders yet. Submit competitive bids on incoming requests.</p>
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
                  <span className="text-xs text-emerald-400 font-semibold">{o.status.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
