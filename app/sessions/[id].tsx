import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, Text } from 'react-native-paper';
import { useSessionStore } from '../../store/useSessionStore';
import { useGearStore } from '../../store/useGearStore';
import { SessionForm } from '../../components/SessionForm';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sessions = useSessionStore((s) => s.sessions);
  const updateSession = useSessionStore((s) => s.updateSession);
  const deleteSession = useSessionStore((s) => s.deleteSession);
  const gear = useGearStore((s) => s.gear);

  const session = useMemo(() => sessions.find((s) => s.id === id), [sessions, id]);
  const [isEditing, setIsEditing] = useState(false);

  const gearName = useMemo(() => {
    if (!session?.gearId) return undefined;
    return gear.find((g) => g.id === session.gearId)?.name;
  }, [gear, session]);

  if (!session) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Session not found.</Text>
        <Button mode="contained" onPress={() => router.back()} style={{ marginTop: 12 }}>
          Go Back
        </Button>
      </View>
    );
  }

  const displayTitle = session.track || session.album || 'Listening Session';

  const handleDelete = () => {
    Alert.alert('Delete session', `Delete "${displayTitle}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteSession(session.id);
          router.replace('/(tabs)/sessions' as any);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        {displayTitle}
      </Text>

      {!isEditing ? (
        <>
          <DetailRow label="Artist" value={session.artist} />
          <DetailRow label="Album" value={session.album} />
          <DetailRow label="Gear" value={gearName} />
          <DetailRow label="Date" value={new Date(session.date).toLocaleString()} />
          <DetailRow
            label="Duration"
            value={session.duration ? `${session.duration} min` : undefined}
          />
          <DetailRow
            label="Rating"
            value={session.rating != null ? `${session.rating}/5` : undefined}
          />
          <DetailRow label="Notes" value={session.notes} />

          <Card style={styles.metaCard}>
            <Card.Content>
              <Text style={styles.metaText}>Created: {new Date(session.createdAt).toLocaleString()}</Text>
              <Text style={styles.metaText}>Updated: {new Date(session.updatedAt).toLocaleString()}</Text>
            </Card.Content>
          </Card>

          <View style={styles.buttonCol}>
            <Button mode="contained" onPress={() => setIsEditing(true)}>
              Edit Session
            </Button>
            <Button
              mode="outlined"
              buttonColor="#2d1618"
              textColor="#ffb4ab"
              onPress={handleDelete}
            >
              Delete Session
            </Button>
          </View>
        </>
      ) : (
        <SessionForm
          initialValues={session}
          submitLabel="Save Changes"
          onCancel={() => setIsEditing(false)}
          onSubmit={(values) => {
            updateSession(session.id, values);
            setIsEditing(false);
          }}
        />
      )}
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614' },
  content: { padding: 16, gap: 8 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#171614',
    padding: 24,
  },
  title: { color: '#cdccca' },
  field: { marginBottom: 14 },
  label: {
    color: '#797876',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontSize: 12,
  },
  value: { color: '#cdccca' },
  emptyText: { color: '#797876' },
  buttonCol: { gap: 12, marginTop: 20 },
  metaCard: { backgroundColor: '#1c1b19', marginTop: 8 },
  metaText: { color: '#797876' },
});
