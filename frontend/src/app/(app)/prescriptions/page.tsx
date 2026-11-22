'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Sparkles, CheckCircle2, Loader2, AlertCircle, ChevronRight, Pill, Microscope, ClipboardCheck, Radio } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

const STEPS = [
  { label: 'Reading prescription', icon: Microscope },
  { label: 'Detecting medicine names', icon: Pill },
  { label: 'Extracting strength & quantity', icon: ClipboardCheck },
  { label: 'Checking prescription details', icon: CheckCircle2 },
  { label: 'Preparing pharmacy requests', icon: Radio },
];

export default function PrescriptionsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [prescription, setPrescription] = useState<any>(null);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadPrescriptions(); }, []);

  async function loadPrescriptions() {
    try { const { data } = await api.get('/prescriptions'); setPrescriptions(data); } catch {}
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f); setError(''); setPrescription(null);
    if (f.type.startsWith('image/')) { const r = new FileReader(); r.onload = () => setPreview(r.result as string); r.readAsDataURL(f); }
    else setPreview(null);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true); setError('');
    try {
      const form = new FormData(); form.append('file', file);
      const { data } = await api.post('/prescriptions/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploading(false); setProcessing(true);
      // Simulate AI processing steps
      for (let i = 0; i < STEPS.length; i++) { setCurrentStep(i); await new Promise(r => setTimeout(r, 800 + Math.random() * 600)); }
      const { data: processed } = await api.post(`/prescriptions/${data.id}/process`);
      setPrescription(processed);
      setProcessing(false); setCurrentStep(-1);
      loadPrescriptions();
    } catch (err: any) { setError(err.response?.data?.detail || 'Upload failed'); setUploading(false); setProcessing(false); }
  }

  const confColor = (c: number) => c >= 0.9 ? 'text-medibid-success' : c >= 0.7 ? 'text-medibid-warning' : 'text-medibid-error';

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-medibid-text-primary">Upload Prescription</h1>
        <p className="text-sm text-medibid-text-secondary mt-1">AI will extract all medicine details automatically</p>
      </div>

      {/* Upload Area */}
      {!processing && !prescription && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-medibid-border p-6">
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-medibid-border rounded-xl p-8 text-center cursor-pointer hover:border-medibid-brand/40 hover:bg-medibid-soft-blue/30 transition-all group">
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,application/pdf" onChange={handleFileSelect} className="hidden" />
            {preview ? (
              <div className="relative inline-block">
                <img src={preview} alt="Preview" className="max-h-56 rounded-xl mx-auto shadow-sm" />
                <button onClick={e => { e.stopPropagation(); setFile(null); setPreview(null); }}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-medibid-soft-blue flex items-center justify-center mx-auto mb-4 group-hover:bg-medibid-brand/10 transition-colors">
                  <Upload className="w-7 h-7 text-medibid-brand" />
                </div>
                <p className="font-semibold text-medibid-text-primary">Drop your prescription here</p>
                <p className="text-sm text-medibid-text-secondary mt-1">or click to browse · JPG, PNG, PDF up to 10MB</p>
              </>
            )}
          </div>
          {file && !preview && <div className="mt-4 flex items-center gap-3 p-3 bg-medibid-bg rounded-xl"><FileText className="w-5 h-5 text-medibid-brand" /><span className="text-sm font-medium">{file.name}</span></div>}
          {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
          {file && (
            <button onClick={handleUpload} disabled={uploading}
              className="mt-4 w-full py-3 bg-medibid-brand text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-70 shadow-lg shadow-blue-500/20 transition-all">
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading...</> : <><Sparkles className="w-4 h-4" />Process with AI</>}
            </button>
          )}
        </motion.div>
      )}

      {/* AI Processing */}
      <AnimatePresence>
        {processing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-medibid-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-medibid-soft-blue flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-medibid-brand animate-pulse" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-medibid-text-primary">AI Processing</h3>
                <p className="text-xs text-medibid-text-secondary">Analyzing your prescription...</p>
              </div>
            </div>
            <div className="space-y-3">
              {STEPS.map((step, i) => {
                const done = i < currentStep; const active = i === currentStep; const pending = i > currentStep;
                return (
                  <motion.div key={step.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${active ? 'bg-medibid-soft-blue border border-medibid-brand/20' : done ? 'bg-medibid-mint/50' : 'bg-medibid-bg'}`}>
                    {done ? <CheckCircle2 className="w-5 h-5 text-medibid-success" /> : active ? <Loader2 className="w-5 h-5 text-medibid-brand animate-spin" /> : <div className="w-5 h-5 rounded-full border-2 border-medibid-border" />}
                    <span className={`text-sm font-medium ${active ? 'text-medibid-brand' : done ? 'text-medibid-success' : 'text-medibid-text-secondary'}`}>{step.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extracted Medicines */}
      {prescription && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-medibid-mint border border-green-200 rounded-2xl p-5 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-medibid-success flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800">Prescription processed successfully</p>
              <p className="text-xs text-green-700 mt-0.5">Dr: {prescription.doctor_name} · {prescription.medicines.length} medicines extracted · <span className="font-medium text-amber-700">DEMO AI FALLBACK</span></p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-medibid-border overflow-hidden">
            <div className="px-6 py-4 border-b border-medibid-border flex items-center justify-between">
              <h3 className="font-heading font-semibold text-medibid-text-primary">Extracted Medicines</h3>
              <span className="text-xs text-medibid-text-secondary bg-medibid-bg px-3 py-1 rounded-full font-medium">{prescription.medicines.length} items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-medibid-bg/70"><th className="px-5 py-3 text-left font-semibold text-medibid-text-secondary text-xs">Medicine</th><th className="px-5 py-3 text-left font-semibold text-medibid-text-secondary text-xs">Brand</th><th className="px-5 py-3 text-left font-semibold text-medibid-text-secondary text-xs">Strength</th><th className="px-5 py-3 text-left font-semibold text-medibid-text-secondary text-xs">Qty</th><th className="px-5 py-3 text-left font-semibold text-medibid-text-secondary text-xs">Dosage</th><th className="px-5 py-3 text-left font-semibold text-medibid-text-secondary text-xs">Confidence</th></tr></thead>
                <tbody className="divide-y divide-medibid-border">
                  {prescription.medicines.map((m: any, i: number) => (
                    <tr key={i} className="hover:bg-medibid-bg/30">
                      <td className="px-5 py-3.5 font-semibold text-medibid-text-primary">{m.medicine_name}{m.schedule_category && <span className="ml-2 text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-medium">Sch. {m.schedule_category}</span>}</td>
                      <td className="px-5 py-3.5 text-medibid-text-secondary">{m.brand_name || '-'}</td>
                      <td className="px-5 py-3.5 text-medibid-text-secondary">{m.strength || '-'}</td>
                      <td className="px-5 py-3.5 font-semibold">{m.quantity || '-'}</td>
                      <td className="px-5 py-3.5 text-medibid-text-secondary text-xs max-w-[200px] truncate">{m.dosage || '-'}</td>
                      <td className="px-5 py-3.5"><span className={`font-bold ${confColor(m.confidence)}`}>{(m.confidence * 100).toFixed(0)}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={`/auctions?prescription_id=${prescription.id}`}
              className="flex-1 py-3 bg-medibid-brand text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
              Start Pharmacy Auction <ChevronRight className="w-4 h-4" />
            </Link>
            <button onClick={() => { setFile(null); setPreview(null); setPrescription(null); }}
              className="px-6 py-3 bg-white border border-medibid-border text-medibid-text-primary rounded-xl font-semibold text-sm hover:bg-medibid-bg transition-all">
              Upload Another
            </button>
          </div>
        </motion.div>
      )}

      {/* Previous Prescriptions */}
      {prescriptions.length > 0 && !processing && (
        <div className="bg-white rounded-2xl border border-medibid-border">
          <div className="px-6 py-4 border-b border-medibid-border"><h3 className="font-heading font-semibold text-medibid-text-primary">Previous Prescriptions</h3></div>
          <div className="divide-y divide-medibid-border">
            {prescriptions.map(rx => (
              <div key={rx.id} className="flex items-center justify-between px-6 py-4 hover:bg-medibid-bg/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-medibid-soft-blue flex items-center justify-center"><FileText className="w-4.5 h-4.5 text-medibid-brand" /></div>
                  <div>
                    <p className="text-sm font-semibold text-medibid-text-primary">RX-{rx.id.slice(0, 8)}</p>
                    <p className="text-xs text-medibid-text-secondary">{rx.medicines.length} medicines · {rx.doctor_name || 'Processing...'}</p>
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${rx.status === 'extracted' ? 'bg-medibid-mint text-green-700' : 'bg-amber-50 text-amber-700'}`}>{rx.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

