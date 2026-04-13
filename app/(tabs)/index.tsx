import { useMemo } from 'react';
import { ScrollView, StyleSheet, View, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Chip, Button, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGearStore } from '../../store/useGearStore';
import { useSessionStore } from '../../store/useSessionStore';
import { useEQStore } from '../../store/useEQStore';
import { useThemeStore } from '../../store/useThemeStore';

export default function HomeScreen() {
  const gear = useGearStore((s) => s.gear);
  const sessions = useSessionStore((s) => s.sessions);
  const profiles = useEQStore((s) => s.profiles);
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

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

  // Dynamic colors based on theme
  const bg = isDark ? '#171614' : '#f5f4f2';
  const titleColor = isDark ? '#cdccca' : '#1a1918';
  const dateColor = isDark ? '#797876' : '#5a5856';
  const cardBg = isDark ? '#1c1b19' : '#ffffff';
  const statNumColor = isDark ? '#4f98a3' : '#2e7a85';
  const statLabelColor = isDark ? '#797876' : '#5a5856';
  const sectionColor = isDark ? '#cdccca' : '#1a1918';
  const gearNameColor = isDark ? '#cdccca' : '#1a1918';
  const accent = isDark ? '#4f98a3' : '#2e7a85';

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header row with title and theme toggle */}
        <View style={styles.headerRow}>
          <View>
            <Text variant="headlineMedium" style={[styles.title, { color: titleColor }]}>Hi-Fi Audio Log</Text>
            <Text variant="bodyMedium" style={[styles.date, { color: dateColor }]}>{today}</Text>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle} hitSlop={12}>
            <MaterialCommunityIcons
              name={isDark ? 'weather-sunny' : 'weather-night'}
              size={26}
              color={accent}
            />
          </TouchableOpacity>
        </View>

        {isEmpty ? (
          <Surface style={[styles.onboarding, { backgroundColor: cardBg }]}>
            <Text variant="titleMedium" style={[styles.onboardingTitle, { color: sectionColor }]}>
              Welcome to Hi-Fi Audio Log
            </Text>
            <Text variant="bodyMedium" style={[styles.onboardingText, { color: dateColor }]}>
              Start by adding your first piece of gear
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push('/modals/add-gear')}
              style={styles.onboardingButton}
              buttonColor={accent}
            >
              Add Gear
            </Button>
          </Surface>
        ) : (
          <>
            <View style={styles.statsRow}>
              <Surface style={[styles.statCard, { backgroundColor: cardBg }]}>
                <Text variant="headlineLarge" style={[styles.statNumber, { color: statNumColor }]}>{gear.length}</Text>
                <Text variant="bodySmall" style={[styles.statLabel, { color: statLabelColor }]}>Gear</Text>
              </Surface>
              <Surface style={[styles.statCard, { backgroundColor: cardBg }]}>
                <Text variant="headlineLarge" style={[styles.statNumber, { color: statNumColor }]}>{sessions.length}</Text>
                <Text variant="bodySmall" style={[styles.statLabel, { color: statLabelColor }]}>Sessions</Text>
              </Surface>
              <Surface style={[styles.statCard, { backgroundColor: cardBg }]}>
                <Text variant="headlineLarge" style={[styles.statNumber, { color: statNumColor }]}>{profiles.length}</Text>
                <Text variant="bodySmall" style={[styles.statLabel, { color: statLabelColor }]}>EQ Profiles</Text>
              </Surface>
            </View>

            {recentGear.length > 0 && (
              <>
                <Text variant="titleMedium" style={[styles.sectionTitle, { color: sectionColor }]}>Recent Gear</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
                  {recentGear.map((item) => (
                    <Pressable key={item.id} onPress={() => router.push(`/gear/${item.id}`)}
                    >
                      <Surface style={[styles.gearCard, { backgroundColor: cardBg }]}>
                        <Text variant="bodyMedium" style={[styles.gearName, { color: gearNameColor }]}>{item.name}</Text>
                        <Chip style={styles.gearChip} textStyle={[styles.gearChipText, { color: gearNameColor }]}>
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
                <Text variant="titleMedium" style={[styles.sectionTitle, { color: sectionColor }]}>Recent Sessions</Text>
                {recentSessions.map((item) => {
                  const gearName = getGearName(item);
                  const displayTitle = item.track || item.album || 'Untitled Session';
                  const subtitleParts: string[] = [];
                  if (item.artist) subtitleParts.push(item.artist);
                  if (gearName) subtitleParts.push(gearName);
                  subtitleParts.push(new Date(item.date).toLocaleDateString());
                  return (
                    <Card
                      key={item.id}
                      style={[styles.sessionCard, { backgroundColor: cardBg }]}
                      onPress={() => router.push(`/sessions/${item.id}` as any)}
                    >
                      <Card.Title
                        title={displayTitle}
                        titleStyle={{ color: gearNameColor }}
                        subtitle={subtitleParts.join(' · ')}
                        subtitleStyle={{ color: dateColor }}
                        right={() =>
                          item.rating != null ? (
                            <Text style={[styles.rating, { color: accent }]}>{item.rating}/5</Text>
                          ) : null
                        }
                      />
                    </Card>
                  );
                })}
              </>
            )}

            <Text variant="titleMedium" style={[styles.sectionTitle, { color: sectionColor }]}>Quick Actions</Text>
            <View style={styles.actionsRow}>
              <Button
                mode="contained"
                onPress={() => router.push('/modals/add-gear')}
                style={styles.actionButton}
                buttonColor={accent}
                icon="plus"
              >
                Add Gear
              </Button>
              <Button
                mode="contained"
                onPress={() => router.push('/modals/add-session')}
                style={styles.actionButton}
                buttonColor={accent}
                icon="plus"
              >
                Add Session
              </Button>
            </View>
            <Button
              mode="outlined"
              onPress={() => router.push('/modals/backup-restore')}
              style={[styles.backupButton, { borderColor: accent }]}
              icon="database-export"
              textColor={accent}
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
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {},
  date: { marginTop: 2 },
  themeToggle: {
    padding: 6,
    marginTop: 4,
  },
  onboarding: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 32,
  },
  onboardingTitle: { marginBottom: 8 },
  onboardingText: { marginBottom: 20, textAlign: 'center' },
  onboardingButton: { minWidth: 160 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {},
  statLabel: { marginTop: 4 },
  sectionTitle: { marginBottom: 12 },
  horizontalList: { marginBottom: 24 },
  gearCard: {
    borderRadius: 12,
    padding: 16,
    marginRight: 10,
    minWidth: 140,
  },
  gearName: { marginBottom: 8 },
  gearChip: { alignSelf: 'flex-start', backgroundColor: 'transparent' },
  gearChipText: {},
  sessionCard: { marginBottom: 10 },
  rating: { marginRight: 16 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1 },
  backupButton: { marginTop: 12 },
});
