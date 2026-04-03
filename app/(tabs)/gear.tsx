import { useState, useMemo } from 'react';
import { FlatList, StyleSheet, View, Pressable } from 'react-native';
import { Text, FAB, Card, Chip, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useGearStore } from '../../store/useGearStore';
import type { GearItem } from '../../types';

const TYPE_FILTERS: { label: string; value: GearItem['type'] | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Headphone', value: 'headphone' },
  { label: 'IEM', value: 'iem' },
  { label: 'DAC', value: 'dac' },
  { label: 'Amp', value: 'amp' },
  { label: 'DAC/Amp', value: 'dac/amp' },
];

export default function GearScreen() {
  const gear = useGearStore((s) => s.gear);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<GearItem['type'] | 'all'>('all');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return gear.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (q) {
        return (
          item.name.toLowerCase().includes(q) ||
          item.brand.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
        );
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
        {TYPE_FILTERS.map((f) => (
          <Chip
            key={f.value}
            selected={typeFilter === f.value}
            onPress={() => setTypeFilter(f.value)}
            compact
            style={[styles.chip, typeFilter === f.value && styles.chipSelected]}
            textStyle={typeFilter === f.value ? styles.chipTextSelected : styles.chipText}
          >
            {f.label}
          </Chip>
        ))}
      </View>
      <Text variant="bodySmall" style={styles.count}>
        {filtered.length} item{filtered.length !== 1 ? 's' : ''}
      </Text>
      <FlatList
        data={filtered}
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
            {searchQuery || typeFilter !== 'all'
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
  chip: { backgroundColor: '#2a2927' },
  chipSelected: { backgroundColor: '#4f98a3' },
  chipText: { color: '#cdccca' },
  chipTextSelected: { color: '#fff' },
  count: { color: '#797876', marginBottom: 8 },
  card: { marginBottom: 12, backgroundColor: '#1c1b19' },
  typeChip: { alignSelf: 'flex-start', backgroundColor: '#2a2927' },
  notes: { color: '#797876', marginTop: 8 },
  empty: { color: '#797876', textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#4f98a3' },
});
