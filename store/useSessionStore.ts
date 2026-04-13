import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ListeningSession } from '../types';

interface SessionStore {
  sessions: ListeningSession[];
  addSession: (session: ListeningSession) => void;
  updateSession: (id: string, updates: Partial<ListeningSession>) => void;
  deleteSession: (id: string) => void;
  getSessionsByGearId: (gearId: string) => ListeningSession[];
  replaceAllSessions: (items: ListeningSession[]) => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      addSession: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),
      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id
              ? { ...s, ...updates, updatedAt: new Date().toISOString() }
              : s
          ),
        })),
      deleteSession: (id) =>
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),
      getSessionsByGearId: (gearId) =>
        get().sessions.filter(
          (s) => s.gearId === gearId || (s.gearIds && s.gearIds.includes(gearId))
        ),
      replaceAllSessions: (items) => set({ sessions: items }),
    }),
    {
      name: 'sessions-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
