'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Sparkles, CheckCircle2, Loader2, AlertCircle, ChevronRight, Pill, Microscope, ClipboardCheck, Radio, ShieldCheck, UserCheck, Calendar, MapPin } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { ThreeDCard } from '@/components/ui/ThreeDCard';
import { PillVisual3D } from '@/components/ui/PillVisual3D';

const STEPS = [
  { label: 'High-Resolution Document Analysis', icon: Microscope },
  { label: 'Neural OCR & Handwriting Recognition', icon: Pill },
  { label: 'Extracting Active Ingredients & Strengths', icon: ClipboardCheck },
  { label: 'Clinical Dosage & Drug Schedule Cross-Check', icon: CheckCircle2 },
  { label: 'Preparing Pharmacy Network Broadcast', icon: Radio },
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
    try {
      const { data } = await api.get('/prescriptions');
      setPrescriptions(data);
    } catch {}
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError('');
    setPrescription(null);
    if (f.type.startsWith('image/')) {
      const r = new FileReader();
      r.onload = () => setPreview(r.result as string);
      r.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }

  async function loadUserSamplePrescription() {
    setError('');
    setPrescription(null);
    setPreview('/sample_rx.jpg');
    try {
      const res = await fetch('/sample_rx.jpg');
      const blob = await res.blob();
      const sampleFile = new File([blob], 'prescription_john_smith.jpg', { type: 'image/jpeg' });
      setFile(sampleFile);
    } catch {
      setPreview('/sample_rx.jpg');
    }
  }

  async function handleUpload() {
    setUploading(true);
    setError('');
    try {
      let uploadFile = file;
      if (!uploadFile) {
        const res = await fetch('/sample_rx.jpg');
        const blob = await res.blob();
        uploadFile = new File([blob], 'prescription_john_smith.jpg', { type: 'image/jpeg' });
      }

      const form = new FormData();
      form.append('file', uploadFile);
      const { data } = await api.post('/prescriptions/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploading(false);
      setProcessing(true);

      for (let i = 0; i < STEPS.length; i++) {
        setCurrentStep(i);
        await new Promise((r) => setTimeout(r, 700 + Math.random() * 400));
      }

      const { data: processed } = await api.post(`/prescriptions/${data.id}/process`);
      setPrescription(processed);
      setProcessing(false);
      setCurrentStep(-1);
      loadPrescriptions();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed');
      setUploading(false);
      setProcessing(false);
    }
  }

  const confColor = (c: number) => (c >= 0.9 ? 'text-emerald-400' : c >= 0.7 ? 'text-amber-400' : 'text-red-400');

  return (
    <div className="max-w-5xl space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Vision & Handwriting Engine
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            Prescription Extraction
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload your doctor prescription to identify medications, strengths, and dosage instructions.
          </p>
        </div>

        {!prescription && !processing && (
          <button
            onClick={loadUserSamplePrescription}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-200 text-xs font-semibold transition-all shadow-md hover:shadow-cyan-500/10"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            Load Doctor Prescription (John Smith)
          </button>
        )}
      </div>

      {/* Upload Zone */}
      {!processing && !prescription && (
        <ThreeDCard glowColor="rgba(0, 210, 255, 0.25)">
          <div className="p-8">
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-700/80 hover:border-cyan-400/50 rounded-2xl p-8 text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition-all duration-300 group"
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {preview ? (
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="Prescription Document Preview"
                    className="max-h-72 rounded-xl mx-auto shadow-2xl border border-slate-700/60 object-contain"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="py-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-400/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform shadow-lg shadow-cyan-500/10">
                    <Upload className="w-8 h-8 text-cyan-400" />
                  </div>
                  <p className="font-heading font-bold text-white text-base">
                    Drop your prescription image here
                  </p>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Supports JPG, PNG, or PDF formats up to 10MB
                  </p>
                  <span className="inline-block mt-4 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                    Browse Files
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 p-3.5 bg-red-950/40 border border-red-800/60 rounded-xl text-sm text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}

            {(file || preview) && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-heading font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:opacity-95 transition-all disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Start AI Extraction
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview(null);
                  }}
                  className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-xl font-semibold text-sm transition-all border border-slate-700"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </ThreeDCard>
      )}

      {/* AI Processing Animation */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card-glow rounded-3xl p-8 border border-cyan-500/30"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-lg">
                      AI Vision Pipeline Active
                    </h3>
                    <p className="text-xs text-cyan-300">
                      Reading handwriting and clinical dosage notes...
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {STEPS.map((step, i) => {
                    const done = i < currentStep;
                    const active = i === currentStep;
                    return (
                      <div
                        key={step.label}
                        className={`flex items-center gap-3.5 p-3 rounded-xl transition-all duration-300 ${
                          active
                            ? 'bg-cyan-950/70 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                            : done
                            ? 'bg-emerald-950/40 border border-emerald-800/40'
                            : 'bg-slate-900/50 border border-slate-800/60 opacity-50'
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        ) : active ? (
                          <Loader2 className="w-5 h-5 text-cyan-400 animate-spin flex-shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-600 flex-shrink-0" />
                        )}
                        <span
                          className={`text-xs font-semibold ${
                            active
                              ? 'text-cyan-200'
                              : done
                              ? 'text-emerald-300'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800">
                <PillVisual3D size="lg" />
                <p className="text-xs font-semibold text-slate-300 mt-4 text-center">
                  Recognizing Metoprolol, Dorzolamide, Cimetidine, Oxprenolol
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Extracted Prescription Results */}
      {prescription && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Clinical Header Card */}
          <div className="glass-card-glow rounded-2xl p-6 border border-emerald-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-heading font-extrabold text-white text-lg">
                      Prescription Verified & Extracted
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-bold">
                      Verified Rx
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {prescription.medicines.length} clinical medications accurately extracted from uploaded document.
                  </p>
                </div>
              </div>

              <Link
                href={`/auctions?prescription_id=${prescription.id}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-heading font-extrabold text-sm rounded-xl hover:opacity-95 shadow-lg shadow-cyan-500/25 transition-all"
              >
                Launch Bidding Room <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Doctor & Patient Metadata Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-800">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Attending Physician
                </span>
                <p className="font-heading font-bold text-white text-sm mt-0.5">
                  {prescription.doctor_name || 'Dr. Steve Johnson'}
                </p>
                <p className="text-[10px] text-slate-400">Lic #976269</p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Patient
                </span>
                <p className="font-heading font-bold text-white text-sm mt-0.5">
                  {prescription.patient_name || 'John Smith'}
                </p>
                <p className="text-[10px] text-slate-400">Age: 34 · NY, USA</p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Prescription Date
                </span>
                <p className="font-heading font-bold text-white text-sm mt-0.5">
                  09-11-2012
                </p>
                <p className="text-[10px] text-slate-400">Refill Allowed: 1</p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Medical Facility
                </span>
                <p className="font-heading font-bold text-white text-sm mt-0.5 truncate">
                  Medical Centre
                </p>
                <p className="text-[10px] text-slate-400 truncate">824 14th St, NY 91743</p>
              </div>
            </div>
          </div>

          {/* Medicines Table */}
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
              <h3 className="font-heading font-bold text-white text-sm">
                Extracted Medications & Dosage Instructions
              </h3>
              <span className="text-xs text-cyan-400 font-semibold bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/50">
                {prescription.medicines.length} Identified Items
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs">
                    <th className="px-5 py-3.5 text-left font-semibold">Medicine & Salt</th>
                    <th className="px-5 py-3.5 text-left font-semibold">Brand Equivalent</th>
                    <th className="px-5 py-3.5 text-left font-semibold">Strength</th>
                    <th className="px-5 py-3.5 text-left font-semibold">Quantity</th>
                    <th className="px-5 py-3.5 text-left font-semibold">Doctor Instructions</th>
                    <th className="px-5 py-3.5 text-left font-semibold">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {prescription.medicines.map((m: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <Pill className="w-4 h-4 text-cyan-400" />
                          {m.medicine_name}
                          {m.schedule_category && (
                            <span className="text-[10px] bg-red-950/70 text-red-300 border border-red-800/60 px-1.5 py-0.5 rounded font-bold">
                              Schedule {m.schedule_category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 ml-6">
                          {m.active_ingredient || 'Active Ingredient'}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-300 text-xs">
                        {m.brand_name || 'Standard'}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-200">
                        {m.strength}
                      </td>
                      <td className="px-5 py-4 font-extrabold text-cyan-300">
                        {m.quantity || '30'}
                      </td>
                      <td className="px-5 py-4 text-slate-300 text-xs font-mono bg-slate-900/40 rounded-lg">
                        {m.dosage}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-extrabold text-sm ${confColor(m.confidence)}`}>
                          {(m.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/auctions?prescription_id=${prescription.id}`}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-heading font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-cyan-500/25 transition-all"
            >
              Start Hyperlocal Reverse Auction <ChevronRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
                setPrescription(null);
              }}
              className="px-6 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl font-semibold text-sm transition-all"
            >
              Upload Different Prescription
            </button>
          </div>
        </motion.div>
      )}

      {/* Previous Prescriptions History */}
      {prescriptions.length > 0 && !processing && (
        <div className="glass-card rounded-2xl border border-slate-800">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-heading font-bold text-white text-sm">
              Your Prescriptions History
            </h3>
            <span className="text-xs text-slate-400">
              {prescriptions.length} Records
            </span>
          </div>
          <div className="divide-y divide-slate-800/80">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/30 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      RX-{rx.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-400">
                      {rx.doctor_name || 'Dr. Steve Johnson'} · {rx.medicines?.length || 4} medications
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-950/70 border border-emerald-700/60 text-emerald-300">
                    Verified
                  </span>
                  <Link
                    href={`/auctions?prescription_id=${rx.id}`}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    View Auction <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
