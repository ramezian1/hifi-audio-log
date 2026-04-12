import { ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Text } from 'react-native-paper';
import { GearForm } from '../../components/GearForm';
import { useGearStore } from '../../store/useGearStore';

export default function AddGearModal() {
  const addGear = useGearStore((s) => s.addGear);

  const handleSubmit = (values: {
    name: string;
    brand: string;
    type: 'headphone' | 'iem' | 'dac' | 'amp' | 'dac/amp' | 'cable' | 'other';
    purchaseDate?: string;
    price?: number;
    currency?: string;
    notes?: string;
    rating?: number;
  }) => {
    const now = new Date().toISOString();

    addGear({
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      ...values,
      createdAt: now,
      updatedAt: now,
    });

    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        Add Gear
      </Text>
      <GearForm submitLabel="Save" onCancel={() => router.back()} onSubmit={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171614',
  },
  content: {
    padding: 16,
    gap: 12,
  },
  title: {
    color: '#cdccca',
    marginBottom: 8,
  },
});
