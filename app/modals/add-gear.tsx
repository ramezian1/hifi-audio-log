import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { useGearStore } from '../../store/useGearStore';
import { GearItem } from '../../types';

const GEAR_TYPE_BUTTONS: { value: GearItem['type']; label: string }[] = [
  { value: 'headphone', label: 'Headphone' },
  { value: 'iem', label: 'IEM' },
  { value: 'dac', label: 'DAC' },
  { value: 'amp', label: 'Amp' },
  { value: 'dac/amp', label: 'DAC/Amp' },
];

export default function AddGearModal() {
  const theme = useTheme();
  const addGear = useGearStore((s) => s.addGear);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState<GearItem['type']>('headphone');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !brand.trim()) return;
    const now = new Date().toISOString();
    addGear({
      id: Date.now().toString(),
      name: name.trim(),
      brand: brand.trim(),
      type,
      purchaseDate: purchaseDate.trim() || undefined,
      notes: notes.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    });
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <TextInput
        label="Name *"
        value={name}
        onChangeText={setName}
        mode="outlined"
        placeholder="e.g. HD 800 S"
        style={styles.input}
      />
      <TextInput
        label="Brand *"
        value={brand}
        onChangeText={setBrand}
        mode="outlined"
        placeholder="e.g. Sennheiser"
        style={styles.input}
      />

      <Text variant="labelLarge" style={styles.label}>Type</Text>
      <SegmentedButtons
        value={type}
        onValueChange={(v) => setType(v as GearItem['type'])}
        buttons={GEAR_TYPE_BUTTONS}
        style={styles.segmented}
      />

      <TextInput
        label="Purchase Date"
        value={purchaseDate}
        onChangeText={setPurchaseDate}
        mode="outlined"
        placeholder="e.g. 2024-01-15"
        style={styles.input}
      />
      <TextInput
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        placeholder="Optional notes..."
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <Button mode="outlined" onPress={() => router.back()} style={styles.button}>
          Cancel
        </Button>
        <Button mode="contained" onPress={handleSubmit} style={styles.button} disabled={!name.trim() || !brand.trim()}>
          Save
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 8 },
  input: { marginBottom: 8 },
  label: { marginTop: 8, marginBottom: 4 },
  segmented: { marginBottom: 8 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  button: { flex: 1 },
});
