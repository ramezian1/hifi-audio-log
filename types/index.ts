export interface GearItem {
  id: string;
  name: string;
  brand: string;
  type: 'headphone' | 'iem' | 'dac' | 'amp' | 'dac/amp' | 'cable' | 'other';
  purchaseDate?: string;
  price?: number;
  currency?: string; // e.g. 'USD', 'EUR'
  notes?: string;
  rating?: number; // 1-10
  imageUri?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListeningSession {
  id: string;
  gearId?: string;       // primary gear used
  date: string;
  duration?: number;     // in minutes
  notes?: string;
  track?: string;        // track name
  album?: string;        // album name
  artist?: string;
  rating?: number;       // 1-5
  eqProfileId?: string;
  createdAt: string;
}

export interface EQProfile {
  id: string;
  name: string;
  gearId?: string;       // optional link to a specific headphone
  bands: EQBand[];
  preamp: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EQBand {
  frequency: number;     // Hz
  gain: number;          // dB
  q: number;             // Q factor
  type: 'peaking' | 'lowShelf' | 'highShelf' | 'lowPass' | 'highPass';
}
