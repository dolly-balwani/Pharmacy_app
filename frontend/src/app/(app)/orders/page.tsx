'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle2, Truck, MapPin, ArrowRight, ChevronDown } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, formatDate, timeAgo } from '@/lib/utils';

const STATUS_STEPS = ['pharmacy_selected', 'awaiting_pharmacist_verification', 'pharmacist_approved', 'preparing_order', 'ready_for_dispatch', 'out_for_delivery', 'delivered'];
const STATUS_LABELS: Record<string, string> = {
  pharmacy_selected: 'Pharmacy Selected', awaiting_pharmacist_verification: 'Awaiting Verification',
  pharmacist_approved: 'Pharmacist Approved', pharmacist_rejected: 'Rejected',
  preparing_order: 'Preparing', ready_for_dispatch: 'Ready for Dispatch',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { api.get('/orders').then(r => setOrders(r.data)).catch(() => {}); }, []);

  const statusColor = (s: string) => s === 'delivered' ? 'bg-medibid-success' : s === 'pharmacist_rejected' || s === 'cancelled' ? 'bg-medibid-error' : s === 'out_for_delivery' ? 'bg-medibid-brand' : 'bg-medibid-warning';

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-medibid-text-primary">My Orders</h1>
        <p className="text-sm text-medibid-text-secondary mt-1">Track your medicine orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-medibid-border p-10 text-center">
          <Package className="w-12 h-12 text-medibid-border mx-auto mb-4" />
          <h3 className="font-heading font-bold text-medibid-text-primary mb-1">No Orders Yet</h3>
          <p className="text-sm text-medibid-text-secondary">Upload a prescription and select a pharmacy bid to place an order</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o, i) => {
            const stepIdx = STATUS_STEPS.indexOf(o.status);
            return (
              <motion.div key={o.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-medibid-border overflow-hidden">
                <div className="p-5 cursor-pointer" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-medibid-soft-blue flex items-center justify-center">
                        <Package className="w-5 h-5 text-medibid-brand" />
                      </div>
                      <div>
                        <p className="font-heading font-bold text-medibid-text-primary">Order #{o.id.slice(0, 8)}</p>
                        <p className="text-xs text-medibid-text-secondary mt-0.5">{timeAgo(o.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-heading font-bold text-medibid-text-primary">{formatCurrency(o.total_amount)}</p>
                        <div className="flex items-center gap-1.5 justify-end mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${statusColor(o.status)}`} />
                          <span className="text-xs text-medibid-text-secondary font-medium">{STATUS_LABELS[o.status] || o.status}</span>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-medibid-text-secondary transition-transform ${expanded === o.id ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  {/* Progress bar */}
                  {stepIdx >= 0 && (
                    <div className="mt-4 flex items-center gap-1">
                      {STATUS_STEPS.map((_, si) => (
                        <div key={si} className={`h-1.5 flex-1 rounded-full ${si <= stepIdx ? 'bg-medibid-brand' : 'bg-medibid-border'}`} />
                      ))}
                    </div>
                  )}
                </div>
                {expanded === o.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-medibid-border px-5 pb-5">
                    <div className="grid md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-3">
                        <div className="p-3 bg-medibid-bg rounded-xl">
                          <p className="text-xs text-medibid-text-secondary font-medium mb-1">Order Details</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-medibid-text-secondary">Subtotal</span><span className="font-semibold">{formatCurrency(o.subtotal)}</span></div>
                            <div className="flex justify-between"><span className="text-medibid-text-secondary">Discount</span><span className="font-semibold text-medibid-success">-{formatCurrency(o.discount_amount)}</span></div>
                            <div className="flex justify-between"><span className="text-medibid-text-secondary">Delivery</span><span className="font-semibold">{formatCurrency(o.delivery_charge)}</span></div>
                            <div className="flex justify-between pt-2 border-t border-medibid-border"><span className="font-semibold">Total</span><span className="font-bold text-medibid-brand">{formatCurrency(o.total_amount)}</span></div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-medibid-bg rounded-xl">
                        <p className="text-xs text-medibid-text-secondary font-medium mb-2">Delivery Status</p>
                        <div className="flex items-center gap-2 text-sm text-medibid-text-primary">
                          <Truck className="w-4 h-4 text-medibid-brand" />
                          <span className="font-medium">MediBid Express (Demo)</span>
                        </div>
                        {o.delivery_address && (
                          <div className="flex items-start gap-2 text-xs text-medibid-text-secondary mt-2">
                            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <span>{o.delivery_address}</span>
                          </div>
                        )}
                        <p className="text-xs text-amber-600 mt-2 font-medium">🔬 Simulated delivery tracking</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

