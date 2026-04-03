import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, IconButton, Card, useTheme, Menu } from 'react-native-paper';
import { router } from 'expo-router';
import { useEQStore } from '../../store/useEQStore';
import { useGearStore } from '../../store/useGearStore';
import { EQBand } from '../../types';

function createDefaultBand(): EQBand {
  return { frequency: 1000, gain: 0, q: 1 };
}

export default function AddEQModal() {
  const theme = useTheme();
  const addProfile = useEQStore((s) => s.addProfile);
  const gear = useGearStore((s) => s.gear);

  const [name, setName] = useState('');
  const [gearId, setGearId] = useState('');
  const [bands, setBands] = useState<EQBand[]>([createDefaultBand()]);
  const [menuVisible, setMenuVisible] = useState(false);

  const selectedGear = gear.find((g) => g.id === gearId);

  const updateBand = (index: number, field: keyof EQBand, value: string) => {
    setBands((prev) =>
      prev.map((b, i) =>
        i === index ? { ...b, [field]: parseFloat(value) || 0 } : b
      )
    );
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
      id: Date.now().toString(),
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
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
      <TextInput
        label="Profile Name *"
        value={name}
        onChangeText={setName}
        mode="outlined"
        placeholder="e.g. HD 800 S Harman"
        style={styles.input}
      />

      {gear.length > 0 && (
        <>
          <Text variant="labelLarge" style={styles.label}>Gear</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button mode="outlined" onPress={() => setMenuVisible(true)} style={styles.menuButton}>
                {selectedGear ? `${selectedGear.name} (${selectedGear.brand})` : 'Select gear...'}
              </Button>
            }
          >
            {gear.map((g) => (
              <Menu.Item
                key={g.id}
                title={`${g.name} — ${g.brand}`}
                onPress={() => { setGearId(g.id); setMenuVisible(false); }}
              />
            ))}
          </Menu>
        </>
      )}

      <View style={styles.bandsHeader}>
        <Text variant="titleMedium" style={{ color: theme.colors.onBackground }}>
          EQ Bands ({bands.length}/10)
        </Text>
        {bands.length < 10 && (
          <IconButton icon="plus-circle" onPress={addBand} size={24} />
        )}
      </View>

      {bands.map((band, index) => (
        <Card key={index} style={[styles.bandCard, { backgroundColor: theme.colors.surfaceVariant }]}>
          <Card.Content>
            <View style={styles.bandHeader}>
              <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant }}>Band {index + 1}</Text>
              {bands.length > 1 && (
                <IconButton icon="close" size={18} onPress={() => removeBand(index)} />
              )}
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
  container: { flex: 1 },
  content: { padding: 16, gap: 8 },
  input: { marginBottom: 8 },
  label: { marginTop: 8, marginBottom: 4 },
  menuButton: { marginBottom: 8 },
  bandsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  bandCard: { marginBottom: 8 },
  bandHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bandRow: { flexDirection: 'row', gap: 8 },
  bandInput: { flex: 1 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 32 },
  button: { flex: 1 },
});
