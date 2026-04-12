import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, HelperText, Menu, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { useGearStore } from '../store/useGearStore';
import type { ListeningSession } from '../types';

const RATING_OPTIONS = [
  { value: '', label: 'None' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
];

type SessionFormValues = {
  gearId: string;
  track: string;
  artist: string;
  album: string;
  notes: string;
  rating: string;
  date: string;
  duration: string;
};

interface SessionFormProps {
  initialValues?: Partial<ListeningSession>;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (values: {
    gearId?: string;
    track?: string;
    artist?: string;
    album?: string;
    notes?: string;
    rating?: number;
    date: string;
    duration?: number;
  }) => void;
}

const ISO_LOCAL_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function toLocalDateTimeInput(value?: string) {
  if (!value) {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
  }

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';

  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
}

function fromLocalDateTimeInput(value: string) {
  return new Date(value).toISOString();
}

function toFormValues(initialValues?: Partial<ListeningSession>): SessionFormValues {
  return {
    gearId: initialValues?.gearId ?? '',
    track: initialValues?.track ?? '',
    artist: initialValues?.artist ?? '',
    album: initialValues?.album ?? '',
    notes: initialValues?.notes ?? '',
    rating: initialValues?.rating != null ? String(initialValues.rating) : '',
    date: toLocalDateTimeInput(initialValues?.date),
    duration: initialValues?.duration != null ? String(initialValues.duration) : '',
  };
}

export function SessionForm({
  initialValues,
  submitLabel = 'Save',
  onCancel,
  onSubmit,
}: SessionFormProps) {
  const gear = useGearStore((s) => s.gear);
  const [values, setValues] = useState<SessionFormValues>(() => toFormValues(initialValues));
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    setValues(toFormValues(initialValues));
  }, [initialValues]);

  const selectedGear = gear.find((g) => g.id === values.gearId);

  const errors = useMemo(() => {
    const next: Partial<Record<keyof SessionFormValues, string>> = {};

    if (!values.date.trim() || !ISO_LOCAL_RE.test(values.date.trim())) {
      next.date = 'Use a valid date/time.';
    }

    if (values.rating.trim()) {
      const parsedRating = Number(values.rating);
      if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        next.rating = 'Rating must be an integer from 1 to 5.';
      }
    }

    if (values.duration.trim()) {
      const parsedDuration = Number(values.duration);
      if (!Number.isInteger(parsedDuration) || parsedDuration < 1) {
        next.duration = 'Duration must be a positive whole number of minutes.';
      }
    }

    if (!values.track.trim() && !values.album.trim() && !values.notes.trim()) {
      next.track = 'Add at least a track, album, or note.';
    }

    return next;
  }, [values]);

  const hasErrors = Object.keys(errors).length > 0;

  const updateField = <K extends keyof SessionFormValues>(key: K, value: SessionFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (hasErrors) return;

    onSubmit({
      gearId: values.gearId || undefined,
      track: values.track.trim() || undefined,
      artist: values.artist.trim() || undefined,
      album: values.album.trim() || undefined,
      notes: values.notes.trim() || undefined,
      rating: values.rating.trim() ? Number(values.rating) : undefined,
      date: fromLocalDateTimeInput(values.date.trim()),
      duration: values.duration.trim() ? Number(values.duration) : undefined,
    });
  };

  return (
    <View style={styles.form}>
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
              {selectedGear ? `${selectedGear.name} (${selectedGear.brand})` : 'Select gear...'}
            </Button>
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item
            onPress={() => {
              updateField('gearId', '');
              setMenuVisible(false);
            }}
            title="None"
          />
          {gear.map((g) => (
            <Menu.Item
              key={g.id}
              onPress={() => {
                updateField('gearId', g.id);
                setMenuVisible(false);
              }}
              title={`${g.name} (${g.brand})`}
            />
          ))}
        </Menu>
      </View>

      <TextInput
        label="Track"
        value={values.track}
        onChangeText={(value) => updateField('track', value)}
        mode="outlined"
        style={styles.input}
        error={!!errors.track}
      />
      <HelperText type="error" visible={!!errors.track}>{errors.track}</HelperText>

      <TextInput
        label="Artist"
        value={values.artist}
        onChangeText={(value) => updateField('artist', value)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Album"
        value={values.album}
        onChangeText={(value) => updateField('album', value)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label="Session Date/Time"
        value={values.date}
        onChangeText={(value) => updateField('date', value)}
        mode="outlined"
        placeholder="YYYY-MM-DDTHH:mm"
        style={styles.input}
        error={!!errors.date}
      />
      <HelperText type="error" visible={!!errors.date}>{errors.date}</HelperText>

      <TextInput
        label="Duration (minutes)"
        value={values.duration}
        onChangeText={(value) => updateField('duration', value)}
        mode="outlined"
        keyboardType="number-pad"
        style={styles.input}
        error={!!errors.duration}
      />
      <HelperText type="error" visible={!!errors.duration}>{errors.duration}</HelperText>

      <TextInput
        label="Notes"
        value={values.notes}
        onChangeText={(value) => updateField('notes', value)}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Text variant="labelMedium" style={styles.label}>Rating</Text>
      <SegmentedButtons
        value={values.rating}
        onValueChange={(value) => updateField('rating', value)}
        buttons={RATING_OPTIONS}
        style={styles.segmented}
      />
      <HelperText type="error" visible={!!errors.rating}>{errors.rating}</HelperText>

      <View style={styles.buttonRow}>
        {onCancel ? (
          <Button mode="outlined" onPress={onCancel} style={styles.button}>
            Cancel
          </Button>
        ) : null}
        <Button mode="contained" onPress={handleSubmit} style={styles.button} disabled={hasErrors}>
          {submitLabel}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 4 },
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
