import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimePeriod } from '../../lib/types/analytics';

interface PeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

export function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'today', label: "Aujourd'hui" },
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
  ];

  return (
    <View style={styles.container}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period.value}
          style={[
            styles.button,
            selectedPeriod === period.value && styles.buttonActive,
          ]}
          onPress={() => onPeriodChange(period.value)}
        >
          <Text
            style={[
              styles.buttonText,
              selectedPeriod === period.value && styles.buttonTextActive,
            ]}
          >
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ECF0F1',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  buttonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
