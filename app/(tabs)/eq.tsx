import { FlatList, StyleSheet, View } from 'react-native';
import { Text, FAB, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { useEQStore } from '../../store/useEQStore';
import { useGearStore } from '../../store/useGearStore';

export default function EQScreen() {
  const profiles = useEQStore((s) => s.profiles);
  const gear = useGearStore((s) => s.gear);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>EQ Profiles</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const linkedGear = item.gearId ? gear.find((g) => g.id === item.gearId) : undefined;
          const subtitle = [
            linkedGear ? linkedGear.name : null,
            `${item.bands.length} bands`,
          ].filter(Boolean).join(' · ');

          return (
            <Card style={styles.card}>
              <Card.Title title={item.name} subtitle={subtitle} />
              {item.notes && (
                <Card.Content>
                  <Text variant="bodySmall" style={styles.notes}>{item.notes}</Text>
                </Card.Content>
              )}
            </Card>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>No EQ profiles yet. Tap + to create one.</Text>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/modals/add-eq')} />
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
