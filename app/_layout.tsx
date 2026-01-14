// ============================================
// PlayNxt - Root Layout
// ============================================

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { COLORS } from '@/constants';

export default function RootLayout() {
  const { hydrate } = useAuthStore();

  useEffect(() => {
    // Hydrate auth state on app start
    hydrate();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.surface,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitleVisible: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="game/[id]"
          options={{
            headerShown: true,
            title: 'Game Details',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="venue/[id]"
          options={{
            headerShown: true,
            title: 'Venue Details',
            headerBackVisible: true,
          }}
        />
      </Stack>
    </>
  );
}
