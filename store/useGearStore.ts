import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GearItem } from '../types';

interface GearStore {
  gear: GearItem[];
  addGear: (item: GearItem) => void;
  updateGear: (id: string, updates: Partial<GearItem>) => void;
  deleteGear: (id: string) => void;
  getGearById: (id: string) => GearItem | undefined;
}

export const useGearStore = create<GearStore>()(
  persist(
    (set, get) => ({
      gear: [],
      addGear: (item) => set((state) => ({ gear: [...state.gear, item] })),
      updateGear: (id, updates) =>
        set((state) => ({
          gear: state.gear.map((g) =>
            g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
          ),
        })),
      deleteGear: (id) =>
        set((state) => ({ gear: state.gear.filter((g) => g.id !== id) })),
      getGearById: (id) => get().gear.find((g) => g.id === id),
    }),
    { name: 'gear-storage' }
  )
);
