import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: number; // pourcentage de changement
  icon?: string;
}

export function MetricCard({ title, value, trend, icon }: MetricCardProps) {
  const trendColor = trend && trend > 0 ? '#2ECC71' : trend && trend < 0 ? '#E74C3C' : '#95A5A6';
  const trendArrow = trend && trend > 0 ? '↑' : trend && trend < 0 ? '↓' : '→';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {trend !== undefined && (
        <View style={styles.trendContainer}>
          <Text style={[styles.trend, { color: trendColor }]}>
            {trendArrow} {Math.abs(trend)}%
          </Text>
          <Text style={styles.trendLabel}>vs période précédente</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trend: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  trendLabel: {
    fontSize: 12,
    color: '#95A5A6',
  },
});
