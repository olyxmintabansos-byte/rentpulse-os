"use client";

import React, { useState } from 'react';
import { 
  Building, 
  User, 
  Zap, 
  Droplet, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Room, RoomStatus } from '@/types/rentpulse';
import { RoomDetailModal } from './RoomDetailModal';

interface FloorPlanViewProps {
  rooms: Room[];
}

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({ rooms }) => {
  const [selectedFloor, setSelectedFloor] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | 'ALL'>('ALL');
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filteredRooms = rooms.filter((r) => {
    const matchesFloor = selectedFloor === 'ALL' || r.floor === selectedFloor;
    const matchesStatus = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchesFloor && matchesStatus;
  });

  const getStatusConfig = (status: RoomStatus) => {
    switch (status) {
      case 'TERISI':
        return {
          border: 'border-emerald-700/60 hover:border-emerald-500',
          bg: 'bg-gradient-to-br from-slate-900 to-emerald-950/40',
          badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-800',
          indicator: 'bg-emerald-400',
          text: 'Terisi',
        };
      case 'KOSONG':
        return {
          border: 'border-cyan-700/60 hover:border-cyan-500',
          bg: 'bg-gradient-to-br from-slate-900 to-cyan-950/40',
          badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-800',
          indicator: 'bg-cyan-400',
          text: 'Siap Huni',
        };
      case 'MENUNGGAK':
        return {
          border: 'border-rose-700/60 hover:border-rose-500',
          bg: 'bg-gradient-to-br from-slate-900 to-rose-950/40',
          badgeBg: 'bg-rose-950 text-rose-300 border-rose-800',
          indicator: 'bg-rose-400 animate-pulse',
          text: 'Menunggak',
        };
      case 'PERBAIKAN':
        return {
          border: 'border-amber-700/60 hover:border-amber-500',
          bg: 'bg-gradient-to-br from-slate-900 to-amber-950/40',
          badgeBg: 'bg-amber-950 text-amber-300 border-amber-800',
          indicator: 'bg-amber-400',
          text: 'Perbaikan',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Floor & Status Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        {/* Floor Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Lantai:</span>
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 1, label: 'Lantai 1 & Ruko' },
            { id: 2, label: 'Lantai 2' },
          ].map((fl) => (
            <button
              key={fl.id}
              onClick={() => setSelectedFloor(fl.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFloor === fl.id
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-800/80 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {fl.label}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ALL', label: 'Semua Status' },
            { id: 'TERISI', label: 'Terisi' },
            { id: 'KOSONG', label: 'Siap Huni' },
            { id: 'MENUNGGAK', label: 'Menunggak' },
            { id: 'PERBAIKAN', label: 'Perbaikan' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === st.id
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Interactive Floor Plan Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const config = getStatusConfig(room.status);
          return (
            <div
              key={room.id}
              onClick={() => {
                setActiveRoom(room);
                setIsModalOpen(true);
              }}
              className={`p-5 rounded-3xl border ${config.border} ${config.bg} cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl flex flex-col justify-between space-y-4`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${config.indicator}`} />
                    <h3 className="font-black text-white text-base">{room.roomNumber}</h3>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {room.type.replace('_', ' ')} • Lantai {room.floor}
                  </p>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${config.badgeBg}`}>
                  {config.text}
                </span>
              </div>

              {/* Tenant Meta / Vacancy */}
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
                {room.tenantName ? (
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-400" />
                      <span>Penyewa:</span>
                    </span>
                    <p className="font-bold text-slate-200 truncate">{room.tenantName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{room.tenantPhone}</p>
                  </div>
                ) : (
                  <div className="py-2 text-center text-slate-500 text-xs italic">
                    Kamar Kosong Siap Huni
                  </div>
                )}
              </div>

              {/* Price & Meters */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Sewa Bulanan:</span>
                  <span className="font-mono font-bold text-white">
                    Rp {room.monthlyPrice.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">
                  <div>⚡ {room.lastElectricKwh} kWh</div>
                  <div>💧 {room.lastWaterM3} m³</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Detail Modal */}
      <RoomDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setActiveRoom(null);
        }}
        room={activeRoom}
      />
    </div>
  );
};
