import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, Menu, IconButton, Card } from 'react-native-paper';
import { router } from 'expo-router';
import { useEQStore } from '../../store/useEQStore';
import { useGearStore } from '../../store/useGearStore';
import { EQBand } from '../../types';

function createDefaultBand(): EQBand {
  return { frequency: 1000, gain: 0, q: 1 };
}

export default function AddEQModal() {
  const addProfile = useEQStore((s) => s.addProfile);
  const gear = useGearStore((s) => s.gear);
  const [name, setName] = useState('');
  const [gearId, setGearId] = useState('');
    const [bands, setBands] = useState<EQBand[]>(() => [createDefaultBand()]);
  const [menuVisible, setMenuVisible] = useState(false);

  const selectedGear = gear.find((g) => g.id === gearId);

  const updateBand = (index: number, field: keyof EQBand, value: string) => {
    setBands((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: parseFloat(value) || 0 };
      return updated;
    });
  };

  const addBand = () => {
    if (bands.length >= 10) return;
    setBands((prev) => [...prev, createDefaultBand()]);
  };

  const removeBand = (index: number) => {
    setBands((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name.trim() || bands.length === 0) return;
    const now = new Date().toISOString();
    addProfile({
            id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      name: name.trim(),
      gearId: gearId || undefined,
      bands,
      preamp: 0,
      createdAt: now,
      updatedAt: now,
    });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TextInput
        label="Profile Name *"
        value={name}
        onChangeText={setName}
        placeholder="e.g. HD 800 S Harman"
        mode="outlined"
        style={styles.input}
      />

      <Text variant="labelMedium" style={styles.label}>Gear</Text>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            {selectedGear ? selectedGear.name : 'Select gear...'}
          </Button>
        }
        contentStyle={styles.menuContent}
      >
        <Menu.Item
          onPress={() => { setGearId(''); setMenuVisible(false); }}
          title="None"
        />
        {gear.map((g) => (
          <Menu.Item
            key={g.id}
            onPress={() => { setGearId(g.id); setMenuVisible(false); }}
            title={`${g.name} (${g.brand})`}
          />
        ))}
      </Menu>

      <View style={styles.bandsHeader}>
        <Text variant="titleMedium" style={styles.bandsTitle}>
          EQ Bands ({bands.length}/10)
        </Text>
        {bands.length < 10 && (
          <Button mode="contained-tonal" onPress={addBand} compact icon="plus">
            Add Band
          </Button>
        )}
      </View>

      {bands.map((band, index) => (
        <Card key={index} style={styles.bandCard}>
          <Card.Content>
            <View style={styles.bandHeader}>
              <Text variant="labelLarge" style={styles.bandLabel}>Band {index + 1}</Text>
              <IconButton
                icon="close"
                size={18}
                onPress={() => removeBand(index)}
                disabled={bands.length <= 1}
              />
            </View>
            <View style={styles.bandRow}>
              <TextInput
                label="Freq (Hz)"
                value={band.frequency.toString()}
                onChangeText={(v) => updateBand(index, 'frequency', v)}
                mode="outlined"
                keyboardType="numeric"
                style={styles.bandInput}
                dense
              />
              <TextInput
                label="Gain (dB)"
                value={band.gain.toString()}
                onChangeText={(v) => updateBand(index, 'gain', v)}
                mode="outlined"
                keyboardType="numeric"
                style={styles.bandInput}
                dense
              />
              <TextInput
                label="Q"
                value={band.q.toString()}
                onChangeText={(v) => updateBand(index, 'q', v)}
                mode="outlined"
                keyboardType="numeric"
                style={styles.bandInput}
                dense
              />
            </View>
          </Card.Content>
        </Card>
      ))}

      <View style={styles.buttonRow}>
        <Button mode="outlined" onPress={() => router.back()} style={styles.button}>
          Cancel
        </Button>
        <Button mode="contained" onPress={handleSubmit} style={styles.button} disabled={!name.trim() || bands.length === 0}>
          Save
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614' },
  content: { padding: 16, gap: 12 },
  input: { backgroundColor: '#1c1b19' },
  label: { color: '#797876', marginTop: 4 },
  menuButton: { alignSelf: 'stretch' },
  menuButtonContent: { justifyContent: 'flex-start' },
  menuContent: { backgroundColor: '#1c1b19' },
  bandsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  bandsTitle: { color: '#cdccca' },
  bandCard: { backgroundColor: '#1c1b19' },
  bandHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bandLabel: { color: '#cdccca' },
  bandRow: { flexDirection: 'row', gap: 8 },
  bandInput: { flex: 1, backgroundColor: '#1c1b19' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 12, marginBottom: 32 },
  button: { flex: 1 },
});
