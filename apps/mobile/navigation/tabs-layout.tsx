import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { tokens } from '@/constants/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: tokens.colors.background,
        },
        tabBarActiveBackgroundColor: tokens.colors.primarySoft,
        tabBarActiveTintColor: tokens.colors.primary,
        tabBarInactiveTintColor: tokens.colors.outline,
        tabBarItemStyle: {
          borderRadius: 18,
          marginHorizontal: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        },
        tabBarStyle: {
          backgroundColor: tokens.chrome.bottomBar,
          borderTopWidth: 0,
          elevation: 0,
          height: 84,
          paddingBottom: 14,
          paddingTop: 10,
          shadowColor: tokens.colors.onSurface,
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.05,
          shadowRadius: 24,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="home" size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="history" size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <MaterialIcons color={color} name="person" size={size} />,
        }}
      />
    </Tabs>
  );
}
