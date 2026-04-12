import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from 'react-native-paper';
import { SessionForm } from '../../components/SessionForm';
import { useSessionStore } from '../../store/useSessionStore';

export default function AddSessionModal() {
  const addSession = useSessionStore((s) => s.addSession);

  const handleSubmit = (values: {
    gearId?: string;
    track?: string;
    artist?: string;
    album?: string;
    notes?: string;
    rating?: number;
    date: string;
    duration?: number;
  }) => {
    const now = new Date().toISOString();

    addSession({
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      ...values,
      createdAt: now,
      updatedAt: now,
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        Add Session
      </Text>
      <SessionForm submitLabel="Save" onCancel={() => router.back()} onSubmit={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614' },
  content: { padding: 16, gap: 12 },
  title: { color: '#cdccca', marginBottom: 8 },
});
