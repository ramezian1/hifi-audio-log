import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, Chip, Divider, Text, TextInput } from 'react-native-paper';
import { useGearStore } from '../../store/useGearStore';
import type { GearItem } from '../../types';

const TYPE_OPTIONS: GearItem['type'][] = [
  'headphone',
  'iem',
  'dac',
  'amp',
  'dac/amp',
  'cable',
  'other',
];

export default function GearDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gear = useGearStore((s) => s.gear);
  const updateGear = useGearStore((s) => s.updateGear);
  const deleteGear = useGearStore((s) => s.deleteGear);

  const gearItem = useMemo(() => gear.find((g) => g.id === id), [gear, id]);

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(gearItem?.name ?? '');
  const [brand, setBrand] = useState(gearItem?.brand ?? '');
  const [type, setType] = useState<GearItem['type']>(gearItem?.type ?? 'headphone');
  const [purchaseDate, setPurchaseDate] = useState(gearItem?.purchaseDate ?? '');
  const [price, setPrice] = useState(gearItem?.price != null ? String(gearItem.price) : '');
  const [currency, setCurrency] = useState(gearItem?.currency ?? 'USD');
  const [rating, setRating] = useState(gearItem?.rating != null ? String(gearItem.rating) : '');
  const [notes, setNotes] = useState(gearItem?.notes ?? '');

  if (!gearItem) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Gear item not found.</Text>
        <Button mode="contained" onPress={() => router.back()} style={{ marginTop: 12 }}>
          Go Back
        </Button>
      </View>
    );
  }

  const handleSave = () => {
    if (!name.trim() || !brand.trim()) return;

    updateGear(gearItem.id, {
      name: name.trim(),
      brand: brand.trim(),
      type,
      purchaseDate: purchaseDate.trim() || undefined,
      price: price.trim() ? Number(price) : undefined,
      currency: currency.trim() || undefined,
      rating: rating.trim() ? Number(rating) : undefined,
      notes: notes.trim() || undefined,
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete gear',
      `Delete "${gearItem.brand} ${gearItem.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteGear(gearItem.id);
            router.replace('/(tabs)/gear' as any);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.name}>
        {gearItem.brand} {gearItem.name}
      </Text>

      <Chip style={styles.typeChip} textStyle={{ color: '#cdccca' }}>
        {gearItem.type}
      </Chip>

      <Divider style={styles.divider} />

      {isEditing ? (
        <View style={styles.form}>
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
          <TextInput
            label={`Type (${TYPE_OPTIONS.join(', ')})`}
            value={type}
            onChangeText={(value) => setType(value as GearItem['type'])}
            mode="outlined"
            style={styles.input}
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
            <Button mode="outlined" onPress={() => setIsEditing(false)} style={styles.button}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSave} style={styles.button}>
              Save
            </Button>
          </View>
        </View>
      ) : (
        <>
          <DetailRow label="Brand" value={gearItem.brand} />
          <DetailRow label="Type" value={gearItem.type} />
          <DetailRow label="Purchase Date" value={gearItem.purchaseDate} />
          <DetailRow
            label="Price"
            value={
              gearItem.price != null
                ? `${gearItem.currency ?? 'USD'} ${gearItem.price}`
                : undefined
            }
          />
          <DetailRow
            label="Rating"
            value={gearItem.rating != null ? `${gearItem.rating}/10` : undefined}
          />
          <DetailRow label="Notes" value={gearItem.notes} />

          <Card style={styles.metaCard}>
            <Card.Content>
              <Text style={styles.metaText}>Created: {gearItem.createdAt}</Text>
              <Text style={styles.metaText}>Updated: {gearItem.updatedAt}</Text>
            </Card.Content>
          </Card>

          <View style={styles.buttonCol}>
            <Button mode="contained" onPress={() => setIsEditing(true)}>
              Edit Gear
            </Button>
            <Button
              mode="outlined"
              buttonColor="#2d1618"
              textColor="#ffb4ab"
              onPress={handleDelete}
            >
              Delete Gear
            </Button>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171614',
  },
  content: {
    padding: 16,
    gap: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171614',
    padding: 24,
  },
  name: {
    color: '#cdccca',
  },
  typeChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2927',
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#2a2927',
  },
  field: {
    marginBottom: 14,
  },
  label: {
    color: '#797876',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontSize: 12,
  },
  value: {
    color: '#cdccca',
  },
  emptyText: {
    color: '#797876',
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: '#1c1b19',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  buttonCol: {
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
  },
  metaCard: {
    backgroundColor: '#1c1b19',
    marginTop: 8,
  },
  metaText: {
    color: '#797876',
  },
});
