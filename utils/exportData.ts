import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
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
    const fileName = `hifi-audio-log-${
      new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    }.json`;
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, json, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert('Sharing not available', `File saved to: ${fileUri}`);
      return;
    }
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Export Hi-Fi Audio Log',
      UTI: 'public.json',
    });
  } catch (error) {
    console.error('Export failed:', error);
    Alert.alert('Export Failed', 'Could not export data. Please try again.');
  }
}

/**
 * Open a document picker so the user can choose a backup JSON file,
 * then parse and validate it. Returns null if invalid or cancelled.
 */
export async function pickAndParseImportFile(): Promise<ExportPayload | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]?.uri) return null;
    const json = await FileSystem.readAsStringAsync(result.assets[0].uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return parseImportFile(json);
  } catch (error) {
    console.error('Import pick failed:', error);
    return null;
  }
}

/**
 * Parse and validate an imported JSON string.
 * Returns null if the payload is missing required fields or has wrong shapes.
 */
export function parseImportFile(json: string): ExportPayload | null {
  try {
    const data = JSON.parse(json) as ExportPayload;
    if (
      typeof data.version !== 'string' ||
      typeof data.exportedAt !== 'string' ||
      !Array.isArray(data.gear) ||
      !Array.isArray(data.sessions) ||
      !Array.isArray(data.eqProfiles)
    ) {
      return null;
    }
    // Validate each gear item has required fields
    for (const g of data.gear) {
      if (typeof g.id !== 'string' || typeof g.name !== 'string' || typeof g.brand !== 'string') {
        return null;
      }
    }
    // Validate each session has required fields
    for (const s of data.sessions) {
      if (typeof s.id !== 'string' || typeof s.date !== 'string') {
        return null;
      }
    }
    // Validate each EQ profile has required fields
    for (const p of data.eqProfiles) {
      if (
        typeof p.id !== 'string' ||
        typeof p.name !== 'string' ||
        !Array.isArray(p.bands)
      ) {
        return null;
      }
    }
    return data;
  } catch {
    return null;
  }
}
