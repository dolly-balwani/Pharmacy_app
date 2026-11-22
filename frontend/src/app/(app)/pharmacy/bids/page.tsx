'use client';
import { Gavel } from 'lucide-react';
export default function PharmacyBidsPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div><h1 className="text-2xl font-heading font-bold text-medibid-text-primary">My Bids</h1>
        <p className="text-sm text-medibid-text-secondary mt-1">Track your submitted bids</p></div>
      <div className="bg-white rounded-2xl border border-medibid-border p-10 text-center">
        <Gavel className="w-10 h-10 text-medibid-border mx-auto mb-3" />
        <p className="text-sm text-medibid-text-secondary">Your submitted bids will appear here. Submit bids from active prescription requests.</p>
      </div>
    </div>
  );
}

