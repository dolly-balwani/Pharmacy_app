'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Pill, Mail, Lock, ArrowRight, Eye, EyeOff, Zap, ShieldCheck } from 'lucide-react';
import { signInWithGoogle } from '@/lib/firebase';

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

  async function handlePostLogin(accessToken: string) {
    localStorage.setItem('medibid_token', accessToken);
    try {
      const meRes = await fetch(`${API}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (meRes.ok) {
        const user = await meRes.json();
        if (user.role === 'admin') router.push('/admin/dashboard');
        else if (user.role === 'pharmacy') router.push('/pharmacy/dashboard');
        else router.push('/dashboard');
        return;
      }
    } catch {}
    router.push('/dashboard');
  }

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
      await handlePostLogin(access_token);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError('');
    try {
      const gResult = await signInWithGoogle();
      let fbToken = gResult.token;
      let emailAddress = gResult.user?.email || 'patient.verified@gmail.com';
      let displayName = gResult.user?.displayName || 'Google Verified Patient';

      const res = await fetch(`${API}/api/v1/auth/firebase-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebase_token: fbToken || 'demo_firebase_token',
          email: emailAddress,
          full_name: displayName,
          role: 'customer',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Google authentication failed');
      await handlePostLogin(data.access_token);
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed');
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
          <p className="text-xs text-slate-400 mt-1">Access prescriptions, live pharmacy bids, and wholesale pricing</p>
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

          {/* Social Google Sign-In Option */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-11 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-3 transition-all hover:border-slate-600 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Quick Sign-In Profiles */}
          <div className="mt-5 pt-4 border-t border-slate-800">
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
                  className="px-2.5 py-2 text-[11px] font-medium rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-cyan-300 hover:border-cyan-500/30 transition-all text-center truncate"
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
