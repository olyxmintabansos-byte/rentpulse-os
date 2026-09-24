"use client";

import React, { useState } from 'react';
import { Tenant, Room } from '@/types/rentpulse';
import { StorageEngine } from '@/lib/storage';
import { 
  Users, 
  UserPlus, 
  Search, 
  Phone, 
  MessageSquare, 
  Home, 
  Briefcase, 
  ShieldAlert, 
  LogOut, 
  Calendar, 
  DollarSign,
  Receipt
} from 'lucide-react';
import { AddTenantModal } from './AddTenantModal';

interface TenantManagerViewProps {
  tenants: Tenant[];
  rooms: Room[];
  onRefresh: () => void;
  onOpenBillingForTenant?: (tenant: Tenant) => void;
}

export const TenantManagerView: React.FC<TenantManagerViewProps> = ({
  tenants,
  rooms,
  onRefresh,
  onOpenBillingForTenant,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredTenants = tenants.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.fullName.toLowerCase().includes(term) ||
      t.roomNumber.toLowerCase().includes(term) ||
      t.phone.includes(term) ||
      t.jobOrCampus.toLowerCase().includes(term)
    );
  });

  const handleCheckout = (tenant: Tenant) => {
    const confirmMessage = `Apakah Anda yakin ingin memproses Check-Out untuk penyewa "${tenant.fullName}" dari ${tenant.roomNumber}?\n\nKamar akan otomatis diset menjadi KOSONG dan siap disewakan kembali.`;
    if (!confirm(confirmMessage)) return;

    // 1. Remove tenant from list
    const currentTenants = StorageEngine.getTenants();
    const updatedTenants = currentTenants.filter((t) => t.id !== tenant.id);
    StorageEngine.saveTenants(updatedTenants);

    // 2. Set room to KOSONG and clear tenant info
    const currentRooms = StorageEngine.getRooms();
    const updatedRooms = currentRooms.map((r) => {
      if (r.id === tenant.roomId || r.roomNumber === tenant.roomNumber) {
        return {
          ...r,
          status: 'KOSONG' as const,
          tenantId: undefined,
          tenantName: undefined,
          tenantPhone: undefined,
        };
      }
      return r;
    });
    StorageEngine.saveRooms(updatedRooms);

    onRefresh();
  };

  const handleWhatsApp = (phone: string, name: string, room: string) => {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const message = encodeURIComponent(
      `Halo Kak ${name} (${room}), salam dari Pengelola Kost Pratama Sehat Mandiri. Kami ingin menyapa dan mengonfirmasi mengenai masa sewa kamar Anda. Apakah ada kendala pada fasilitas kamar? Terima kasih!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Cari nama, kamar, no HP, pekerjaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-xs text-slate-400 font-mono hidden md:block">
            Total Penghuni: <strong className="text-emerald-400">{tenants.length} Orang</strong>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950/40 transition"
          >
            <UserPlus className="h-4 w-4" />
            <span>Check-In Penghuni Baru</span>
          </button>
        </div>
      </div>

      {/* Tenants Grid */}
      {filteredTenants.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/30 border border-slate-800/80">
          <Users className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-300">Belum ada data penghuni</p>
          <p className="text-xs text-slate-500 mt-1">
            Klik tombol "Check-In Penghuni Baru" di atas untuk menambahkan penghuni pertama ke kamar kosong.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTenants.map((t) => {
            const room = rooms.find((r) => r.id === t.roomId || r.roomNumber === t.roomNumber);

            return (
              <div
                key={t.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition flex flex-col justify-between space-y-4 group shadow-lg shadow-black/20"
              >
                <div>
                  {/* Top: Name & Room Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                        {t.fullName}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                        <Briefcase className="h-3 w-3 text-slate-500" />
                        <span>{t.jobOrCampus}</span>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-xs font-bold font-mono">
                      {t.roomNumber}
                    </div>
                  </div>

                  {/* Detail Info */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" /> No. WhatsApp
                      </span>
                      <span className="font-mono text-slate-200">{t.phone}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> Tanggal Masuk
                      </span>
                      <span>{t.startDate}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <DollarSign className="h-3.5 w-3.5" /> Deposit Jaminan
                      </span>
                      <span className="font-mono font-bold text-cyan-400">
                        Rp {t.depositPaid.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {t.emergencyContact && (
                      <div className="pt-2 border-t border-slate-800/60 text-[11px] bg-slate-950/40 p-2 rounded-xl">
                        <span className="text-amber-400/90 font-semibold block mb-0.5 flex items-center gap-1">
                          <ShieldAlert className="h-3 w-3" /> Kontak Darurat:
                        </span>
                        <div className="text-slate-400 flex justify-between">
                          <span>{t.emergencyContact.name} ({t.emergencyContact.relationship})</span>
                          <span className="font-mono">{t.emergencyContact.phone}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleWhatsApp(t.phone, t.fullName, t.roomNumber)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/60 text-xs font-semibold transition"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  {onOpenBillingForTenant && (
                    <button
                      onClick={() => onOpenBillingForTenant(t)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 text-cyan-400 border border-cyan-800/60 text-xs font-semibold transition"
                    >
                      <Receipt className="h-3.5 w-3.5" />
                      <span>Tagih</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCheckout(t)}
                    title="Proses Check-Out / Selesai Sewa"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 border border-slate-700 hover:border-rose-800 transition"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Tenant Modal */}
      {isAddModalOpen && (
        <AddTenantModal
          rooms={rooms}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};
