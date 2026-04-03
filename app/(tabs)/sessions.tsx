import { FlatList, StyleSheet, View } from 'react-native';
import { Text, FAB, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { useSessionStore } from '../../store/useSessionStore';
import { useGearStore } from '../../store/useGearStore';

export default function SessionsScreen() {
  const sessions = useSessionStore((s) => s.sessions);
  const gear = useGearStore((s) => s.gear);

  const getGearName = (gearIds: string[]) => {
    if (gearIds.length === 0) return undefined;
    const names = gearIds
      .map((id) => gear.find((g) => g.id === id)?.name)
      .filter(Boolean);
    return names.length > 0 ? names.join(', ') : undefined;
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Listening Sessions</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const gearName = getGearName(item.gearIds);
          return (
            <Card style={styles.card}>
              <Card.Title
                title={item.trackOrAlbum ?? 'Untitled Session'}
                subtitle={[
                  item.artist,
                  gearName,
                  new Date(item.date).toLocaleDateString(),
                ].filter(Boolean).join(' · ')}
              />
              <Card.Content>
                {item.rating != null && (
                  <Text variant="bodySmall" style={styles.meta}>Rating: {item.rating}/5</Text>
                )}
                {item.notes && <Text variant="bodySmall" style={styles.notes}>{item.notes}</Text>}
              </Card.Content>
            </Card>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>No sessions logged yet. Tap + to add one.</Text>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/modals/add-session')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614', padding: 16 },
  title: { color: '#cdccca', marginBottom: 16 },
  card: { marginBottom: 12, backgroundColor: '#1c1b19' },
  meta: { color: '#4f98a3', marginBottom: 4 },
  notes: { color: '#797876', marginTop: 4 },
  empty: { color: '#797876', textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#4f98a3' },
});
