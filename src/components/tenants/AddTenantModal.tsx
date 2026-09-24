"use client";

import React, { useState } from 'react';
import { Room, Tenant } from '@/types/rentpulse';
import { StorageEngine } from '@/lib/storage';
import { 
  X, 
  UserPlus, 
  User, 
  Phone, 
  CreditCard, 
  Briefcase, 
  ShieldAlert, 
  Calendar, 
  DollarSign,
  Home
} from 'lucide-react';

interface AddTenantModalProps {
  rooms: Room[];
  onClose: () => void;
  onSuccess: () => void;
}

export const AddTenantModal: React.FC<AddTenantModalProps> = ({ rooms, onClose, onSuccess }) => {
  const vacantRooms = rooms.filter((r) => r.status === 'KOSONG' || r.status === 'PERBAIKAN');

  const [fullName, setFullName] = useState('');
  const [nik, setNik] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState(vacantRooms[0]?.id || '');
  const [jobOrCampus, setJobOrCampus] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRel, setEmergencyRel] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [depositPaid, setDepositPaid] = useState<number>(() => {
    const defaultRoom = vacantRooms[0];
    return defaultRoom ? defaultRoom.monthlyPrice : 1500000;
  });

  const handleRoomChange = (roomId: string) => {
    setSelectedRoomId(roomId);
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setDepositPaid(room.monthlyPrice);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !selectedRoomId) {
      alert('Mohon lengkapi Nama, Nomor WhatsApp, dan Pilih Kamar!');
      return;
    }

    const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
    if (!selectedRoom) return;

    const newTenant: Tenant = {
      id: `ten-${Date.now().toString().slice(-6)}`,
      fullName,
      nik: nik || '3201000000000000',
      phone: phone.startsWith('0') ? phone : `0${phone}`,
      roomId: selectedRoom.id,
      roomNumber: selectedRoom.roomNumber,
      jobOrCampus: jobOrCampus || 'Karyawan Swasta',
      emergencyContact: {
        name: emergencyName || 'Keluarga',
        relationship: emergencyRel || 'Kerabat',
        phone: emergencyPhone || phone,
      },
      startDate,
      depositPaid: Number(depositPaid) || 0,
    };

    // Update Tenants list
    const currentTenants = StorageEngine.getTenants();
    StorageEngine.saveTenants([...currentTenants, newTenant]);

    // Update Room status to TERISI
    const currentRooms = StorageEngine.getRooms();
    const updatedRooms = currentRooms.map((r) => {
      if (r.id === selectedRoomId) {
        return {
          ...r,
          status: 'TERISI' as const,
          tenantId: newTenant.id,
          tenantName: newTenant.fullName,
          tenantPhone: newTenant.phone,
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
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Onboarding Penghuni Baru</h3>
              <p className="text-xs text-slate-400">Registrasi data penyewa baru & alokasikan kamar</p>
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
          {/* Section 1: Data Pribadi */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <User className="h-4 w-4" /> 1. Data Pribadi Penghuni
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Nomor WhatsApp Aktif *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Nomor NIK / KTP</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="16 digit NIK KTP"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Pekerjaan / Instansi / Kampus</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Contoh: Universitas Indonesia / PT GoTo"
                    value={jobOrCampus}
                    onChange={(e) => setJobOrCampus(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Alokasi Kamar & Biaya */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Home className="h-4 w-4" /> 2. Alokasi Kamar & Keuangan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Pilih Kamar Kosong *</label>
                {vacantRooms.length === 0 ? (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                    Semua kamar saat ini penuh!
                  </div>
                ) : (
                  <select
                    value={selectedRoomId}
                    onChange={(e) => handleRoomChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {vacantRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.roomNumber} (Lt. {r.floor} - Rp {r.monthlyPrice.toLocaleString('id-ID')})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Tanggal Mulai Huni</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Deposit / Jaminan (Rp)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="number"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(Number(e.target.value))}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Kontak Darurat */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" /> 3. Kontak Darurat (Emergency Contact)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Nama Kontak Darurat</label>
                <input
                  type="text"
                  placeholder="Contoh: Susanto"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Hubungan Keluarga</label>
                <input
                  type="text"
                  placeholder="Contoh: Orang Tua / Wali"
                  value={emergencyRel}
                  onChange={(e) => setEmergencyRel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">No. Telp Darurat</label>
                <input
                  type="tel"
                  placeholder="081122334455"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={vacantRooms.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-950/40 transition disabled:opacity-50"
            >
              Simpan & Check-In Penghuni
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
