import React, { useCallback } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '@/constants/theme';
import TypeBadge from './TypeBadge';
import { FavoritePokemon } from '@/types/pokemon';

interface FavoriteCardProps {
  favorite: FavoritePokemon;
  index: number;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
  favorite,
  index,
  onPress,
  onEdit,
  onDelete,
}) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const delay = Math.min(index, 6) * 80;
  const displayName = (favorite?.name ?? '').charAt(0).toUpperCase() + (favorite?.name ?? '').slice(1);
  const nickname = favorite?.nickname;

  return (
    <Animated.View
      entering={FadeInRight.delay(delay).duration(400)}
      exiting={FadeOutLeft.duration(300)}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.98); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        accessibilityLabel={`Favorito ${displayName}`}
        accessibilityRole="button"
      >
        <Animated.View style={[styles.card, animStyle]}>
          <Image
            source={{ uri: favorite?.imageUrl ?? '' }}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={displayName}
          />

          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
              {nickname ? <Text style={styles.nickname}> • {nickname}</Text> : null}
            </Text>

            <View style={styles.typesRow}>
              {(favorite?.types ?? []).map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </View>

            {favorite?.notes ? (
              <Text style={styles.notes} numberOfLines={1}>
                {favorite.notes}
              </Text>
            ) : null}
          </View>

          <View style={styles.actions}>
            <Pressable
              style={styles.actionBtn}
              onPress={onEdit}
              hitSlop={8}
              accessibilityLabel="Editar favorito"
              accessibilityRole="button"
            >
              <Ionicons name="pencil" size={20} color={COLORS.textSecondary} />
            </Pressable>

            <Pressable
              style={styles.actionBtn}
              onPress={onDelete}
              hitSlop={8}
              accessibilityLabel="Remover favorito"
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.error} />
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: 12,
    marginHorizontal: SPACING.md,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
      },
    }),
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  nickname: {
    fontWeight: '400',
    color: COLORS.accent,
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  notes: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    padding: 6,
  },
});

export default React.memo(FavoriteCard);
