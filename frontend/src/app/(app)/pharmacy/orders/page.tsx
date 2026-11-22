'use client';
import React, { useEffect, useState } from 'react';
import { Package, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';

export default function PharmacyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => { api.get('/orders').then(r => setOrders(r.data)).catch(() => {}); }, []);

  return (
    <div className="max-w-5xl space-y-6">
      <div><h1 className="text-2xl font-heading font-bold text-medibid-text-primary">Orders</h1>
        <p className="text-sm text-medibid-text-secondary mt-1">Manage your pharmacy orders</p></div>
      <div className="bg-white rounded-2xl border border-medibid-border">
        {orders.length === 0 ? (
          <div className="p-10 text-center"><Package className="w-10 h-10 text-medibid-border mx-auto mb-3" /><p className="text-sm text-medibid-text-secondary">No orders yet</p></div>
        ) : (
          <div className="divide-y divide-medibid-border">
            {orders.map(o => (
              <div key={o.id} className="flex items-center justify-between px-6 py-4 hover:bg-medibid-bg/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-medibid-soft-blue flex items-center justify-center"><Package className="w-4.5 h-4.5 text-medibid-brand" /></div>
                  <div><p className="text-sm font-semibold">#{o.id.slice(0,8)}</p><p className="text-xs text-medibid-text-secondary">{timeAgo(o.created_at)}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">{formatCurrency(o.total_amount)}</span>
                  {o.status === 'awaiting_pharmacist_verification' && (
                    <button onClick={async () => {
                      await api.post(`/orders/${o.id}/pharmacist-approval`, { pharmacist_name: "Demo Pharmacist", registration_number: "KA-PHARM-001" });
                      api.get('/orders').then(r => setOrders(r.data));
                    }} className="px-3 py-1.5 bg-medibid-success text-white rounded-lg text-xs font-semibold hover:bg-green-700">
                      <CheckCircle2 className="w-3 h-3 inline mr-1" />Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

