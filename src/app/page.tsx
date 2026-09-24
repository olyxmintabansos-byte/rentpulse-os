"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { FloorPlanView } from '@/components/floorplan/FloorPlanView';
import { StorageEngine } from '@/lib/storage';
import { Room } from '@/types/rentpulse';
import { 
  Building2, 
  Home, 
  Users, 
  AlertCircle, 
  Wrench, 
  DollarSign, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const loadData = () => {
    setRooms(StorageEngine.getRooms());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('rentpulse_rooms_updated', loadData);
    return () => window.removeEventListener('rentpulse_rooms_updated', loadData);
  }, []);

  const totalOccupied = rooms.filter((r) => r.status === 'TERISI').length;
  const totalLate = rooms.filter((r) => r.status === 'MENUNGGAK').length;
  const totalVacant = rooms.filter((r) => r.status === 'KOSONG').length;
  const totalMaintenance = rooms.filter((r) => r.status === 'PERBAIKAN').length;

  const totalMonthlyPotential = rooms.reduce((sum, r) => sum + r.monthlyPrice, 0);
  const totalRealizedRevenue = rooms
    .filter((r) => r.status === 'TERISI')
    .reduce((sum, r) => sum + r.monthlyPrice, 0);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Navbar onReset={loadData} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 space-y-8 w-full">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Kamar Terisi</span>
              <Users className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-2">{totalOccupied} Kamar</div>
            <div className="text-[11px] text-emerald-400/70 mt-1">Penghuni Aktif</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Menunggak Sewa</span>
              <AlertCircle className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-3xl font-black text-rose-400 mt-2">{totalLate} Kamar</div>
            <div className="text-[11px] text-rose-400/70 mt-1">Perlu WhatsApp Reminder</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Kamar Siap Huni</span>
              <Home className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-cyan-400 mt-2">{totalVacant} Kamar</div>
            <div className="text-[11px] text-cyan-400/70 mt-1">Bisa ditawarkan ke tamu baru</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pendapatan Berjalan</span>
              <DollarSign className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 mt-2 font-mono">
              Rp {totalRealizedRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-amber-400/70 mt-1">
              Potensi Total: Rp {totalMonthlyPotential.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        {/* Visual Floor Plan Grid */}
        <FloorPlanView rooms={rooms} />
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-400">RENTPULSE OS v1.0</p>
        <p className="mt-1">Smart Property & Kos-Kosan Rental Operating System.</p>
      </footer>
    </div>
  );
}
