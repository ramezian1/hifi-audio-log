import { useState, useMemo } from 'react';
import { FlatList, StyleSheet, View, Pressable } from 'react-native';
import { Text, FAB, Card, Chip, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useGearStore } from '../../store/useGearStore';
import type { GearItem } from '../../types';

const TYPE_FILTERS = ['All', 'Headphone', 'IEM', 'DAC', 'Amp', 'DAC/Amp'] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

export default function GearScreen() {
  const gear = useGearStore((s) => s.gear);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');

  const filteredGear = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return gear.filter((item: GearItem) => {
      if (typeFilter !== 'All' && item.type !== typeFilter.toLowerCase()) return false;
      if (query) {
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesBrand = item.brand.toLowerCase().includes(query);
        const matchesType = item.type.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesType) return false;
      }
      return true;
    });
  }, [gear, searchQuery, typeFilter]);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>My Gear</Text>
      <Searchbar
        placeholder="Search by name, brand, or type"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
        iconColor="#797876"
        placeholderTextColor="#797876"
      />
      <View style={styles.chipRow}>
        {TYPE_FILTERS.map((type) => (
          <Chip
            key={type}
            selected={typeFilter === type}
            onPress={() => setTypeFilter(type)}
            style={[styles.filterChip, typeFilter === type && styles.filterChipActive]}
            textStyle={typeFilter === type ? styles.filterChipTextActive : styles.filterChipText}
            compact
          >
            {type}
          </Chip>
        ))}
      </View>
      <Text variant="bodySmall" style={styles.resultCount}>
        {filteredGear.length} {filteredGear.length === 1 ? 'item' : 'items'}
      </Text>
      <FlatList
        data={filteredGear}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/gear/${item.id}`)}>
            <Card style={styles.card}>
              <Card.Title title={item.name} subtitle={item.brand} />
              <Card.Content>
                <Chip compact style={styles.typeChip}>{item.type}</Chip>
                {item.notes && <Text variant="bodySmall" style={styles.notes}>{item.notes}</Text>}
              </Card.Content>
            </Card>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {searchQuery || typeFilter !== 'All'
              ? 'No gear matches your search'
              : 'No gear yet. Tap + to add your first item.'}
          </Text>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/modals/add-gear')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614', padding: 16 },
  title: { color: '#cdccca', marginBottom: 12 },
  searchbar: { backgroundColor: '#1c1b19', marginBottom: 8 },
  searchInput: { color: '#cdccca' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  filterChip: { backgroundColor: '#2a2927' },
  filterChipActive: { backgroundColor: '#4f98a3' },
  filterChipText: { color: '#797876' },
  filterChipTextActive: { color: '#fff' },
  resultCount: { color: '#797876', marginBottom: 8 },
  card: { marginBottom: 12, backgroundColor: '#1c1b19' },
  typeChip: { alignSelf: 'flex-start', backgroundColor: '#2a2927' },
  notes: { color: '#797876', marginTop: 8 },
  empty: { color: '#797876', textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#4f98a3' },
});
