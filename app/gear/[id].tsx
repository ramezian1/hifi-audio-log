import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Button, Chip, Divider } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { useGearStore } from '../../store/useGearStore';
import { useSessionStore } from '../../store/useSessionStore';

export default function GearDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const gear = useGearStore((s) => s.gear);
  const deleteGear = useGearStore((s) => s.deleteGear);
  const getSessionsByGearId = useSessionStore((s) => s.getSessionsByGearId);
  const gearItem = gear.find((g) => g.id === id);

  if (!gearItem) {
    return (
      <View style={styles.container}>
        <Text variant="bodyLarge" style={styles.emptyText}>Gear item not found.</Text>
      </View>
    );
  }

  const linkedSessions = getSessionsByGearId(gearItem.id);

  const handleDelete = () => {
    deleteGear(gearItem.id);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.name}>{gearItem.name}</Text>
      <Text variant="titleMedium" style={styles.brand}>{gearItem.brand}</Text>
      <Chip compact style={styles.typeChip}>{gearItem.type}</Chip>

      {gearItem.purchaseDate && (
        <View style={styles.field}>
          <Text variant="labelMedium" style={styles.label}>Purchase Date</Text>
          <Text variant="bodyMedium" style={styles.value}>{gearItem.purchaseDate}</Text>
        </View>
      )}

      {gearItem.notes && (
        <View style={styles.field}>
          <Text variant="labelMedium" style={styles.label}>Notes</Text>
          <Text variant="bodyMedium" style={styles.value}>{gearItem.notes}</Text>
        </View>
      )}

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Listening Sessions ({linkedSessions.length})
      </Text>
      {linkedSessions.length === 0 ? (
        <Text variant="bodySmall" style={styles.emptyText}>No sessions linked to this gear.</Text>
      ) : (
        linkedSessions.map((session) => (
          <Card key={session.id} style={styles.sessionCard}>
            <Card.Title
              title={session.track || session.trackOrAlbum || 'Untitled'}
              subtitle={`${session.artist ? session.artist + ' · ' : ''}${new Date(session.createdAt).toLocaleDateString()}`}
            />
            {session.rating != null && (
              <Card.Content>
                <Text variant="bodySmall" style={styles.rating}>Rating: {session.rating}/5</Text>
              </Card.Content>
            )}
          </Card>
        ))
      )}

      <Button
        mode="contained"
        buttonColor="#b3261e"
        textColor="#fff"
        onPress={handleDelete}
        style={styles.deleteButton}
        icon="delete"
      >
        Delete Gear
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614' },
  content: { padding: 16, gap: 8 },
  name: { color: '#cdccca' },
  brand: { color: '#797876' },
  typeChip: { alignSelf: 'flex-start', backgroundColor: '#2a2927', marginTop: 4 },
  field: { marginTop: 12 },
  label: { color: '#797876', textTransform: 'uppercase', marginBottom: 2 },
  value: { color: '#cdccca' },
  divider: { marginVertical: 16, backgroundColor: '#2a2927' },
  sectionTitle: { color: '#cdccca', marginBottom: 8 },
  emptyText: { color: '#797876' },
  sessionCard: { backgroundColor: '#1c1b19', marginBottom: 8 },
  rating: { color: '#4f98a3' },
  deleteButton: { marginTop: 24 },
});
