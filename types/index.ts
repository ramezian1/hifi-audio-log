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
  gearId?: string;
    gearIds?: string[];
  date: string;
  duration?: number;
  notes?: string;
  track?: string;
  album?: string;
  artist?: string;
  rating?: number;
  eqProfileId?: string;
  createdAt: string;
  updatedAt: string;
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
