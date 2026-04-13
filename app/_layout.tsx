import { Stack } from 'expo-router';
import { MD3DarkTheme, MD3LightTheme, PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeStore } from '../store/useThemeStore';

// Custom dark palette (teal accent)
const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4f98a3',
    background: '#171614',
    surface: '#1c1b19',
    surfaceVariant: '#2a2927',
    onBackground: '#cdccca',
    onSurface: '#cdccca',
    onSurfaceVariant: '#797876',
    outline: '#393836',
  },
};

// Custom light palette
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2e7a85',
    background: '#f5f4f2',
    surface: '#ffffff',
    surfaceVariant: '#e8e6e3',
    onBackground: '#1a1918',
    onSurface: '#1a1918',
    onSurfaceVariant: '#5a5856',
    outline: '#c8c6c3',
  },
};

export default function RootLayout() {
  const isDark = useThemeStore((s) => s.isDark);
  const theme = isDark ? darkTheme : lightTheme;

  const headerBg = isDark ? '#1c1b19' : '#ffffff';
  const headerTint = isDark ? '#cdccca' : '#1a1918';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="gear/[id]"
              options={{
                headerShown: true,
                title: 'Gear Detail',
                headerStyle: { backgroundColor: headerBg },
                headerTintColor: headerTint,
              }}
            />
            <Stack.Screen
              name="modals/add-gear"
              options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Add Gear',
                headerStyle: { backgroundColor: headerBg },
                headerTintColor: headerTint,
              }}
            />
            <Stack.Screen
              name="sessions/[id]"
              options={{
                headerShown: true,
                title: 'Session Detail',
                headerStyle: { backgroundColor: headerBg },
                headerTintColor: headerTint,
              }}
            />
            <Stack.Screen
              name="modals/add-session"
              options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Add Session',
                headerStyle: { backgroundColor: headerBg },
                headerTintColor: headerTint,
              }}
            />
            <Stack.Screen
              name="modals/add-eq"
              options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Add EQ Profile',
                headerStyle: { backgroundColor: headerBg },
                headerTintColor: headerTint,
              }}
            />
            <Stack.Screen
              name="modals/backup-restore"
              options={{
                presentation: 'modal',
                headerShown: true,
                title: 'Backup & Restore',
                headerStyle: { backgroundColor: headerBg },
                headerTintColor: headerTint,
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
