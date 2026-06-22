import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { getTypeColor, getTypeTextColor } from '@/constants/typeColors';

interface TypeBadgeProps {
  type: string;
  style?: StyleProp<ViewStyle>;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type, style }) => {
  const bgColor = getTypeColor(type);
  const textColor = getTypeTextColor(type);
  const label = (type ?? '').charAt(0).toUpperCase() + (type ?? '').slice(1);

  return (
    <View
      style={[styles.badge, { backgroundColor: bgColor }, style]}
      accessibilityLabel={`Tipo ${label}`}
    >
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default React.memo(TypeBadge);
