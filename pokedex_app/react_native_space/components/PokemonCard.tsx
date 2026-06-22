import React, { useCallback } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import { getTypeColor } from '@/constants/typeColors';
import TypeBadge from './TypeBadge';
import { formatPokemonId } from '@/services/pokeApi';

interface PokemonCardProps {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  isFavorite: boolean;
  index: number;
  onPress: () => void;
  onToggleFavorite: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  id,
  name,
  imageUrl,
  types,
  isFavorite,
  index,
  onPress,
  onToggleFavorite,
}) => {
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const primaryType = types?.[0] ?? 'normal';
  const primaryColor = getTypeColor(primaryType);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97);
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, []);

  const handleHeart = useCallback(() => {
    heartScale.value = withSpring(1.4, {}, () => {
      heartScale.value = withSpring(1);
    });
    onToggleFavorite?.();
  }, [onToggleFavorite]);

  const delay = Math.min(index, 6) * 50;

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400).springify()}
      style={styles.wrapper}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={`Pokémon ${name ?? ''}`}
        accessibilityRole="button"
      >
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: `${primaryColor}20` },
            cardStyle,
          ]}
        >
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }} />
            <Text style={styles.idText}>{formatPokemonId(id)}</Text>
          </View>

          <Pressable
            style={styles.heartButton}
            onPress={handleHeart}
            hitSlop={12}
            accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            accessibilityRole="button"
          >
            <Animated.View style={heartStyle}>
              <MaterialCommunityIcons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? COLORS.primary : COLORS.textSecondary}
              />
            </Animated.View>
          </Pressable>

          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="contain"
              accessibilityLabel={name ?? 'Pokémon'}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialCommunityIcons name="pokeball" size={48} color={COLORS.textSecondary} />
            </View>
          )}

          <Text style={styles.name} numberOfLines={1}>
            {(name ?? '').charAt(0).toUpperCase() + (name ?? '').slice(1)}
          </Text>

          <View style={styles.typesRow}>
            {(types ?? []).map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '50%',
    padding: 6,
  },
  card: {
    borderRadius: RADIUS.lg,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.surfaceElevated,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 4,
  },
  idText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 4,
  },
  image: {
    width: 96,
    height: 96,
  },
  imagePlaceholder: {
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 6,
  },
});

export default React.memo(PokemonCard);
