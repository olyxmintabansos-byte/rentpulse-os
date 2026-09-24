"use client";

import React, { useState } from 'react';
import { 
  X, 
  Home, 
  User, 
  Phone, 
  Zap, 
  Droplet, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench,
  Sparkles
} from 'lucide-react';
import { Room, RoomStatus } from '@/types/rentpulse';
import { StorageEngine } from '@/lib/storage';

interface RoomDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  isOpen,
  onClose,
  room,
}) => {
  const [status, setStatus] = useState<RoomStatus>(room?.status || 'KOSONG');
  const [monthlyPrice, setMonthlyPrice] = useState<number>(room?.monthlyPrice || 1500000);
  const [electricMeter, setElectricMeter] = useState<number>(room?.lastElectricKwh || 0);
  const [waterMeter, setWaterMeter] = useState<number>(room?.lastWaterM3 || 0);
  const [notes, setNotes] = useState<string>(room?.notes || '');

  React.useEffect(() => {
    if (room) {
      setStatus(room.status);
      setMonthlyPrice(room.monthlyPrice);
      setElectricMeter(room.lastElectricKwh);
      setWaterMeter(room.lastWaterM3);
      setNotes(room.notes || '');
    }
  }, [room]);

  if (!isOpen || !room) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const rooms = StorageEngine.getRooms();
    const updated = rooms.map((r) =>
      r.id === room.id
        ? {
            ...r,
            status,
            monthlyPrice: Number(monthlyPrice),
            lastElectricKwh: Number(electricMeter),
            lastWaterM3: Number(waterMeter),
            notes,
          }
        : r
    );
    StorageEngine.saveRooms(updated);
    onClose();
  };

  const statusBadges: Record<RoomStatus, { label: string; color: string }> = {
    TERISI: { label: 'Terisi (Aktif)', color: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
    KOSONG: { label: 'Kosong Siap Huni', color: 'bg-cyan-950 text-cyan-300 border-cyan-800' },
    MENUNGGAK: { label: 'Menunggak Pembayaran', color: 'bg-rose-950 text-rose-300 border-rose-800' },
    PERBAIKAN: { label: 'Sedang Perbaikan/Cleaning', color: 'bg-amber-950 text-amber-300 border-amber-800' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400">
            <Home className="h-5 w-5" />
            <h3 className="text-base font-bold text-white">Detail & Konfigurasi {room.roomNumber}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          {/* Status Kamar */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Status Keterisian Kamar</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RoomStatus)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 font-semibold"
            >
              <option value="TERISI">Terisi (Penghuni Aktif)</option>
              <option value="KOSONG">Kosong (Siap Huni)</option>
              <option value="MENUNGGAK">Menunggak (Perlu Peringatan)</option>
              <option value="PERBAIKAN">Perbaikan / Sedang Cleaning</option>
            </select>
          </div>

          {/* Tenant Details if Occupied */}
          {room.tenantName ? (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Penyewa Aktif</span>
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{room.tenantName}</span>
                <span className="text-emerald-400 font-mono">{room.tenantPhone}</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-slate-500 text-center">
              Kamar sedang tidak memiliki penyewa aktif.
            </div>
          )}

          {/* Pricing & Utility Meters */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 font-medium">Harga Sewa (Rp/Bln)</label>
              <input
                type="number"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-medium">Meteran Listrik (kWh)</label>
              <input
                type="number"
                value={electricMeter}
                onChange={(e) => setElectricMeter(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 font-medium">Meteran Air (m3)</label>
              <input
                type="number"
                value={waterMeter}
                onChange={(e) => setWaterMeter(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          {/* Facilities List */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Fasilitas Kamar:</label>
            <div className="flex flex-wrap gap-1.5">
              {room.facilities.map((f, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Catatan Tambahan Kamar</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Lampu kamar mandi perlu dicek..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
