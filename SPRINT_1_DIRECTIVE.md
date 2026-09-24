<USER_REQUEST>
================================================================================
HERMES MEGA-DIRECTIVE: RENTPULSE - SPRINT 1 (CORE SHELL & ROOM FLOOR PLAN)
================================================================================
Role: Principal Systems Architect & Lead Engineer.
Target Directory: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os

CRITICAL PROTOCOLS:
1. ALWAYS use the `terminal` tool to run commands in PowerShell.
2. For pre-existing files, ALWAYS run `read_file` first before calling `write_file`.
3. ZERO PLACEHOLDERS: Write complete, typed TypeScript code with full interactive logic.
4. Execute all steps sequentially and compile with `npm run build`.

--------------------------------------------------------------------------------
STEP 1: INITIALIZE DIRECTORY SKELETON
--------------------------------------------------------------------------------
Execute the following PowerShell command in the terminal:

New-Item -ItemType Directory -Force -Path "C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\app", "C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\components\layout", "C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\components\floorplan", "C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\types", "C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\lib", "C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\public"

--------------------------------------------------------------------------------
FILE 1: package.json
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\package.json
--------------------------------------------------------------------------------
{
  "name": "rentpulse-os",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy": "gh-pages -d out -t --dotfiles"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^1.16.0",
    "next": "^15.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.0.2"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.9",
    "@types/node": "^22.13.0",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "gh-pages": "^6.3.0",
    "postcss": "^8.5.2",
    "tailwindcss": "^4.0.9",
    "typescript": "^5.7.3"
  }
}

--------------------------------------------------------------------------------
FILE 2: tsconfig.json
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\tsconfig.json
--------------------------------------------------------------------------------
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

--------------------------------------------------------------------------------
FILE 3: next.config.mjs
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\next.config.mjs
--------------------------------------------------------------------------------
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/rentpulse-os' : '',
};

export default nextConfig;

--------------------------------------------------------------------------------
FILE 4: postcss.config.mjs
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\postcss.config.mjs
--------------------------------------------------------------------------------
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};

--------------------------------------------------------------------------------
FILE 5: src/app/globals.css
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\app\globals.css
--------------------------------------------------------------------------------
@import "tailwindcss";

@layer base {
  :root {
    --background: #090d16;
    --foreground: #f1f5f9;
  }
}

body {
  background-color: #090d16;
  color: #f1f5f9;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #090d16;
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

--------------------------------------------------------------------------------
FILE 6: public/.nojekyll
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\public\.nojekyll
--------------------------------------------------------------------------------
# Prevent GitHub Pages Jekyll Processing

--------------------------------------------------------------------------------
FILE 7: src/types/rentpulse.ts
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\types\rentpulse.ts
--------------------------------------------------------------------------------
export type RoomStatus = 'TERISI' | 'KOSONG' | 'MENUNGGAK' | 'PERBAIKAN';
export type RoomType = 'AC_STANDARD' | 'AC_DELUXE' | 'NON_AC' | 'RUKO_DEPAN';

export interface Room {
  id: string;
  roomNumber: string; // e.g. "Kamar 101", "Ruko A-1"
  floor: number; // 1, 2, 3
  type: RoomType;
  monthlyPrice: number;
  status: RoomStatus;
  tenantId?: string;
  tenantName?: string;
  tenantPhone?: string;
  facilities: string[];
  lastElectricKwh: number;
  lastWaterM3: number;
  notes?: string;
}

export interface Tenant {
  id: string;
  fullName: string;
  nik: string;
  phone: string;
  roomId: string;
  roomNumber: string;
  jobOrCampus: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  startDate: string; // YYYY-MM-DD
  depositPaid: number;
}

export interface UtilityRates {
  electricPerKwh: number; // e.g. 2200
  waterPerM3: number; // e.g. 12000
  wifiAndTrashFee: number; // e.g. 60000
  lateFeePerDay: number; // e.g. 15000
}

export interface RentInvoice {
  id: string;
  invoiceNumber: string;
  roomId: string;
  roomNumber: string;
  tenantName: string;
  tenantPhone: string;
  monthPeriod: string; // e.g. "Oktober 2026"
  roomFee: number;
  electricKwhStart: number;
  electricKwhEnd: number;
  electricCost: number;
  waterM3Start: number;
  waterM3End: number;
  waterCost: number;
  wifiAndTrashFee: number;
  lateDays: number;
  lateFee: number;
  totalAmount: number;
  status: 'BELUM_BAYAR' | 'LUNAS';
  dueDate: string;
  paidAt?: string;
}

--------------------------------------------------------------------------------
FILE 8: src/lib/mock-data.ts
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\lib\mock-data.ts
--------------------------------------------------------------------------------
import { Room, Tenant, UtilityRates, RentInvoice } from '@/types/rentpulse';

export const DEFAULT_UTILITY_RATES: UtilityRates = {
  electricPerKwh: 2200,
  waterPerM3: 12000,
  wifiAndTrashFee: 60000,
  lateFeePerDay: 15000,
};

export const INITIAL_ROOMS: Room[] = [
  // Lantai 1
  {
    id: 'room-101',
    roomNumber: 'Kamar 101',
    floor: 1,
    type: 'AC_STANDARD',
    monthlyPrice: 1850000,
    status: 'TERISI',
    tenantId: 'ten-01',
    tenantName: 'Dimas Wicaksono',
    tenantPhone: '081299887766',
    facilities: ['AC 1/2 PK', 'Kamar Mandi Dalam', 'Kasur Springbed', 'Lemari Pakaian', 'Meja Kerja'],
    lastElectricKwh: 420,
    lastWaterM3: 18,
  },
  {
    id: 'room-102',
    roomNumber: 'Kamar 102',
    floor: 1,
    type: 'AC_DELUXE',
    monthlyPrice: 2250000,
    status: 'MENUNGGAK',
    tenantId: 'ten-02',
    tenantName: 'Fajar Nugraha',
    tenantPhone: '081377665544',
    facilities: ['AC 1 PK', 'Water Heater', 'Smart TV 32"', 'Kamar Mandi Dalam', 'Balkon'],
    lastElectricKwh: 580,
    lastWaterM3: 24,
    notes: 'Jatuh tempo tanggal 20 September. Terlambat 4 hari.',
  },
  {
    id: 'room-103',
    roomNumber: 'Kamar 103',
    floor: 1,
    type: 'NON_AC',
    monthlyPrice: 1100000,
    status: 'KOSONG',
    facilities: ['Kipas Angin Dinding', 'Kamar Mandi Luar', 'Kasur Busa', 'Lemari'],
    lastElectricKwh: 110,
    lastWaterM3: 6,
  },
  {
    id: 'room-104',
    roomNumber: 'Kamar 104',
    floor: 1,
    type: 'AC_STANDARD',
    monthlyPrice: 1850000,
    status: 'PERBAIKAN',
    facilities: ['AC 1/2 PK', 'Kamar Mandi Dalam', 'Kasur Springbed'],
    lastElectricKwh: 310,
    lastWaterM3: 12,
    notes: 'Sedang pengecatan ulang dinding dan servis AC berkala.',
  },

  // Lantai 2
  {
    id: 'room-201',
    roomNumber: 'Kamar 201',
    floor: 2,
    type: 'AC_STANDARD',
    monthlyPrice: 1900000,
    status: 'TERISI',
    tenantId: 'ten-03',
    tenantName: 'Siti Sarah Rahmawati',
    tenantPhone: '081512349876',
    facilities: ['AC 1/2 PK', 'Kamar Mandi Dalam', 'Jendela Hadap Taman', 'Meja Belajar'],
    lastElectricKwh: 345,
    lastWaterM3: 15,
  },
  {
    id: 'room-202',
    roomNumber: 'Kamar 202',
    floor: 2,
    type: 'AC_DELUXE',
    monthlyPrice: 2300000,
    status: 'KOSONG',
    facilities: ['AC 1 PK', 'Kulkas Mini', 'Water Heater', 'Kamar Mandi Dalam'],
    lastElectricKwh: 12,
    lastWaterM3: 2,
  },
  {
    id: 'room-203',
    roomNumber: 'Kamar 203',
    floor: 2,
    type: 'AC_STANDARD',
    monthlyPrice: 1900000,
    status: 'TERISI',
    tenantId: 'ten-04',
    tenantName: 'Kevin Anggara',
    tenantPhone: '081765432109',
    facilities: ['AC 1/2 PK', 'Kamar Mandi Dalam', 'High Speed LAN'],
    lastElectricKwh: 490,
    lastWaterM3: 19,
  },
  {
    id: 'room-204',
    roomNumber: 'Kamar 204',
    floor: 2,
    type: 'NON_AC',
    monthlyPrice: 1150000,
    status: 'KOSONG',
    facilities: ['Exhaust Fan', 'Kasur Single', 'Lemari', 'Kamar Mandi Luar'],
    lastElectricKwh: 40,
    lastWaterM3: 4,
  },

  // Ruko Depan
  {
    id: 'room-ruko-1',
    roomNumber: 'Ruko A-1 Depan',
    floor: 1,
    type: 'RUKO_DEPAN',
    monthlyPrice: 4500000,
    status: 'TERISI',
    tenantId: 'ten-05',
    tenantName: 'Kopi Kenangan Senja (Barista)',
    tenantPhone: '081988112233',
    facilities: ['Rolling Door Otomatis', 'Listrik 4400 Watt', 'Air PDAM Mandiri', 'Toilet Dalam'],
    lastElectricKwh: 1240,
    lastWaterM3: 54,
  },
];

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'ten-01',
    fullName: 'Dimas Wicaksono',
    nik: '3201123456780001',
    phone: '081299887766',
    roomId: 'room-101',
    roomNumber: 'Kamar 101',
    jobOrCampus: 'Software Engineer di Tech Co.',
    emergencyContact: {
      name: 'Bambang Wicaksono',
      relationship: 'Orang Tua (Ayah)',
      phone: '081122334455',
    },
    startDate: '2026-02-01',
    depositPaid: 1850000,
  },
  {
    id: 'ten-02',
    fullName: 'Fajar Nugraha',
    nik: '3201123456780002',
    phone: '081377665544',
    roomId: 'room-102',
    roomNumber: 'Kamar 102',
    jobOrCampus: 'Digital Marketer',
    emergencyContact: {
      name: 'Rina Nugraha',
      relationship: 'Kakak Kandung',
      phone: '081233445566',
    },
    startDate: '2026-05-15',
    depositPaid: 2250000,
  },
];

--------------------------------------------------------------------------------
FILE 9: src/lib/storage.ts
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\lib\storage.ts
--------------------------------------------------------------------------------
import { Room, Tenant, UtilityRates, RentInvoice } from '@/types/rentpulse';
import { INITIAL_ROOMS, INITIAL_TENANTS, DEFAULT_UTILITY_RATES } from './mock-data';

const STORAGE_KEYS = {
  ROOMS: 'rentpulse_rooms_v1',
  TENANTS: 'rentpulse_tenants_v1',
  RATES: 'rentpulse_rates_v1',
  INVOICES: 'rentpulse_invoices_v1',
};

export const StorageEngine = {
  getRooms(): Room[] {
    if (typeof window === 'undefined') return INITIAL_ROOMS;
    const raw = localStorage.getItem(STORAGE_KEYS.ROOMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
      return INITIAL_ROOMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ROOMS;
    }
  },

  saveRooms(rooms: Room[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    window.dispatchEvent(new Event('rentpulse_rooms_updated'));
  },

  getTenants(): Tenant[] {
    if (typeof window === 'undefined') return INITIAL_TENANTS;
    const raw = localStorage.getItem(STORAGE_KEYS.TENANTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(INITIAL_TENANTS));
      return INITIAL_TENANTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TENANTS;
    }
  },

  saveTenants(tenants: Tenant[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(tenants));
    window.dispatchEvent(new Event('rentpulse_tenants_updated'));
  },

  getRates(): UtilityRates {
    if (typeof window === 'undefined') return DEFAULT_UTILITY_RATES;
    const raw = localStorage.getItem(STORAGE_KEYS.RATES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(DEFAULT_UTILITY_RATES));
      return DEFAULT_UTILITY_RATES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_UTILITY_RATES;
    }
  },

  saveRates(rates: UtilityRates): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(rates));
    window.dispatchEvent(new Event('rentpulse_rates_updated'));
  },

  getInvoices(): RentInvoice[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.INVOICES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveInvoices(invoices: RentInvoice[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    window.dispatchEvent(new Event('rentpulse_invoices_updated'));
  },

  resetAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
    localStorage.setItem(STORAGE_KEYS.TENANTS, JSON.stringify(INITIAL_TENANTS));
    localStorage.setItem(STORAGE_KEYS.RATES, JSON.stringify(DEFAULT_UTILITY_RATES));
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    window.location.reload();
  },
};

--------------------------------------------------------------------------------
FILE 10: src/components/layout/Navbar.tsx
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\components\layout\Navbar.tsx
--------------------------------------------------------------------------------
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

--------------------------------------------------------------------------------
FILE 11: src/components/floorplan/RoomDetailModal.tsx
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\components\floorplan\RoomDetailModal.tsx
--------------------------------------------------------------------------------
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

--------------------------------------------------------------------------------
FILE 12: src/components/floorplan/FloorPlanView.tsx
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\components\floorplan\FloorPlanView.tsx
--------------------------------------------------------------------------------
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

--------------------------------------------------------------------------------
FILE 13: src/app/layout.tsx
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\app\layout.tsx
--------------------------------------------------------------------------------
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RentPulse OS | Smart Property & Kos-Kosan Rental Management',
  description: 'Sistem Operasi Manajemen Kos-Kosan, Kontrakan, Ruko, & Apartemen Sewa Terpadu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}

--------------------------------------------------------------------------------
FILE 14: src/app/page.tsx
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os\src\app\page.tsx
--------------------------------------------------------------------------------
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

--------------------------------------------------------------------------------
STEP 2: TERMINAL COMPILATION & VERIFICATION
--------------------------------------------------------------------------------
Execute the following PowerShell commands in the terminal:

Set-Location "C:\Users\L480\AppData\Local\hermes\cache\scratch\rentpulse-os"
npm install
npm run build

--------------------------------------------------------------------------------
STEP 3: INITIAL GIT COMMIT
--------------------------------------------------------------------------------
Execute the following git command:

git init
git config user.name "olyxmintabansos-byte"
git config user.email "olyxmintabansos-byte@users.noreply.github.com"
git add .
git commit -m "feat(rentpulse): sprint 1 visual room floor plan, room detail modal & local storage engine"
================================================================================

tolong tegur dong, gue pertama lu udah bilang terus gue bilang lagi tapi dia tetap kekeh bikin kode
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-09-24T20:35:17+08:00.
</ADDITIONAL_METADATA>