import { useState } from 'react';
import { View, FlatList, StyleSheet, Modal, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text, FAB, Card } from 'react-native-paper';
import { useSessionStore } from '../../store/useSessionStore';
import { useGearStore } from '../../store/useGearStore';

export default function SessionsScreen() {
  const { sessions, addSession } = useSessionStore();
  const { gear } = useGearStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [trackOrAlbum, setTrackOrAlbum] = useState('');
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const [rating, setRating] = useState('');
  const [selectedGearIds, setSelectedGearIds] = useState<string[]>([]);

  const toggleGear = (id: string) => {
    setSelectedGearIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    addSession({
      id: Date.now().toString(),
      gearIds: selectedGearIds,
      date: new Date().toISOString(),
      trackOrAlbum: trackOrAlbum.trim() || undefined,
      notes: notes.trim() || undefined,
      duration: duration ? parseInt(duration, 10) : undefined,
      rating: rating ? parseInt(rating, 10) : undefined,
      createdAt: new Date().toISOString(),
    });
    setTrackOrAlbum('');
    setNotes('');
    setDuration('');
    setRating('');
    setSelectedGearIds([]);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Listening Sessions</Text>
      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.trackOrAlbum ?? 'Untitled Session'}
              subtitle={new Date(item.date).toLocaleDateString()}
            />
            <Card.Content>
              {item.notes && <Text variant="bodySmall" style={styles.notes}>{item.notes}</Text>}
              {item.duration && <Text variant="bodySmall" style={styles.notes}>{item.duration} min</Text>}
              {item.rating && <Text variant="bodySmall" style={styles.notes}>Rating: {item.rating}/10</Text>}
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No sessions logged yet. Tap + to add one.</Text>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text variant="titleLarge" style={styles.modalTitle}>Log Session</Text>
            <ScrollView>
              <Text style={styles.label}>Track / Album</Text>
              <TextInput
                style={styles.input}
                value={trackOrAlbum}
                onChangeText={setTrackOrAlbum}
                placeholder="What were you listening to?"
                placeholderTextColor="#555"
              />
              {gear.length > 0 && (
                <>
                  <Text style={styles.label}>Gear Used</Text>
                  <View style={styles.chipRow}>
                    {gear.map((g) => (
                      <TouchableOpacity key={g.id} onPress={() => toggleGear(g.id)}>
                        <View style={[
                          styles.gearChip,
                          selectedGearIds.includes(g.id) && styles.gearChipSelected,
                        ]}>
                          <Text style={styles.gearChipText}>{g.name}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
              <Text style={styles.label}>Duration (minutes)</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="e.g. 60"
                placeholderTextColor="#555"
                keyboardType="numeric"
              />
              <Text style={styles.label}>Rating (1-10)</Text>
              <TextInput
                style={styles.input}
                value={rating}
                onChangeText={setRating}
                placeholder="e.g. 8"
                placeholderTextColor="#555"
                keyboardType="numeric"
              />
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Optional notes..."
                placeholderTextColor="#555"
                multiline
                numberOfLines={3}
              />
            </ScrollView>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnSave} onPress={handleAdd}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614', padding: 16 },
  title: { color: '#cdccca', marginBottom: 16 },
  card: { marginBottom: 12, backgroundColor: '#1c1b19' },
  notes: { color: '#797876', marginTop: 4 },
  empty: { color: '#797876', textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#4f98a3' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#1c1b19', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, maxHeight: '90%' },
  modalTitle: { color: '#cdccca', marginBottom: 16 },
  label: { color: '#797876', fontSize: 12, marginTop: 12, marginBottom: 4, textTransform: 'uppercase' },
  input: { backgroundColor: '#2a2927', color: '#cdccca', borderRadius: 8, padding: 12, fontSize: 15 },
  inputMultiline: { minHeight: 72, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  gearChip: { backgroundColor: '#2a2927', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  gearChipSelected: { backgroundColor: '#4f98a3' },
  gearChipText: { color: '#cdccca', fontSize: 13 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btnCancel: { flex: 1, backgroundColor: '#2a2927', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnSave: { flex: 1, backgroundColor: '#4f98a3', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#cdccca', fontWeight: '600' },
});
