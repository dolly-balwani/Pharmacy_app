'use client';
import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

export default function AdminCompliancePage() {
  const [exceptions, setExceptions] = useState<any[]>([]);
  useEffect(() => { api.get('/admin/compliance-exceptions').then(r => setExceptions(r.data)).catch(() => {}); }, []);

  return (
    <div className="max-w-6xl space-y-6">
      <div><h1 className="text-2xl font-heading font-bold text-medibid-text-primary">Compliance Queue</h1>
        <p className="text-sm text-medibid-text-secondary mt-1">Review compliance exceptions and flags</p></div>
      {exceptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-medibid-border p-10 text-center">
          <Shield className="w-12 h-12 text-medibid-success mx-auto mb-3" />
          <h3 className="font-heading font-bold text-medibid-text-primary mb-1">All Clear</h3>
          <p className="text-sm text-medibid-text-secondary">No compliance exceptions to review at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exceptions.map(e => (
            <div key={e.id} className={`bg-white rounded-xl border p-5 ${e.severity === 'high' ? 'border-red-200' : 'border-medibid-border'}`}>
              <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${e.severity === 'high' ? 'text-medibid-error' : 'text-medibid-warning'}`} />
                <div>
                  <p className="font-semibold text-medibid-text-primary text-sm">{e.exception_type}</p>
                  <p className="text-xs text-medibid-text-secondary mt-1">{e.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${e.severity === 'high' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{e.severity}</span>
                    {e.is_resolved && <span className="text-medibid-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />Resolved</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

