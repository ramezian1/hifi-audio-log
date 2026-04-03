import { FlatList, StyleSheet, View } from 'react-native';
import { Text, FAB, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { useSessionStore } from '../../store/useSessionStore';
import { useGearStore } from '../../store/useGearStore';

export default function SessionsScreen() {
  const sessions = useSessionStore((s) => s.sessions);
  const gear = useGearStore((s) => s.gear);

  const getGearName = (session: typeof sessions[number]): string | undefined => {
    if (session.gearId) {
      return gear.find((g) => g.id === session.gearId)?.name;
    }
    if (session.gearIds && session.gearIds.length > 0) {
      return gear.find((g) => g.id === session.gearIds![0])?.name;
    }
    return undefined;
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Listening Sessions</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const gearName = getGearName(item);
          const displayTitle = item.track || item.trackOrAlbum || 'Untitled Session';
          const subtitleParts: string[] = [];
          if (item.artist) subtitleParts.push(item.artist);
          if (gearName) subtitleParts.push(gearName);
          subtitleParts.push(new Date(item.createdAt).toLocaleDateString());

          return (
            <Card style={styles.card}>
              <Card.Title
                title={displayTitle}
                subtitle={subtitleParts.join(' · ')}
              />
              {item.rating != null && (
                <Card.Content>
                  <Text variant="bodySmall" style={styles.rating}>Rating: {item.rating}/5</Text>
                </Card.Content>
              )}
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
  rating: { color: '#4f98a3' },
  empty: { color: '#797876', textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#4f98a3' },
});
