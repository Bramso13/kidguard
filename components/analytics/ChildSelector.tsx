import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Child {
  id: string;
  name: string;
}

interface ChildSelectorProps {
  children: Child[];
  selectedChildId: string | null; // null = tous les enfants
  onChildSelect: (childId: string | null) => void;
}

export function ChildSelector({ children, selectedChildId, onChildSelect }: ChildSelectorProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <TouchableOpacity
        style={[
          styles.chip,
          selectedChildId === null && styles.chipActive,
        ]}
        onPress={() => onChildSelect(null)}
      >
        <Text
          style={[
            styles.chipText,
            selectedChildId === null && styles.chipTextActive,
          ]}
        >
          👨‍👩‍👧‍👦 Tous les enfants
        </Text>
      </TouchableOpacity>

      {children.map((child) => (
        <TouchableOpacity
          key={child.id}
          style={[
            styles.chip,
            selectedChildId === child.id && styles.chipActive,
          ]}
          onPress={() => onChildSelect(child.id)}
        >
          <Text
            style={[
              styles.chipText,
              selectedChildId === child.id && styles.chipTextActive,
            ]}
          >
            👤 {child.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  contentContainer: {
    paddingHorizontal: 4,
  },
  chip: {
    backgroundColor: '#ECF0F1',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  chipActive: {
    backgroundColor: '#4A90E2',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
