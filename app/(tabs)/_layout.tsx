import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
      <Tabs.Screen
        name="gear"
        options={{
          title: 'Gear',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="headphones" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="playlist-music" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="eq"
        options={{
          title: 'EQ Profiles',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="equalizer" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
