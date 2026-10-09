export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface Stellplatz {
  id: number;
  nummer: string;
  typ: 'wohnmobil' | 'zelt' | 'wohnwagen';
  beschreibung: string;
  preis_pro_nacht: number;
  hat_strom: boolean;
  hat_wasser: boolean;
  ist_aktiv: boolean;
  created_at?: string;
}

export interface Buchung {
  id: number;
  stellplatz_id: number;
  gast_name: string;
  gast_email: string;
  gast_telefon: string;
  check_in: string;
  check_out: string;
  status: 'reserviert' | 'checked_in' | 'checked_out' | 'storniert';
  gesamtpreis: number;
  strom_zaehler_start: number | null;
  strom_zaehler_ende: number | null;
  wasser_zaehler_start: number | null;
  wasser_zaehler_ende: number | null;
  created_at?: string;
}

export interface Saisonpreis {
  id: number;
  name: string;
  start_datum: string;
  end_datum: string;
  preis_pro_nacht: number;
  stellplatz_typ: string;
}

export interface DashboardStats {
  gesamt_stellplaetze: number;
  belegte_stellplaetze: number;
  freie_stellplaetze: number;
  aktive_buchungen: number;
  umsatz_monat: number;
  umsatz_jahr: number;
  durchschnittliche_belegung: number;
  stellplaetze_nach_typ: Record<string, number>;
  buchungen_nach_status: Record<string, number>;
}
