'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Gavel, TrendingUp, Users, Clock, ArrowRight, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';

export default function PharmacyDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data)).catch(() => {});
    api.get('/auctions').then(r => setAuctions(r.data)).catch(() => {});
  }, []);

  const activeAuctions = auctions.filter(a => a.status === 'active');
  const wonAuctions = auctions.filter(a => a.status === 'completed');
  const pendingOrders = orders.filter(o => o.status === 'awaiting_pharmacist_verification');

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-medibid-text-primary">Pharmacy Dashboard</h1>
        <p className="text-sm text-medibid-text-secondary mt-1">Manage your pharmacy operations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Auctions', value: activeAuctions.length, icon: Gavel, color: 'bg-medibid-soft-blue text-medibid-brand' },
          { label: 'Pending Verification', value: pendingOrders.length, icon: AlertCircle, color: 'bg-amber-50 text-amber-600' },
          { label: 'Total Orders', value: orders.length, icon: Package, color: 'bg-medibid-mint text-medibid-success' },
          { label: 'Win Rate', value: '67%', icon: Award, color: 'bg-medibid-lavender text-purple-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl border border-medibid-border p-5 hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}><s.icon className="w-4.5 h-4.5" /></div>
            <p className="text-2xl font-heading font-bold text-medibid-text-primary">{s.value}</p>
            <p className="text-xs text-medibid-text-secondary mt-0.5 font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Pending Verifications */}
      {pendingOrders.length > 0 && (
        <div className="bg-white rounded-2xl border border-medibid-border">
          <div className="px-6 py-4 border-b border-medibid-border flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h3 className="font-heading font-semibold text-medibid-text-primary">Pending Pharmacist Verification</h3>
          </div>
          <div className="divide-y divide-medibid-border">
            {pendingOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-medibid-text-primary">Order #{o.id.slice(0, 8)}</p>
                  <p className="text-xs text-medibid-text-secondary">{formatCurrency(o.total_amount)} · {timeAgo(o.created_at)}</p>
                </div>
                <button onClick={async () => {
                  await api.post(`/orders/${o.id}/pharmacist-approval`, { pharmacist_name: "Dr. Anand Reddy (Demo)", registration_number: "KA-PHARM-001", notes: "Verified - all medicines approved" });
                  api.get('/orders').then(r => setOrders(r.data)).catch(() => {});
                }} className="px-4 py-2 bg-medibid-success text-white rounded-xl text-xs font-semibold hover:bg-green-700 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-medibid-border">
        <div className="px-6 py-4 border-b border-medibid-border">
          <h3 className="font-heading font-semibold text-medibid-text-primary">Recent Orders</h3>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center">
            <Package className="w-10 h-10 text-medibid-border mx-auto mb-3" />
            <p className="text-sm text-medibid-text-secondary">No orders yet. Wait for auction wins!</p>
          </div>
        ) : (
          <div className="divide-y divide-medibid-border">
            {orders.map(o => (
              <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-medibid-bg/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-medibid-soft-blue flex items-center justify-center"><Package className="w-4.5 h-4.5 text-medibid-brand" /></div>
                  <div>
                    <p className="text-sm font-semibold text-medibid-text-primary">#{o.id.slice(0, 8)}</p>
                    <p className="text-xs text-medibid-text-secondary">{timeAgo(o.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(o.total_amount)}</p>
                  <span className="text-xs text-medibid-text-secondary">{o.status.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

