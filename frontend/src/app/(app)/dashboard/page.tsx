'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Upload, Gavel, Package, TrendingDown, MapPin, ArrowRight, Sparkles, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data.slice(0, 5))).catch(() => {});
    api.get('/auctions').then(r => setAuctions(r.data.filter((a: any) => a.status === 'active'))).catch(() => {});
  }, []);

  const statusColor: Record<string, string> = {
    delivered: 'bg-medibid-success', out_for_delivery: 'bg-medibid-brand', pharmacist_approved: 'bg-medibid-warning',
    awaiting_pharmacist_verification: 'bg-amber-400', preparing_order: 'bg-medibid-warning', pharmacy_selected: 'bg-medibid-accent',
  };
  const statusLabel: Record<string, string> = {
    delivered: 'Delivered', out_for_delivery: 'In Transit', pharmacist_approved: 'Approved',
    awaiting_pharmacist_verification: 'Awaiting Verification', preparing_order: 'Preparing', pharmacy_selected: 'Processing',
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Welcome Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-medibid-brand via-blue-600 to-blue-700 rounded-2xl p-7 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-blue-400/10 rounded-full translate-y-1/2 blur-xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wide">AI-Powered Savings</span>
          </div>
          <h2 className="text-2xl font-heading font-bold mb-1.5">Hello, {user?.full_name?.split(' ')[0]} 👋</h2>
          <p className="text-sm text-blue-100 max-w-md mb-5">Upload your prescription and let AI find the best medicine prices from verified pharmacies near you.</p>
          <Link href="/prescriptions" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-medibid-brand font-semibold text-sm rounded-xl hover:bg-blue-50 transition-all shadow-lg">
            <Upload className="w-4 h-4" /> Upload Prescription <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Auctions', value: auctions.length.toString(), icon: Gavel, color: 'bg-medibid-soft-blue text-medibid-brand' },
          { label: 'Total Orders', value: orders.length.toString(), icon: Package, color: 'bg-medibid-mint text-medibid-success' },
          { label: 'Avg. Savings', value: '23%', icon: TrendingDown, color: 'bg-medibid-lavender text-purple-600' },
          { label: 'Nearby Pharmacies', value: '5', icon: MapPin, color: 'bg-amber-50 text-amber-600' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white rounded-xl border border-medibid-border p-5 hover:shadow-md transition-shadow">
            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-2xl font-heading font-bold text-medibid-text-primary">{s.value}</p>
            <p className="text-xs text-medibid-text-secondary mt-0.5 font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { href: '/prescriptions', icon: Upload, title: 'Upload Prescription', desc: 'AI-powered medicine extraction', color: 'bg-medibid-soft-blue text-medibid-brand' },
          { href: '/auctions', icon: Gavel, title: 'Live Bidding Room', desc: 'Watch pharmacies compete', color: 'bg-medibid-mint text-medibid-success' },
          { href: '/orders', icon: Package, title: 'Track Orders', desc: 'Monitor delivery status', color: 'bg-medibid-lavender text-purple-600' },
        ].map(a => (
          <Link key={a.href} href={a.href}>
            <div className="bg-white rounded-xl border border-medibid-border p-5 hover:shadow-md hover:border-medibid-brand/20 transition-all group cursor-pointer">
              <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center mb-3`}>
                <a.icon className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-medibid-text-primary text-sm">{a.title}</h3>
                  <p className="text-xs text-medibid-text-secondary mt-0.5">{a.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-medibid-text-secondary group-hover:text-medibid-brand transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-medibid-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-medibid-border">
          <h3 className="font-heading font-semibold text-medibid-text-primary">Recent Orders</h3>
          <Link href="/orders" className="text-xs text-medibid-brand font-semibold hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
        </div>
        {orders.length === 0 ? (
          <div className="p-10 text-center">
            <Package className="w-10 h-10 text-medibid-border mx-auto mb-3" />
            <p className="text-sm text-medibid-text-secondary">No orders yet. Upload a prescription to get started!</p>
            <Link href="/prescriptions" className="inline-flex items-center gap-1 text-sm text-medibid-brand font-semibold mt-3 hover:underline">
              <Upload className="w-3.5 h-3.5" /> Upload Now
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-medibid-border">
            {orders.map(o => (
              <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-medibid-bg/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-medibid-soft-blue flex items-center justify-center">
                    <Package className="w-4.5 h-4.5 text-medibid-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-medibid-text-primary">Order #{o.id.slice(0, 8)}</p>
                    <p className="text-xs text-medibid-text-secondary">{timeAgo(o.created_at)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-medibid-text-primary">{formatCurrency(o.total_amount)}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusColor[o.status] || 'bg-medibid-text-secondary'}`} />
                    <span className="text-xs text-medibid-text-secondary">{statusLabel[o.status] || o.status}</span>
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

