'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Store, Gavel, Package, TrendingUp, Bot, Shield, BarChart3, ArrowRight, CheckCircle2, XCircle, Clock } from 'lucide-react';
import api from '@/lib/api';

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
    { label: 'Total Customers', value: analytics.total_customers || 0, icon: Users, color: 'bg-medibid-soft-blue text-medibid-brand' },
    { label: 'Verified Pharmacies', value: `${analytics.verified_pharmacies || 0}/${analytics.total_pharmacies || 0}`, icon: Store, color: 'bg-medibid-mint text-medibid-success' },
    { label: 'Active Auctions', value: analytics.active_auctions || 0, icon: Gavel, color: 'bg-medibid-lavender text-purple-600' },
    { label: 'Total Orders', value: analytics.total_orders || 0, icon: Package, color: 'bg-amber-50 text-amber-600' },
    { label: 'Completed Orders', value: analytics.completed_orders || 0, icon: CheckCircle2, color: 'bg-medibid-mint text-medibid-success' },
    { label: 'AI Success Rate', value: `${analytics.ai_agent_success_rate || 0}%`, icon: Bot, color: 'bg-medibid-soft-blue text-medibid-brand' },
  ];

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-medibid-text-primary">Admin Dashboard</h1>
        <p className="text-sm text-medibid-text-secondary mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl border border-medibid-border p-5 hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-4.5 h-4.5" /></div>
            <p className="text-2xl font-heading font-bold text-medibid-text-primary">{s.value}</p>
            <p className="text-xs text-medibid-text-secondary mt-0.5 font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Pharmacies */}
      <div className="bg-white rounded-2xl border border-medibid-border">
        <div className="px-6 py-4 border-b border-medibid-border flex items-center justify-between">
          <h3 className="font-heading font-semibold text-medibid-text-primary">Registered Pharmacies</h3>
          <span className="text-xs bg-medibid-bg px-3 py-1 rounded-full font-medium text-medibid-text-secondary">{pharmacies.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-medibid-bg/70"><th className="px-5 py-3 text-left text-xs font-semibold text-medibid-text-secondary">Name</th><th className="px-5 py-3 text-left text-xs font-semibold text-medibid-text-secondary">City</th><th className="px-5 py-3 text-left text-xs font-semibold text-medibid-text-secondary">License</th><th className="px-5 py-3 text-left text-xs font-semibold text-medibid-text-secondary">Rating</th><th className="px-5 py-3 text-left text-xs font-semibold text-medibid-text-secondary">Status</th></tr></thead>
            <tbody className="divide-y divide-medibid-border">
              {pharmacies.map(p => (
                <tr key={p.id} className="hover:bg-medibid-bg/30">
                  <td className="px-5 py-3.5 font-semibold text-medibid-text-primary">{p.name}</td>
                  <td className="px-5 py-3.5 text-medibid-text-secondary">{p.city}</td>
                  <td className="px-5 py-3.5 text-medibid-text-secondary text-xs font-mono">{p.drug_license_number || '-'}</td>
                  <td className="px-5 py-3.5"><span className="font-semibold">⭐ {p.rating || 4.0}</span></td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.verification_status === 'verified' ? 'bg-medibid-mint text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {p.verification_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Auctions */}
      <div className="bg-white rounded-2xl border border-medibid-border">
        <div className="px-6 py-4 border-b border-medibid-border"><h3 className="font-heading font-semibold text-medibid-text-primary">Recent Auctions</h3></div>
        <div className="divide-y divide-medibid-border">
          {auctions.slice(0, 5).map(a => (
            <div key={a.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-medibid-soft-blue flex items-center justify-center"><Gavel className="w-4.5 h-4.5 text-medibid-brand" /></div>
                <div>
                  <p className="text-sm font-semibold text-medibid-text-primary">Auction #{a.id.slice(0, 8)}</p>
                  <p className="text-xs text-medibid-text-secondary">{a.total_pharmacies_notified} pharmacies · {a.total_bids_received} bids</p>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${a.status === 'active' ? 'bg-medibid-soft-blue text-medibid-brand' : a.status === 'completed' ? 'bg-medibid-mint text-green-700' : 'bg-medibid-bg text-medibid-text-secondary'}`}>{a.status}</span>
            </div>
          ))}
          {auctions.length === 0 && <div className="p-8 text-center text-sm text-medibid-text-secondary">No auctions yet</div>}
        </div>
      </div>
    </div>
  );
}

