'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, getStoredToken, getStoredUser } from '@/lib/auth';
import { apiFetch } from '@/lib/api';
import type { AuthUser } from '@/lib/types';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      // Verify token is still valid
      apiFetch<AuthUser>('/auth/profile')
        .then((freshUser) => setUser(freshUser))
        .catch(() => {
          // Token expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        });
    }
    setLoaded(true);
  }, []);

  function login(newToken: string, newUser: AuthUser) {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  if (!loaded) return null;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAdmin: user?.role === 'ADMIN' }}
    >
      {children}
    </AuthContext.Provider>
  );
}
