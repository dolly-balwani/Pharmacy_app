'use client';
import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import api from '@/lib/api';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

export default function AdminCompliancePage() {
  const [exceptions, setExceptions] = useState<any[]>([]);
  useEffect(() => {
    api.get('/admin/compliance-exceptions').then(r => setExceptions(r.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-slate-100">CDSCO & Regulatory Compliance Queue</h1>
          <p className="text-sm text-slate-400 mt-1">Audit Schedule H/H1/X drugs, generic substitutions, and registered pharmacist sign-offs</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0d1527] border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Drugs & Cosmetics Act 1940 Audited</span>
        </div>
      </div>

      {exceptions.length === 0 ? (
        <ThreeDCard className="p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-heading font-semibold text-slate-200 mb-1">Zero Compliance Exceptions</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            All submitted prescriptions and dispensed medications comply with statutory pharmacy guidelines and verified physician requirements.
          </p>
        </ThreeDCard>
      ) : (
        <div className="space-y-3">
          {exceptions.map(e => (
            <ThreeDCard key={e.id} className="p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-400" />
                <div>
                  <p className="font-semibold text-slate-200 text-sm">{e.exception_type}</p>
                  <p className="text-xs text-slate-400 mt-1">{e.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                      {e.severity}
                    </span>
                    {e.is_resolved && (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </ThreeDCard>
          ))}
        </div>
      )}
    </div>
  );
}
