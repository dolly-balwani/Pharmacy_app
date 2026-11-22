'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { Home, Upload, Gavel, Package, Store, Users, BarChart3, Bot, Shield, LogOut, Menu, X, Pill, Bell, ChevronRight } from 'lucide-react';
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
  const roleColor = user?.role === 'admin' ? 'text-purple-600 bg-medibid-lavender' : user?.role === 'pharmacy' ? 'text-medibid-success bg-medibid-mint' : 'text-medibid-brand bg-medibid-soft-blue';

  const Content = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-medibid-border">
        <div className="w-9 h-9 bg-medibid-brand rounded-xl flex items-center justify-center shadow-sm">
          <Pill className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-heading font-bold text-medibid-text-primary">MediBid AI</h1>
          <div className={cn("text-xs font-medium px-2 py-0.5 rounded-full inline-block capitalize mt-0.5", roleColor)}>{user?.role}</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                active ? 'bg-medibid-soft-blue text-medibid-brand' : 'text-medibid-text-secondary hover:bg-medibid-bg hover:text-medibid-text-primary')}>
              <link.icon className={cn('w-4.5 h-4.5 flex-shrink-0', active ? 'text-medibid-brand' : 'text-medibid-text-secondary group-hover:text-medibid-text-primary')} />
              <span className="flex-1">{link.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-3 p-3 bg-amber-50 border border-amber-200/80 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-sm">🔬</span>
          <div>
            <p className="text-xs font-semibold text-amber-700">DEMO MODE</p>
            <p className="text-[10px] text-amber-600">Simulated data only</p>
          </div>
        </div>
      </div>

      <div className="px-3 pb-4 border-t border-medibid-border pt-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-medibid-brand to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">{user?.full_name?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-medibid-text-primary truncate">{user?.full_name}</p>
            <p className="text-xs text-medibid-text-secondary truncate">{user?.email}</p>
          </div>
          <button onClick={logout} className="p-1.5 rounded-lg hover:bg-red-50 text-medibid-text-secondary hover:text-red-500 transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-60 bg-white border-r border-medibid-border flex-col h-screen sticky top-0 flex-shrink-0">
        <Content />
      </aside>
      <button onClick={() => setOpen(!open)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md border border-medibid-border">
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="lg:hidden fixed left-0 top-0 h-full w-60 z-50 shadow-2xl">
              <Content />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

