'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Message = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export default function GuestbookPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch semua pesan
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('guestbook')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Submit Pesan Baru
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setErrorMsg('Nama dan pesan tidak boleh kosong, brok!');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase
      .from('guestbook')
      .insert([{ name: name.trim(), message: message.trim() }]);

    if (error) {
      setErrorMsg('Gagal mengirim pesan. Coba lagi nanti.');
    } else {
      setName('');
      setMessage('');
      fetchMessages(); // Refresh list pesan
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-24 px-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="space-y-4 mb-10">
        <h1 className="text-3xl md:text-5xl font-bold">Guestbook</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Tinggalkan jejak, salam, pesan, atau masukan untuk Fandy Aziz di sini!
        </p>
      </div>

      {/* Form Input Pesan */}
      <form onSubmit={handleSubmit} className="p-6 bg-card border border-border rounded-2xl shadow-lg space-y-4 mb-12">
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
            {errorMsg}
          </div>
        )}
        <div>
          <label className="block text-xs font-mono text-muted-foreground mb-1.5">NAMA / PANGGILAN</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Misal: Alex / Anonim"
            maxLength={40}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-muted-foreground mb-1.5">PESAN</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis pesan unikmu..."
            rows={3}
            maxLength={280}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Mengirim...' : 'Kirim Pesan'}
        </button>
      </form>

      {/* Daftar Pesan Pengunjung */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>💬</span> Pesan Terbaru ({messages.length})
        </h2>

        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Belum ada pesan. Jadilah orang pertama yang mengisi guestbook!</p>
        ) : (
          messages.map((item) => (
            <div key={item.id} className="p-4 bg-card/50 border border-border/60 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-primary">{item.name}</span>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm text-foreground/90">{item.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}