import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={MD3DarkTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="gear/[id]" options={{ headerShown: true, title: 'Gear Detail', headerStyle: { backgroundColor: '#1c1b19' }, headerTintColor: '#cdccca' }} />
          <Stack.Screen name="modals/add-gear" options={{ presentation: 'modal', title: 'Add Gear', headerShown: true, headerStyle: { backgroundColor: '#1c1b19' }, headerTintColor: '#cdccca' }} />
          <Stack.Screen name="modals/add-session" options={{ presentation: 'modal', title: 'Add Session', headerShown: true, headerStyle: { backgroundColor: '#1c1b19' }, headerTintColor: '#cdccca' }} />
          <Stack.Screen name="modals/add-eq" options={{ presentation: 'modal', title: 'Add EQ Profile', headerShown: true, headerStyle: { backgroundColor: '#1c1b19' }, headerTintColor: '#cdccca' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
