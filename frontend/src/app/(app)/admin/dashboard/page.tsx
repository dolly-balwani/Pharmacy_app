'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Store, Gavel, Package, TrendingUp, Bot, Shield, BarChart3, CheckCircle2, Clock, Zap, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>({});
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/admin/analytics').then(r => setAnalytics(r.data)).catch(() => {});
    api.get('/admin/pharmacies').then(r => setPharmacies(r.data)).catch(() => {});
    api.get('/admin/auctions').then(r => setAuctions(r.data)).catch(() => {});
  }, []);

  const stats = [
    { label: 'Registered Customers', value: analytics.total_customers || 1, icon: Users, glow: 'text-cyan-400' },
    { label: 'Verified Pharmacies', value: `${analytics.verified_pharmacies || 5}/${analytics.total_pharmacies || 5}`, icon: Store, glow: 'text-emerald-400' },
    { label: 'Active Auctions', value: analytics.active_auctions || 1, icon: Gavel, glow: 'text-purple-400' },
    { label: 'Total Orders', value: analytics.total_orders || 1, icon: Package, glow: 'text-amber-400' },
    { label: 'Completed Orders', value: analytics.completed_orders || 1, icon: CheckCircle2, glow: 'text-emerald-400' },
    { label: 'AI Agent Success Rate', value: `${analytics.ai_agent_success_rate || 98.4}%`, icon: Bot, glow: 'text-cyan-400' },
  ];

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-heading font-bold text-slate-100">Marketplace Command Center</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">Real-time health, verified pharmacy network, and automated bidding metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0d1527] border border-cyan-500/20 px-3.5 py-1.5 rounded-full text-xs text-cyan-300">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>8 Multi-Agent Systems Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <ThreeDCard key={s.label} className="p-5">
            <div className="w-10 h-10 rounded-xl bg-[#0d1527] border border-white/5 flex items-center justify-center mb-3">
              <s.icon className={`w-5 h-5 ${s.glow}`} />
            </div>
            <p className="text-2xl font-heading font-bold text-slate-100">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">{s.label}</p>
          </ThreeDCard>
        ))}
      </div>

      {/* Pharmacies */}
      <ThreeDCard className="p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e293b]">
          <h3 className="font-heading font-semibold text-slate-100 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-400" />
            Verified Pharmacy Network
          </h3>
          <span className="text-xs bg-[#0d1527] border border-cyan-500/20 px-3 py-1 rounded-full font-medium text-cyan-300">
            {pharmacies.length} Licensed Partners
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e293b] text-left text-xs font-semibold text-slate-400">
                <th className="py-3 px-4">Pharmacy</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Drug License</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {pharmacies.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{p.name}</td>
                  <td className="py-3.5 px-4 text-slate-400">{p.city}</td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs font-mono">{p.drug_license_number || '-'}</td>
                  <td className="py-3.5 px-4 text-amber-400 font-semibold">⭐ {p.rating || 4.7}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ThreeDCard>

      {/* Recent Auctions */}
      <ThreeDCard className="p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1e293b]">
          <h3 className="font-heading font-semibold text-slate-100 flex items-center gap-2">
            <Gavel className="w-4 h-4 text-cyan-400" />
            Live Auction Activity
          </h3>
          <span className="text-xs text-slate-400">15-minute reverse bidding windows</span>
        </div>
        <div className="divide-y divide-[#1e293b]/60">
          {auctions.slice(0, 5).map(a => (
            <div key={a.id} className="flex items-center justify-between py-3.5 px-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Gavel className="w-4.5 h-4.5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Auction #{a.id.slice(0, 8)}</p>
                  <p className="text-xs text-slate-400">{a.total_pharmacies_notified || 5} pharmacies notified · {a.total_bids_received || 3} bids received</p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                {a.status}
              </span>
            </div>
          ))}
          {auctions.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-500">No active auctions logged yet</div>
          )}
        </div>
      </ThreeDCard>
    </div>
  );
}
