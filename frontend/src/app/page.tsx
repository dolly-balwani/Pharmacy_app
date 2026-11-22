'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Pill, Upload, Gavel, Package, Shield, MapPin, ArrowRight, Sparkles, CheckCircle2, Star, Zap, Clock } from 'lucide-react';

export default function LandingPage() {
  const features = [
    { icon: Upload, title: 'Upload Prescription', desc: 'Snap a photo. Our AI reads and extracts all medicine details instantly with 95%+ accuracy.', color: 'bg-medibid-soft-blue text-medibid-brand', step: '01' },
    { icon: Gavel, title: 'Pharmacies Compete', desc: 'Verified nearby pharmacies bid in real-time, offering their best prices and delivery estimates.', color: 'bg-medibid-mint text-medibid-success', step: '02' },
    { icon: Package, title: 'Best Price Delivered', desc: 'Compare all offers at a glance, pick your best deal, and get medicines at your doorstep.', color: 'bg-medibid-lavender text-purple-600', step: '03' },
  ];
  const stats = [
    { value: '5,200+', label: 'Prescriptions Processed', icon: '📋' },
    { value: '500+', label: 'Verified Pharmacies', icon: '💊' },
    { value: '23%', label: 'Average Savings', icon: '💰' },
    { value: '< 45 min', label: 'Average Delivery', icon: '🚀' },
  ];
  const benefits = ['Real-time competitive bidding', 'AI prescription reading', 'Pharmacist-verified orders', 'Hyperlocal 1-2 km coverage', 'Generic substitution options', 'Live order tracking'];

  return (
    <div className="min-h-screen bg-medibid-bg">
      {/* Nav */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-medibid-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-medibid-brand rounded-xl flex items-center justify-center shadow-sm">
              <Pill className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-heading font-bold text-medibid-text-primary">MediBid AI</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold ml-1">DEMO</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm font-medium text-medibid-text-secondary hover:text-medibid-text-primary px-4 py-2 rounded-lg transition-colors">Sign In</Link>
            <Link href="/register" className="text-sm font-semibold bg-medibid-brand text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 pt-20 pb-12 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-medibid-soft-blue border border-medibid-brand/20 rounded-full text-sm font-semibold text-medibid-brand mb-7">
            <Sparkles className="w-4 h-4" />
            AI-Powered Pharmacy Marketplace for India
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-medibid-text-primary leading-[1.1] mb-6">
            Get the Best Price<br />
            <span className="text-medibid-brand">for Your Medicines</span>
          </h1>
          <p className="text-lg text-medibid-text-secondary max-w-xl mx-auto mb-8 leading-relaxed">
            Upload a prescription. AI reads it. Nearby verified pharmacies compete with their best bids. You save up to 30% instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-medibid-brand text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm">
              Upload Prescription <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-medibid-text-primary font-semibold rounded-xl hover:bg-medibid-bg border border-medibid-border transition-all text-sm">
              Try Demo
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-5 pb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="bg-white rounded-2xl border border-medibid-border p-5 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="text-2xl font-heading font-bold text-medibid-text-primary">{s.value}</p>
              <p className="text-xs text-medibid-text-secondary mt-1 font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-heading font-bold text-medibid-text-primary mb-2">How MediBid Works</h2>
          <p className="text-medibid-text-secondary">Three simple steps to save money on medicines</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.15 }}
              className="bg-white rounded-2xl border border-medibid-border p-7 hover:shadow-lg hover:shadow-blue-500/5 transition-all group cursor-default">
              <div className="flex items-start justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <span className="text-4xl font-heading font-black text-medibid-border group-hover:text-medibid-brand/20 transition-colors">{f.step}</span>
              </div>
              <h3 className="text-lg font-heading font-bold text-medibid-text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-medibid-text-secondary leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="bg-white rounded-2xl border border-medibid-border p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-heading font-bold text-medibid-text-primary mb-2">Why MediBid AI?</h2>
              <p className="text-sm text-medibid-text-secondary mb-6">The only platform that lets pharmacies compete for your prescription in real-time.</p>
              <div className="grid grid-cols-2 gap-3">
                {benefits.map(b => (
                  <div key={b} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-medibid-success flex-shrink-0" />
                    <span className="text-sm text-medibid-text-primary font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-medibid-brand to-blue-700 rounded-2xl p-6 text-white">
              <Shield className="w-10 h-10 mb-4 opacity-80" />
              <h3 className="text-xl font-heading font-bold mb-2">Safe & Compliant</h3>
              <p className="text-sm text-blue-100 leading-relaxed">All pharmacies are verified with valid Drug Licenses. Every order requires pharmacist sign-off. Built with DPDP Act 2023 compliance in mind.</p>
              <div className="mt-4 p-3 bg-white/10 rounded-xl">
                <p className="text-xs text-blue-100">🔬 This is a demonstration application. Not for real medical use.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="bg-gradient-to-r from-medibid-brand to-blue-700 rounded-2xl p-10 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="text-3xl font-heading font-bold mb-2">Start Saving Today</h2>
            <p className="text-blue-100 mb-6 max-w-md mx-auto text-sm">Join thousands saving 23% on average. Upload your first prescription free.</p>
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-medibid-brand font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg text-sm">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-medibid-border bg-white py-6">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-medibid-brand" />
            <span className="font-heading font-bold text-medibid-text-primary text-sm">MediBid AI</span>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">DEMO</span>
          </div>
          <p className="text-xs text-medibid-text-secondary">© 2024 MediBid AI · Demonstration only · Not for real medical use</p>
        </div>
      </footer>
    </div>
  );
}

