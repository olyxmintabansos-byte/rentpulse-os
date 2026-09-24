"use client";

import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  RotateCcw, 
  Sparkles, 
  Home, 
  Users, 
  Zap, 
  Clock 
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';
import { Room } from '@/types/rentpulse';

interface NavbarProps {
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [timeString, setTimeString] = useState<string>('');

  const loadData = () => {
    setRooms(StorageEngine.getRooms());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('rentpulse_rooms_updated', loadData);
    return () => window.removeEventListener('rentpulse_rooms_updated', loadData);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalOccupied = rooms.filter((r) => r.status === 'TERISI' || r.status === 'MENUNGGAK').length;
  const occupancyPercent = rooms.length > 0 ? Math.round((totalOccupied / rooms.length) * 100) : 0;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 px-4 py-1.5 text-center text-[11px] font-medium text-slate-300 border-b border-slate-800/60 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Sistem Operasi Kost & Properti Sewa — Tingkat Okupansi Properti: <strong className="text-emerald-400 font-bold">{occupancyPercent}% Terisi</strong></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-950/40">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">RentPulse</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-1.5 py-0.5 rounded">
                Property OS v1.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">Kost Pratama Sehat Mandiri & Ruko Senopati</p>
          </div>
        </div>

        {/* Live Clock & Ticker */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
          <Clock className="h-3.5 w-3.5 text-emerald-400" />
          <span>{timeString || 'Memuat...'}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Reset seluruh data properti ke kondisi demo default?')) {
                StorageEngine.resetAll();
              }
            }}
            title="Reset Data Demo"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
