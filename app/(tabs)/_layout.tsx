import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';

export default function TabsLayout() {
  const isDark = useThemeStore((s) => s.isDark);

  const tabBarBg = isDark ? '#1c1b19' : '#ffffff';
  const tabBarBorder = isDark ? '#393836' : '#e0dedd';
  const tabBarActive = isDark ? '#4f98a3' : '#2e7a85';
  const tabBarInactive = isDark ? '#797876' : '#9a9896';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: tabBarBorder,
        },
        tabBarActiveTintColor: tabBarActive,
        tabBarInactiveTintColor: tabBarInactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
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
