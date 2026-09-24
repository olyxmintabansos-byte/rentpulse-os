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
