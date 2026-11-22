'use client';
import React, { useEffect, useState } from 'react';
import { Store, CheckCircle2, XCircle, Clock } from 'lucide-react';
import api from '@/lib/api';

export default function AdminPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  useEffect(() => { api.get('/admin/pharmacies').then(r => setPharmacies(r.data)).catch(() => {}); }, []);

  return (
    <div className="max-w-6xl space-y-6">
      <div><h1 className="text-2xl font-heading font-bold text-medibid-text-primary">Pharmacy Management</h1>
        <p className="text-sm text-medibid-text-secondary mt-1">Review and manage pharmacy registrations</p></div>
      <div className="bg-white rounded-2xl border border-medibid-border overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="bg-medibid-bg/70"><th className="px-5 py-3 text-left text-xs font-semibold text-medibid-text-secondary">Pharmacy</th><th className="px-5 py-3 text-left text-xs font-semibold text-medibid-text-secondary">City</th><th className="px-5 py-3 text-left text-xs font-semibold text-medibid-text-secondary">License</th><th className="px-5 py-3 text-left text-xs font-semibold text-medibid-text-secondary">Rating</th><th className="px-5 py-3 text-left text-xs font-semibold text-medibid-text-secondary">Status</th></tr></thead>
          <tbody className="divide-y divide-medibid-border">
            {pharmacies.map(p => (
              <tr key={p.id} className="hover:bg-medibid-bg/30">
                <td className="px-5 py-3.5 font-semibold">{p.name}</td>
                <td className="px-5 py-3.5 text-medibid-text-secondary">{p.city}</td>
                <td className="px-5 py-3.5 text-medibid-text-secondary text-xs font-mono">{p.drug_license_number || '-'}</td>
                <td className="px-5 py-3.5">⭐ {p.rating}</td>
                <td className="px-5 py-3.5"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.verification_status === 'verified' ? 'bg-medibid-mint text-green-700' : 'bg-amber-50 text-amber-700'}`}>{p.verification_status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

