import { FlatList, StyleSheet, View } from 'react-native';
import { Text, FAB, Card, Chip } from 'react-native-paper';
import { router } from 'expo-router';
import { useGearStore } from '../../store/useGearStore';

export default function GearScreen() {
  const gear = useGearStore((s) => s.gear);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>My Gear</Text>
      <FlatList
        data={gear}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => router.push(`/gear/${item.id}`)}>
            <Card.Title title={item.name} subtitle={item.brand} />
            <Card.Content>
              <Chip compact>{item.type}</Chip>
              {item.notes && <Text variant="bodySmall" style={styles.notes}>{item.notes}</Text>}
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No gear yet. Tap + to add your first item.</Text>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/modals/add-gear')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614', padding: 16 },
  title: { color: '#cdccca', marginBottom: 16 },
  card: { marginBottom: 12, backgroundColor: '#1c1b19' },
  notes: { color: '#797876', marginTop: 8 },
  empty: { color: '#797876', textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#4f98a3' },
});
