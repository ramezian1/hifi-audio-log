import { useState, useMemo, useCallback } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FAB, Card, Chip, Searchbar } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { useSessionStore } from '../../store/useSessionStore';
import { useGearStore } from '../../store/useGearStore';
import type { ListeningSession } from '../../types';

const RATING_FILTERS: { label: string; value: number }[] = [
  { label: 'All', value: 0 },
  { label: '\u26055', value: 5 },
  { label: '\u26054', value: 4 },
  { label: '\u26053', value: 3 },
  { label: '\u26052', value: 2 },
  { label: '\u26051', value: 1 },
];

export default function SessionsScreen() {
  const sessions = useSessionStore((s) => s.sessions);
  const deleteSession = useSessionStore((s) => s.deleteSession);
  const gear = useGearStore((s) => s.gear);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState(0);

  const getGearName = useCallback(
    (session: ListeningSession): string | undefined => {
      if (session.gearId) {
        return gear.find((g) => g.id === session.gearId)?.name;
      }
      if (session.gearIds && session.gearIds.length > 0) {
        return gear.find((g) => g.id === session.gearIds![0])?.name;
      }
      return undefined;
    },
    [gear],
  );

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return sessions.filter((item) => {
      if (ratingFilter !== 0 && item.rating !== ratingFilter) return false;
      if (q) {
        const gearName = getGearName(item) ?? '';
        const title = item.track || item.album || '';
        return (
          title.toLowerCase().includes(q) ||
          (item.artist ?? '').toLowerCase().includes(q) ||
          gearName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sessions, searchQuery, ratingFilter, getGearName]);

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      'Delete Session',
      `Remove "${title}" from your sessions?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteSession(id) },
      ]
    );
  };

  const renderRightActions = (id: string, title: string) => (
    <View style={styles.deleteAction}>
      <Text style={styles.deleteText} onPress={() => handleDelete(id, title)}>
        Delete
      </Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Listening Sessions</Text>
      <Searchbar
        placeholder="Search by track, artist, or gear"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
        inputStyle={styles.searchInput}
        iconColor="#797876"
        placeholderTextColor="#797876"
      />
      <View style={styles.chipRow}>
        {RATING_FILTERS.map((f) => (
          <Chip
            key={f.value}
            selected={ratingFilter === f.value}
            onPress={() => setRatingFilter(f.value)}
            compact
            style={[styles.chip, ratingFilter === f.value && styles.chipSelected]}
            textStyle={ratingFilter === f.value ? styles.chipTextSelected : styles.chipText}
          >
            {f.label}
          </Chip>
        ))}
      </View>
      <Text variant="bodySmall" style={styles.count}>
        {filtered.length} session{filtered.length !== 1 ? 's' : ''}
      </Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const gearName = getGearName(item);
          const displayTitle = item.track || item.album || 'Untitled Session';
          const subtitleParts: string[] = [];
          if (item.artist) subtitleParts.push(item.artist);
          if (gearName) subtitleParts.push(gearName);
          subtitleParts.push(new Date(item.date).toLocaleDateString());
          return (
            <Swipeable
              renderRightActions={() => renderRightActions(item.id, displayTitle)}
              overshootRight={false}
            >
            <Card style={styles.card} onPress={() => router.push(`/sessions/${item.id}` as any)}>
  <Card.Title
    title={displayTitle}
    subtitle={subtitleParts.join(' · ')}
  />
  {item.rating != null && (
    <Card.Content>
      <Text style={styles.rating}>Rating: {item.rating}/5</Text>
    </Card.Content>
  )}
</Card>
</Swipeable>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {searchQuery || ratingFilter !== 0
              ? 'No sessions match your search'
              : 'No sessions logged yet. Tap + to add one.'}
          </Text>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/modals/add-session')}
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
  chipTextSelected: { color: '#fff' },
  count: { color: '#797876', marginBottom: 8 },
  card: { marginBottom: 12, backgroundColor: '#1c1b19' },
  rating: { color: '#4f98a3' },
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
