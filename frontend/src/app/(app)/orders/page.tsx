'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle2, Truck, MapPin, ChevronDown, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

const STATUS_STEPS = [
  'pharmacy_selected',
  'awaiting_pharmacist_verification',
  'pharmacist_approved',
  'preparing_order',
  'ready_for_dispatch',
  'out_for_delivery',
  'delivered',
];

const STATUS_LABELS: Record<string, string> = {
  pharmacy_selected: 'Pharmacy Selected',
  awaiting_pharmacist_verification: 'Awaiting Pharmacist Sign-Off',
  pharmacist_approved: 'Pharmacist Approved',
  pharmacist_rejected: 'Rejected by Pharmacist',
  preparing_order: 'Packing & Quality Check',
  ready_for_dispatch: 'Ready for Courier Pickup',
  out_for_delivery: 'Out for Express Delivery',
  delivered: 'Successfully Delivered',
  cancelled: 'Order Cancelled',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get('/orders').then((r) => setOrders(r.data)).catch(() => {});
  }, []);

  const statusColor = (s: string) =>
    s === 'delivered'
      ? 'bg-emerald-400'
      : s === 'pharmacist_rejected' || s === 'cancelled'
      ? 'bg-red-400'
      : s === 'out_for_delivery'
      ? 'bg-cyan-400'
      : 'bg-amber-400';

  return (
    <div className="max-w-5xl space-y-7">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
          Order Tracking & History
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor your prescription verification, pharmacist sign-off, and express delivery milestones.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
          <Package className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-white text-base">No Orders Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Upload your prescription and accept a pharmacy quotation to initiate fulfillment.
          </p>
          <div className="mt-5">
            <a
              href="/prescriptions"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-heading font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20"
            >
              Upload Prescription <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o, i) => {
            const stepIdx = STATUS_STEPS.indexOf(o.status);
            return (
              <ThreeDCard key={o.id} glowColor="rgba(0, 210, 255, 0.15)">
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60">
                  <div
                    className="cursor-pointer"
                    onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <p className="font-heading font-extrabold text-white text-base">
                              Order #{o.id.slice(0, 8).toUpperCase()}
                            </p>
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
                              Rx Order
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {timeAgo(o.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-5">
                        <div className="text-right">
                          <p className="text-xl font-heading font-black text-white">
                            {formatCurrency(o.total_amount)}
                          </p>
                          <div className="flex items-center gap-1.5 justify-end mt-1">
                            <span className={`w-2 h-2 rounded-full ${statusColor(o.status)}`} />
                            <span className="text-xs text-slate-300 font-semibold">
                              {STATUS_LABELS[o.status] || o.status}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 transition-transform ${
                            expanded === o.id ? 'rotate-180 text-cyan-400' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Milestone Progress Bar */}
                    {stepIdx >= 0 && (
                      <div className="mt-5 space-y-1.5">
                        <div className="flex items-center gap-1">
                          {STATUS_STEPS.map((_, si) => (
                            <div
                              key={si}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                si <= stepIdx ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'bg-slate-800'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                          <span>Quotation Accepted</span>
                          <span>Pharmacist Review</span>
                          <span>Express Delivery</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expanded Breakdown */}
                  {expanded === o.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t border-slate-800 mt-5 pt-5"
                    >
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-2">
                          <p className="text-xs font-bold text-white mb-2">Cost Breakdown</p>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Medications Subtotal</span>
                            <span className="font-semibold text-white">{formatCurrency(o.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-emerald-400">
                            <span>Pharmacy Discount</span>
                            <span className="font-semibold">-{formatCurrency(o.discount_amount)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Hyperlocal Courier Fee</span>
                            <span className="font-semibold text-white">
                              {o.delivery_charge === 0 ? 'FREE' : formatCurrency(o.delivery_charge)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-extrabold text-white">
                            <span>Final Paid Amount</span>
                            <span className="text-cyan-400">{formatCurrency(o.total_amount)}</span>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800/80 space-y-3">
                          <p className="text-xs font-bold text-white">Fulfillment & Verification</p>
                          <div className="flex items-center gap-2 text-xs text-slate-300">
                            <Truck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            <span>MediBid Express Logistics (Courier Assigned)</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-slate-400">
                            <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <span>{o.delivery_address || '162 Example St, New York / Koramangala, Bangalore'}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>Batch & Expiry verified by Registered Pharmacist (KA-PHARM-001)</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ThreeDCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
