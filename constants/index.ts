export const GEAR_TYPES = [
  { label: 'Headphone', value: 'headphone' },
  { label: 'IEM', value: 'iem' },
  { label: 'DAC', value: 'dac' },
  { label: 'Amp', value: 'amp' },
  { label: 'DAC/Amp', value: 'dac/amp' },
  { label: 'Cable', value: 'cable' },
  { label: 'Other', value: 'other' },
] as const;

export const EQ_BAND_TYPES = [
  { label: 'Peak', value: 'peak' },
  { label: 'Low Shelf', value: 'lowShelf' },
  { label: 'High Shelf', value: 'highShelf' },
  { label: 'Low Pass', value: 'lowPass' },
  { label: 'High Pass', value: 'highPass' },
] as const;

export const APP_NAME = 'Hi-Fi Audio Log';
