import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, SegmentedButtons, useTheme, Menu } from 'react-native-paper';
import { router } from 'expo-router';
import { useSessionStore } from '../../store/useSessionStore';
import { useGearStore } from '../../store/useGearStore';

const RATING_BUTTONS = [1, 2, 3, 4, 5].map((n) => ({
  value: n.toString(),
  label: n.toString(),
}));

export default function AddSessionModal() {
  const theme = useTheme();
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
      id: Date.now().toString(),
      gearIds: gearId ? [gearId] : [],
      date: now,
      trackOrAlbum: track.trim() || undefined,
      artist: artist.trim() || undefined,
      notes: notes.trim() || undefined,
      rating: rating ? parseInt(rating, 10) : undefined,
      createdAt: now,
    });
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.content}>
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

      <TextInput
        label="Track / Album"
        value={track}
        onChangeText={setTrack}
        mode="outlined"
        placeholder="What were you listening to?"
        style={styles.input}
      />
      <TextInput
        label="Artist"
        value={artist}
        onChangeText={setArtist}
        mode="outlined"
        placeholder="e.g. Pink Floyd"
        style={styles.input}
      />
      <TextInput
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        placeholder="Optional notes..."
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      <Text variant="labelLarge" style={styles.label}>Rating (1-5)</Text>
      <SegmentedButtons
        value={rating}
        onValueChange={setRating}
        buttons={RATING_BUTTONS}
        style={styles.segmented}
      />

      <View style={styles.buttonRow}>
        <Button mode="outlined" onPress={() => router.back()} style={styles.button}>
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
  container: { flex: 1 },
  content: { padding: 16, gap: 8 },
  input: { marginBottom: 8 },
  label: { marginTop: 8, marginBottom: 4 },
  segmented: { marginBottom: 8 },
  menuButton: { marginBottom: 8 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  button: { flex: 1 },
});
