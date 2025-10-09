import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import type { ChildProfile } from '@/lib/types';

interface PhoneSharingButtonProps {
  child: ChildProfile;
  onPress: () => void;
}

/**
 * Phone Sharing Button Component
 * 
 * Large, prominent button for activating child mode.
 * Requirements:
 * - Minimum 60x60pt touch target
 * - Distinctive color (different from parent mode)
 * - Display child's avatar/icon if configured
 * - Child's name clearly visible
 */
export default function PhoneSharingButton({ child, onPress }: PhoneSharingButtonProps) {
  const getAvatarDisplay = () => {
    if (child.avatar) {
      // TODO: Replace with actual avatar image when implemented
      return <Text style={styles.avatarPlaceholder}>👤</Text>;
    }
    
    // Show first letter of child's name as fallback
    return (
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarLetter}>
          {child.name.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`Activer le mode ${child.name}`}
      accessibilityHint="Appuyez pour permettre à votre enfant d'utiliser ce téléphone"
    >
      {/* Avatar Section */}
      <View style={styles.avatarContainer}>
        {getAvatarDisplay()}
      </View>

      {/* Child Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.childName}>{child.name}</Text>
        <Text style={styles.buttonText}>va utiliser ce téléphone</Text>
        
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statBadge}>
            <Text style={styles.statText}>⭐ {child.totalStars}</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statText}>🔥 {child.currentStreak} jours</Text>
          </View>
        </View>
      </View>

      {/* Arrow Indicator */}
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9A3C', // Distinctive warm orange for child mode activation
    borderRadius: 20,
    padding: 20,
    minHeight: 100, // Well above 60pt minimum
    shadowColor: '#FF9A3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: '#FFA850',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFBD73',
  },
  avatarLetter: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF9A3C',
  },
  avatarPlaceholder: {
    fontSize: 48,
  },
  infoContainer: {
    flex: 1,
  },
  childName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 8,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  arrowContainer: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});