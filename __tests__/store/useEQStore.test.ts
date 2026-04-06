import { useEQStore } from '../../store/useEQStore';
import { EQProfile, EQBand } from '../../types';

jest.mock('zustand/middleware', () => ({
  persist: (config: unknown) => config,
}));

const makeEQBand = (overrides: Partial<EQBand> = {}): EQBand => ({
  frequency: 1000,
  gain: 0,
  q: 1.0,
  ...overrides,
});

const makeProfile = (overrides: Partial<EQProfile> = {}): EQProfile => ({
  id: 'eq-1',
  name: 'Harman Target',
  bands: [makeEQBand()],
  preamp: -6,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('useEQStore', () => {
  beforeEach(() => {
    useEQStore.setState({ profiles: [] });
  });

  // ─── addProfile ────────────────────────────────────────────────────────────

  describe('addProfile', () => {
    it('adds a single profile', () => {
      const profile = makeProfile();
      useEQStore.getState().addProfile(profile);
      expect(useEQStore.getState().profiles).toHaveLength(1);
      expect(useEQStore.getState().profiles[0]).toEqual(profile);
    });

    it('appends profiles in insertion order', () => {
      const first = makeProfile({ id: 'eq-1', name: 'Harman Target' });
      const second = makeProfile({ id: 'eq-2', name: 'Diffuse Field' });
      useEQStore.getState().addProfile(first);
      useEQStore.getState().addProfile(second);
      const { profiles } = useEQStore.getState();
      expect(profiles[0].id).toBe('eq-1');
      expect(profiles[1].id).toBe('eq-2');
    });

    it('stores all optional fields correctly', () => {
      const profile = makeProfile({
        gearId: 'g-1',
        notes: 'My reference curve',
      });
      useEQStore.getState().addProfile(profile);
      const stored = useEQStore.getState().profiles[0];
      expect(stored.gearId).toBe('g-1');
      expect(stored.notes).toBe('My reference curve');
    });

    it('accepts a profile without optional fields', () => {
      const minimal = makeProfile({ id: 'eq-min' });
      delete (minimal as Partial<EQProfile>).gearId;
      delete (minimal as Partial<EQProfile>).notes;
      useEQStore.getState().addProfile(minimal);
      const stored = useEQStore.getState().profiles[0];
      expect(stored.gearId).toBeUndefined();
      expect(stored.notes).toBeUndefined();
    });

    it('stores multiple EQ bands correctly', () => {
      const bands: EQBand[] = [
        makeEQBand({ frequency: 60, gain: 3, q: 0.7 }),
        makeEQBand({ frequency: 1000, gain: -2, q: 1.4 }),
        makeEQBand({ frequency: 8000, gain: 4, q: 2.0 }),
      ];
      useEQStore.getState().addProfile(makeProfile({ bands }));
      expect(useEQStore.getState().profiles[0].bands).toHaveLength(3);
      expect(useEQStore.getState().profiles[0].bands[1].gain).toBe(-2);
    });

    it('stores the preamp value', () => {
      useEQStore.getState().addProfile(makeProfile({ preamp: -9.5 }));
      expect(useEQStore.getState().profiles[0].preamp).toBe(-9.5);
    });
  });

  // ─── updateProfile ─────────────────────────────────────────────────────────

  describe('updateProfile', () => {
    it('updates specified fields of an existing profile', () => {
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-1', name: 'Old Name' }));
      useEQStore.getState().updateProfile('eq-1', { name: 'New Name', preamp: -3 });
      const updated = useEQStore.getState().profiles[0];
      expect(updated.name).toBe('New Name');
      expect(updated.preamp).toBe(-3);
    });

    it('does not mutate unrelated fields', () => {
      useEQStore.getState().addProfile(
        makeProfile({ id: 'eq-1', gearId: 'g-1', notes: 'Keep me' })
      );
      useEQStore.getState().updateProfile('eq-1', { name: 'Changed' });
      const updated = useEQStore.getState().profiles[0];
      expect(updated.gearId).toBe('g-1');
      expect(updated.notes).toBe('Keep me');
    });

    it('sets updatedAt to a new ISO timestamp', () => {
      useEQStore.getState().addProfile(
        makeProfile({ id: 'eq-1', updatedAt: '2020-01-01T00:00:00.000Z' })
      );
      const before = Date.now();
      useEQStore.getState().updateProfile('eq-1', { name: 'Touched' });
      const after = Date.now();
      const ts = new Date(useEQStore.getState().profiles[0].updatedAt).getTime();
      expect(ts).toBeGreaterThanOrEqual(before);
      expect(ts).toBeLessThanOrEqual(after);
    });

    it('does not affect other profiles', () => {
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-1', name: 'Profile A' }));
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-2', name: 'Profile B' }));
      useEQStore.getState().updateProfile('eq-1', { name: 'Changed' });
      expect(useEQStore.getState().profiles[1].name).toBe('Profile B');
    });

    it('is a no-op when the id does not exist', () => {
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-1', name: 'Original' }));
      useEQStore.getState().updateProfile('nonexistent', { name: 'Changed' });
      expect(useEQStore.getState().profiles[0].name).toBe('Original');
    });

    it('can replace the entire bands array', () => {
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-1', bands: [makeEQBand()] }));
      const newBands: EQBand[] = [
        makeEQBand({ frequency: 100, gain: 2, q: 0.5 }),
        makeEQBand({ frequency: 4000, gain: -1, q: 1.2 }),
      ];
      useEQStore.getState().updateProfile('eq-1', { bands: newBands });
      expect(useEQStore.getState().profiles[0].bands).toHaveLength(2);
      expect(useEQStore.getState().profiles[0].bands[0].frequency).toBe(100);
    });
  });

  // ─── deleteProfile ─────────────────────────────────────────────────────────

  describe('deleteProfile', () => {
    it('removes the profile with the matching id', () => {
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-1' }));
      useEQStore.getState().deleteProfile('eq-1');
      expect(useEQStore.getState().profiles).toHaveLength(0);
    });

    it('does not remove profiles with a different id', () => {
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-1' }));
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-2' }));
      useEQStore.getState().deleteProfile('eq-1');
      const remaining = useEQStore.getState().profiles;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('eq-2');
    });

    it('is a no-op when the id does not exist', () => {
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-1' }));
      useEQStore.getState().deleteProfile('nonexistent');
      expect(useEQStore.getState().profiles).toHaveLength(1);
    });

    it('leaves an empty list when the only profile is deleted', () => {
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-1' }));
      useEQStore.getState().deleteProfile('eq-1');
      expect(useEQStore.getState().profiles).toEqual([]);
    });
  });

  // ─── getProfileById ────────────────────────────────────────────────────────

  describe('getProfileById', () => {
    it('returns the correct profile when it exists', () => {
      const profile = makeProfile({ id: 'eq-1', name: 'Harman Target' });
      useEQStore.getState().addProfile(profile);
      const result = useEQStore.getState().getProfileById('eq-1');
      expect(result).toEqual(profile);
    });

    it('returns undefined for an unknown id', () => {
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-1' }));
      expect(useEQStore.getState().getProfileById('unknown')).toBeUndefined();
    });

    it('returns undefined when the list is empty', () => {
      expect(useEQStore.getState().getProfileById('eq-1')).toBeUndefined();
    });

    it('returns the correct profile when multiple profiles exist', () => {
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-1', name: 'Profile A' }));
      useEQStore.getState().addProfile(makeProfile({ id: 'eq-2', name: 'Profile B' }));
      const result = useEQStore.getState().getProfileById('eq-2');
      expect(result?.name).toBe('Profile B');
    });
  });

  // ─── initial state ─────────────────────────────────────────────────────────

  describe('initial state', () => {
    it('starts with an empty profiles list', () => {
      useEQStore.setState({ profiles: [] });
      expect(useEQStore.getState().profiles).toEqual([]);
    });
  });
});
