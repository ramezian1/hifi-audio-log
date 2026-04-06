import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Chip, Text } from 'react-native-paper';
import { ListeningSession } from '../types';

interface SessionRowProps {
  session: ListeningSession;
  gearName?: string;
  onPress?: () => void;
  onDelete?: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDuration(minutes?: number): string | null {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function SessionRow({ session, gearName, onPress, onDelete }: SessionRowProps) {
  const duration = formatDuration(session.duration);
  const trackInfo = [session.artist, session.track, session.album]
    .filter(Boolean)
    .join(' — ');

  return (
    <List.Item
      title={trackInfo || 'Listening Session'}
      description={[
        gearName,
        formatDate(session.date),
        duration,
      ]
        .filter(Boolean)
        .join('  ·  ')}
      onPress={onPress}
      right={() => (
        <View style={styles.right}>
          {session.rating !== undefined && (
            <Chip icon="star" compact style={styles.chip}>
              {session.rating}/5
            </Chip>
          )}
        </View>
      )}
      style={styles.item}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  right: {
    justifyContent: 'center',
    paddingRight: 8,
  },
  chip: {
    alignSelf: 'center',
  },
});

export default SessionRow;
