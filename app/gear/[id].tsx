import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, Chip, Divider, Text } from 'react-native-paper';
import { GearForm } from '../../components/GearForm';
import { useGearStore } from '../../store/useGearStore';

export default function GearDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gear = useGearStore((s) => s.gear);
  const updateGear = useGearStore((s) => s.updateGear);
  const deleteGear = useGearStore((s) => s.deleteGear);

  const gearItem = useMemo(() => gear.find((g) => g.id === id), [gear, id]);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleDelete = () => {
    Alert.alert('Delete gear', `Delete "${gearItem.brand} ${gearItem.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteGear(gearItem.id);
          router.replace('/(tabs)/gear' as any);
        },
      },
    ]);
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
        <GearForm
          initialValues={gearItem}
          submitLabel="Save Changes"
          onCancel={() => setIsEditing(false)}
          onSubmit={(values) => {
            updateGear(gearItem.id, values);
            setIsEditing(false);
          }}
        />
      ) : (
        <>
          <DetailRow label="Brand" value={gearItem.brand} />
          <DetailRow label="Type" value={gearItem.type} />
          <DetailRow label="Purchase Date" value={gearItem.purchaseDate} />
          <DetailRow
            label="Price"
            value={gearItem.price != null ? `${gearItem.currency ?? 'USD'} ${gearItem.price}` : undefined}
          />
          <DetailRow label="Rating" value={gearItem.rating != null ? `${gearItem.rating}/10` : undefined} />
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
            <Button mode="outlined" buttonColor="#2d1618" textColor="#ffb4ab" onPress={handleDelete}>
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
  buttonCol: {
    gap: 12,
    marginTop: 20,
  },
  metaCard: {
    backgroundColor: '#1c1b19',
    marginTop: 8,
  },
  metaText: {
    color: '#797876',
  },
});
