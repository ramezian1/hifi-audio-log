import { useMemo } from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { Text, Card, Button, Chip, Surface } from 'react-native-paper';
import { router } from 'expo-router';
import { useGearStore } from '../../store/useGearStore';
import { useSessionStore } from '../../store/useSessionStore';
import { useEQStore } from '../../store/useEQStore';

export default function HomeScreen() {
  const gear = useGearStore((s) => s.gear);
  const sessions = useSessionStore((s) => s.sessions);
  const profiles = useEQStore((s) => s.profiles);

  const recentGear = useMemo(() => gear.slice(-3).reverse(), [gear]);
  const recentSessions = useMemo(() => sessions.slice(0, 3), [sessions]);

  const isEmpty = gear.length === 0 && sessions.length === 0 && profiles.length === 0;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getGearName = (session: (typeof sessions)[number]): string | undefined => {
    if (session.gearId) return gear.find((g) => g.id === session.gearId)?.name;
    if (session.gearIds && session.gearIds.length > 0) {
      return gear.find((g) => g.id === session.gearIds![0])?.name;
    }
    return undefined;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineMedium" style={styles.appTitle}>Hi-Fi Audio Log</Text>
      <Text variant="bodyMedium" style={styles.date}>{today}</Text>

      {/* Stats Row */}
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

      {isEmpty ? (
        <View style={styles.onboarding}>
          <Text variant="titleMedium" style={styles.onboardingTitle}>
            Welcome to Hi-Fi Audio Log
          </Text>
          <Text variant="bodyMedium" style={styles.onboardingText}>
            Start by adding your first piece of gear
          </Text>
          <Button
            mode="contained"
            buttonColor="#4f98a3"
            textColor="#fff"
            icon="plus"
            onPress={() => router.push('/modals/add-gear')}
            style={styles.onboardingButton}
          >
            Add Gear
          </Button>
        </View>
      ) : (
        <>
          {/* Recent Gear */}
          {recentGear.length > 0 && (
            <>
              <Text variant="titleMedium" style={styles.sectionTitle}>Recent Gear</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                {recentGear.map((item) => (
                  <Pressable key={item.id} onPress={() => router.push(`/gear/${item.id}`)}>
                    <Surface style={styles.gearCard}>
                      <Text variant="titleSmall" style={styles.gearCardName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Chip compact style={styles.gearCardChip} textStyle={styles.gearCardChipText}>
                        {item.type}
                      </Chip>
                    </Surface>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          )}

          {/* Recent Sessions */}
          {recentSessions.length > 0 && (
            <>
              <Text variant="titleMedium" style={styles.sectionTitle}>Recent Sessions</Text>
              {recentSessions.map((session) => {
                const gearName = getGearName(session);
                const displayTitle = session.track || session.trackOrAlbum || 'Untitled Session';
                const subtitleParts: string[] = [];
                if (session.artist) subtitleParts.push(session.artist);
                if (gearName) subtitleParts.push(gearName);
                subtitleParts.push(new Date(session.createdAt).toLocaleDateString());

                return (
                  <Card key={session.id} style={styles.sessionCard}>
                    <Card.Title title={displayTitle} subtitle={subtitleParts.join(' · ')} />
                    {session.rating != null && (
                      <Card.Content>
                        <Text variant="bodySmall" style={styles.rating}>Rating: {session.rating}/5</Text>
                      </Card.Content>
                    )}
                  </Card>
                );
              })}
            </>
          )}

          {/* Quick Actions */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <Button
              mode="contained"
              buttonColor="#4f98a3"
              textColor="#fff"
              icon="plus"
              onPress={() => router.push('/modals/add-gear')}
              style={styles.actionButton}
            >
              Add Gear
            </Button>
            <Button
              mode="contained"
              buttonColor="#4f98a3"
              textColor="#fff"
              icon="plus"
              onPress={() => router.push('/modals/add-session')}
              style={styles.actionButton}
            >
              Add Session
            </Button>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614' },
  content: { padding: 16, paddingBottom: 32 },
  appTitle: { color: '#cdccca', marginBottom: 4 },
  date: { color: '#797876', marginBottom: 20 },
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
  onboarding: { alignItems: 'center', marginTop: 48 },
  onboardingTitle: { color: '#cdccca', marginBottom: 8 },
  onboardingText: { color: '#797876', marginBottom: 20, textAlign: 'center' },
  onboardingButton: { marginTop: 8 },
  sectionTitle: { color: '#cdccca', marginBottom: 12 },
  horizontalList: { marginBottom: 24 },
  gearCard: {
    backgroundColor: '#1c1b19',
    borderRadius: 12,
    padding: 16,
    marginRight: 10,
    minWidth: 140,
    alignItems: 'center',
    gap: 8,
  },
  gearCardName: { color: '#cdccca' },
  gearCardChip: { backgroundColor: '#2a2927' },
  gearCardChipText: { color: '#797876', fontSize: 11 },
  sessionCard: { backgroundColor: '#1c1b19', marginBottom: 8 },
  rating: { color: '#4f98a3' },
  quickActions: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1 },
});
