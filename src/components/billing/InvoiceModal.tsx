"use client";

import React, { useRef } from 'react';
import { RentInvoice } from '@/types/rentpulse';
import { StorageEngine } from '@/lib/storage';
import { 
  X, 
  Receipt, 
  Printer, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Zap, 
  Droplet, 
  Share2 
} from 'lucide-react';

interface InvoiceModalProps {
  invoice: RentInvoice;
  onClose: () => void;
  onRefresh: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose, onRefresh }) => {
  const isPaid = invoice.status === 'LUNAS';

  const handleToggleStatus = () => {
    const currentInvoices = StorageEngine.getInvoices();
    const updated = currentInvoices.map((inv) => {
      if (inv.id === invoice.id) {
        return {
          ...inv,
          status: (isPaid ? 'BELUM_BAYAR' : 'LUNAS') as 'BELUM_BAYAR' | 'LUNAS',
          paidAt: !isPaid ? new Date().toISOString() : undefined,
        };
      }
      return inv;
    });
    StorageEngine.saveInvoices(updated);

    // Also update room status if paid
    if (!isPaid) {
      const currentRooms = StorageEngine.getRooms();
      const updatedRooms = currentRooms.map((r) => {
        if (r.id === invoice.roomId || r.roomNumber === invoice.roomNumber) {
          return {
            ...r,
            status: 'TERISI' as const,
            notes: undefined,
          };
        }
        return r;
      });
      StorageEngine.saveRooms(updatedRooms);
    }

    onRefresh();
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    let cleanPhone = invoice.tenantPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const message = encodeURIComponent(
`*INVOICE TAGIHAN SEWA KOST*
*Kost Pratama Sehat Mandiri*
----------------------------------------
No. Invoice : ${invoice.invoiceNumber}
Kamar       : ${invoice.roomNumber}
Penghuni    : ${invoice.tenantName}
Periode     : ${invoice.monthPeriod}
Jatuh Tempo : ${invoice.dueDate}

*RINCIAN BIAYA:*
- Sewa Pokok     : Rp ${invoice.roomFee.toLocaleString('id-ID')}
- Listrik (${invoice.electricKwhEnd - invoice.electricKwhStart} kWh): Rp ${invoice.electricCost.toLocaleString('id-ID')}
- Air PDAM (${invoice.waterM3End - invoice.waterM3Start} m³)  : Rp ${invoice.waterCost.toLocaleString('id-ID')}
- WiFi & Sampah  : Rp ${invoice.wifiAndTrashFee.toLocaleString('id-ID')}${invoice.lateFee > 0 ? `\n- Denda Telat (${invoice.lateDays} hari) : Rp ${invoice.lateFee.toLocaleString('id-ID')}` : ''}
----------------------------------------
*TOTAL TAGIHAN : Rp ${invoice.totalAmount.toLocaleString('id-ID')}*
Status         : ${invoice.status === 'LUNAS' ? '✅ SUDAH LUNAS' : '⚠️ BELUM DIBAYAR'}

Pembayaran via Transfer:
Bank BCA: 820-1234-990
A/N: Pengelola Kost Mandiri

Mohon kirimkan bukti transfer setelah melakukan pembayaran. Terima kasih!`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 print:hidden">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Receipt className="h-4 w-4 text-emerald-400" />
            <span>Kwitansi / Invoice Digital</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-100 bg-slate-950/40">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Watermark / Badge */}
            <div className="absolute right-4 top-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  isPaid
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isPaid ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                {isPaid ? 'LUNAS' : 'BELUM BAYAR'}
              </span>
            </div>

            {/* Header Properti */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Kost Pratama Sehat Mandiri</h3>
                <p className="text-[11px] text-slate-400">Jl. Margonda Raya No. 45, Depan Kampus UI</p>
                <p className="text-[10px] text-slate-500 font-mono">WhatsApp Admin: 0812-9988-7700</p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-800/80">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Nomor Tagihan</span>
                <span className="font-mono font-bold text-white">{invoice.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Periode Sewa</span>
                <span className="font-semibold text-emerald-400">{invoice.monthPeriod}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Penyewa</span>
                <span className="font-bold text-white">{invoice.tenantName}</span>
                <span className="block text-[11px] font-mono text-slate-400">{invoice.tenantPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Unit Kamar</span>
                <span className="font-bold text-cyan-400">{invoice.roomNumber}</span>
                <span className="block text-[10px] text-slate-400">Jatuh Tempo: {invoice.dueDate}</span>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="py-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Sewa Kamar Pokok</span>
                <span className="font-mono">Rp {invoice.roomFee.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-amber-400" />
                  Listrik ({invoice.electricKwhStart} → {invoice.electricKwhEnd} kWh = {invoice.electricKwhEnd - invoice.electricKwhStart} kWh)
                </span>
                <span className="font-mono">Rp {invoice.electricCost.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1">
                  <Droplet className="h-3 w-3 text-cyan-400" />
                  Air PDAM ({invoice.waterM3Start} → {invoice.waterM3End} m³ = {invoice.waterM3End - invoice.waterM3Start} m³)
                </span>
                <span className="font-mono">Rp {invoice.waterCost.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Iuran WiFi Bersama & Retribusi Sampah</span>
                <span className="font-mono">Rp {invoice.wifiAndTrashFee.toLocaleString('id-ID')}</span>
              </div>

              {invoice.lateFee > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Denda Keterlambatan ({invoice.lateDays} Hari)</span>
                  <span className="font-mono">Rp {invoice.lateFee.toLocaleString('id-ID')}</span>
                </div>
              )}

              {/* Total Row */}
              <div className="pt-3 border-t border-slate-700/80 flex justify-between items-center text-sm font-bold">
                <span className="text-white uppercase tracking-wider font-extrabold">TOTAL BAYAR</span>
                <span className="text-lg font-mono font-black text-emerald-400">
                  Rp {invoice.totalAmount.toLocaleString('id-ID')}
                </span>
              </div>

              {invoice.paidAt && (
                <p className="text-[10px] text-emerald-400 text-right pt-1 font-mono">
                  Diterima lunas pada: {new Date(invoice.paidAt).toLocaleString('id-ID')}
                </p>
              )}
            </div>

            {/* Footer Notice */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
              Bukti pembayaran ini diterbitkan secara otomatis dan sah melalui Sistem Manajemen RentPulse OS.
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (Hidden when printing) */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              isPaid
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isPaid ? 'Batal Lunas (Set Belum Bayar)' : 'Konfirmasi Lunas'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Kirim WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
