import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Divider, Text } from 'react-native-paper';
import { useGearStore } from '../../store/useGearStore';
import { useSessionStore } from '../../store/useSessionStore';
import { useEQStore } from '../../store/useEQStore';
import { exportToJSON, pickAndParseImportFile } from '../../utils/exportData';

export default function BackupRestoreModal() {
  const gear = useGearStore((s) => s.gear);
  const sessions = useSessionStore((s) => s.sessions);
  const profiles = useEQStore((s) => s.profiles);
  const replaceAllGear = useGearStore((s) => s.replaceAllGear);
  const replaceAllSessions = useSessionStore((s) => s.replaceAllSessions);
  const replaceAllProfiles = useEQStore((s) => s.replaceAllProfiles);

  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportToJSON(gear, sessions, profiles);
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const payload = await pickAndParseImportFile();
      if (!payload) {
        Alert.alert('Import Failed', 'The selected file is not a valid Hi-Fi Audio Log backup.');
        return;
      }
      Alert.alert(
        'Restore Backup',
        `This will replace all your current data with:\n\n• ${payload.gear.length} gear items\n• ${payload.sessions.length} sessions\n• ${payload.eqProfiles.length} EQ profiles\n\nThis cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Restore',
            style: 'destructive',
            onPress: () => {
              replaceAllGear(payload.gear);
              replaceAllSessions(payload.sessions);
              replaceAllProfiles(payload.eqProfiles);
              Alert.alert('Restored', 'Your data has been restored successfully.');
              router.back();
            },
          },
        ]
      );
    } finally {
      setImporting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="headlineSmall" style={styles.title}>
        Backup & Restore
      </Text>
      <Text style={styles.subtitle}>
        Export your data as a JSON file to back it up, or restore from a previous backup.
      </Text>

      <Divider style={styles.divider} />

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.cardTitle}>Current Data</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Gear items</Text>
            <Text style={styles.statValue}>{gear.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Sessions</Text>
            <Text style={styles.statValue}>{sessions.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>EQ profiles</Text>
            <Text style={styles.statValue}>{profiles.length}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonCol}>
        <Button
          mode="contained"
          icon="export"
          onPress={handleExport}
          loading={exporting}
          disabled={exporting || importing}
          style={styles.button}
        >
          Export Backup
        </Button>

        <Button
          mode="outlined"
          icon="import"
          onPress={handleImport}
          loading={importing}
          disabled={importing || exporting}
          style={styles.button}
        >
          Restore from Backup
        </Button>

        <Button
          mode="text"
          onPress={() => router.back()}
          style={styles.button}
        >
          Close
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#171614' },
  content: { padding: 16, gap: 12 },
  title: { color: '#cdccca' },
  subtitle: { color: '#797876', marginTop: 4 },
  divider: { backgroundColor: '#2a2927', marginVertical: 16 },
  card: { backgroundColor: '#1c1b19' },
  cardTitle: { color: '#cdccca', marginBottom: 12 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statLabel: { color: '#797876' },
  statValue: { color: '#cdccca', fontWeight: '600' },
  buttonCol: { gap: 12, marginTop: 8 },
  button: { borderRadius: 8 },
});
