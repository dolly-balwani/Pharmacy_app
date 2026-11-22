'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Home, Upload, Gavel, Package, Store, BarChart3, Bot, Shield, LogOut, Menu, X, Pill, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const customerLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/prescriptions', label: 'Prescriptions', icon: Upload },
  { href: '/auctions', label: 'Bidding Room', icon: Gavel },
  { href: '/orders', label: 'My Orders', icon: Package },
];
const pharmacyLinks = [
  { href: '/pharmacy/dashboard', label: 'Dashboard', icon: Home },
  { href: '/pharmacy/requests', label: 'Requests', icon: Upload },
  { href: '/pharmacy/bids', label: 'My Bids', icon: Gavel },
  { href: '/pharmacy/orders', label: 'Orders', icon: Package },
];
const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/admin/pharmacies', label: 'Pharmacies', icon: Store },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/agents', label: 'AI Agents', icon: Bot },
  { href: '/admin/compliance', label: 'Compliance', icon: Shield },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'pharmacy' ? pharmacyLinks : customerLinks;
  const roleBadge = user?.role === 'admin' ? 'text-purple-400 bg-purple-950/60 border border-purple-800/40' : user?.role === 'pharmacy' ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40' : 'text-cyan-400 bg-cyan-950/60 border border-cyan-800/40';

  const Content = () => (
    <div className="flex flex-col h-full bg-[#080D1A] border-r border-slate-800/70 text-slate-200">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/70">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Pill className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-heading font-bold text-white tracking-tight flex items-center gap-1.5">
            MediBid AI
          </h1>
          <div className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full inline-block capitalize mt-0.5", roleBadge)}>
            {user?.role} Portal
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                active
                  ? 'bg-gradient-to-r from-blue-600/25 to-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
              )}
            >
              <link.icon className={cn('w-4.5 h-4.5 flex-shrink-0 transition-colors', active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300')} />
              <span className="flex-1">{link.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 opacity-80" />}
            </Link>
          );
        })}
      </nav>

      {/* Real-Time Network Status (Clean, no demo badge) */}
      <div className="mx-3 mb-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-slate-200 flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> Bidding Network Live
            </p>
            <p className="text-[10px] text-slate-400">Hyperlocal 1-2 km Discovery</p>
          </div>
        </div>
      </div>

      {/* User Footer */}
      <div className="px-3 pb-4 border-t border-slate-800/70 pt-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs text-white shadow-md shadow-cyan-500/20">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg hover:bg-red-950/50 text-slate-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-60 bg-[#080D1A] border-r border-slate-800/70 flex-col h-screen sticky top-0 flex-shrink-0 z-40">
        <Content />
      </aside>
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900/90 text-white rounded-xl shadow-lg border border-slate-700/80 backdrop-blur-md"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-full w-60 z-50 shadow-2xl shadow-black"
            >
              <Content />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
