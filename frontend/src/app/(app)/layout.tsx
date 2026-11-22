'use client';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/layout/sidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Pill } from 'lucide-react';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  if (isLoading) return (
    <div className="min-h-screen bg-medibid-bg flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 bg-medibid-brand rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-soft shadow-lg">
          <Pill className="w-7 h-7 text-white" />
        </div>
        <p className="text-sm text-medibid-text-secondary font-medium">Loading MediBid AI...</p>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-medibid-bg">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider><AppContent>{children}</AppContent></AuthProvider>;
}

