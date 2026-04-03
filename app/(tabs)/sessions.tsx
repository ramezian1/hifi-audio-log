import { useState, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Text, FAB, Card, Chip, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import { useSessionStore } from '../../store/useSessionStore';
import { useGearStore } from '../../store/useGearStore';
import type { ListeningSession } from '../../types';

const RATING_FILTERS = ['All', '★5', '★4', '★3', '★2', '★1'] as const;
type RatingFilter = (typeof RATING_FILTERS)[number];

function ratingFilterToNumber(filter: RatingFilter): number | null {
  if (filter === 'All') return null;
  return parseInt(filter.charAt(1), 10);
}

export default function SessionsScreen() {
  const sessions = useSessionStore((s) => s.sessions);
  const gear = useGearStore((s) => s.gear);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('All');

  const getGearName = (session: ListeningSession): string | undefined => {
    if (session.gearId) {
      return gear.find((g) => g.id === session.gearId)?.name;
    }
    if (session.gearIds && session.gearIds.length > 0) {
      return gear.find((g) => g.id === session.gearIds![0])?.name;
    }
    return undefined;
  };

  const filteredSessions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const ratingValue = ratingFilterToNumber(ratingFilter);

    return sessions.filter((session: ListeningSession) => {
      if (ratingValue !== null && session.rating !== ratingValue) return false;
      if (query) {
        const track = (session.track || session.trackOrAlbum || '').toLowerCase();
        const artist = (session.artist || '').toLowerCase();
        const gearName = (getGearName(session) || '').toLowerCase();
        if (!track.includes(query) && !artist.includes(query) && !gearName.includes(query)) return false;
      }
      return true;
    });
  }, [sessions, searchQuery, ratingFilter, gear]);

  return (
    <View style={styles.container}>
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
        {RATING_FILTERS.map((filter) => (
          <Chip
            key={filter}
            selected={ratingFilter === filter}
            onPress={() => setRatingFilter(filter)}
            style={[styles.filterChip, ratingFilter === filter && styles.filterChipActive]}
            textStyle={ratingFilter === filter ? styles.filterChipTextActive : styles.filterChipText}
            compact
          >
            {filter}
          </Chip>
        ))}
      </View>
      <Text variant="bodySmall" style={styles.resultCount}>
        {filteredSessions.length} {filteredSessions.length === 1 ? 'session' : 'sessions'}
      </Text>
      <FlatList
        data={filteredSessions}
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
          <Text style={styles.empty}>
            {searchQuery || ratingFilter !== 'All'
              ? 'No sessions match your search'
              : 'No sessions logged yet. Tap + to add one.'}
          </Text>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => router.push('/modals/add-session')} />
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
  rating: { color: '#4f98a3' },
  empty: { color: '#797876', textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#4f98a3' },
});
