// ============================================
// PlayNxt - Tabs Layout (Playo-style)
// ============================================

import { Tabs } from 'expo-router';
import { Text, StyleSheet, View, Platform } from 'react-native';
import { COLORS, FONT_SIZE, SPACING } from '@/constants';

interface TabIconProps {
  icon: string;
  label: string;
  focused: boolean;
}

const TabIcon = ({ icon, label, focused }: TabIconProps) => (
  <View style={styles.tabIcon}>
    <Text style={[styles.icon, focused && styles.iconFocused]}>{icon}</Text>
    <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : SPACING.sm,
          paddingTop: SPACING.sm,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Play',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏆" label="Play" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Book',
          tabBarIcon: ({ focused }) => <TabIcon icon="🏟️" label="Book" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Activity',
          tabBarIcon: ({ focused }) => <TabIcon icon="📋" label="Activity" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon icon="👤" label="Profile" focused={focused} />,
        }}
      />
      {/* Hide create-game from tabs - accessible from home */}
      <Tabs.Screen
        name="create-game"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  icon: {
    fontSize: 22,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  labelFocused: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
