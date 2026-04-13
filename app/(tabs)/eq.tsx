import { useState, useMemo } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, FAB, Card, Searchbar } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { useEQStore } from '../../store/useEQStore';
import { useGearStore } from '../../store/useGearStore';
import { useThemeStore } from '../../store/useThemeStore';
import { EQCurveChart } from '../../components/EQCurveChart';
import type { EQProfile } from '../../types';
import { Pressable } from 'react-native';

export default function EQScreen() {
  const profiles = useEQStore((s) => s.profiles);
  const deleteProfile = useEQStore((s) => s.deleteProfile);
  const gear = useGearStore((s) => s.gear);
  const isDark = useThemeStore((s) => s.isDark);
  const [searchQuery, setSearchQuery] = useState('');

  const bg = isDark ? '#171614' : '#f5f4f2';
  const titleColor = isDark ? '#cdccca' : '#1a1918';
  const countColor = isDark ? '#797876' : '#5a5856';
  const cardBg = isDark ? '#1c1b19' : '#ffffff';
  const notesColor = isDark ? '#797876' : '#5a5856';
  const emptyColor = isDark ? '#797876' : '#9a9896';
  const fabColor = isDark ? '#4f98a3' : '#2e7a85';
  const searchBg = isDark ? '#1c1b19' : '#ffffff';
  const searchInputColor = isDark ? '#cdccca' : '#1a1918';

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
  <Pressable style={styles.deleteAction} onPress={() => handleDelete(id, name)}>
    <Text style={styles.deleteText}>Delete</Text>
  </Pressable>
);

  const renderItem = ({ item }: { item: EQProfile }) => {
    const linkedGear = item.gearId ? gear.find((g) => g.id === item.gearId) : undefined;
    const subtitle = [
      linkedGear ? linkedGear.name : null,
      `${item.bands.length} band${item.bands.length !== 1 ? 's' : ''}`,
    ].filter(Boolean).join(' · ');

    return (
      <Swipeable
        renderRightActions={() => renderRightActions(item.id, item.name)}
        overshootRight={false}
      >
        <Card
          style={[styles.card, { backgroundColor: cardBg }]}
          onPress={() => router.push(`/modals/add-eq?id=${item.id}` as any)}
        >
          <Card.Title
            title={item.name}
            titleStyle={{ color: titleColor }}
            subtitle={subtitle}
            subtitleStyle={{ color: countColor }}
          />
          <Card.Content>
            {item.bands.length > 0 && (
              <EQCurveChart bands={item.bands} preamp={item.preamp} width={320} height={130} />
            )}
            {item.notes ? (
              <Text style={[styles.notes, { color: notesColor }]}>{item.notes}</Text>
            ) : null}
          </Card.Content>
        </Card>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: bg }]}>
      <Text variant="headlineMedium" style={[styles.title, { color: titleColor }]}>EQ Profiles</Text>
      <Searchbar
        placeholder="Search by profile or gear name"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[styles.searchbar, { backgroundColor: searchBg }]}
        inputStyle={{ color: searchInputColor }}
        iconColor="#797876"
        placeholderTextColor="#797876"
      />
      <Text variant="bodySmall" style={[styles.count, { color: countColor }]}>
        {filtered.length} profile{filtered.length !== 1 ? 's' : ''}
      </Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: emptyColor }]}>
            {searchQuery ? 'No EQ profiles match your search' : 'No EQ profiles yet. Tap + to create one.'}
          </Text>
        }
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: fabColor }]}
        onPress={() => router.push('/modals/add-eq')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 12 },
  searchbar: { marginBottom: 8 },
  count: { marginBottom: 8 },
  card: { marginBottom: 12 },
  notes: { marginTop: 8, fontSize: 13 },
  empty: { textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', right: 16, bottom: 16 },
  deleteAction: {
  backgroundColor: '#c0392b',
  justifyContent: 'center',
  alignItems: 'center',
  width: 104,
  marginBottom: 12,
  borderRadius: 8,
},
  deleteText: { color: '#fff', fontWeight: 'bold' },
});
