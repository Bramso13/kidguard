import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PhoneSharingButton from '@/components/parent/PhoneSharingButton';
import DashboardStats from '@/components/parent/DashboardStats';
import ConfirmationDialog from '@/components/parent/ConfirmationDialog';
import type { ChildProfile } from '@/lib/types';

/**
 * Parent Dashboard Screen
 * 
 * Displays:
 * - Phone sharing buttons for each child
 * - At-a-glance statistics
 * - Quick navigation to other parent features
 */
export default function ParentDashboard() {
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // TODO: Replace with actual data from API
  const mockChildren: ChildProfile[] = [
    {
      id: '1',
      parentId: 'parent-1',
      name: 'Sophie',
      age: 8,
      avatar: null,
      difficultyLevel: 'easy',
      exerciseTypes: ['math', 'reading', 'logic'],
      timeRewardMinutes: 15,
      blockedAppCategories: ['all'],
      totalPoints: 250,
      totalStars: 25,
      currentStreak: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      parentId: 'parent-1',
      name: 'Lucas',
      age: 11,
      avatar: null,
      difficultyLevel: 'medium',
      exerciseTypes: ['math', 'reading', 'logic', 'vocabulary'],
      timeRewardMinutes: 20,
      blockedAppCategories: ['games', 'social'],
      totalPoints: 480,
      totalStars: 42,
      currentStreak: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // TODO: Replace with actual statistics from API
  const stats = {
    childrenCount: mockChildren.length,
    totalExercisesToday: 12,
    totalTimeEarnedToday: 180, // minutes
  };

  const handlePhoneSharingPress = (child: ChildProfile) => {
    setSelectedChild(child);
    setShowConfirmation(true);
  };

  const handleConfirmActivation = () => {
    if (!selectedChild) return;

    // TODO: Call API to start child session
    console.log(`Activating child mode for: ${selectedChild.name}`);
    
    setShowConfirmation(false);
    setSelectedChild(null);
    
    // TODO: Navigate to child mode screen
  };

  const handleCancelActivation = () => {
    setShowConfirmation(false);
    setSelectedChild(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Tableau de bord</Text>
          <Text style={styles.subtitle}>Bonjour ! Bienvenue sur KidGuard</Text>
        </View>

        {/* Dashboard Statistics */}
        <DashboardStats stats={stats} />

        {/* Phone Sharing Buttons Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partage de téléphone</Text>
          <Text style={styles.sectionDescription}>
            Activez le mode enfant pour partager votre téléphone en toute sécurité
          </Text>
          
          <View style={styles.phoneSharingButtons}>
            {mockChildren.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Aucun enfant configuré
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Ajoutez votre premier enfant pour commencer
                </Text>
              </View>
            ) : (
              mockChildren.map((child) => (
                <PhoneSharingButton
                  key={child.id}
                  child={child}
                  onPress={() => handlePhoneSharingPress(child)}
                />
              ))
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>👶 Gérer les enfants</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📊 Voir l'activité</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>⚙️ Paramètres</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        visible={showConfirmation}
        childName={selectedChild?.name || ''}
        onConfirm={handleConfirmActivation}
        onCancel={handleCancelActivation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Light calming background
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C5F7C', // Calming blue for parent mode
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  phoneSharingButtons: {
    gap: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748B',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
});