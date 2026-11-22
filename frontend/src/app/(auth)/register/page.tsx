'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Pill, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const ROLES = [
  { id: 'customer', label: 'Customer', desc: 'Procure medicines at lowest bids', icon: '🛒' },
  { id: 'pharmacy', label: 'Pharmacy', desc: 'Bid on nearby prescriptions', icon: '💊' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || 'Registration failed');
      }
      const { access_token } = await res.json();
      localStorage.setItem('medibid_token', access_token);
      router.push(form.role === 'pharmacy' ? '/pharmacy/dashboard' : '/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -top-20 -left-20" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -bottom-20 -right-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-heading font-extrabold text-white tracking-tight">MediBid AI</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">Create an Account</h2>
          <p className="text-xs text-slate-400 mt-1">Join the intelligent reverse pharmacy marketplace</p>
        </div>

        <div className="glass-card-glow rounded-3xl p-8 border border-slate-800 shadow-2xl">
          {error && (
            <div className="mb-4 p-3.5 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-400">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.id })}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    form.role === r.id
                      ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/20'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-lg mb-1">{r.icon}</div>
                  <div className="text-xs font-bold text-white">{r.label}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>

            {[
              { icon: User, field: 'full_name', label: 'Full Name', type: 'text', placeholder: 'John Smith' },
              { icon: Mail, field: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
              { icon: Phone, field: 'phone', label: 'Phone', type: 'tel', placeholder: '+91-9876543210' },
              { icon: Lock, field: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
            ].map(({ icon: Icon, field, label, type, placeholder }) => (
              <div key={field}>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={type}
                    required={field !== 'phone'}
                    minLength={field === 'password' ? 6 : undefined}
                    placeholder={placeholder}
                    value={(form as any)[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="w-full pl-10 pr-4 h-11 rounded-xl border border-slate-800 bg-slate-900/90 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-slate-950 font-heading font-extrabold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-cyan-500/25 mt-2"
            >
              {loading ? <span className="animate-pulse">Creating account...</span> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-xs text-center text-slate-400 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
