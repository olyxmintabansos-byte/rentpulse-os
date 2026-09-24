"use client";

import React, { useState } from 'react';
import { UtilityRates } from '@/types/rentpulse';
import { StorageEngine } from '@/lib/storage';
import { X, Settings2, Zap, Droplet, Wifi, AlertTriangle, Save } from 'lucide-react';

interface UtilitySettingsModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const UtilitySettingsModal: React.FC<UtilitySettingsModalProps> = ({ onClose, onSuccess }) => {
  const currentRates = StorageEngine.getRates();

  const [electricPerKwh, setElectricPerKwh] = useState(currentRates.electricPerKwh);
  const [waterPerM3, setWaterPerM3] = useState(currentRates.waterPerM3);
  const [wifiAndTrashFee, setWifiAndTrashFee] = useState(currentRates.wifiAndTrashFee);
  const [lateFeePerDay, setLateFeePerDay] = useState(currentRates.lateFeePerDay);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRates: UtilityRates = {
      electricPerKwh: Number(electricPerKwh) || 2200,
      waterPerM3: Number(waterPerM3) || 12000,
      wifiAndTrashFee: Number(wifiAndTrashFee) || 60000,
      lateFeePerDay: Number(lateFeePerDay) || 15000,
    };

    StorageEngine.saveRates(updatedRates);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pengaturan Tarif Utilitas</h3>
              <p className="text-xs text-slate-400">Parameter kalkulasi otomatis tagihan sewa</p>
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
        <form onSubmit={handleSave} className="p-6 space-y-4 text-sm text-slate-200">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" /> Tarif Listrik per kWh (Rp)
            </label>
            <input
              type="number"
              required
              value={electricPerKwh}
              onChange={(e) => setElectricPerKwh(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Droplet className="h-3.5 w-3.5 text-cyan-400" /> Tarif Air PDAM per m³ (Rp)
            </label>
            <input
              type="number"
              required
              value={waterPerM3}
              onChange={(e) => setWaterPerM3(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-emerald-400" /> Iuran WiFi & Kebersihan Kost (Rp/Bulan)
            </label>
            <input
              type="number"
              required
              value={wifiAndTrashFee}
              onChange={(e) => setWifiAndTrashFee(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" /> Denda Keterlambatan Harian (Rp/Hari)
            </label>
            <input
              type="number"
              required
              value={lateFeePerDay}
              onChange={(e) => setLateFeePerDay(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Tarif</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
