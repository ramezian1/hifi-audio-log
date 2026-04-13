import { useMemo } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Chip, Button, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { useGearStore } from '../../store/useGearStore';
import { useSessionStore } from '../../store/useSessionStore';
import { useEQStore } from '../../store/useEQStore';
export default function HomeScreen() {
  const gear = useGearStore((s) => s.gear);
  const sessions = useSessionStore((s) => s.sessions);
  const profiles = useEQStore((s) => s.profiles);
  const recentGear = useMemo(() => {
    return [...gear]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [gear]);
  const recentSessions = useMemo(() => {
    return [...sessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [sessions]);
  const isEmpty = gear.length === 0 && sessions.length === 0 && profiles.length === 0;
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const getGearName = (session: (typeof sessions)[number]): string | undefined => {
    if (session.gearId) return gear.find((g) => g.id === session.gearId)?.name;
    return undefined;
  };
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>Hi-Fi Audio Log</Text>
        <Text variant="bodyMedium" style={styles.date}>{today}</Text>
        {isEmpty ? (
          <Surface style={styles.onboarding}>
            <Text variant="titleMedium" style={styles.onboardingTitle}>
              Welcome to Hi-Fi Audio Log
            </Text>
            <Text variant="bodyMedium" style={styles.onboardingText}>
              Start by adding your first piece of gear
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push('/modals/add-gear')}
              style={styles.onboardingButton}
              buttonColor="#4f98a3"
            >
              Add Gear
            </Button>
          </Surface>
        ) : (
          <>
            <View style={styles.statsRow}>
              <Surface style={styles.statCard}>
                <Text variant="headlineLarge" style={styles.statNumber}>{gear.length}</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Gear</Text>
              </Surface>
              <Surface style={styles.statCard}>
                <Text variant="headlineLarge" style={styles.statNumber}>{sessions.length}</Text>
                <Text variant="bodySmall" style={styles.statLabel}>Sessions</Text>
              </Surface>
              <Surface style={styles.statCard}>
                <Text variant="headlineLarge" style={styles.statNumber}>{profiles.length}</Text>
                <Text variant="bodySmall" style={styles.statLabel}>EQ Profiles</Text>
              </Surface>
            </View>
            {recentGear.length > 0 && (
              <>
                <Text variant="titleMedium" style={styles.sectionTitle}>Recent Gear</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                  {recentGear.map((item) => (
                    <Pressable key={item.id} onPress={() => router.push(`/gear/${item.id}`)}>
                      <Surface style={styles.gearCard}>
                        <Text variant="titleSmall" style={styles.gearName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <Chip compact style={styles.gearChip} textStyle={styles.gearChipText}>
                          {item.type}
                        </Chip>
                      </Surface>
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}
            {recentSessions.length > 0 && (
              <>
                <Text variant="titleMedium" style={styles.sectionTitle}>Recent Sessions</Text>
                {recentSessions.map((item) => {
                  const gearName = getGearName(item);
                  const displayTitle = item.track || item.album || 'Untitled Session';
                  const subtitleParts: string[] = [];
                  if (item.artist) subtitleParts.push(item.artist);
                  if (gearName) subtitleParts.push(gearName);
                  subtitleParts.push(new Date(item.date).toLocaleDateString());
                  return (
                    <Card key={item.id} style={styles.sessionCard} onPress={() => router.push(`/sessions/${item.id}` as any)}>
                      <Card.Title
                        title={displayTitle}
                        subtitle={subtitleParts.join(' \u00B7 ')}
                      />
                      {item.rating != null && (
                        <Card.Content>
                          <Text variant="bodySmall" style={styles.rating}>
                            Rating: {item.rating}/5
                          </Text>
                        </Card.Content>
                      )}
                    </Card>
                  );
                })}
              </>
            )}
            <Text variant="titleMedium" style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsRow}>
              <Button
                mode="contained"
                onPress={() => router.push('/modals/add-gear')}
                style={styles.actionButton}
                buttonColor="#4f98a3"
                icon="plus"
              >
                Add Gear
              </Button>
              <Button
                mode="contained"
                onPress={() => router.push('/modals/add-session')}
                style={styles.actionButton}
                buttonColor="#4f98a3"
                icon="plus"
              >
                Add Session
              </Button>
            </View>
            <Button
              mode="outlined"
              onPress={() => router.push('/modals/backup-restore')}
              style={styles.backupButton}
              icon="database-export"
            >
              Backup & Restore
            </Button>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614' },
  content: { padding: 16, paddingBottom: 32 },
  title: { color: '#cdccca' },
  date: { color: '#797876', marginBottom: 20 },
  onboarding: {
    backgroundColor: '#1c1b19',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 32,
  },
  onboardingTitle: { color: '#cdccca', marginBottom: 8 },
  onboardingText: { color: '#797876', marginBottom: 20, textAlign: 'center' },
  onboardingButton: { minWidth: 160 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: '#1c1b19',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: { color: '#4f98a3' },
  statLabel: { color: '#797876', marginTop: 4 },
  sectionTitle: { color: '#cdccca', marginBottom: 12 },
  horizontalList: { marginBottom: 24 },
  gearCard: {
    backgroundColor: '#1c1b19',
    borderRadius: 12,
    padding: 16,
    marginRight: 10,
    minWidth: 140,
  },
  gearName: { color: '#cdccca', marginBottom: 8 },
  gearChip: { alignSelf: 'flex-start', backgroundColor: '#2a2927' },
  gearChipText: { color: '#cdccca' },
  sessionCard: { backgroundColor: '#1c1b19', marginBottom: 10 },
  rating: { color: '#4f98a3' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1 },
  backupButton: { marginTop: 12, borderColor: '#4f98a3' },
});
