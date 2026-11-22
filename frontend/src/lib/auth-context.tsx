'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './api';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'pharmacy' | 'admin';
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('medibid_token');
    if (t) { setToken(t); fetchUser(t); } else setIsLoading(false);
  }, []);

  async function fetchUser(t: string) {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch { localStorage.removeItem('medibid_token'); setToken(null); }
    finally { setIsLoading(false); }
  }

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('medibid_token', data.access_token);
    setToken(data.access_token);
    await fetchUser(data.access_token);
  }

  async function register(regData: any) {
    const { data } = await api.post('/auth/register', regData);
    localStorage.setItem('medibid_token', data.access_token);
    setToken(data.access_token);
    await fetchUser(data.access_token);
  }

  function logout() { localStorage.removeItem('medibid_token'); setToken(null); setUser(null); }

  return <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

