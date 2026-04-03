export interface GearItem {
  id: string;
  name: string;
  brand: string;
  type: 'headphone' | 'iem' | 'dac' | 'amp' | 'dac/amp' | 'cable' | 'other';
  purchaseDate?: string;
  price?: number;
  notes?: string;
  rating?: number; // 1-10
  imageUri?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListeningSession {
  id: string;
  gearIds: string[];  // linked gear
  date: string;
  duration?: number;  // in minutes
  notes?: string;
  trackOrAlbum?: string;
  artist?: string;
  rating?: number;    // 1-10
  eqProfileId?: string;
  createdAt: string;
}

export interface EQProfile {
  id: string;
  name: string;
  gearId?: string;    // optional link to a specific headphone
  bands: EQBand[];
  preamp: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EQBand {
  frequency: number;
  gain: number;
  q: number;
}
