import { View, FlatList, StyleSheet } from 'react-native';
import { Text, FAB, Card } from 'react-native-paper';
import { useSessionStore } from '../../store/useSessionStore';

export default function SessionsScreen() {
  const { sessions } = useSessionStore();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Listening Sessions</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.trackOrAlbum ?? 'Untitled Session'}
              subtitle={new Date(item.date).toLocaleDateString()}
            />
            <Card.Content>
              <Text variant="bodySmall" style={styles.notes}>{item.notes}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No sessions logged yet. Tap + to add one.</Text>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614', padding: 16 },
  title: { color: '#cdccca', marginBottom: 16 },
  card: { marginBottom: 12, backgroundColor: '#1c1b19' },
  notes: { color: '#797876', marginTop: 4 },
  empty: { color: '#797876', textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#4f98a3' },
});
