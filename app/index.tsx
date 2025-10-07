import { View, Text, StyleSheet, Button } from 'react-native';
import * as Sentry from '@sentry/react-native';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 KidGuard</Text>
      <Text style={styles.subtitle}>Transform screen time into learning time</Text>
      <Text style={styles.info}>Project initialized successfully!</Text>
      <Button
        title="Try!"
        onPress={() => {
          Sentry.captureException(new Error('First error'));
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
  },
});
