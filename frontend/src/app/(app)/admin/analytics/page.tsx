'use client';
import React from 'react';
import { BarChart3 } from 'lucide-react';
export default function AdminAnalyticsPage() {
  return (
    <div className="max-w-6xl space-y-6">
      <div><h1 className="text-2xl font-heading font-bold text-medibid-text-primary">Analytics</h1>
        <p className="text-sm text-medibid-text-secondary mt-1">Platform metrics and insights</p></div>
      <div className="bg-white rounded-2xl border border-medibid-border p-10 text-center">
        <BarChart3 className="w-12 h-12 text-medibid-border mx-auto mb-3" />
        <h3 className="font-heading font-bold text-medibid-text-primary mb-1">Analytics Dashboard</h3>
        <p className="text-sm text-medibid-text-secondary">Charts and detailed analytics will be available after sufficient demo data is generated.</p>
      </div>
    </div>
  );
}

