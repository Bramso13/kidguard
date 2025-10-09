import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Avatar, Card, useTheme } from 'react-native-paper';
import { ChildProfile } from '@/lib/types';

interface PhoneSharingButtonProps {
  child: ChildProfile;
  onPress: () => void;
}

export function PhoneSharingButton({ child, onPress }: PhoneSharingButtonProps) {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[styles.card, { backgroundColor: theme.colors.primaryContainer }]}>
        <Card.Content style={styles.content}>
          <View style={styles.avatarContainer}>
            {child.avatar ? (
              <Avatar.Image size={60} source={{ uri: child.avatar }} />
            ) : (
              <Avatar.Text size={60} label={child.name.charAt(0).toUpperCase()} />
            )}
          </View>
          <View style={styles.textContainer}>
            <Text variant="titleLarge" style={styles.childName}>
              {child.name}
            </Text>
            <Text variant="bodyMedium" style={styles.sharingText}>
              va utiliser ce téléphone
            </Text>
            <View style={styles.statsContainer}>
              <Text variant="bodySmall" style={styles.stats}>
                {child.totalPoints} points • {child.totalStars} étoiles
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    minHeight: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  childName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sharingText: {
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stats: {
    opacity: 0.7,
  },
});
