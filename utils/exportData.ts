import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import { GearItem, ListeningSession, EQProfile } from '../types';

export interface ExportPayload {
  version: string;
  exportedAt: string;
  gear: GearItem[];
  sessions: ListeningSession[];
  eqProfiles: EQProfile[];
}

/**
 * Serialize all store data into a single JSON export payload.
 */
export function buildExportPayload(
  gear: GearItem[],
  sessions: ListeningSession[],
  eqProfiles: EQProfile[]
): ExportPayload {
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    gear,
    sessions,
    eqProfiles,
  };
}

/**
 * Write the payload to a JSON file in the cache directory and
 * open the system share sheet so the user can save/send it.
 */
export async function exportToJSON(
  gear: GearItem[],
  sessions: ListeningSession[],
  eqProfiles: EQProfile[]
): Promise<void> {
  try {
    const payload = buildExportPayload(gear, sessions, eqProfiles);
    const json = JSON.stringify(payload, null, 2);

    const fileName = `hifi-audio-log-${new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, 19)}.json`;

    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, json, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert(
        'Sharing not available',
        `File saved to: ${fileUri}`
      );
      return;
    }

    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Export Hi-Fi Audio Log',
      UTI: 'public.json', // iOS
    });
  } catch (error) {
    console.error('Export failed:', error);
    Alert.alert('Export Failed', 'Could not export data. Please try again.');
  }
}

/**
 * Parse and validate an imported JSON file.
 * Returns null if the file is invalid.
 */
export function parseImportFile(json: string): ExportPayload | null {
  try {
    const data = JSON.parse(json) as ExportPayload;
    if (!data.version || !Array.isArray(data.gear) || !Array.isArray(data.sessions)) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
