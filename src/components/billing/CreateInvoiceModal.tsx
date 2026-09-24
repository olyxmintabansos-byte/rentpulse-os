"use client";

import React, { useState, useEffect } from 'react';
import { Room, Tenant, UtilityRates, RentInvoice } from '@/types/rentpulse';
import { StorageEngine } from '@/lib/storage';
import { 
  X, 
  Receipt, 
  Zap, 
  Droplet, 
  Wifi, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Calculator 
} from 'lucide-react';

interface CreateInvoiceModalProps {
  rooms: Room[];
  preSelectedTenant?: Tenant | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  rooms,
  preSelectedTenant,
  onClose,
  onSuccess,
}) => {
  const occupiedRooms = rooms.filter((r) => r.status === 'TERISI' || r.status === 'MENUNGGAK');
  const rates = StorageEngine.getRates();

  const [selectedRoomId, setSelectedRoomId] = useState<string>(() => {
    if (preSelectedTenant) {
      const match = rooms.find((r) => r.id === preSelectedTenant.roomId || r.roomNumber === preSelectedTenant.roomNumber);
      if (match) return match.id;
    }
    return occupiedRooms[0]?.id || '';
  });

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const [monthPeriod, setMonthPeriod] = useState<string>(() => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  });

  const [electricStart, setElectricStart] = useState<number>(selectedRoom?.lastElectricKwh || 0);
  const [electricEnd, setElectricEnd] = useState<number>((selectedRoom?.lastElectricKwh || 0) + 45);

  const [waterStart, setWaterStart] = useState<number>(selectedRoom?.lastWaterM3 || 0);
  const [waterEnd, setWaterEnd] = useState<number>((selectedRoom?.lastWaterM3 || 0) + 4);

  const [lateDays, setLateDays] = useState<number>(selectedRoom?.status === 'MENUNGGAK' ? 4 : 0);
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });

  // When room changes, sync initial meters
  useEffect(() => {
    if (selectedRoom) {
      setElectricStart(selectedRoom.lastElectricKwh || 0);
      setElectricEnd((selectedRoom.lastElectricKwh || 0) + 45);
      setWaterStart(selectedRoom.lastWaterM3 || 0);
      setWaterEnd((selectedRoom.lastWaterM3 || 0) + 4);
      setLateDays(selectedRoom.status === 'MENUNGGAK' ? 4 : 0);
    }
  }, [selectedRoomId]);

  // Calculations
  const roomFee = selectedRoom?.monthlyPrice || 0;
  const electricUsage = Math.max(0, electricEnd - electricStart);
  const electricCost = electricUsage * rates.electricPerKwh;

  const waterUsage = Math.max(0, waterEnd - waterStart);
  const waterCost = waterUsage * rates.waterPerM3;

  const wifiAndTrashFee = rates.wifiAndTrashFee;
  const lateFee = lateDays * rates.lateFeePerDay;

  const totalAmount = roomFee + electricCost + waterCost + wifiAndTrashFee + lateFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    const newInvoice: RentInvoice = {
      id: `inv-${Date.now().toString().slice(-6)}`,
      invoiceNumber: `INV/${new Date().getFullYear()}/${Date.now().toString().slice(-5)}`,
      roomId: selectedRoom.id,
      roomNumber: selectedRoom.roomNumber,
      tenantName: selectedRoom.tenantName || 'Penghuni',
      tenantPhone: selectedRoom.tenantPhone || '081200000000',
      monthPeriod,
      roomFee,
      electricKwhStart: electricStart,
      electricKwhEnd: electricEnd,
      electricCost,
      waterM3Start: waterStart,
      waterM3End: waterEnd,
      waterCost,
      wifiAndTrashFee,
      lateDays,
      lateFee,
      totalAmount,
      status: 'BELUM_BAYAR',
      dueDate,
    };

    // 1. Save Invoice
    const currentInvoices = StorageEngine.getInvoices();
    StorageEngine.saveInvoices([newInvoice, ...currentInvoices]);

    // 2. Update Room latest meter reading
    const currentRooms = StorageEngine.getRooms();
    const updatedRooms = currentRooms.map((r) => {
      if (r.id === selectedRoom.id) {
        return {
          ...r,
          lastElectricKwh: electricEnd,
          lastWaterM3: waterEnd,
          status: lateDays > 0 ? ('MENUNGGAK' as const) : r.status,
        };
      }
      return r;
    });
    StorageEngine.saveRooms(updatedRooms);

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Generate Tagihan Bulanan</h3>
              <p className="text-xs text-slate-400">Kalkulasi sewa kamar + meteran listrik & air digital</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-200">
          {/* Room & Period */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Pilih Kamar / Penghuni *</label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              >
                {occupiedRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.roomNumber} - {r.tenantName || 'Tanpa Nama'} (Rp {r.monthlyPrice.toLocaleString('id-ID')})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Periode Tagihan Bulan</label>
              <input
                type="text"
                value={monthPeriod}
                onChange={(e) => setMonthPeriod(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Electric Meter Sub-Form */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Zap className="h-4 w-4" /> Meteran Listrik (Tarif: Rp {rates.electricPerKwh.toLocaleString('id-ID')} / kWh)
              </span>
              <span className="text-slate-400">Pemakaian: <strong className="text-white font-mono">{electricUsage} kWh</strong></span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Meter Awal (kWh)</label>
                <input
                  type="number"
                  value={electricStart}
                  onChange={(e) => setElectricStart(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Meter Akhir Saat Ini (kWh)</label>
                <input
                  type="number"
                  value={electricEnd}
                  onChange={(e) => setElectricEnd(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div className="text-right text-xs text-amber-400/90 font-mono">
              Subtotal Listrik: Rp {electricCost.toLocaleString('id-ID')}
            </div>
          </div>

          {/* Water Meter Sub-Form */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Droplet className="h-4 w-4" /> Meteran Air (Tarif: Rp {rates.waterPerM3.toLocaleString('id-ID')} / m³)
              </span>
              <span className="text-slate-400">Pemakaian: <strong className="text-white font-mono">{waterUsage} m³</strong></span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Meter Awal (m³)</label>
                <input
                  type="number"
                  value={waterStart}
                  onChange={(e) => setWaterStart(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Meter Akhir Saat Ini (m³)</label>
                <input
                  type="number"
                  value={waterEnd}
                  onChange={(e) => setWaterEnd(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <div className="text-right text-xs text-cyan-400/90 font-mono">
              Subtotal Air: Rp {waterCost.toLocaleString('id-ID')}
            </div>
          </div>

          {/* Fixed Dues & Late Fees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" /> Hari Keterlambatan (Denda Rp {rates.lateFeePerDay.toLocaleString('id-ID')}/hari)
              </label>
              <input
                type="number"
                min="0"
                value={lateDays}
                onChange={(e) => setLateDays(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-cyan-400" /> Tanggal Jatuh Tempo
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Invoice Summary Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border border-emerald-500/30 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Sewa Pokok Kamar ({selectedRoom?.roomNumber})</span>
              <span className="font-mono">Rp {roomFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Listrik ({electricUsage} kWh)</span>
              <span className="font-mono">Rp {electricCost.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Air PDAM ({waterUsage} m³)</span>
              <span className="font-mono">Rp {waterCost.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Iuran Sampah & WiFi Kost</span>
              <span className="font-mono">Rp {wifiAndTrashFee.toLocaleString('id-ID')}</span>
            </div>
            {lateFee > 0 && (
              <div className="flex justify-between text-xs text-rose-400">
                <span>Denda Keterlambatan ({lateDays} Hari)</span>
                <span className="font-mono">Rp {lateFee.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
              <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
                <Calculator className="h-4 w-4" /> TOTAL TAGIHAN
              </span>
              <span className="text-lg font-mono font-black text-emerald-400">
                Rp {totalAmount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold shadow-lg shadow-cyan-950/40 transition"
            >
              Terbitkan Invoice Tagihan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
