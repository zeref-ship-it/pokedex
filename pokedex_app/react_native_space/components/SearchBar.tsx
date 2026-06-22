import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Platform, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar Pokémon...',
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <Ionicons
        name="search"
        size={20}
        color={focused ? COLORS.primary : COLORS.textSecondary}
        style={styles.icon}
      />
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel={placeholder}
      />
      {(value?.length ?? 0) > 0 && (
        <Pressable
          onPress={() => onChangeText?.('')}
          hitSlop={12}
          accessibilityLabel="Limpar busca"
        >
          <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.xl,
    paddingHorizontal: 16,
    paddingVertical: Platform.select({ ios: 12, default: 8 }),
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  focused: {
    borderColor: COLORS.primary,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    padding: 0,
  },
});

export default React.memo(SearchBar);
