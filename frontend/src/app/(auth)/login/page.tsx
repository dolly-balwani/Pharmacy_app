'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Pill, Mail, Lock, ArrowRight, Eye, EyeOff, Zap, ShieldCheck } from 'lucide-react';
import { PillVisual3D } from '@/components/ui/PillVisual3D';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const accounts = [
    { label: 'Customer Portal', email: 'customer@medibid.ai' },
    { label: 'Pharmacy Merchant', email: 'pharmacy@medibid.ai' },
    { label: 'Admin Command', email: 'admin@medibid.ai' },
  ];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || 'Login failed');
      }
      const { access_token } = await res.json();
      localStorage.setItem('medibid_token', access_token);
      const meRes = await fetch(`${API}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const user = await meRes.json();
      if (user.role === 'admin') router.push('/admin/dashboard');
      else if (user.role === 'pharmacy') router.push('/pharmacy/dashboard');
      else router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -bottom-20 -right-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-heading font-extrabold text-white tracking-tight">MediBid AI</h1>
              <p className="text-xs text-slate-400">Intelligent Pharmacy Marketplace</p>
            </div>
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">Sign In to Your Account</h2>
          <p className="text-xs text-slate-400 mt-1">Access your prescriptions, active bids, and pharmacy orders</p>
        </div>

        <div className="glass-card-glow rounded-3xl p-8 border border-slate-800 shadow-2xl">
          {error && (
            <div className="mb-5 p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-400 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 h-11 rounded-xl border border-slate-800 bg-slate-900/90 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 h-11 rounded-xl border border-slate-800 bg-slate-900/90 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-slate-950 font-heading font-extrabold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/25"
            >
              {loading ? <span className="animate-pulse">Authenticating...</span> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Quick Sign-In Profiles */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Sign-In Profiles</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {accounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email);
                    setPassword('demo123456');
                  }}
                  className="px-2.5 py-2 text-[11px] font-medium rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-cyan-300 hover:border-cyan-500/30 transition-all"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-center text-slate-400 mt-6">
            New to MediBid?{' '}
            <Link href="/register" className="text-cyan-400 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
