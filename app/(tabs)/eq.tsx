import { useState } from 'react';
import { View, FlatList, StyleSheet, Modal, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text, FAB, Card } from 'react-native-paper';
import { useEQStore } from '../../store/useEQStore';
import { useGearStore } from '../../store/useGearStore';

// Default 10-band EQ
const DEFAULT_BANDS = [
  { frequency: 31, gain: 0, q: 1 },
  { frequency: 63, gain: 0, q: 1 },
  { frequency: 125, gain: 0, q: 1 },
  { frequency: 250, gain: 0, q: 1 },
  { frequency: 500, gain: 0, q: 1 },
  { frequency: 1000, gain: 0, q: 1 },
  { frequency: 2000, gain: 0, q: 1 },
  { frequency: 4000, gain: 0, q: 1 },
  { frequency: 8000, gain: 0, q: 1 },
  { frequency: 16000, gain: 0, q: 1 },
];

export default function EQScreen() {
  const { profiles, addProfile } = useEQStore();
  const { gear } = useGearStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [preamp, setPreamp] = useState('0');
  const [notes, setNotes] = useState('');
  const [selectedGearId, setSelectedGearId] = useState<string | undefined>(undefined);

  const handleAdd = () => {
    if (!name.trim()) return;
    addProfile({
      id: Date.now().toString(),
      name: name.trim(),
      gearId: selectedGearId,
      bands: DEFAULT_BANDS,
      preamp: parseFloat(preamp) || 0,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setName('');
    setPreamp('0');
    setNotes('');
    setSelectedGearId(undefined);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>EQ Profiles</Text>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.name}
              subtitle={`${item.bands.length} bands · Preamp: ${item.preamp}dB`}
            />
            {item.notes && (
              <Card.Content>
                <Text variant="bodySmall" style={styles.notes}>{item.notes}</Text>
              </Card.Content>
            )}
          </Card>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No EQ profiles yet. Tap + to create one.</Text>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text variant="titleLarge" style={styles.modalTitle}>New EQ Profile</Text>
            <ScrollView>
              <Text style={styles.label}>Profile Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. HD 800 S Harman"
                placeholderTextColor="#555"
              />
              <Text style={styles.label}>Preamp (dB)</Text>
              <TextInput
                style={styles.input}
                value={preamp}
                onChangeText={setPreamp}
                placeholder="0"
                placeholderTextColor="#555"
                keyboardType="numeric"
              />
              {gear.length > 0 && (
                <>
                  <Text style={styles.label}>Linked Headphone</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.chipRow}>
                      {gear
                        .filter((g) => g.type === 'headphone' || g.type === 'iem')
                        .map((g) => (
                          <TouchableOpacity
                            key={g.id}
                            onPress={() => setSelectedGearId(selectedGearId === g.id ? undefined : g.id)}
                          >
                            <View style={[
                              styles.gearChip,
                              selectedGearId === g.id && styles.gearChipSelected,
                            ]}>
                              <Text style={styles.gearChipText}>{g.name}</Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                    </View>
                  </ScrollView>
                </>
              )}
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={notes}
                onChangeText={setNotes}
                placeholder="EQ description, target curve, etc..."
                placeholderTextColor="#555"
                multiline
                numberOfLines={3}
              />
              <Text style={styles.hint}>10-band EQ preset will be created with flat gains. Edit individual band gains after saving.</Text>
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
  hint: { color: '#555', fontSize: 11, marginTop: 12, fontStyle: 'italic' },
  input: { backgroundColor: '#2a2927', color: '#cdccca', borderRadius: 8, padding: 12, fontSize: 15 },
  inputMultiline: { minHeight: 72, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  gearChip: { backgroundColor: '#2a2927', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  gearChipSelected: { backgroundColor: '#4f98a3' },
  gearChipText: { color: '#cdccca', fontSize: 13 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btnCancel: { flex: 1, backgroundColor: '#2a2927', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnSave: { flex: 1, backgroundColor: '#4f98a3', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#cdccca', fontWeight: '600' },
});
