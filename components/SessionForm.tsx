import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Divider, HelperText, SegmentedButtons, Text, TextInput } from 'react-native-paper';
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
  const [gearPickerOpen, setGearPickerOpen] = useState(false);

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
      {/* Gear selector */}
      <Text variant="labelMedium" style={styles.label}>Gear</Text>
      <TouchableOpacity
        style={styles.gearButton}
        onPress={() => setGearPickerOpen((v) => !v)}
        activeOpacity={0.7}
      >
        <Text style={styles.gearButtonText}>
          {selectedGear ? `${selectedGear.name} (${selectedGear.brand})` : 'Select gear...'}
        </Text>
        <Text style={styles.gearButtonChevron}>{gearPickerOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {gearPickerOpen && (
        <View style={styles.gearList}>
          <TouchableOpacity
            style={[
              styles.gearOption,
              values.gearId === '' && styles.gearOptionSelected,
            ]}
            onPress={() => {
              updateField('gearId', '');
              setGearPickerOpen(false);
            }}
          >
            <Text style={styles.gearOptionText}>None</Text>
          </TouchableOpacity>
          <Divider style={styles.divider} />
          {gear.length === 0 ? (
            <Text style={styles.gearEmpty}>No gear added yet. Add gear first.</Text>
          ) : (
            gear.map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[
                  styles.gearOption,
                  values.gearId === g.id && styles.gearOptionSelected,
                ]}
                onPress={() => {
                  updateField('gearId', g.id);
                  setGearPickerOpen(false);
                }}
              >
                <Text style={styles.gearOptionText}>{g.name} ({g.brand})</Text>
                <Text style={styles.gearOptionType}>{g.type}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

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
  gearButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4f98a3',
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#1c1b19',
    marginBottom: 4,
  },
  gearButtonText: { color: '#cdccca', flex: 1 },
  gearButtonChevron: { color: '#797876', marginLeft: 8 },
  gearList: {
    borderWidth: 1,
    borderColor: '#2a2927',
    borderRadius: 4,
    backgroundColor: '#1c1b19',
    marginBottom: 8,
    overflow: 'hidden',
  },
  gearOption: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  gearOptionSelected: {
    backgroundColor: '#2a4a4d',
  },
  gearOptionText: { color: '#cdccca' },
  gearOptionType: { color: '#797876', fontSize: 12, marginTop: 2 },
  gearEmpty: { color: '#797876', padding: 14 },
  divider: { backgroundColor: '#2a2927' },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  button: { flex: 1 },
});
