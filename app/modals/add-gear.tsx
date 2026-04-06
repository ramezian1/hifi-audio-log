import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { useGearStore } from '../../store/useGearStore';
import type { GearItem } from '../../types';

const TYPE_OPTIONS: { value: GearItem['type']; label: string }[] = [
  { value: 'headphone', label: 'Headphone' },
  { value: 'iem', label: 'IEM' },
  { value: 'dac', label: 'DAC' },
  { value: 'amp', label: 'Amp' },
  { value: 'dac/amp', label: 'DAC/Amp' },
  { value: 'cable', label: 'Cable' },
  { value: 'other', label: 'Other' },
];

export default function AddGearModal() {
  const addGear = useGearStore((s) => s.addGear);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState<GearItem['type']>('headphone');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !brand.trim()) return;

    const now = new Date().toISOString();

    addGear({
      id: Date.now().toString(),
      name: name.trim(),
      brand: brand.trim(),
      type,
      purchaseDate: purchaseDate.trim() || undefined,
      price: price.trim() ? Number(price) : undefined,
      currency: currency.trim() || undefined,
      notes: notes.trim() || undefined,
      rating: rating.trim() ? Number(rating) : undefined,
      createdAt: now,
      updatedAt: now,
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        Add Gear
      </Text>

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Brand"
        value={brand}
        onChangeText={setBrand}
        mode="outlined"
        style={styles.input}
      />

      <Text variant="bodyMedium" style={styles.label}>
        Type
      </Text>

      <SegmentedButtons
        value={type}
        onValueChange={(value) => setType(value as GearItem['type'])}
        buttons={TYPE_OPTIONS}
        style={styles.segmented}
      />

      <TextInput
        label="Purchase Date (YYYY-MM-DD)"
        value={purchaseDate}
        onChangeText={setPurchaseDate}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Price"
        value={price}
        onChangeText={setPrice}
        mode="outlined"
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        label="Currency"
        value={currency}
        onChangeText={setCurrency}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Rating (1-10)"
        value={rating}
        onChangeText={setRating}
        mode="outlined"
        keyboardType="number-pad"
        style={styles.input}
      />

      <TextInput
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <Button mode="outlined" onPress={() => router.back()} style={styles.button}>
          Cancel
        </Button>
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Save
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171614',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    color: '#cdccca',
    marginBottom: 8,
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
