import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

export default function ParentLayout() {
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1976d2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="children/index"
          options={{
            title: 'Mes Enfants',
          }}
        />
        <Stack.Screen
          name="children/[id]"
          options={{
            title: 'Profil Enfant',
          }}
        />
      </Stack>
    </PaperProvider>
  );
}