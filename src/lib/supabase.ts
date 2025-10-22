import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Provider = {
  id: string;
  name: string;
  type: 'flight' | 'train';
  logo_url: string | null;
  website_url: string;
  active: boolean;
  created_at: string;
};

export type Search = {
  id: string;
  user_id: string | null;
  search_type: 'flight' | 'train';
  origin: string;
  destination: string;
  departure_date: string;
  return_date: string | null;
  passengers: number;
  search_params: Record<string, unknown>;
  created_at: string;
};

export type Result = {
  id: string;
  search_id: string;
  provider_id: string;
  route_type: 'direct' | 'connecting';
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  price: number;
  currency: string;
  stops: number;
  carrier: string;
  booking_url: string;
  details: Record<string, unknown>;
  created_at: string;
};
