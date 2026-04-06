import { useGearStore } from '../../store/useGearStore';
import { GearItem } from '../../types';

// Strip persistence so tests work without AsyncStorage I/O
jest.mock('zustand/middleware', () => ({
  persist: (config: unknown) => config,
  createJSONStorage: () => ({}),
}));

const makeGear = (overrides: Partial<GearItem> = {}): GearItem => ({
  id: 'gear-1',
  name: 'HD 600',
  brand: 'Sennheiser',
  type: 'headphone',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

describe('useGearStore', () => {
  beforeEach(() => {
    useGearStore.setState({ gear: [] });
  });

  // ─── addGear ───────────────────────────────────────────────────────────────

  describe('addGear', () => {
    it('adds a single gear item', () => {
      const item = makeGear();
      useGearStore.getState().addGear(item);
      expect(useGearStore.getState().gear).toHaveLength(1);
      expect(useGearStore.getState().gear[0]).toEqual(item);
    });

    it('appends subsequent items in insertion order', () => {
      const first = makeGear({ id: 'g-1', name: 'HD 600' });
      const second = makeGear({ id: 'g-2', name: 'HD 800S' });
      useGearStore.getState().addGear(first);
      useGearStore.getState().addGear(second);
      const { gear } = useGearStore.getState();
      expect(gear).toHaveLength(2);
      expect(gear[0].id).toBe('g-1');
      expect(gear[1].id).toBe('g-2');
    });

    it('stores all provided fields correctly', () => {
      const item = makeGear({
        type: 'dac',
        brand: 'Topping',
        price: 199,
        notes: 'Great DAC',
        rating: 9,
        purchaseDate: '2023-06-15',
      });
      useGearStore.getState().addGear(item);
      const stored = useGearStore.getState().gear[0];
      expect(stored.type).toBe('dac');
      expect(stored.brand).toBe('Topping');
      expect(stored.price).toBe(199);
      expect(stored.notes).toBe('Great DAC');
      expect(stored.rating).toBe(9);
      expect(stored.purchaseDate).toBe('2023-06-15');
    });

    it('supports all valid gear types', () => {
      const types: GearItem['type'][] = ['headphone', 'iem', 'dac', 'amp', 'dac/amp', 'cable', 'other'];
      types.forEach((type, i) => {
        useGearStore.getState().addGear(makeGear({ id: `g-${i}`, type }));
      });
      const stored = useGearStore.getState().gear.map((g) => g.type);
      expect(stored).toEqual(types);
    });
  });

  // ─── updateGear ────────────────────────────────────────────────────────────

  describe('updateGear', () => {
    it('updates specified fields of an existing item', () => {
      useGearStore.getState().addGear(makeGear({ id: 'g-1', name: 'HD 600' }));
      useGearStore.getState().updateGear('g-1', { name: 'HD 650', rating: 10 });
      const updated = useGearStore.getState().gear[0];
      expect(updated.name).toBe('HD 650');
      expect(updated.rating).toBe(10);
    });

    it('does not mutate unrelated fields', () => {
      const original = makeGear({ id: 'g-1', brand: 'Sennheiser', price: 300 });
      useGearStore.getState().addGear(original);
      useGearStore.getState().updateGear('g-1', { name: 'HD 650' });
      const updated = useGearStore.getState().gear[0];
      expect(updated.brand).toBe('Sennheiser');
      expect(updated.price).toBe(300);
    });

    it('sets updatedAt to a new ISO timestamp', () => {
      useGearStore.getState().addGear(makeGear({ id: 'g-1', updatedAt: '2020-01-01T00:00:00.000Z' }));
      const before = Date.now();
      useGearStore.getState().updateGear('g-1', { name: 'HD 650' });
      const after = Date.now();
      const { updatedAt } = useGearStore.getState().gear[0];
      const ts = new Date(updatedAt).getTime();
      expect(ts).toBeGreaterThanOrEqual(before);
      expect(ts).toBeLessThanOrEqual(after);
    });

    it('does not affect other items in the list', () => {
      useGearStore.getState().addGear(makeGear({ id: 'g-1', name: 'HD 600' }));
      useGearStore.getState().addGear(makeGear({ id: 'g-2', name: 'HD 800S' }));
      useGearStore.getState().updateGear('g-1', { name: 'HD 650' });
      expect(useGearStore.getState().gear[1].name).toBe('HD 800S');
    });

    it('is a no-op when the id does not exist', () => {
      useGearStore.getState().addGear(makeGear({ id: 'g-1' }));
      useGearStore.getState().updateGear('nonexistent', { name: 'Changed' });
      expect(useGearStore.getState().gear[0].name).toBe('HD 600');
    });
  });

  // ─── deleteGear ────────────────────────────────────────────────────────────

  describe('deleteGear', () => {
    it('removes the item with the matching id', () => {
      useGearStore.getState().addGear(makeGear({ id: 'g-1' }));
      useGearStore.getState().deleteGear('g-1');
      expect(useGearStore.getState().gear).toHaveLength(0);
    });

    it('does not remove items with a different id', () => {
      useGearStore.getState().addGear(makeGear({ id: 'g-1' }));
      useGearStore.getState().addGear(makeGear({ id: 'g-2' }));
      useGearStore.getState().deleteGear('g-1');
      const remaining = useGearStore.getState().gear;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('g-2');
    });

    it('is a no-op when the id does not exist', () => {
      useGearStore.getState().addGear(makeGear({ id: 'g-1' }));
      useGearStore.getState().deleteGear('nonexistent');
      expect(useGearStore.getState().gear).toHaveLength(1);
    });

    it('leaves an empty list when the only item is deleted', () => {
      useGearStore.getState().addGear(makeGear({ id: 'g-1' }));
      useGearStore.getState().deleteGear('g-1');
      expect(useGearStore.getState().gear).toEqual([]);
    });
  });

  // ─── getGearById ───────────────────────────────────────────────────────────

  describe('getGearById', () => {
    it('returns the correct item when it exists', () => {
      const item = makeGear({ id: 'g-1', name: 'HD 600' });
      useGearStore.getState().addGear(item);
      const result = useGearStore.getState().getGearById('g-1');
      expect(result).toEqual(item);
    });

    it('returns undefined for an unknown id', () => {
      useGearStore.getState().addGear(makeGear({ id: 'g-1' }));
      expect(useGearStore.getState().getGearById('unknown')).toBeUndefined();
    });

    it('returns undefined when the list is empty', () => {
      expect(useGearStore.getState().getGearById('g-1')).toBeUndefined();
    });

    it('returns the correct item when multiple items exist', () => {
      useGearStore.getState().addGear(makeGear({ id: 'g-1', name: 'HD 600' }));
      useGearStore.getState().addGear(makeGear({ id: 'g-2', name: 'HD 800S' }));
      const result = useGearStore.getState().getGearById('g-2');
      expect(result?.name).toBe('HD 800S');
    });
  });

  // ─── initial state ─────────────────────────────────────────────────────────

  describe('initial state', () => {
    it('starts with an empty gear list', () => {
      useGearStore.setState({ gear: [] });
      expect(useGearStore.getState().gear).toEqual([]);
    });
  });
});
