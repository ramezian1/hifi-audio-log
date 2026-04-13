import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Menu,
  IconButton,
  Card,
  SegmentedButtons,
  HelperText,
} from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { useEQStore } from '../../store/useEQStore';
import { useGearStore } from '../../store/useGearStore';
import { EQBand } from '../../types';

const BAND_TYPE_OPTIONS = [
  { value: 'peaking', label: 'Peak' },
  { value: 'lowShelf', label: 'Low Shelf' },
  { value: 'highShelf', label: 'High Shelf' },
] as const;

function createDefaultBand(): EQBand {
  return { frequency: 1000, gain: 0, q: 1, type: 'peaking' };
}

function sanitizeBand(band: EQBand): EQBand {
  return {
    frequency: Number.isFinite(band.frequency) ? band.frequency : 1000,
    gain: Number.isFinite(band.gain) ? band.gain : 0,
    q: Number.isFinite(band.q) && band.q > 0 ? band.q : 1,
    type: band.type ?? 'peaking',
  };
}

  const editingProfile = useMemo(
    () => (id ? profiles.find((p) => p.id === id) : undefined),
    [id, profiles]
  );

  const [name, setName] = useState('');
  const [gearId, setGearId] = useState('');
  const [notes, setNotes] = useState('');
  const [preamp, setPreamp] = useState('0');
  const [bands, setBands] = useState<EQBand[]>([createDefaultBand()]);
  const [menuVisible, setMenuVisible] = useState(false);

export default function AddEQModal() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const addProfile = useEQStore((s) => s.addProfile);
  const updateProfile = useEQStore((s) => s.updateProfile);
  const profiles = useEQStore((s) => s.profiles);
  const gear = useGearStore((s) => s.gear);
}

useEffect(() => {
  if (editingProfile) {
    setName(editingProfile.name);
    setGearId(editingProfile.gearId ?? '');
    setNotes(editingProfile.notes ?? '');
    setPreamp(String(editingProfile.preamp ?? 0));
    setBands(
      editingProfile.bands?.length
        ? editingProfile.bands.map(sanitizeBand)
        : [createDefaultBand()]
    );
  } else {
    setName('');
    setGearId('');
    setNotes('');
    setPreamp('0');
    setBands([createDefaultBand()]);
  }

  setMenuVisible(false);
}, [editingProfile]);

  const selectedGear = gear.find((g) => g.id === gearId);

  const updateBand = (index: number, field: keyof EQBand, value: string) => {
    setBands((prev) => {
      const updated = [...prev];
      const current = updated[index];

      if (field === 'type') {
        updated[index] = {
          ...current,
          type: value as EQBand['type'],
        };
        return updated;
      }

      const parsed = parseFloat(value);
      updated[index] = {
        ...current,
        [field]: Number.isFinite(parsed) ? parsed : 0,
      };

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

  const errors = useMemo(() => {
    const next: string[] = [];

    if (!name.trim()) next.push('Profile name is required.');

    if (!bands.length) next.push('At least one EQ band is required.');

    bands.forEach((band, index) => {
      if (!Number.isFinite(band.frequency) || band.frequency < 20 || band.frequency > 20000) {
        next.push(`Band ${index + 1}: frequency must be between 20 and 20000 Hz.`);
      }
      if (!Number.isFinite(band.gain) || band.gain < -18 || band.gain > 18) {
        next.push(`Band ${index + 1}: gain must be between -18 and +18 dB.`);
      }
      if (!Number.isFinite(band.q) || band.q <= 0 || band.q > 10) {
        next.push(`Band ${index + 1}: Q must be greater than 0 and up to 10.`);
      }
    });

    const parsedPreamp = parseFloat(preamp);
    if (!Number.isFinite(parsedPreamp) || parsedPreamp < -24 || parsedPreamp > 24) {
      next.push('Preamp must be between -24 and +24 dB.');
    }

    return next;
  }, [bands, name, preamp]);

  const canSave = errors.length === 0;

  const handleSubmit = () => {
    if (!canSave) return;

    const now = new Date().toISOString();
    const payload = {
      name: name.trim(),
      gearId: gearId || undefined,
      notes: notes.trim() || undefined,
      preamp: parseFloat(preamp),
      bands: bands.map(sanitizeBand),
    };

    if (editingProfile) {
      updateProfile(editingProfile.id, payload);
    } else {
      addProfile({
        id: Math.random().toString(36).slice(2) + Date.now().toString(36),
        ...payload,
        createdAt: now,
        updatedAt: now,
      });
    }

    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        {editingProfile ? 'Edit EQ Profile' : 'Add EQ Profile'}
      </Text>

      <TextInput
        label="Profile Name *"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Momentum 4 Warm Tilt"
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
            {selectedGear ? `${selectedGear.name} (${selectedGear.brand})` : 'Select gear...'}
          </Button>
        }
        contentStyle={styles.menuContent}
      >
        <Menu.Item
          onPress={() => {
            setGearId('');
            setMenuVisible(false);
          }}
          title="None"
        />
        {gear.map((g) => (
          <Menu.Item
            key={g.id}
            onPress={() => {
              setGearId(g.id);
              setMenuVisible(false);
            }}
            title={`${g.name} (${g.brand})`}
          />
        ))}
      </Menu>

      <TextInput
        label="Preamp (dB)"
        value={preamp}
        onChangeText={setPreamp}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

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
              <Text variant="labelLarge" style={styles.bandLabel}>
                Band {index + 1}
              </Text>
              <IconButton
                icon="close"
                size={18}
                onPress={() => removeBand(index)}
                disabled={bands.length <= 1}
              />
            </View>

            <SegmentedButtons
              value={band.type}
              onValueChange={(value) => updateBand(index, 'type', value)}
              buttons={BAND_TYPE_OPTIONS as any}
              style={styles.segmented}
            />

            <View style={styles.bandRow}>
              <TextInput
                label="Freq (Hz)"
                value={String(band.frequency)}
                onChangeText={(v) => updateBand(index, 'frequency', v)}
                mode="outlined"
                keyboardType="numeric"
                style={styles.bandInput}
                dense
              />
              <TextInput
                label="Gain (dB)"
                value={String(band.gain)}
                onChangeText={(v) => updateBand(index, 'gain', v)}
                mode="outlined"
                keyboardType="numeric"
                style={styles.bandInput}
                dense
              />
              <TextInput
                label="Q"
                value={String(band.q)}
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

      {errors.length > 0 ? (
        <View style={styles.errorBox}>
          {errors.map((error, index) => (
            <HelperText key={index} type="error" visible>
              {error}
            </HelperText>
          ))}
        </View>
      ) : null}

      <View style={styles.buttonRow}>
        <Button mode="outlined" onPress={() => router.back()} style={styles.button}>
          Cancel
        </Button>
        <Button mode="contained" onPress={handleSubmit} style={styles.button} disabled={!canSave}>
          Save
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614' },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  title: { color: '#cdccca', marginBottom: 4 },
  input: { backgroundColor: '#1c1b19' },
  label: { color: '#797876', marginTop: 4 },
  menuButton: { alignSelf: 'stretch' },
  menuButtonContent: { justifyContent: 'flex-start' },
  menuContent: { backgroundColor: '#1c1b19' },
  bandsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  bandsTitle: { color: '#cdccca' },
  bandCard: { backgroundColor: '#1c1b19' },
  bandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bandLabel: { color: '#cdccca' },
  segmented: { marginTop: 8, marginBottom: 12 },
  bandRow: { flexDirection: 'row', gap: 8 },
  bandInput: { flex: 1, backgroundColor: '#1c1b19' },
  errorBox: {
    backgroundColor: '#2d1618',
    borderRadius: 12,
    padding: 8,
  },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 12, marginBottom: 32 },
  button: { flex: 1 },
});
