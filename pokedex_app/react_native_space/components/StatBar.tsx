import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { COLORS } from '@/constants/theme';

const STAT_COLORS: Record<string, string> = {
  hp: '#22C55E',
  attack: '#EF4444',
  defense: '#F97316',
  'special-attack': '#3B82F6',
  'special-defense': '#7C3AED',
  speed: '#FACC15',
};

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Atq. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidade',
};

interface StatBarProps {
  statName: string;
  value: number;
  maxValue?: number;
  delay?: number;
}

const StatBar: React.FC<StatBarProps> = ({ statName, value, maxValue = 255, delay = 0 }) => {
  const progress = useSharedValue(0);
  const color = STAT_COLORS[statName ?? ''] ?? '#A3A3A3';
  const label = STAT_LABELS[statName ?? ''] ?? statName ?? '';

  useEffect(() => {
    const safeValue = Math.min(Math.max(value ?? 0, 0), maxValue);
    const timeout = setTimeout(() => {
      progress.value = withTiming(safeValue / maxValue, { duration: 800 });
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, maxValue, delay]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${Math.round(progress.value * 100)}%`,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value ?? 0}</Text>
      <View style={styles.barBg}>
        <Animated.View style={[styles.barFill, { backgroundColor: color }, animStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 85,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  value: {
    width: 36,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
    textAlign: 'right',
    marginRight: 12,
  },
  barBg: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default React.memo(StatBar);
