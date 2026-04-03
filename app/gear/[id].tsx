import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Button, Chip, Divider, useTheme } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { useGearStore } from '../../store/useGearStore';
import { useSessionStore } from '../../store/useSessionStore';

export default function GearDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const gear = useGearStore((s) => s.getGearById(id));
  const deleteGear = useGearStore((s) => s.deleteGear);
  const sessions = useSessionStore((s) => s.sessions.filter((sess) => sess.gearIds.includes(id)));

  if (!gear) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="bodyLarge" style={styles.notFound}>Gear not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    deleteGear(id);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.content}>
            <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>{gear.name}</Text>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>{gear.brand}</Text>

            <Chip compact style={styles.typeChip}>{gear.type}</Chip>

            {gear.purchaseDate && (
              <View style={styles.field}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Purchase Date</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onBackground }}>{gear.purchaseDate}</Text>
              </View>
            )}

            {gear.notes && (
              <View style={styles.field}>
                <Text variant="labelMedium" style={{ color: theme.colors.onSurfaceVariant }}>Notes</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onBackground }}>{gear.notes}</Text>
              </View>
            )}

            <Divider style={styles.divider} />
            <Text variant="titleMedium" style={{ color: theme.colors.onBackground, marginBottom: 8 }}>
              Listening Sessions ({sessions.length})
            </Text>
          </View>
        }
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={[styles.sessionCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Title
              title={item.trackOrAlbum ?? 'Untitled Session'}
              subtitle={`${item.artist ?? 'Unknown artist'} · ${new Date(item.date).toLocaleDateString()}`}
            />
            {item.rating != null && (
              <Card.Content>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Rating: {item.rating}/10
                </Text>
              </Card.Content>
            )}
          </Card>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.colors.onSurfaceVariant }]}>No sessions with this gear yet.</Text>
        }
        ListFooterComponent={
          <Button
            mode="outlined"
            onPress={handleDelete}
            textColor={theme.colors.error}
            style={styles.deleteButton}
          >
            Delete Gear
          </Button>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  listContent: { paddingBottom: 32 },
  notFound: { textAlign: 'center', marginTop: 48 },
  typeChip: { alignSelf: 'flex-start', marginTop: 12 },
  field: { marginTop: 16 },
  divider: { marginVertical: 20 },
  sessionCard: { marginHorizontal: 16, marginBottom: 8 },
  empty: { textAlign: 'center', marginTop: 16, paddingHorizontal: 16 },
  deleteButton: { marginHorizontal: 16, marginTop: 24 },
});
