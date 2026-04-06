import { GEAR_TYPES, EQ_BAND_TYPES, APP_NAME } from '../../constants';

describe('constants', () => {
  describe('APP_NAME', () => {
    it('equals "Hi-Fi Audio Log"', () => {
      expect(APP_NAME).toBe('Hi-Fi Audio Log');
    });

    it('is a string', () => {
      expect(typeof APP_NAME).toBe('string');
    });
  });

  describe('GEAR_TYPES', () => {
    it('contains 7 gear types', () => {
      expect(GEAR_TYPES).toHaveLength(7);
    });

    it('each entry has a label and a value', () => {
      GEAR_TYPES.forEach((type) => {
        expect(type).toHaveProperty('label');
        expect(type).toHaveProperty('value');
        expect(typeof type.label).toBe('string');
        expect(typeof type.value).toBe('string');
      });
    });

    it('includes "headphone"', () => {
      expect(GEAR_TYPES.map((t) => t.value)).toContain('headphone');
    });

    it('includes "iem"', () => {
      expect(GEAR_TYPES.map((t) => t.value)).toContain('iem');
    });

    it('includes "dac"', () => {
      expect(GEAR_TYPES.map((t) => t.value)).toContain('dac');
    });

    it('includes "amp"', () => {
      expect(GEAR_TYPES.map((t) => t.value)).toContain('amp');
    });

    it('includes "dac/amp"', () => {
      expect(GEAR_TYPES.map((t) => t.value)).toContain('dac/amp');
    });

    it('includes "cable"', () => {
      expect(GEAR_TYPES.map((t) => t.value)).toContain('cable');
    });

    it('includes "other"', () => {
      expect(GEAR_TYPES.map((t) => t.value)).toContain('other');
    });

    it('has unique values', () => {
      const values = GEAR_TYPES.map((t) => t.value);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('has unique labels', () => {
      const labels = GEAR_TYPES.map((t) => t.label);
      const uniqueLabels = new Set(labels);
      expect(uniqueLabels.size).toBe(labels.length);
    });
  });

  describe('EQ_BAND_TYPES', () => {
    it('contains 5 EQ band types', () => {
      expect(EQ_BAND_TYPES).toHaveLength(5);
    });

    it('each entry has a label and a value', () => {
      EQ_BAND_TYPES.forEach((type) => {
        expect(type).toHaveProperty('label');
        expect(type).toHaveProperty('value');
        expect(typeof type.label).toBe('string');
        expect(typeof type.value).toBe('string');
      });
    });

    it('includes "peak"', () => {
      expect(EQ_BAND_TYPES.map((t) => t.value)).toContain('peak');
    });

    it('includes "lowShelf"', () => {
      expect(EQ_BAND_TYPES.map((t) => t.value)).toContain('lowShelf');
    });

    it('includes "highShelf"', () => {
      expect(EQ_BAND_TYPES.map((t) => t.value)).toContain('highShelf');
    });

    it('includes "lowPass"', () => {
      expect(EQ_BAND_TYPES.map((t) => t.value)).toContain('lowPass');
    });

    it('includes "highPass"', () => {
      expect(EQ_BAND_TYPES.map((t) => t.value)).toContain('highPass');
    });

    it('has unique values', () => {
      const values = EQ_BAND_TYPES.map((t) => t.value);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });

    it('has unique labels', () => {
      const labels = EQ_BAND_TYPES.map((t) => t.label);
      const uniqueLabels = new Set(labels);
      expect(uniqueLabels.size).toBe(labels.length);
    });
  });
});
