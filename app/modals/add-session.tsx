import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, Menu } from 'react-native-paper';
import { router } from 'expo-router';
import { useSessionStore } from '../../store/useSessionStore';
import { useGearStore } from '../../store/useGearStore';

const RATING_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
];

export default function AddSessionModal() {
  const addSession = useSessionStore((s) => s.addSession);
  const gear = useGearStore((s) => s.gear);
  const [gearId, setGearId] = useState('');
  const [track, setTrack] = useState('');
  const [artist, setArtist] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const selectedGear = gear.find((g) => g.id === gearId);

  const handleSubmit = () => {
    const now = new Date().toISOString();
    addSession({
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      gearId: gearId || undefined,
      date: now,
      track: track.trim() || undefined,
      artist: artist.trim() || undefined,
      notes: notes.trim() || undefined,
      rating: rating ? parseInt(rating, 10) : undefined,
      createdAt: now,
      updatedAt: now,
    });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="labelMedium" style={styles.label}>Gear</Text>
      <View style={styles.menuWrapper}>
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
      </View>

      <TextInput
        label="Track"
        value={track}
        onChangeText={setTrack}
        style={styles.input}
      />
      <TextInput
        label="Artist"
        value={artist}
        onChangeText={setArtist}
        style={styles.input}
      />
      <TextInput
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Text variant="labelMedium" style={styles.label}>Rating</Text>
      <SegmentedButtons
        value={rating}
        onValueChange={setRating}
        buttons={RATING_OPTIONS}
        style={styles.segmented}
      />

      <View style={styles.buttonRow}>
        <Button onPress={() => router.back()} style={styles.button}>
          Cancel
        </Button>
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
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
  segmented: { marginBottom: 4 },
  menuWrapper: { width: '100%' },
  menuButton: { alignSelf: 'stretch' },
  menuButtonContent: { justifyContent: 'flex-start' },
  menuContent: { backgroundColor: '#1c1b19' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  button: { flex: 1 },
});
