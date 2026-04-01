import { useState } from 'react';
import { View, FlatList, StyleSheet, Modal, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text, FAB, Card, Chip } from 'react-native-paper';
import { useGearStore } from '../../store/useGearStore';
import { GearItem } from '../../types';

const GEAR_TYPES: GearItem['type'][] = ['headphone', 'iem', 'dac', 'amp', 'cable', 'other'];

export default function GearScreen() {
  const { gear, addGear } = useGearStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState<GearItem['type']>('headphone');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !brand.trim()) return;
    addGear({
      id: Date.now().toString(),
      name: name.trim(),
      brand: brand.trim(),
      type,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setName('');
    setBrand('');
    setType('headphone');
    setNotes('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>My Gear</Text>
      <FlatList
        data={gear}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.name} subtitle={item.brand} />
            <Card.Content>
              <Chip compact>{item.type}</Chip>
              {item.notes && <Text variant="bodySmall" style={styles.notes}>{item.notes}</Text>}
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No gear yet. Tap + to add your first item.</Text>
        }
      />
      <FAB icon="plus" style={styles.fab} onPress={() => setModalVisible(true)} />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text variant="titleLarge" style={styles.modalTitle}>Add Gear</Text>
            <ScrollView>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g. HD 800 S"
                placeholderTextColor="#555"
              />
              <Text style={styles.label}>Brand *</Text>
              <TextInput
                style={styles.input}
                value={brand}
                onChangeText={setBrand}
                placeholder="e.g. Sennheiser"
                placeholderTextColor="#555"
              />
              <Text style={styles.label}>Type</Text>
              <View style={styles.chipRow}>
                {GEAR_TYPES.map((t) => (
                  <TouchableOpacity key={t} onPress={() => setType(t)}>
                    <Chip
                      compact
                      selected={type === t}
                      style={[styles.typeChip, type === t && styles.typeChipSelected]}
                    >
                      {t}
                    </Chip>
                  </TouchableOpacity>
                ))}
              </View>
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
  notes: { color: '#797876', marginTop: 8 },
  empty: { color: '#797876', textAlign: 'center', marginTop: 48 },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#4f98a3' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#1c1b19', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, maxHeight: '90%' },
  modalTitle: { color: '#cdccca', marginBottom: 16 },
  label: { color: '#797876', fontSize: 12, marginTop: 12, marginBottom: 4, textTransform: 'uppercase' },
  input: { backgroundColor: '#2a2927', color: '#cdccca', borderRadius: 8, padding: 12, fontSize: 15 },
  inputMultiline: { minHeight: 72, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  typeChip: { backgroundColor: '#2a2927' },
  typeChipSelected: { backgroundColor: '#4f98a3' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btnCancel: { flex: 1, backgroundColor: '#2a2927', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnSave: { flex: 1, backgroundColor: '#4f98a3', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#cdccca', fontWeight: '600' },
});
