import { useState, useMemo } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FAB, Card, Searchbar } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { useEQStore } from '../../store/useEQStore';
import { useGearStore } from '../../store/useGearStore';

export default function EQScreen() {
  const profiles = useEQStore((s) => s.profiles);
  const deleteProfile = useEQStore((s) => s.deleteProfile);
  const gear = useGearStore((s) => s.gear);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return profiles;
    return profiles.filter((item) => {
      const linkedGear = item.gearId ? gear.find((g) => g.id === item.gearId) : undefined;
      return (
        item.name.toLowerCase().includes(q) ||
        (linkedGear?.name ?? '').toLowerCase().includes(q)
      );
    });
  }, [profiles, gear, searchQuery]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete EQ Profile',
      `Remove "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteProfile(id) },
      ]
    );
  };

  const renderRightActions = (id: string, name: string) => (
    <View style={styles.deleteAction}>
      <Text style={styles.deleteText} onPress={() => handleDelete(id, name)}>
        Delete
      </Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>EQ Profiles</Text>
      <Searchbar
        placeholder="Search by profile or gear name"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
        iconColor="#797876"
        placeholderTextColor="#797876"
      />
      <Text variant="bodySmall" style={styles.count}>
        {filtered.length} profile{filtered.length !== 1 ? 's' : ''}
      </Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const linkedGear = item.gearId ? gear.find((g) => g.id === item.gearId) : undefined;
          const subtitle = [
            linkedGear ? linkedGear.name : null,
            `${item.bands.length} bands`,
          ].filter(Boolean).join(' · ');
          return (
            <Swipeable
              renderRightActions={() => renderRightActions(item.id, item.name)}
              overshootRight={false}
            >
              <Card style={styles.card}>
                <Card.Title title={item.name} subtitle={subtitle} />
                {item.notes && (
                  <Card.Content>
                    <Text variant="bodySmall" style={styles.notes}>{item.notes}</Text>
                  </Card.Content>
                )}
              </Card>
            </Swipeable>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {searchQuery
              ? 'No EQ profiles match your search'
              : 'No EQ profiles yet. Tap + to create one.'}
          </Text>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/modals/add-eq')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614', padding: 16 },
  title: { color: '#cdccca', marginBottom: 12 },
  searchbar: { backgroundColor: '#1c1b19', marginBottom: 8 },
  searchInput: { color: '#cdccca' },
  count: { color: '#797876', marginBottom: 8 },
  card: { marginBottom: 12, backgroundColor: '#1c1b19' },
  notes: { color: '#797876', marginTop: 4 },
  empty: { color: '#797876', textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#4f98a3' },
  deleteAction: {
    backgroundColor: '#c0392b',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 12,
    borderRadius: 8,
  },
  deleteText: { color: '#fff', fontWeight: 'bold' },
});
