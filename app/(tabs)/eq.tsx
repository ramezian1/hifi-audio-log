import { useState, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text, FAB, Card, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useEQStore } from '../../store/useEQStore';
import { useGearStore } from '../../store/useGearStore';
import type { EQProfile } from '../../types';

export default function EQScreen() {
  const profiles = useEQStore((s) => s.profiles);
  const gear = useGearStore((s) => s.gear);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfiles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return profiles;

    return profiles.filter((profile: EQProfile) => {
      const nameMatch = profile.name.toLowerCase().includes(query);
      const linkedGear = profile.gearId ? gear.find((g) => g.id === profile.gearId) : undefined;
      const gearMatch = linkedGear ? linkedGear.name.toLowerCase().includes(query) : false;
      return nameMatch || gearMatch;
    });
  }, [profiles, searchQuery, gear]);

  return (
    <View style={styles.container}>
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
      <Text variant="bodySmall" style={styles.resultCount}>
        {filteredProfiles.length} {filteredProfiles.length === 1 ? 'profile' : 'profiles'}
      </Text>
      <FlatList
        data={filteredProfiles}
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
          <Text style={styles.empty}>
            {searchQuery
              ? 'No EQ profiles match your search'
              : 'No EQ profiles yet. Tap + to create one.'}
          </Text>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/modals/add-eq')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614', padding: 16 },
  title: { color: '#cdccca', marginBottom: 12 },
  searchbar: { backgroundColor: '#1c1b19', marginBottom: 8 },
  searchInput: { color: '#cdccca' },
  resultCount: { color: '#797876', marginBottom: 8 },
  card: { marginBottom: 12, backgroundColor: '#1c1b19' },
  notes: { color: '#797876', marginTop: 4 },
  empty: { color: '#797876', textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#4f98a3' },
});
