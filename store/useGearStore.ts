import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { GearItem } from '../types';

interface GearStore {
  gear: GearItem[];
  addGear: (item: GearItem) => void;
  updateGear: (id: string, updates: Partial<GearItem>) => void;
  deleteGear: (id: string) => void;
  getGearById: (id: string) => GearItem | undefined;
  replaceAllGear: (items: GearItem[]) => void;
}

export const useGearStore = create<GearStore>()(
  persist(
    (set, get) => ({
      gear: [],
      addGear: (item) => set((state) => ({ gear: [...state.gear, item] })),
      updateGear: (id, updates) =>
        set((state) => ({
          gear: state.gear.map((g) =>
            g.id === id
              ? { ...g, ...updates, updatedAt: new Date().toISOString() }
              : g
          ),
        })),
      deleteGear: (id) =>
        set((state) => ({
          gear: state.gear.filter((g) => g.id !== id),
        })),
      getGearById: (id) => get().gear.find((g) => g.id === id),
      replaceAllGear: (items) => set({ gear: items }),
    }),
    {
      name: 'gear-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
