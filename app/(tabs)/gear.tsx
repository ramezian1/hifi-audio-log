import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Card, Chip, FAB, Searchbar, Text } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
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
  const deleteGear = useGearStore((s) => s.deleteGear);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<GearItem['type'] | 'all'>('all');

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return gear.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        (item.notes ?? '').toLowerCase().includes(q)
      );
    });
  }, [gear, searchQuery, typeFilter]);

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Gear',
      `Remove "${name}" from your collection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteGear(id) },
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
      <Text variant="headlineMedium" style={styles.title}>
        My Gear
      </Text>
      <Searchbar
        placeholder="Search gear"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
      />
      <View style={styles.chipRow}>
        {TYPE_FILTERS.map((filter) => (
          <Chip
            key={filter.value}
            selected={typeFilter === filter.value}
            onPress={() => setTypeFilter(filter.value)}
            compact
            style={[
              styles.chip,
              typeFilter === filter.value && styles.chipSelected,
            ]}
            textStyle={
              typeFilter === filter.value
                ? styles.chipTextSelected
                : styles.chipText
            }
          >
            {filter.label}
          </Chip>
        ))}
      </View>
      <Text variant="bodySmall" style={styles.count}>
        {filtered.length} item{filtered.length !== 1 ? 's' : ''}
      </Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 96 }}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => renderRightActions(item.id, item.name)}
            overshootRight={false}
          >
            <Pressable onPress={() => router.push(`/gear/${item.id}` as any)}>
              <Card style={styles.card}>
                <Card.Title title={item.name} subtitle={item.brand} />
                <Card.Content>
                  <Chip style={styles.typeChip}>{item.type}</Chip>
                  {item.notes ? (
                    <Text variant="bodySmall" style={styles.notes}>
                      {item.notes}
                    </Text>
                  ) : null}
                </Card.Content>
              </Card>
            </Pressable>
          </Swipeable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {searchQuery || typeFilter !== 'all'
              ? 'No gear matches your search'
              : 'No gear yet. Tap + to add your first item.'}
          </Text>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/modals/add-gear' as any)}
      />
    </SafeAreaView>
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
  chipTextSelected: { color: '#ffffff' },
  count: { color: '#797876', marginBottom: 8 },
  card: { marginBottom: 12, backgroundColor: '#1c1b19' },
  typeChip: { alignSelf: 'flex-start', backgroundColor: '#2a2927', marginTop: 8 },
  notes: { color: '#797876', marginTop: 8 },
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
