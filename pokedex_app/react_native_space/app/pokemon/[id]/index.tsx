import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS } from '@/constants/theme';
import { getTypeColor } from '@/constants/typeColors';
import { fetchPokemonDetail, getPokemonImageUrl, formatPokemonId } from '@/services/pokeApi';
import { PokemonDetail } from '@/types/pokemon';
import { useFavorites } from '@/context/FavoritesContext';
import TypeBadge from '@/components/TypeBadge';
import StatBar from '@/components/StatBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';

export default function PokemonDetailScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, addFavorite, removeFavorite, getFavoriteByPokemonId } = useFavorites();

  const heartScale = useSharedValue(1);
  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const loadPokemon = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPokemonDetail(id);
      setPokemon(data);
    } catch (err) {
      console.error('Error loading pokemon detail:', err);
      setError('Erro ao carregar detalhes');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPokemon();
  }, [loadPokemon]);

  const pokemonId = pokemon?.id ?? 0;
  const favorited = isFavorite(pokemonId);
  const imageUrl = getPokemonImageUrl(pokemon);
  const types = (pokemon?.types ?? []).map((t) => t?.type?.name ?? 'normal');
  const primaryType = types?.[0] ?? 'normal';
  const primaryColor = getTypeColor(primaryType);
  const displayName = (pokemon?.name ?? '').charAt(0).toUpperCase() + (pokemon?.name ?? '').slice(1);

  const handleToggleFavorite = useCallback(async () => {
    heartScale.value = withSpring(1.4, {}, () => {
      heartScale.value = withSpring(1);
    });

    try {
      if (favorited) {
        const fav = getFavoriteByPokemonId(pokemonId);
        if (fav?.id) {
          await removeFavorite(fav.id);
        }
      } else {
        await addFavorite({
          pokemonId,
          name: pokemon?.name ?? '',
          imageUrl,
          types,
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  }, [favorited, pokemonId, pokemon, imageUrl, types, getFavoriteByPokemonId, removeFavorite, addFavorite]);

  const handleEditFavorite = useCallback(() => {
    const fav = getFavoriteByPokemonId(pokemonId);
    if (fav?.id) {
      router.push(`/favorite/${fav.id}/edit`);
    }
  }, [pokemonId, getFavoriteByPokemonId]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Voltar">
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </Pressable>
        </View>
        <LoadingSpinner message="Carregando detalhes..." />
      </SafeAreaView>
    );
  }

  if (error || !pokemon) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Voltar">
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </Pressable>
        </View>
        <ErrorState message={error ?? 'Pokémon não encontrado'} onRetry={loadPokemon} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} accessibilityLabel="Voltar">
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>{displayName}</Text>
        <Pressable
          onPress={handleToggleFavorite}
          style={styles.heartBtn}
          accessibilityLabel={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Animated.View style={heartStyle}>
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={26}
              color={favorited ? COLORS.primary : COLORS.textPrimary}
            />
          </Animated.View>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={[`${primaryColor}40`, COLORS.backgroundDark] as const}
          style={styles.hero}
        >
          <Animated.View entering={FadeIn.duration(600)}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={styles.heroImage}
                resizeMode="contain"
                accessibilityLabel={displayName}
              />
            ) : (
              <View style={styles.heroImagePlaceholder}>
                <MaterialCommunityIcons name="pokeball" size={80} color={COLORS.textSecondary} />
              </View>
            )}
          </Animated.View>
        </LinearGradient>

        {/* Name & ID */}
        <View style={styles.nameSection}>
          <Text style={styles.pokemonId}>{formatPokemonId(pokemonId)}</Text>
          <Text style={styles.pokemonName}>{displayName}</Text>
        </View>

        {/* Types */}
        <View style={styles.typesRow}>
          {types.map((t) => (
            <TypeBadge key={t} type={t} style={{ marginHorizontal: 4 }} />
          ))}
        </View>

        {/* Physical info */}
        <View style={styles.physicalRow}>
          <View style={styles.physicalCard}>
            <Text style={styles.physicalLabel}>Peso</Text>
            <Text style={styles.physicalValue}>
              {((pokemon?.weight ?? 0) / 10).toFixed(1)} kg
            </Text>
          </View>
          <View style={styles.physicalCard}>
            <Text style={styles.physicalLabel}>Altura</Text>
            <Text style={styles.physicalValue}>
              {((pokemon?.height ?? 0) / 10).toFixed(1)} m
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas Base</Text>
          {(pokemon?.stats ?? []).map((s, i) => (
            <StatBar
              key={s?.stat?.name ?? String(i)}
              statName={s?.stat?.name ?? ''}
              value={s?.base_stat ?? 0}
              delay={i * 100}
            />
          ))}
        </View>

        {/* Abilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <View style={styles.abilitiesRow}>
            {(pokemon?.abilities ?? []).map((a) => {
              const abilityName = a?.ability?.name ?? '';
              const label = abilityName.charAt(0).toUpperCase() + abilityName.slice(1);
              return (
                <View key={abilityName} style={styles.abilityChip}>
                  <Text style={styles.abilityText}>{label.replace('-', ' ')}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Favorite action */}
        <View style={styles.actionSection}>
          {favorited ? (
            <>
              <Pressable
                style={styles.editButton}
                onPress={handleEditFavorite}
                accessibilityLabel="Editar apelido e notas"
              >
                <Ionicons name="pencil" size={18} color={COLORS.accent} />
                <Text style={styles.editButtonText}>Editar apelido / notas</Text>
              </Pressable>
              <Pressable
                style={styles.removeButton}
                onPress={handleToggleFavorite}
                accessibilityLabel="Remover dos favoritos"
              >
                <Text style={styles.removeButtonText}>Remover dos Favoritos</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              style={styles.addButton}
              onPress={handleToggleFavorite}
              accessibilityLabel="Adicionar aos favoritos"
            >
              <LinearGradient
                colors={[COLORS.primary, '#B91C1C'] as const}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="heart" size={20} color={COLORS.white} />
                <Text style={styles.addButtonText}>Adicionar aos Favoritos</Text>
              </LinearGradient>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backBtn: {
    padding: 8,
  },
  topTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  heartBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  heroImage: {
    width: 200,
    height: 200,
  },
  heroImagePlaceholder: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameSection: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  pokemonId: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  pokemonName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  typesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  physicalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  physicalCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  physicalLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  physicalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  abilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  abilityChip: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  abilityText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  actionSection: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.md,
    gap: 12,
  },
  addButton: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  removeButton: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.accent,
  },
});
