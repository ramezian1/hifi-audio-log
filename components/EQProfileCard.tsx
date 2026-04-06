import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text, IconButton } from 'react-native-paper';
import { EQProfile } from '../types';

interface EQProfileCardProps {
  profile: EQProfile;
  gearName?: string;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EQProfileCard({
  profile,
  gearName,
  onPress,
  onEdit,
  onDelete,
}: EQProfileCardProps) {
  return (
    <Card style={styles.card} onPress={onPress} mode="elevated">
      <Card.Title
        title={profile.name}
        subtitle={gearName ?? 'No gear linked'}
        left={(props) => <IconButton {...props} icon="equalizer" />}
        right={(props) => (
          <View style={styles.actions}>
            {onEdit && (
              <IconButton {...props} icon="pencil" onPress={onEdit} />
            )}
            {onDelete && (
              <IconButton {...props} icon="trash-can-outline" onPress={onDelete} />
            )}
          </View>
        )}
      />
      <Card.Content>
        <View style={styles.row}>
          <Chip icon="tune" compact style={styles.chip}>
            {profile.bands.length} bands
          </Chip>
          <Chip icon="volume-high" compact style={styles.chip}>
            Preamp: {profile.preamp > 0 ? '+' : ''}{profile.preamp} dB
          </Chip>
        </View>
        {profile.notes ? (
          <Text variant="bodySmall" style={styles.notes} numberOfLines={2}>
            {profile.notes}
          </Text>
        ) : null}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    marginRight: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  notes: {
    marginTop: 8,
    opacity: 0.7,
  },
});

export default EQProfileCard;
