'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (res.ok) {
    // 💡 Pakai ini supaya browser langsung reload & middleware langsung deteksi cookie-nya
    window.location.href = '/admin/create';
  } else {
    const data = await res.json();
    setError(data.message || 'Gagal login');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.NEXT_PUBLIC_ADMIN_SUPABASE_EMAIL!,
    password: process.env.NEXT_PUBLIC_ADMIN_SUPABASE_PASSWORD!,
  });

};

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-sm text-muted-foreground">Masukkan password untuk buat artikel baru</p>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Password Admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:border-primary text-foreground"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}