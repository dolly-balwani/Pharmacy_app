'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Mail, Lock, ArrowRight, Eye, EyeOff, Zap, ShieldCheck, Phone, KeyRound, Sparkles } from 'lucide-react';
import { signInWithGoogle } from '@/lib/firebase';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type AuthMethod = 'password' | 'otp' | 'google';

export default function LoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<AuthMethod>('password');

  // Password Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  // Phone OTP State
  const [phone, setPhone] = useState('+91 ');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpHint, setOtpHint] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  // 1. Password Login
  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
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

  // 2. Phone OTP: Send
  async function handleSendOtp() {
    if (!phone || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number (+91)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/v1/auth/phone-otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to dispatch OTP');
      setOtpSent(true);
      if (data.gateway_connected) {
        setOtpHint('');
        setSuccessMsg(`SMS OTP dispatched directly to ${data.phone}! Please check your phone messages.`);
      } else {
        setOtpHint(data.otp_code || '');
        if (data.gateway_error) {
          setError(`SMS Gateway Notice: ${data.gateway_error}`);
        } else {
          setSuccessMsg(`OTP generated for ${data.phone}. Add FAST2SMS_API_KEY in backend/.env for direct phone SMS.`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch OTP');
    } finally {
      setLoading(false);
    }
  }

  // 2. Phone OTP: Verify
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the 6-digit OTP code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/v1/auth/phone-otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp_code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Invalid verification code');
      await handlePostLogin(data.access_token);
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  // 3. Google Sign-In
  async function handleGoogleLogin() {
    setLoading(true);
    setError('');
    try {
      const gResult = await signInWithGoogle();
      let fbToken = gResult.token;
      let emailAddress = gResult.user?.email || 'patient.verified@gmail.com';
      let displayName = gResult.user?.displayName || 'Google Verified Patient';

      // Call backend to authenticate / provision user
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
          {/* Auth Method Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => { setMethod('password'); setError(''); setSuccessMsg(''); }}
              className={`py-2 text-xs font-heading font-bold rounded-xl transition-all ${
                method === 'password'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => { setMethod('otp'); setError(''); setSuccessMsg(''); }}
              className={`py-2 text-xs font-heading font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                method === 'otp'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" /> Phone OTP (+91)
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-400 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-950/50 border border-emerald-800/80 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" /> {successMsg}
            </div>
          )}

          {/* METHOD 1: Password Login */}
          {method === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
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
          )}

          {/* METHOD 2: Phone OTP Authentication */}
          {method === 'otp' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Indian Mobile Number</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 h-11 rounded-xl border border-slate-800 bg-slate-900/90 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 font-mono tracking-wide"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="px-4 h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-bold whitespace-nowrap transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : otpSent ? 'Resend' : 'Get OTP'}
                  </button>
                </div>
              </div>

              {otpSent && (
                <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300">Enter 6-Digit OTP</label>
                      {otpHint && (
                        <span className="text-[11px] text-cyan-400 font-mono">Code: {otpHint}</span>
                      )}
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="• • • • • •"
                        required
                        className="w-full pl-10 pr-4 h-11 rounded-xl border border-cyan-500/40 bg-slate-900/90 text-center tracking-widest font-mono text-lg text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:opacity-95 text-slate-950 font-heading font-extrabold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/25"
                  >
                    {loading ? <span className="animate-pulse">Verifying OTP...</span> : <><span>Verify & Sign In</span><ShieldCheck className="w-4 h-4" /></>}
                  </button>
                </form>
              )}
            </div>
          )}

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
                    setMethod('password');
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
