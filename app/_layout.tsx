import { Tabs } from 'expo-router';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';

export default function RootLayout() {
  return (
    <PaperProvider theme={MD3DarkTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#1c1b19' },
          tabBarActiveTintColor: '#4f98a3',
          tabBarInactiveTintColor: '#797876',
        }}
      >
        <Tabs.Screen name="(tabs)/gear" options={{ title: 'Gear' }} />
        <Tabs.Screen name="(tabs)/sessions" options={{ title: 'Sessions' }} />
        <Tabs.Screen name="(tabs)/eq" options={{ title: 'EQ Profiles' }} />
      </Tabs>
    </PaperProvider>
  );
}
