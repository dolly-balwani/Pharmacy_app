'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Pill, Upload, Gavel, Package, Shield, MapPin, ArrowRight, Sparkles, CheckCircle2, Zap, Clock, ShieldCheck, Award } from 'lucide-react';
import { PillVisual3D } from '@/components/ui/PillVisual3D';
import { ThreeDCard } from '@/components/ui/ThreeDCard';

export default function LandingPage() {
  const features = [
    {
      icon: Upload,
      title: 'Neural Prescription OCR',
      desc: 'Snap a photo of your handwritten doctor prescription. The vision agent extracts medicine names, strengths, and dosages with 98% accuracy.',
      glow: 'rgba(56, 189, 248, 0.3)',
      step: '01',
    },
    {
      icon: Gavel,
      title: 'Hyperlocal Reverse Auction',
      desc: 'Verified licensed chemists within 1-2 km compete in real-time, submitting discounted quotations and guaranteed delivery speeds.',
      glow: 'rgba(16, 185, 129, 0.3)',
      step: '02',
    },
    {
      icon: Package,
      title: 'Pharmacist-Verified Delivery',
      desc: 'A registered pharmacist digitally verifies each prescription before fulfillment. Medicines arrive at your doorstep in under 30 minutes.',
      glow: 'rgba(168, 85, 247, 0.3)',
      step: '03',
    },
  ];

  const stats = [
    { value: '₹4.8M+', label: 'Customer Savings to Date', icon: '💰' },
    { value: '500+', label: 'Verified Partner Chemists', icon: '💊' },
    { value: '23%', label: 'Average Bill Reduction', icon: '📉' },
    { value: '24 min', label: 'Average Hyperlocal Delivery', icon: '⚡' },
  ];

  const benefits = [
    'Real-time competitive reverse bidding',
    'AI-powered clinical handwriting OCR',
    'Mandatory registered pharmacist approval',
    'Hyperlocal 1–2 km geo-discovery',
    'Verified generic substitution savings',
    'Live GPS express courier tracking',
  ];

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 overflow-hidden">
      {/* Ambient background energy orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-[30%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Nav */}
      <nav className="bg-[#080D1A]/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-heading font-extrabold text-white tracking-tight">MediBid AI</span>
              <span className="text-[10px] bg-cyan-950 border border-cyan-800 text-cyan-400 px-2 py-0.5 rounded-full font-bold">
                ENTERPRISE
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-colors hover:bg-slate-800/50"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-5 py-2.5 rounded-xl hover:opacity-95 transition-opacity shadow-lg shadow-cyan-500/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Pill Visual */}
      <section className="max-w-6xl mx-auto px-5 pt-16 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 border border-cyan-500/30 rounded-full text-xs font-bold text-cyan-400 shadow-md shadow-cyan-500/10">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              AI-Native Hyperlocal Pharmacy Marketplace
            </div>

            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight leading-[1.1] text-white">
              Pharmacies Compete.<br />
              <span className="text-gradient-cyan">You Save Up to 30%.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Upload your doctor prescription. AI vision extracts the medicines in seconds. Local verified chemists bid with real-time discounts and express delivery.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/prescriptions"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-slate-950 font-heading font-extrabold rounded-xl shadow-xl shadow-cyan-500/25 hover:opacity-95 transition-all text-sm"
              >
                <Upload className="w-4 h-4" /> Upload Prescription <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold rounded-xl border border-slate-700/80 transition-all text-sm"
              >
                Explore Marketplace
              </Link>
            </div>

            <div className="flex items-center gap-5 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verified Chemist Licenses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Pharmacist Sign-Off Required</span>
              </div>
            </div>
          </motion.div>

          {/* 3D Visual Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col items-center justify-center relative"
          >
            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
              <PillVisual3D size="lg" />

              {/* Floating 3D Badge 1 */}
              <div className="absolute top-4 left-0 glass-card-glow px-4 py-2.5 rounded-2xl border border-cyan-500/30 shadow-xl shadow-cyan-500/10 flex items-center gap-3 animate-float-3d">
                <div className="w-8 h-8 rounded-xl bg-cyan-950 flex items-center justify-center">
                  <Gavel className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Live Bid Received</p>
                  <p className="text-xs font-bold text-white">MedPlus: ₹412 (22% off)</p>
                </div>
              </div>

              {/* Floating 3D Badge 2 */}
              <div className="absolute bottom-6 right-0 glass-card-glow px-4 py-2.5 rounded-2xl border border-emerald-500/30 shadow-xl shadow-emerald-500/10 flex items-center gap-3 animate-float-3d [animation-delay:2s]">
                <div className="w-8 h-8 rounded-xl bg-emerald-950 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Pharmacist Approved</p>
                  <p className="text-xs font-bold text-emerald-400">Reg: KA-PHARM-001</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-cyan-500/30 transition-all text-center group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{s.icon}</div>
              <p className="text-2xl font-heading font-extrabold text-white tracking-tight">{s.value}</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works with 3D Cards */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 font-semibold mb-3">
            Simple 3-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            How MediBid Operates
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
            From handwritten prescription to verified medicine delivery at the guaranteed lowest rate.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <ThreeDCard key={f.title} glowColor={f.glow} className="h-full">
              <div className="p-7 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/80 flex items-center justify-center">
                      <f.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <span className="text-4xl font-heading font-black text-slate-800">
                      {f.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-white mb-2.5">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            </ThreeDCard>
          ))}
        </div>
      </section>

      {/* Trust & Safety Panel */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-800 relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight mb-3">
                Why Patients Rely on MediBid
              </h2>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                We combine AI clinical speed with mandatory human pharmacist governance for safe, transparent healthcare fulfillment.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-slate-300 font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-950/70 via-slate-900/90 to-cyan-950/60 p-8 rounded-2xl border border-cyan-500/20 shadow-2xl">
              <ShieldCheck className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-xl font-heading font-bold text-white mb-2">
                Regulatory & Clinical Governance
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All pharmacies maintain active Drug Licenses. Schedule H/H1/X drugs require physical validation. Every dispensed pack is inspected by a registered pharmacist.
              </p>
              <div className="mt-5 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Compliant with Indian Pharmacy Act & DPDP Act 2023 guidelines</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <div className="relative rounded-3xl p-10 sm:p-14 text-center bg-gradient-to-r from-blue-700 via-cyan-600 to-indigo-700 overflow-hidden shadow-2xl shadow-cyan-500/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Ready to Save on Your Next Prescription?
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Join thousands of customers who obtain competitive prices directly from trusted neighborhood pharmacies.
            </p>
            <div className="pt-2">
              <Link
                href="/prescriptions"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-950 text-white font-heading font-extrabold text-sm rounded-xl hover:bg-slate-900 transition-all shadow-xl"
              >
                Upload Prescription Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080D1A] py-8">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Pill className="w-4 h-4 text-cyan-400" />
            <span className="font-heading font-bold text-white text-sm">MediBid AI</span>
            <span className="text-[10px] text-slate-400 ml-2">Intelligent Hyperlocal Pharmacy Marketplace</span>
          </div>
          <p className="text-xs text-slate-500">
            © 2024 MediBid AI · All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
