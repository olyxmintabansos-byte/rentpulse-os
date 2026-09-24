"use client";

import React, { useState, useEffect } from 'react';
import { RentInvoice, Room, Tenant } from '@/types/rentpulse';
import { StorageEngine } from '@/lib/storage';
import { 
  Receipt, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Settings2, 
  DollarSign, 
  AlertCircle, 
  MessageSquare, 
  Printer, 
  Zap, 
  Droplet,
  Eye
} from 'lucide-react';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import { InvoiceModal } from './InvoiceModal';
import { UtilitySettingsModal } from './UtilitySettingsModal';

interface BillingViewProps {
  rooms: Room[];
  tenants: Tenant[];
  onRefresh: () => void;
  targetTenantForBilling?: Tenant | null;
  onClearTargetTenant?: () => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  rooms,
  tenants,
  onRefresh,
  targetTenantForBilling,
  onClearTargetTenant,
}) => {
  const [invoices, setInvoices] = useState<RentInvoice[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'BELUM_BAYAR' | 'LUNAS'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<RentInvoice | null>(null);

  const loadInvoices = () => {
    let list = StorageEngine.getInvoices();
    // Seed initial invoices if empty
    if (list.length === 0) {
      const seeded: RentInvoice[] = [
        {
          id: 'inv-seed-01',
          invoiceNumber: 'INV/2026/09001',
          roomId: 'room-101',
          roomNumber: 'Kamar 101',
          tenantName: 'Dimas Wicaksono',
          tenantPhone: '081299887766',
          monthPeriod: 'September 2026',
          roomFee: 1850000,
          electricKwhStart: 380,
          electricKwhEnd: 420,
          electricCost: 88000,
          waterM3Start: 15,
          waterM3End: 18,
          waterCost: 36000,
          wifiAndTrashFee: 60000,
          lateDays: 0,
          lateFee: 0,
          totalAmount: 2034000,
          status: 'LUNAS',
          dueDate: '2026-09-05',
          paidAt: '2026-09-03T10:15:00.000Z',
        },
        {
          id: 'inv-seed-02',
          invoiceNumber: 'INV/2026/09002',
          roomId: 'room-102',
          roomNumber: 'Kamar 102',
          tenantName: 'Fajar Nugraha',
          tenantPhone: '081377665544',
          monthPeriod: 'September 2026',
          roomFee: 2250000,
          electricKwhStart: 510,
          electricKwhEnd: 580,
          electricCost: 154000,
          waterM3Start: 19,
          waterM3End: 24,
          waterCost: 60000,
          wifiAndTrashFee: 60000,
          lateDays: 4,
          lateFee: 60000,
          totalAmount: 2584000,
          status: 'BELUM_BAYAR',
          dueDate: '2026-09-20',
        },
      ];
      StorageEngine.saveInvoices(seeded);
      list = seeded;
    }
    setInvoices(list);
  };

  useEffect(() => {
    loadInvoices();
    window.addEventListener('rentpulse_invoices_updated', loadInvoices);
    return () => window.removeEventListener('rentpulse_invoices_updated', loadInvoices);
  }, []);

  // Open create modal if redirected with tenant
  useEffect(() => {
    if (targetTenantForBilling) {
      setIsCreateOpen(true);
    }
  }, [targetTenantForBilling]);

  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    if (onClearTargetTenant) onClearTargetTenant();
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filterStatus === 'ALL' || inv.status === filterStatus;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      inv.tenantName.toLowerCase().includes(term) ||
      inv.roomNumber.toLowerCase().includes(term) ||
      inv.invoiceNumber.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  // KPI Metrics
  const totalPaidRevenue = invoices
    .filter((inv) => inv.status === 'LUNAS')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const totalOutstanding = invoices
    .filter((inv) => inv.status === 'BELUM_BAYAR')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const handleQuickWhatsApp = (inv: RentInvoice) => {
    let cleanPhone = inv.tenantPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const message = encodeURIComponent(
      `Halo Kak ${inv.tenantName} (${inv.roomNumber}), tagihan sewa kost periode *${inv.monthPeriod}* sebesar *Rp ${inv.totalAmount.toLocaleString('id-ID')}* telah terbit. Jatuh tempo: *${inv.dueDate}*. Mohon konfirmasinya jika telah melakukan transfer. Terima kasih!`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Terbayar (Bulan Berjalan)</span>
            <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
              Rp {totalPaidRevenue.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-emerald-400/70 mt-0.5">Kwitansi Lunas</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Piutang Belum Bayar</span>
            <div className="text-2xl font-black text-rose-400 mt-1 font-mono">
              Rp {totalOutstanding.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-rose-400/70 mt-0.5">Perlu Follow-up WhatsApp</div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Total Invoice Terbit</span>
            <div className="text-2xl font-black text-white mt-1 font-mono">
              {invoices.length} Faktur
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Kalkulasi Otomatis Utilitas</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Receipt className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Control Bar & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterStatus === 'ALL'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({invoices.length})
            </button>
            <button
              onClick={() => setFilterStatus('BELUM_BAYAR')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterStatus === 'BELUM_BAYAR'
                  ? 'bg-rose-950 text-rose-400 border border-rose-800/60 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Belum Bayar
            </button>
            <button
              onClick={() => setFilterStatus('LUNAS')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterStatus === 'LUNAS'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lunas
            </button>
          </div>

          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Cari penghuni, kamar, nomor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Atur Tarif Listrik, Air, & Denda"
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <Settings2 className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-950/40 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Terbitkan Tagihan Baru</span>
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Kamar & Penghuni</th>
                <th className="py-3 px-4">Periode</th>
                <th className="py-3 px-4">Meteran Utilitas</th>
                <th className="py-3 px-4">Total Tagihan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Tidak ada tagihan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isPaid = inv.status === 'LUNAS';

                  return (
                    <tr key={inv.id} className="hover:bg-slate-850/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{inv.tenantName}</div>
                        <div className="text-[11px] text-cyan-400 font-mono">{inv.roomNumber}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200">{inv.monthPeriod}</div>
                        <div className="text-[10px] text-slate-500">Jatuh Tempo: {inv.dueDate}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                          <Zap className="h-3 w-3" /> {inv.electricKwhEnd - inv.electricKwhStart} kWh (Rp {inv.electricCost.toLocaleString('id-ID')})
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
                          <Droplet className="h-3 w-3" /> {inv.waterM3End - inv.waterM3Start} m³ (Rp {inv.waterCost.toLocaleString('id-ID')})
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-black text-sm text-emerald-400">
                          Rp {inv.totalAmount.toLocaleString('id-ID')}
                        </div>
                        {inv.lateFee > 0 && (
                          <span className="text-[10px] text-rose-400 font-mono">
                            +Denda Rp {inv.lateFee.toLocaleString('id-ID')}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            isPaid
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isPaid ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {isPaid ? 'Lunas' : 'Belum Bayar'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            title="Lihat / Cetak Kwitansi"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleQuickWhatsApp(inv)}
                            title="Kirim Reminder WhatsApp"
                            className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800/80 transition"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <CreateInvoiceModal
          rooms={rooms}
          preSelectedTenant={targetTenantForBilling}
          onClose={handleCloseCreate}
          onSuccess={() => {
            loadInvoices();
            onRefresh();
          }}
        />
      )}

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onRefresh={() => {
            loadInvoices();
            onRefresh();
          }}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <UtilitySettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onSuccess={() => {
            loadInvoices();
            onRefresh();
          }}
        />
      )}
    </div>
  );
};
