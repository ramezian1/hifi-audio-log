import { Stack } from 'expo-router';
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
      <PaperProvider theme={MD3DarkTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="gear/[id]"
            options={{
              headerShown: true,
              title: 'Gear Detail',
              headerStyle: { backgroundColor: '#1c1b19' },
              headerTintColor: '#cdccca',
            }}
          />
          <Stack.Screen
            name="modals/add-gear"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Add Gear',
              headerStyle: { backgroundColor: '#1c1b19' },
              headerTintColor: '#cdccca',
            }}
          />
          <Stack.Screen
            name="modals/add-session"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Add Session',
              headerStyle: { backgroundColor: '#1c1b19' },
              headerTintColor: '#cdccca',
            }}
          />
          <Stack.Screen
            name="modals/add-eq"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: 'Add EQ Profile',
              headerStyle: { backgroundColor: '#1c1b19' },
              headerTintColor: '#cdccca',
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
              </GestureHandlerRootView>
  );
}
