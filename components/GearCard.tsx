import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Chip, Text, IconButton } from 'react-native-paper';
import { GearItem } from '../types';

interface GearCardProps {
  item: GearItem;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const GEAR_TYPE_ICONS: Record<GearItem['type'], string> = {
  headphone: 'headphones',
  iem: 'earbuds',
  dac: 'chip',
  amp: 'amplifier',
  'dac/amp': 'chip',
  cable: 'cable-data',
  other: 'cube-outline',
};

export function GearCard({ item, onPress, onEdit, onDelete }: GearCardProps) {
  const icon = GEAR_TYPE_ICONS[item.type] ?? 'cube-outline';

  return (
    <Card style={styles.card} onPress={onPress} mode="elevated">
      <Card.Title
        title={item.name}
        subtitle={item.brand}
        left={(props) => <IconButton {...props} icon={icon} />}
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
          <Chip icon={icon} compact style={styles.chip}>
            {item.type.toUpperCase()}
          </Chip>
          {item.rating !== undefined && (
            <Chip icon="star" compact style={styles.chip}>
              {item.rating}/10
            </Chip>
          )}
          {item.price !== undefined && (
            <Chip icon="currency-usd" compact style={styles.chip}>
              {item.currency ?? '$'}{item.price.toFixed(2)}
            </Chip>
          )}
        </View>
        {item.notes ? (
          <Text variant="bodySmall" style={styles.notes} numberOfLines={2}>
            {item.notes}
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

export default GearCard;
