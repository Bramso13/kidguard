import { Stack } from 'expo-router';
import React from 'react';

/**
 * Parent Mode Layout
 * 
 * This layout wraps all parent-mode screens.
 * Applies parent mode styling and navigation structure.
 */
export default function ParentLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2C5F7C', // Calming blue for parent mode
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'KidGuard',
          headerShown: true,
        }}
      />
    </Stack>
  );
}