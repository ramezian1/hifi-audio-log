import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ListeningSession } from '../types';

interface SessionStore {
  sessions: ListeningSession[];
  addSession: (session: ListeningSession) => void;
  updateSession: (id: string, updates: Partial<ListeningSession>) => void;
  deleteSession: (id: string) => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      sessions: [],
      addSession: (session) =>
        set((state) => ({ sessions: [session, ...state.sessions] })),
      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),
      deleteSession: (id) =>
        set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),
    }),
    { name: 'sessions-storage' }
  )
);
