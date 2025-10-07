import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

// Theme pour les écrans d'authentification parents
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4A90E2', // Bleu calme pour l'interface parent
    secondary: '#2ECC71',
    background: '#FFFFFF',
    surface: '#F5F5F5',
  },
};

export default function AuthLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="register" />
        <Stack.Screen name="login" />
      </Stack>
    </PaperProvider>
  );
}
