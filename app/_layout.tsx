import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://bff28ceda66564ff6d3c54334b43fffb@o4510148443176960.ingest.de.sentry.io/4510148445208656',
});

export default Sentry.wrap(function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(parent)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
});
