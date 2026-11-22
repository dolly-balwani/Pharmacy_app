'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Pill, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demos = [
    { label: '🛒 Customer', email: 'customer@medibid.demo' },
    { label: '💊 Pharmacy', email: 'pharmacy@medibid.demo' },
    { label: '⚙️ Admin', email: 'admin@medibid.demo' },
  ];

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Login failed'); }
      const { access_token } = await res.json();
      localStorage.setItem('medibid_token', access_token);
      const meRes = await fetch(`${API}/api/v1/auth/me`, { headers: { Authorization: `Bearer ${access_token}` } });
      const user = await meRes.json();
      if (user.role === 'admin') router.push('/admin/dashboard');
      else if (user.role === 'pharmacy') router.push('/pharmacy/dashboard');
      else router.push('/dashboard');
    } catch (err: any) { setError(err.message || 'Login failed'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medibid-bg via-medibid-soft-blue/30 to-medibid-bg flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-12 h-12 bg-medibid-brand rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-heading font-bold text-medibid-text-primary">MediBid AI</h1>
              <p className="text-xs text-medibid-text-secondary">Intelligent Pharmacy Marketplace</p>
            </div>
          </div>
          <h2 className="text-2xl font-heading font-bold text-medibid-text-primary">Welcome back</h2>
          <p className="text-sm text-medibid-text-secondary mt-1">Sign in to continue saving on medicines</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-medibid-border p-7">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-medibid-text-primary block mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-medibid-text-secondary" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email"
                  className="w-full pl-10 pr-4 h-11 rounded-xl border border-medibid-border bg-white text-sm text-medibid-text-primary placeholder:text-medibid-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-medibid-brand/20 focus:border-medibid-brand transition-all" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-medibid-text-primary block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-medibid-text-secondary" />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter password"
                  className="w-full pl-10 pr-11 h-11 rounded-xl border border-medibid-border bg-white text-sm text-medibid-text-primary placeholder:text-medibid-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-medibid-brand/20 focus:border-medibid-brand transition-all" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-medibid-text-secondary hover:text-medibid-text-primary">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-xl bg-medibid-brand hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-blue-500/20">
              {loading ? <span className="animate-pulse">Signing in...</span> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-medibid-border">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <p className="text-xs font-semibold text-medibid-text-secondary uppercase tracking-wide">Quick Demo Access</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {demos.map(d => (
                <button key={d.email} onClick={() => { setEmail(d.email); setPassword('demo123456'); }}
                  className="px-2 py-2 text-xs font-medium rounded-xl border border-medibid-border text-medibid-text-secondary hover:bg-medibid-soft-blue hover:text-medibid-brand hover:border-medibid-brand/30 transition-all">
                  {d.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-medibid-text-secondary mt-2 text-center">Password for all demo accounts: <code className="bg-medibid-bg px-1 rounded">demo123456</code></p>
          </div>

          <p className="text-sm text-center text-medibid-text-secondary mt-5">
            New to MediBid?{' '}
            <Link href="/register" className="text-medibid-brand font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

