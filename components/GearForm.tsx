import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import type { GearItem } from '../types';

export const TYPE_OPTIONS: { value: GearItem['type']; label: string }[] = [
  { value: 'headphone', label: 'Headphone' },
  { value: 'iem', label: 'IEM' },
  { value: 'dac', label: 'DAC' },
  { value: 'amp', label: 'Amp' },
  { value: 'dac/amp', label: 'DAC/Amp' },
  { value: 'cable', label: 'Cable' },
  { value: 'other', label: 'Other' },
];

type GearFormValues = {
  name: string;
  brand: string;
  type: GearItem['type'];
  purchaseDate: string;
  price: string;
  currency: string;
  notes: string;
  rating: string;
};

interface GearFormProps {
  initialValues?: Partial<GearItem>;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (values: {
    name: string;
    brand: string;
    type: GearItem['type'];
    purchaseDate?: string;
    price?: number;
    currency?: string;
    notes?: string;
    rating?: number;
  }) => void;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function toFormValues(initialValues?: Partial<GearItem>): GearFormValues {
  return {
    name: initialValues?.name ?? '',
    brand: initialValues?.brand ?? '',
    type: initialValues?.type ?? 'headphone',
    purchaseDate: initialValues?.purchaseDate ?? '',
    price: initialValues?.price != null ? String(initialValues.price) : '',
    currency: initialValues?.currency ?? 'USD',
    notes: initialValues?.notes ?? '',
    rating: initialValues?.rating != null ? String(initialValues.rating) : '',
  };
}

export function GearForm({ initialValues, submitLabel = 'Save', onCancel, onSubmit }: GearFormProps) {
  const [values, setValues] = useState<GearFormValues>(() => toFormValues(initialValues));

  useEffect(() => {
    setValues(toFormValues(initialValues));
  }, [initialValues]);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof GearFormValues, string>> = {};

    if (!values.name.trim()) next.name = 'Name is required.';
    if (!values.brand.trim()) next.brand = 'Brand is required.';

    if (values.purchaseDate.trim() && !DATE_RE.test(values.purchaseDate.trim())) {
      next.purchaseDate = 'Use YYYY-MM-DD.';
    }

    if (values.price.trim()) {
      const parsedPrice = Number(values.price);
      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        next.price = 'Enter a valid positive price.';
      }
    }

    if (values.rating.trim()) {
      const parsedRating = Number(values.rating);
      if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 10) {
        next.rating = 'Rating must be an integer from 1 to 10.';
      }
    }

    if (values.currency.trim() && values.currency.trim().length !== 3) {
      next.currency = 'Use a 3-letter currency code.';
    }

    return next;
  }, [values]);

  const hasErrors = Object.keys(errors).length > 0;

  const updateField = <K extends keyof GearFormValues>(key: K, value: GearFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (hasErrors) return;

    onSubmit({
      name: values.name.trim(),
      brand: values.brand.trim(),
      type: values.type,
      purchaseDate: values.purchaseDate.trim() || undefined,
      price: values.price.trim() ? Number(values.price) : undefined,
      currency: values.currency.trim() ? values.currency.trim().toUpperCase() : undefined,
      notes: values.notes.trim() || undefined,
      rating: values.rating.trim() ? Number(values.rating) : undefined,
    });
  };

  return (
    <View style={styles.form}>
      <TextInput
        label="Name"
        value={values.name}
        onChangeText={(value) => updateField('name', value)}
        mode="outlined"
        style={styles.input}
        error={!!errors.name}
      />
      <HelperText type="error" visible={!!errors.name}>{errors.name}</HelperText>

      <TextInput
        label="Brand"
        value={values.brand}
        onChangeText={(value) => updateField('brand', value)}
        mode="outlined"
        style={styles.input}
        error={!!errors.brand}
      />
      <HelperText type="error" visible={!!errors.brand}>{errors.brand}</HelperText>

      <Text variant="bodyMedium" style={styles.label}>Type</Text>
      <SegmentedButtons
        value={values.type}
        onValueChange={(value) => updateField('type', value as GearItem['type'])}
        buttons={TYPE_OPTIONS}
        style={styles.segmented}
      />

      <TextInput
        label="Purchase Date (YYYY-MM-DD)"
        value={values.purchaseDate}
        onChangeText={(value) => updateField('purchaseDate', value)}
        mode="outlined"
        style={styles.input}
        error={!!errors.purchaseDate}
      />
      <HelperText type="error" visible={!!errors.purchaseDate}>{errors.purchaseDate}</HelperText>

      <TextInput
        label="Price"
        value={values.price}
        onChangeText={(value) => updateField('price', value)}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
        error={!!errors.price}
      />
      <HelperText type="error" visible={!!errors.price}>{errors.price}</HelperText>

      <TextInput
        label="Currency"
        value={values.currency}
        onChangeText={(value) => updateField('currency', value.toUpperCase())}
        mode="outlined"
        autoCapitalize="characters"
        maxLength={3}
        style={styles.input}
        error={!!errors.currency}
      />
      <HelperText type="error" visible={!!errors.currency}>{errors.currency}</HelperText>

      <TextInput
        label="Rating (1-10)"
        value={values.rating}
        onChangeText={(value) => updateField('rating', value)}
        mode="outlined"
        keyboardType="number-pad"
        style={styles.input}
        error={!!errors.rating}
      />
      <HelperText type="error" visible={!!errors.rating}>{errors.rating}</HelperText>

      <TextInput
        label="Notes"
        value={values.notes}
        onChangeText={(value) => updateField('notes', value)}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        {onCancel ? (
          <Button mode="outlined" onPress={onCancel} style={styles.button}>
            Cancel
          </Button>
        ) : null}
        <Button mode="contained" onPress={handleSubmit} style={styles.button} disabled={hasErrors}>
          {submitLabel}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 4,
  },
  input: {
    backgroundColor: '#1c1b19',
  },
  label: {
    color: '#797876',
    marginTop: 4,
  },
  segmented: {
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
  },
});
