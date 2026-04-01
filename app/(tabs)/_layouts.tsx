import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1c1b19',
          borderTopColor: '#393836',
        },
        tabBarActiveTintColor: '#4f98a3',
        tabBarInactiveTintColor: '#797876',
      }}
    >
      <Tabs.Screen name="gear" options={{ title: 'Gear' }} />
      <Tabs.Screen name="sessions" options={{ title: 'Sessions' }} />
      <Tabs.Screen name="eq" options={{ title: 'EQ Profiles' }} />
    </Tabs>
  );
}
