'use client';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { Sidebar } from '@/components/layout/sidebar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PillVisual3D } from '@/components/ui/PillVisual3D';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060911] flex items-center justify-center">
        <div className="text-center">
          <PillVisual3D size="sm" className="mb-4 mx-auto" />
          <p className="text-sm text-cyan-400 font-medium tracking-wide animate-pulse">Initializing MediBid AI...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#060911] text-slate-100">
      <Sidebar />
      <main className="flex-1 min-w-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,35,71,0.25),rgba(6,9,17,0))]">
        <div className="p-4 lg:p-8 pt-16 lg:pt-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}
