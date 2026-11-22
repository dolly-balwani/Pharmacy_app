'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Clock, Users, TrendingDown, CheckCircle2, AlertCircle, Package, Sparkles, ArrowRight, Timer, Award, MapPin, Star, Truck, Zap, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

function AuctionsContent() {
  const params = useSearchParams();
  const prescriptionId = params.get('prescription_id');
  const [auctions, setAuctions] = useState<any[]>([]);
  const [activeAuction, setActiveAuction] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedBid, setSelectedBid] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    loadAuctions();
  }, []);

  useEffect(() => {
    if (!activeAuction?.end_time) return;
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(activeAuction.end_time).getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeAuction]);

  async function loadAuctions() {
    try {
      const { data } = await api.get('/auctions');
      setAuctions(data);
      if (prescriptionId) {
        const matching = data.find((a: any) => a.prescription_id === prescriptionId);
        if (matching) {
          setActiveAuction(matching);
          return;
        }
      }
      const active = data.find((a: any) => a.status === 'active');
      if (active) {
        setActiveAuction(active);
        return;
      }
      const completed = data.find((a: any) => a.status === 'completed');
      if (completed) setActiveAuction(completed);
    } catch {}
  }

  async function createAuction() {
    if (!prescriptionId) return;
    setCreating(true);
    try {
      const { data } = await api.post('/auctions', {
        prescription_id: prescriptionId,
        customer_latitude: 12.9352,
        customer_longitude: 77.6245,
        duration_minutes: 15,
        search_radius_km: 2.0,
      });
      setActiveAuction(data);
      setAuctions((prev) => [data, ...prev]);
    } catch {} finally {
      setCreating(false);
    }
  }

  async function selectWinner(bidId: string) {
    if (!activeAuction) return;
    setSelecting(true);
    try {
      await api.post(`/auctions/${activeAuction.id}/select-winner?bid_id=${bidId}`);
      await api.post('/orders', {
        auction_id: activeAuction.id,
        bid_id: bidId,
        delivery_address: '162 Example St, New York, NY / 42 MG Road, Koramangala',
      });
      await loadAuctions();
    } catch {} finally {
      setSelecting(false);
    }
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="max-w-5xl space-y-7">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5" /> Live Reverse Bidding Protocol
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            Pharmacy Bidding Room
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Local verified pharmacies submit itemized quotations. Compare discounts, ratings, and delivery times.
          </p>
        </div>

        {prescriptionId && !activeAuction && (
          <button
            onClick={createAuction}
            disabled={creating}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-heading font-extrabold text-sm rounded-xl shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all disabled:opacity-50"
          >
            {creating ? (
              <span className="animate-pulse">Broadcasting Request...</span>
            ) : (
              <>
                <Gavel className="w-4 h-4" /> Start Reverse Auction
              </>
            )}
          </button>
        )}
      </div>

      {/* Active Auction Section */}
      {activeAuction && (
        <div className="space-y-6">
          {/* Real-Time Telemetry Bar */}
          <div className="glass-card-glow rounded-3xl p-6 border border-cyan-500/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-inner">
                <Timer className="w-5 h-5 text-cyan-400 mx-auto mb-1 animate-pulse" />
                <div className="text-3xl font-heading font-black text-cyan-300 tracking-tight font-mono">
                  {activeAuction.status === 'active'
                    ? `${mins}:${secs.toString().padStart(2, '0')}`
                    : 'CLOSED'}
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Auction Timer</p>
              </div>

              <div className="text-center p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-inner">
                <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <div className="text-3xl font-heading font-black text-emerald-300 tracking-tight">
                  {activeAuction.total_pharmacies_notified || 4}
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Chemists Notified</p>
              </div>

              <div className="text-center p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-inner">
                <Gavel className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                <div className="text-3xl font-heading font-black text-purple-300 tracking-tight">
                  {activeAuction.total_bids_received || activeAuction.bids?.length || 0}
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Bids Received</p>
              </div>

              <div className="text-center p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-inner">
                <TrendingDown className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                <div className="text-3xl font-heading font-black text-amber-300 tracking-tight">
                  {activeAuction.bids?.length > 0
                    ? formatCurrency(Math.min(...activeAuction.bids.map((b: any) => b.total_price)))
                    : '—'}
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">Lowest Quote</p>
              </div>
            </div>
          </div>

          {/* Incoming Bids Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                </span>
                Competing Pharmacy Quotations
              </h3>
              <span className="text-xs text-slate-400">
                Sorted by lowest total quotation
              </span>
            </div>

            {activeAuction.bids?.length > 0 ? (
              <div className="space-y-4">
                {[...activeAuction.bids]
                  .sort((a: any, b: any) => a.total_price - b.total_price)
                  .map((bid: any, i: number) => {
                    const isLowest = i === 0;
                    const isWinner = bid.is_winner;
                    return (
                      <ThreeDCard
                        key={bid.id}
                        glowColor={isWinner ? 'rgba(16, 185, 129, 0.4)' : isLowest ? 'rgba(0, 210, 255, 0.3)' : 'rgba(255, 255, 255, 0.08)'}
                      >
                        <div className={`p-6 rounded-2xl border transition-all ${
                          isWinner
                            ? 'border-emerald-500 bg-emerald-950/20'
                            : isLowest
                            ? 'border-cyan-500/50 bg-slate-900/60'
                            : 'border-slate-800 bg-slate-900/40'
                        }`}>
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                            <div className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                isWinner
                                  ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400'
                                  : isLowest
                                  ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-400'
                                  : 'bg-slate-800 border border-slate-700 text-slate-400'
                              }`}>
                                {isWinner ? (
                                  <ShieldCheck className="w-6 h-6" />
                                ) : isLowest ? (
                                  <Award className="w-6 h-6" />
                                ) : (
                                  <Package className="w-6 h-6" />
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <h4 className="font-heading font-extrabold text-white text-base">
                                    {bid.pharmacy_name || 'Verified Chemist'}
                                  </h4>
                                  {isLowest && !isWinner && (
                                    <span className="text-[10px] bg-cyan-950 border border-cyan-500/50 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                                      Lowest Price Guarantee
                                    </span>
                                  )}
                                  {isWinner && (
                                    <span className="text-[10px] bg-emerald-950 border border-emerald-500 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                                      Selected Offer ✓
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                                  <span className="flex items-center gap-1 text-amber-400 font-semibold">
                                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                                    {bid.pharmacy_rating || 4.7}
                                  </span>
                                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                                    <Truck className="w-3.5 h-3.5 text-cyan-400" />
                                    {bid.estimated_delivery_minutes || 25} mins express
                                  </span>
                                  {bid.discount_percentage > 0 && (
                                    <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                                      {bid.discount_percentage}% OFF
                                    </span>
                                  )}
                                  {bid.notes && (
                                    <span className="text-[11px] text-slate-400 italic">
                                      "{bid.notes}"
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                              <div className="text-right">
                                <p className="text-2xl font-heading font-black text-white tracking-tight">
                                  {formatCurrency(bid.total_price)}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {bid.delivery_charge === 0 ? (
                                    <span className="text-emerald-400 font-semibold">Free Delivery</span>
                                  ) : (
                                    `+${formatCurrency(bid.delivery_charge)} courier`
                                  )}
                                </p>
                              </div>

                              {activeAuction.status === 'active' && !isWinner && (
                                <button
                                  onClick={() => selectWinner(bid.id)}
                                  disabled={selecting}
                                  className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-slate-950 font-heading font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all whitespace-nowrap disabled:opacity-50"
                                >
                                  {selecting ? 'Selecting...' : 'Select Offer'}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Line items details */}
                          {bid.items?.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-800/80">
                              <p className="text-[11px] text-slate-400 font-semibold mb-2">Itemized Breakdown:</p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {bid.items.map((item: any) => (
                                  <div
                                    key={item.id}
                                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                                  >
                                    <p className="font-bold text-white truncate">{item.medicine_name}</p>
                                    <div className="flex items-center justify-between mt-1 text-[11px]">
                                      <span className="text-slate-400">{item.brand_offered || 'Standard'} x{item.quantity}</span>
                                      <span className="font-extrabold text-cyan-300">{formatCurrency(item.subtotal)}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </ThreeDCard>
                    );
                  })}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
                <Gavel className="w-12 h-12 text-slate-700 mx-auto mb-3 animate-pulse" />
                <h4 className="font-heading font-bold text-white text-base">
                  Awaiting Incoming Chemist Quotations...
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Prescription broadcast is active across verified pharmacies within 2 km radius. Bids refresh live.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Active Auction State */}
      {!activeAuction && !prescriptionId && (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800">
          <Gavel className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-white text-lg">
            No Active Bidding Session
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Upload a doctor's prescription first to broadcast to nearby pharmacies and receive live competitive bids.
          </p>
          <div className="mt-5">
            <a
              href="/prescriptions"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-heading font-extrabold text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:opacity-95"
            >
              Upload Prescription <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Past Auctions History */}
      {auctions.filter((a) => a.id !== activeAuction?.id).length > 0 && (
        <div className="glass-card rounded-2xl border border-slate-800">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-heading font-bold text-white text-sm">Previous Bidding Sessions</h3>
            <span className="text-xs text-slate-400">
              {auctions.filter((a) => a.id !== activeAuction?.id).length} Sessions
            </span>
          </div>
          <div className="divide-y divide-slate-800/80">
            {auctions
              .filter((a) => a.id !== activeAuction?.id)
              .map((a) => (
                <div
                  key={a.id}
                  onClick={() => setActiveAuction(a)}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                      <Gavel className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        Auction #{a.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-400">
                        {a.total_bids_received || 0} bids received · {a.duration_minutes || 15} min window
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    a.status === 'completed'
                      ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/50'
                      : 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/50'
                  }`}>
                    {a.status === 'completed' ? 'Completed' : a.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuctionsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-400 animate-pulse">Loading Bidding Room...</div>}>
      <AuctionsContent />
    </Suspense>
  );
}
