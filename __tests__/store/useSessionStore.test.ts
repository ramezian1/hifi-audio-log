import { useSessionStore } from '../../store/useSessionStore';
import { ListeningSession } from '../../types';

jest.mock('zustand/middleware', () => ({
  persist: (config: unknown) => config,
}));

const makeSession = (overrides: Partial<ListeningSession> = {}): ListeningSession => ({
  id: 'session-1',
  date: '2024-03-01',
  createdAt: '2024-03-01T10:00:00.000Z',
  ...overrides,
});

describe('useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({ sessions: [] });
  });

  // ─── addSession ────────────────────────────────────────────────────────────

  describe('addSession', () => {
    it('adds a single session', () => {
      const session = makeSession();
      useSessionStore.getState().addSession(session);
      expect(useSessionStore.getState().sessions).toHaveLength(1);
      expect(useSessionStore.getState().sessions[0]).toEqual(session);
    });

    it('prepends new sessions so newest appears first', () => {
      const first = makeSession({ id: 's-1', date: '2024-01-01' });
      const second = makeSession({ id: 's-2', date: '2024-02-01' });
      useSessionStore.getState().addSession(first);
      useSessionStore.getState().addSession(second);
      const { sessions } = useSessionStore.getState();
      expect(sessions[0].id).toBe('s-2');
      expect(sessions[1].id).toBe('s-1');
    });

    it('stores all provided optional fields', () => {
      const session = makeSession({
        gearId: 'g-1',
        gearIds: ['g-1', 'g-2'],
        duration: 60,
        notes: 'Great session',
        track: 'Bohemian Rhapsody',
        artist: 'Queen',
        rating: 5,
        eqProfileId: 'eq-1',
      });
      useSessionStore.getState().addSession(session);
      const stored = useSessionStore.getState().sessions[0];
      expect(stored.gearId).toBe('g-1');
      expect(stored.gearIds).toEqual(['g-1', 'g-2']);
      expect(stored.duration).toBe(60);
      expect(stored.notes).toBe('Great session');
      expect(stored.track).toBe('Bohemian Rhapsody');
      expect(stored.artist).toBe('Queen');
      expect(stored.rating).toBe(5);
      expect(stored.eqProfileId).toBe('eq-1');
    });

    it('accepts sessions without optional fields', () => {
      const minimal = makeSession({ id: 's-min' });
      useSessionStore.getState().addSession(minimal);
      const stored = useSessionStore.getState().sessions[0];
      expect(stored.gearId).toBeUndefined();
      expect(stored.rating).toBeUndefined();
    });

    it('supports ratings from 1 to 5', () => {
      [1, 2, 3, 4, 5].forEach((rating, i) => {
        useSessionStore.getState().addSession(makeSession({ id: `s-${i}`, rating }));
      });
      const ratings = useSessionStore.getState().sessions.map((s) => s.rating);
      expect(ratings).toContain(1);
      expect(ratings).toContain(5);
    });
  });

  // ─── updateSession ─────────────────────────────────────────────────────────

  describe('updateSession', () => {
    it('updates specified fields of an existing session', () => {
      useSessionStore.getState().addSession(makeSession({ id: 's-1', rating: 3 }));
      useSessionStore.getState().updateSession('s-1', { rating: 5, notes: 'Updated' });
      const updated = useSessionStore.getState().sessions[0];
      expect(updated.rating).toBe(5);
      expect(updated.notes).toBe('Updated');
    });

    it('does not mutate unrelated fields', () => {
      useSessionStore.getState().addSession(
        makeSession({ id: 's-1', artist: 'Radiohead', track: 'Karma Police' })
      );
      useSessionStore.getState().updateSession('s-1', { rating: 4 });
      const updated = useSessionStore.getState().sessions[0];
      expect(updated.artist).toBe('Radiohead');
      expect(updated.track).toBe('Karma Police');
    });

    it('does not affect other sessions', () => {
      useSessionStore.getState().addSession(makeSession({ id: 's-1', rating: 3 }));
      useSessionStore.getState().addSession(makeSession({ id: 's-2', rating: 4 }));
      useSessionStore.getState().updateSession('s-1', { rating: 5 });
      const s2 = useSessionStore.getState().sessions.find((s) => s.id === 's-2');
      expect(s2?.rating).toBe(4);
    });

    it('is a no-op when the id does not exist', () => {
      useSessionStore.getState().addSession(makeSession({ id: 's-1', rating: 3 }));
      useSessionStore.getState().updateSession('nonexistent', { rating: 1 });
      expect(useSessionStore.getState().sessions[0].rating).toBe(3);
    });

    it('can update the gearId field', () => {
      useSessionStore.getState().addSession(makeSession({ id: 's-1', gearId: 'g-1' }));
      useSessionStore.getState().updateSession('s-1', { gearId: 'g-99' });
      expect(useSessionStore.getState().sessions[0].gearId).toBe('g-99');
    });
  });

  // ─── deleteSession ─────────────────────────────────────────────────────────

  describe('deleteSession', () => {
    it('removes the session with the matching id', () => {
      useSessionStore.getState().addSession(makeSession({ id: 's-1' }));
      useSessionStore.getState().deleteSession('s-1');
      expect(useSessionStore.getState().sessions).toHaveLength(0);
    });

    it('does not remove sessions with a different id', () => {
      useSessionStore.getState().addSession(makeSession({ id: 's-1' }));
      useSessionStore.getState().addSession(makeSession({ id: 's-2' }));
      useSessionStore.getState().deleteSession('s-1');
      const remaining = useSessionStore.getState().sessions;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('s-2');
    });

    it('is a no-op when the id does not exist', () => {
      useSessionStore.getState().addSession(makeSession({ id: 's-1' }));
      useSessionStore.getState().deleteSession('nonexistent');
      expect(useSessionStore.getState().sessions).toHaveLength(1);
    });

    it('leaves an empty list when the only session is deleted', () => {
      useSessionStore.getState().addSession(makeSession({ id: 's-1' }));
      useSessionStore.getState().deleteSession('s-1');
      expect(useSessionStore.getState().sessions).toEqual([]);
    });
  });

  // ─── getSessionsByGearId ───────────────────────────────────────────────────

  describe('getSessionsByGearId', () => {
    it('returns sessions where gearId matches', () => {
      useSessionStore.getState().addSession(makeSession({ id: 's-1', gearId: 'g-1' }));
      useSessionStore.getState().addSession(makeSession({ id: 's-2', gearId: 'g-2' }));
      const results = useSessionStore.getState().getSessionsByGearId('g-1');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('s-1');
    });

    it('returns sessions where gearIds array includes the id (legacy support)', () => {
      useSessionStore.getState().addSession(
        makeSession({ id: 's-1', gearIds: ['g-1', 'g-2'] })
      );
      const results = useSessionStore.getState().getSessionsByGearId('g-2');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('s-1');
    });

    it('matches both gearId and gearIds in the same query', () => {
      useSessionStore.getState().addSession(makeSession({ id: 's-1', gearId: 'g-1' }));
      useSessionStore.getState().addSession(makeSession({ id: 's-2', gearIds: ['g-1'] }));
      const results = useSessionStore.getState().getSessionsByGearId('g-1');
      expect(results).toHaveLength(2);
    });

    it('returns an empty array when no session matches', () => {
      useSessionStore.getState().addSession(makeSession({ id: 's-1', gearId: 'g-1' }));
      const results = useSessionStore.getState().getSessionsByGearId('g-99');
      expect(results).toEqual([]);
    });

    it('returns an empty array when the store is empty', () => {
      const results = useSessionStore.getState().getSessionsByGearId('g-1');
      expect(results).toEqual([]);
    });

    it('does not return sessions with no gear link', () => {
      useSessionStore.getState().addSession(makeSession({ id: 's-1' }));
      const results = useSessionStore.getState().getSessionsByGearId('g-1');
      expect(results).toEqual([]);
    });
  });

  // ─── initial state ─────────────────────────────────────────────────────────

  describe('initial state', () => {
    it('starts with an empty sessions list', () => {
      useSessionStore.setState({ sessions: [] });
      expect(useSessionStore.getState().sessions).toEqual([]);
    });
  });
});
