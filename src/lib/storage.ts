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
