import { Stack } from 'expo-router';

export default function ParentLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A90E2',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="analytics/index"
        options={{
          title: 'Tableau de bord',
        }}
      />
    </Stack>
  );
}
