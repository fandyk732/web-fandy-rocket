'use client';

import React, { useState, useEffect } from 'react';
import MateriSection from '@/components/MateriSection';
import AbsenHeader from '@/components/absen/AbsenHeader';
import FormAbsen from '@/components/absen/FormAbsen';
import TabelRekapAbsen, { AbsenData } from '@/components/absen/TabelRekapAbsen';
import FormUploadTugas from '@/components/absen/FormUploadTugas';
import TabelRekapTugas, { TugasData } from '@/components/absen/TabelRekapTugas';

// 🔗 1. APPS SCRIPT URL KHUSUS ABSENSI
const APPS_SCRIPT_ABSEN_URL =
  'https://script.google.com/macros/s/AKfycbzl-dJ67vYAGtuA13tUodzNiMbes9G8F0UXAp9lgGUSd-Bn3u1p16n02APn5orJDdAI/exec';

// 🔗 2. APPS SCRIPT URL KHUSUS TUGAS PRESENTASI (Ganti dengan URL Deploy Apps Script Tugas Lo)
const APPS_SCRIPT_TUGAS_URL =
  'https://script.google.com/macros/s/AKfycbzo5KEovudb-e7di62EvwZuUuWaZVcuU6iawkRu0CDb7tPLL0aWp6wnstTFWvj6-MPhWA/exec';

export default function AbsensiPage() {
  // --- STATE ABSENSI ---
  const [isOpen, setIsOpen] = useState(false);
  const [timeMessage, setTimeMessage] = useState('Memeriksa status sesi absensi...');
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [rekapList, setRekapList] = useState<AbsenData[]>([]);
  const [loadingRekap, setLoadingRekap] = useState(false);

  // --- STATE TUGAS PRESENTASI ---
  const [tugasList, setTugasList] = useState<TugasData[]>([]);
  const [loadingTugas, setLoadingTugas] = useState(false);

  // Fetch Status Sesi Absensi
  const fetchAbsensiStatus = async () => {
    setCheckingStatus(true);
    try {
      const res = await fetch(`${APPS_SCRIPT_ABSEN_URL}?action=getStatus`);
      const json = await res.json();

      if (json.success && json.status === 'BUKA') {
        setIsOpen(true);
        setTimeMessage('🟢 Absensi Sedang Dibuka oleh Dosen');
      } else {
        setIsOpen(false);
        setTimeMessage('🔴 Absensi Ditutup. Silakan tunggu hingga sesi dibuka oleh dosen.');
      }
    } catch (err) {
      console.error('Gagal mengambil status absensi:', err);
      setIsOpen(false);
      setTimeMessage('🔴 Gagal terhubung ke server absensi.');
    } finally {
      setCheckingStatus(false);
    }
  };

  // Fetch Rekap Data Absen
  const fetchRekapAbsen = async () => {
    setLoadingRekap(true);
    try {
      const res = await fetch(APPS_SCRIPT_ABSEN_URL);
      const json = await res.json();
      if (json.success) {
        setRekapList(json.data || []);
      }
    } catch (err) {
      console.error('Gagal mengambil rekap absen:', err);
    } finally {
      setLoadingRekap(false);
    }
  };

  // Fetch Rekap Data Tugas Presentasi
  const fetchRekapTugas = async () => {
    setLoadingTugas(true);
    try {
      const res = await fetch(APPS_SCRIPT_TUGAS_URL);
      const json = await res.json();
      if (json.success) {
        setTugasList(json.data || []);
      }
    } catch (err) {
      console.error('Gagal mengambil rekap tugas:', err);
    } finally {
      setLoadingTugas(false);
    }
  };

  useEffect(() => {
    fetchAbsensiStatus();
    fetchRekapAbsen();
    fetchRekapTugas();

    // Polling status absensi setiap 15 detik
    const timer = setInterval(fetchAbsensiStatus, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-16 space-y-12">
      {/* 📍 SECTION 1: Header & Status Absensi */}
      <AbsenHeader
        isOpen={isOpen}
        timeMessage={timeMessage}
        checkingStatus={checkingStatus}
        onRefreshStatus={fetchAbsensiStatus}
      />

      {/* 📍 SECTION 2: Form Kehadiran Mahasiswa */}
      <FormAbsen
        appsScriptUrl={APPS_SCRIPT_ABSEN_URL}
        isOpen={isOpen}
        onSuccess={fetchRekapAbsen}
      />

      {/* 📍 SECTION 3: Materi Perkuliahan (Google Drive) */}
      <MateriSection />

      {/* 📍 SECTION 4: Upload Tugas Presentasi Kelompok */}
      <FormUploadTugas
        appsScriptUrl={APPS_SCRIPT_TUGAS_URL}
        onUploadSuccess={fetchRekapTugas}
      />

      {/* 📍 SECTION 5: Tabel Rekap Berkas Tugas Presentasi */}
      <TabelRekapTugas
        tugasList={tugasList}
        loading={loadingTugas}
        onRefresh={fetchRekapTugas}
      />

      {/* 📍 SECTION 6: Rekapitulasi Presensi Dosen */}
      <TabelRekapAbsen
        rekapList={rekapList}
        loadingRekap={loadingRekap}
        onRefresh={fetchRekapAbsen}
      />
    </div>
  );
}