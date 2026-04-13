import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { EQProfile } from '../types';

interface EQStore {
  profiles: EQProfile[];
  addProfile: (profile: EQProfile) => void;
  updateProfile: (id: string, updates: Partial<EQProfile>) => void;
  deleteProfile: (id: string) => void;
  getProfileById: (id: string) => EQProfile | undefined;
  replaceAllProfiles: (items: EQProfile[]) => void;
}

export const useEQStore = create<EQStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      addProfile: (profile) =>
        set((state) => ({ profiles: [...state.profiles, profile] })),
      updateProfile: (id, updates) =>
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        })),
      deleteProfile: (id) =>
        set((state) => ({ profiles: state.profiles.filter((p) => p.id !== id) })),
      getProfileById: (id) => get().profiles.find((p) => p.id === id),
      replaceAllProfiles: (items) => set({ profiles: items }),
    }),
    {
      name: 'eq-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
