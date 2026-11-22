'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gavel, Clock, Users, TrendingDown, CheckCircle2, AlertCircle, Package, Sparkles, ArrowRight, Timer, Award, MapPin, Star, Truck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

function AuctionsContent() {
  const params = useSearchParams();
  const prescriptionId = params.get('prescription_id');
  const [auctions, setAuctions] = useState<any[]>([]);
  const [activeAuction, setActiveAuction] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedBid, setSelectedBid] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => { loadAuctions(); }, []);
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
      const active = data.find((a: any) => a.status === 'active');
      if (active) { setActiveAuction(active); return; }
      const completed = data.find((a: any) => a.status === 'completed');
      if (completed) setActiveAuction(completed);
    } catch {}
  }

  async function createAuction() {
    if (!prescriptionId) return;
    setCreating(true);
    try {
      const { data } = await api.post('/auctions', {
        prescription_id: prescriptionId, customer_latitude: 12.9352, customer_longitude: 77.6245,
        duration_minutes: 15, search_radius_km: 2.0,
      });
      setActiveAuction(data); setAuctions(prev => [data, ...prev]);
      // Simulate bids arriving
      setTimeout(() => loadAuctions(), 3000);
    } catch {}
    finally { setCreating(false); }
  }

  async function selectWinner(bidId: string) {
    if (!activeAuction) return;
    setSelecting(true);
    try {
      await api.post(`/auctions/${activeAuction.id}/select-winner?bid_id=${bidId}`);
      // Create order
      await api.post('/orders', { auction_id: activeAuction.id, bid_id: bidId, delivery_address: '42, MG Road, Koramangala, Bangalore' });
      loadAuctions();
    } catch {}
    finally { setSelecting(false); }
  }

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-medibid-text-primary">Bidding Room</h1>
          <p className="text-sm text-medibid-text-secondary mt-1">Watch pharmacies compete for your prescription</p>
        </div>
        {prescriptionId && !activeAuction && (
          <button onClick={createAuction} disabled={creating}
            className="px-5 py-2.5 bg-medibid-brand text-white rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 disabled:opacity-70 shadow-lg shadow-blue-500/20 transition-all">
            {creating ? <><span className="animate-pulse">Starting...</span></> : <><Gavel className="w-4 h-4" />Start Auction</>}
          </button>
        )}
      </div>

      {/* Active Auction */}
      {activeAuction && (
        <div className="space-y-5">
          {/* Status Bar */}
          <div className="bg-white rounded-2xl border border-medibid-border p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-xl bg-medibid-soft-blue">
                <Timer className="w-5 h-5 text-medibid-brand mx-auto mb-1" />
                <div className="text-xl font-heading font-bold text-medibid-brand">
                  {activeAuction.status === 'active' ? `${mins}:${secs.toString().padStart(2, '0')}` : 'Closed'}
                </div>
                <p className="text-xs text-medibid-text-secondary font-medium">Time Left</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-medibid-mint">
                <Users className="w-5 h-5 text-medibid-success mx-auto mb-1" />
                <div className="text-xl font-heading font-bold text-medibid-success">{activeAuction.total_pharmacies_notified}</div>
                <p className="text-xs text-medibid-text-secondary font-medium">Pharmacies Notified</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-medibid-lavender">
                <Gavel className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <div className="text-xl font-heading font-bold text-purple-600">{activeAuction.total_bids_received}</div>
                <p className="text-xs text-medibid-text-secondary font-medium">Bids Received</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-amber-50">
                <TrendingDown className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <div className="text-xl font-heading font-bold text-amber-600">
                  {activeAuction.bids?.length > 0 ? formatCurrency(Math.min(...activeAuction.bids.map((b: any) => b.total_price))) : '—'}
                </div>
                <p className="text-xs text-medibid-text-secondary font-medium">Lowest Bid</p>
              </div>
            </div>
          </div>

          {/* Bids */}
          {activeAuction.bids?.length > 0 ? (
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-medibid-text-primary">Pharmacy Offers</h3>
              {[...activeAuction.bids].sort((a: any, b: any) => a.total_price - b.total_price).map((bid: any, i: number) => {
                const isLowest = i === 0;
                const isWinner = bid.is_winner;
                return (
                  <motion.div key={bid.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className={`bg-white rounded-2xl border p-5 transition-all ${isWinner ? 'border-medibid-success bg-medibid-mint/20 shadow-md' : selectedBid === bid.id ? 'border-medibid-brand shadow-md' : 'border-medibid-border hover:shadow-md hover:border-medibid-brand/30'}`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isLowest ? 'bg-medibid-mint' : 'bg-medibid-bg'}`}>
                          {isLowest && !isWinner ? <Award className="w-6 h-6 text-medibid-success" /> : isWinner ? <CheckCircle2 className="w-6 h-6 text-medibid-success" /> : <Package className="w-6 h-6 text-medibid-text-secondary" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-heading font-bold text-medibid-text-primary">{bid.pharmacy_name || 'Pharmacy'}</p>
                            {isLowest && !isWinner && <span className="text-xs bg-medibid-mint text-green-700 px-2 py-0.5 rounded-full font-semibold">Best Price</span>}
                            {isWinner && <span className="text-xs bg-medibid-success text-white px-2 py-0.5 rounded-full font-semibold">Winner ✓</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-medibid-text-secondary">
                            {bid.pharmacy_rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{bid.pharmacy_rating}</span>}
                            <span className="flex items-center gap-1"><Truck className="w-3 h-3" />{bid.estimated_delivery_minutes} min</span>
                            {bid.discount_percentage > 0 && <span className="flex items-center gap-1 text-medibid-success font-semibold">{bid.discount_percentage}% off</span>}
                            {bid.all_medicines_available ? <span className="text-medibid-success font-semibold">All in stock</span> : <span className="text-medibid-warning">Partial stock</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-heading font-bold text-medibid-text-primary">{formatCurrency(bid.total_price)}</p>
                          {bid.delivery_charge > 0 && <p className="text-xs text-medibid-text-secondary">+{formatCurrency(bid.delivery_charge)} delivery</p>}
                        </div>
                        {activeAuction.status === 'active' && !isWinner && (
                          <button onClick={() => selectWinner(bid.id)} disabled={selecting}
                            className="px-4 py-2.5 bg-medibid-brand text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-70 transition-all whitespace-nowrap shadow-sm">
                            Select
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Medicine items */}
                    {bid.items?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-medibid-border">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {bid.items.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between bg-medibid-bg rounded-lg px-3 py-2">
                              <div>
                                <p className="text-xs font-semibold text-medibid-text-primary truncate">{item.medicine_name}</p>
                                <p className="text-xs text-medibid-text-secondary">x{item.quantity}</p>
                              </div>
                              <p className="text-xs font-bold text-medibid-text-primary ml-2">{formatCurrency(item.subtotal)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-medibid-border p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-medibid-soft-blue flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
                <Sparkles className="w-7 h-7 text-medibid-brand" />
              </div>
              <h3 className="font-heading font-bold text-medibid-text-primary mb-1">Waiting for Bids</h3>
              <p className="text-sm text-medibid-text-secondary max-w-sm mx-auto">Nearby pharmacies have been notified. Bids will appear here in real-time.</p>
            </div>
          )}
        </div>
      )}

      {/* No Active Auction */}
      {!activeAuction && !prescriptionId && (
        <div className="bg-white rounded-2xl border border-medibid-border p-10 text-center">
          <Gavel className="w-12 h-12 text-medibid-border mx-auto mb-4" />
          <h3 className="font-heading font-bold text-medibid-text-primary mb-1">No Active Auctions</h3>
          <p className="text-sm text-medibid-text-secondary mb-4">Upload a prescription first to start a pharmacy auction</p>
          <a href="/prescriptions" className="inline-flex items-center gap-2 px-5 py-2.5 bg-medibid-brand text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/20">
            Upload Prescription <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Past Auctions */}
      {auctions.filter(a => a.id !== activeAuction?.id).length > 0 && (
        <div className="bg-white rounded-2xl border border-medibid-border">
          <div className="px-6 py-4 border-b border-medibid-border"><h3 className="font-heading font-semibold text-medibid-text-primary">Past Auctions</h3></div>
          <div className="divide-y divide-medibid-border">
            {auctions.filter(a => a.id !== activeAuction?.id).map(a => (
              <div key={a.id} className="flex items-center justify-between px-6 py-4 hover:bg-medibid-bg/50 transition-colors cursor-pointer" onClick={() => setActiveAuction(a)}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-medibid-soft-blue flex items-center justify-center"><Gavel className="w-4.5 h-4.5 text-medibid-brand" /></div>
                  <div>
                    <p className="text-sm font-semibold text-medibid-text-primary">Auction #{a.id.slice(0, 8)}</p>
                    <p className="text-xs text-medibid-text-secondary">{a.total_bids_received} bids · {a.total_pharmacies_notified} pharmacies</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${a.status === 'completed' ? 'bg-medibid-mint text-green-700' : a.status === 'active' ? 'bg-medibid-soft-blue text-medibid-brand' : 'bg-medibid-bg text-medibid-text-secondary'}`}>
                  {a.status}
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
    <Suspense fallback={<div className="p-10 text-center text-sm text-medibid-text-secondary">Loading Bidding Room...</div>}>
      <AuctionsContent />
    </Suspense>
  );
}

