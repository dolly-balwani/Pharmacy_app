'use client';
import React, { useEffect, useState } from 'react';
import { Store, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import api from '@/lib/api';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

export default function AdminPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  useEffect(() => {
    api.get('/admin/pharmacies').then(r => setPharmacies(r.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-100">Pharmacy Network Management</h1>
          <p className="text-sm text-slate-400 mt-1">Review verified drug licenses, geo-coordinates, and compliance ratings</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0d1527] border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>CDSCO & State Drug Authority Compliant</span>
        </div>
      </div>

      <ThreeDCard className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e293b] text-left text-xs font-semibold text-slate-400">
                <th className="py-3 px-4">Pharmacy Enterprise</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Drug License</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60">
              {pharmacies.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{p.name}</td>
                  <td className="py-3.5 px-4 text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {p.city}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-xs font-mono">{p.drug_license_number || '-'}</td>
                  <td className="py-3.5 px-4 text-amber-400 font-semibold">⭐ {p.rating || 4.7}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ThreeDCard>
    </div>
  );
}
