'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Pill, Mail, Lock, User, Phone, ArrowRight, Building2 } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const ROLES = [
  { id: 'customer', label: 'Customer', desc: 'Buy medicines', icon: '🛒' },
  { id: 'pharmacy', label: 'Pharmacy', desc: 'Sell medicines', icon: '💊' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/v1/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Registration failed'); }
      const { access_token } = await res.json();
      localStorage.setItem('medibid_token', access_token);
      router.push(form.role === 'pharmacy' ? '/pharmacy/dashboard' : '/dashboard');
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medibid-bg via-medibid-soft-blue/30 to-medibid-bg flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-11 h-11 bg-medibid-brand rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Pill className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-medibid-text-primary">MediBid AI</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-medibid-text-primary">Create account</h2>
          <p className="text-sm text-medibid-text-secondary mt-1">Join the AI pharmacy marketplace</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-medibid-border p-7">
          {error && <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">⚠️ {error}</div>}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map(r => (
                <button key={r.id} type="button" onClick={() => setForm({...form, role: r.id})}
                  className={`p-3.5 rounded-xl border text-left transition-all ${form.role === r.id ? 'bg-medibid-soft-blue border-medibid-brand/40 text-medibid-brand' : 'border-medibid-border text-medibid-text-secondary hover:bg-medibid-bg'}`}>
                  <div className="text-lg mb-1">{r.icon}</div>
                  <div className="text-sm font-semibold">{r.label}</div>
                  <div className="text-xs opacity-70">{r.desc}</div>
                </button>
              ))}
            </div>

            {[
              { icon: User, field: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
              { icon: Mail, field: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
              { icon: Phone, field: 'phone', label: 'Phone', type: 'tel', placeholder: '+91-XXXXXXXXXX' },
              { icon: Lock, field: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
            ].map(({ icon: Icon, field, label, type, placeholder }) => (
              <div key={field}>
                <label className="text-sm font-semibold text-medibid-text-primary block mb-1.5">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-medibid-text-secondary" />
                  <input type={type} required={field !== 'phone'} minLength={field === 'password' ? 6 : undefined}
                    placeholder={placeholder} value={(form as any)[field]} onChange={e => setForm({...form, [field]: e.target.value})}
                    className="w-full pl-10 pr-4 h-11 rounded-xl border border-medibid-border bg-white text-sm text-medibid-text-primary placeholder:text-medibid-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-medibid-brand/20 focus:border-medibid-brand transition-all" />
                </div>
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-xl bg-medibid-brand hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-blue-500/20">
              {loading ? <span className="animate-pulse">Creating account...</span> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-sm text-center text-medibid-text-secondary mt-5">
            Already have an account? <Link href="/login" className="text-medibid-brand font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

