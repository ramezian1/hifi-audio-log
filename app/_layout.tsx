import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider theme={MD3DarkTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PaperProvider>
  );
}
