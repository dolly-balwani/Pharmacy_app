'use client';
import React, { useEffect, useState } from 'react';
import { Gavel, Clock, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { timeAgo } from '@/lib/utils';

export default function PharmacyRequestsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  useEffect(() => { api.get('/auctions').then(r => setAuctions(r.data.filter((a: any) => a.status === 'active'))).catch(() => {}); }, []);

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-medibid-text-primary">Incoming Requests</h1>
        <p className="text-sm text-medibid-text-secondary mt-1">Prescription requests from nearby customers</p>
      </div>
      {auctions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-medibid-border p-10 text-center">
          <AlertCircle className="w-10 h-10 text-medibid-border mx-auto mb-3" />
          <p className="text-sm text-medibid-text-secondary">No active prescription requests at this time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {auctions.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-medibid-border p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-medibid-soft-blue flex items-center justify-center"><Gavel className="w-5 h-5 text-medibid-brand" /></div>
                  <div>
                    <p className="font-semibold text-medibid-text-primary text-sm">Prescription Request #{a.id.slice(0,8)}</p>
                    <p className="text-xs text-medibid-text-secondary"><Clock className="w-3 h-3 inline mr-1" />{a.duration_minutes} min auction · {a.total_bids_received} bids so far</p>
                  </div>
                </div>
                <a href={`/auctions?prescription_id=${a.prescription_id}`} className="px-4 py-2 bg-medibid-brand text-white rounded-xl text-xs font-semibold hover:bg-blue-700">Submit Bid</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

