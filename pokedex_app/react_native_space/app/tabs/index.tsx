import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PokemonCard from '@/components/PokemonCard';
import SearchBar from '@/components/SearchBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { COLORS, SPACING } from '@/constants/theme';
import { fetchPokemonList, fetchPokemonDetail, getPokemonImageUrl } from '@/services/pokeApi';
import { PokemonDetail } from '@/types/pokemon';
import { useFavorites } from '@/context/FavoritesContext';

const PAGE_SIZE = 20;

interface PokemonCardData {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
}

export default function HomeScreen() {
  const [pokemon, setPokemon] = useState<PokemonCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const offsetRef = useRef(0);
  const { isFavorite, addFavorite, removeFavorite, getFavoriteByPokemonId } = useFavorites();

  const loadPokemon = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsLoading(true);
        setPokemon([]);
        offsetRef.current = 0;
      }
      setError(null);

      const listData = await fetchPokemonList(offsetRef.current, PAGE_SIZE);
      const results = listData?.results ?? [];

      if ((results?.length ?? 0) === 0) {
        setHasMore(false);
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

      const details = await Promise.all(
        results.map(async (item) => {
          try {
            const detail = await fetchPokemonDetail(item?.name ?? '');
            return {
              id: detail?.id ?? 0,
              name: detail?.name ?? item?.name ?? '',
              imageUrl: getPokemonImageUrl(detail),
              types: (detail?.types ?? []).map((t) => t?.type?.name ?? 'normal'),
            };
          } catch {
            return null;
          }
        })
      );

      const validDetails = (details?.filter?.((d) => d != null) ?? []) as PokemonCardData[];

      setPokemon((prev) => {
        if (isRefresh) return validDetails;
        const existingIds = new Set((prev ?? []).map((p) => p?.id));
        const newItems = validDetails.filter((d) => !existingIds.has(d?.id));
        return [...(prev ?? []), ...newItems];
      });

      offsetRef.current += PAGE_SIZE;
      setHasMore(listData?.next != null);
    } catch (err) {
      console.error('Error loading pokemon:', err);
      setError('Erro ao carregar Pokémon');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPokemon(true);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isLoading && !searchQuery) {
      setIsLoadingMore(true);
      loadPokemon(false);
    }
  }, [isLoadingMore, hasMore, isLoading, searchQuery, loadPokemon]);

  const filteredPokemon = useMemo(() => {
    if (!searchQuery?.trim?.()) return pokemon ?? [];
    const q = searchQuery.toLowerCase().trim();
    return (pokemon ?? []).filter((p) => p?.name?.toLowerCase?.()?.includes?.(q));
  }, [pokemon, searchQuery]);

  const handleToggleFavorite = useCallback(
    async (item: PokemonCardData) => {
      try {
        if (isFavorite(item?.id)) {
          const fav = getFavoriteByPokemonId(item?.id);
          if (fav?.id) {
            await removeFavorite(fav.id);
          }
        } else {
          await addFavorite({
            pokemonId: item?.id ?? 0,
            name: item?.name ?? '',
            imageUrl: item?.imageUrl ?? '',
            types: item?.types ?? [],
          });
        }
      } catch (err) {
        console.error('Toggle favorite error:', err);
      }
    },
    [isFavorite, getFavoriteByPokemonId, removeFavorite, addFavorite]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: PokemonCardData; index: number }) => (
      <PokemonCard
        id={item?.id ?? 0}
        name={item?.name ?? ''}
        imageUrl={item?.imageUrl ?? ''}
        types={item?.types ?? []}
        isFavorite={isFavorite(item?.id)}
        index={index}
        onPress={() => router.push(`/pokemon/${item?.id}`)}
        onToggleFavorite={() => handleToggleFavorite(item)}
      />
    ),
    [isFavorite, handleToggleFavorite]
  );

  const keyExtractor = useCallback((item: PokemonCardData) => String(item?.id ?? Math.random()), []);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }, [isLoadingMore]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="pokeball" size={28} color={COLORS.primary} />
          <Text style={styles.title}>Pokédex</Text>
        </View>
        <LoadingSpinner message="Carregando Pokémon..." />
      </SafeAreaView>
    );
  }

  if (error && (pokemon?.length ?? 0) === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="pokeball" size={28} color={COLORS.primary} />
          <Text style={styles.title}>Pokédex</Text>
        </View>
        <ErrorState message={error} onRetry={() => loadPokemon(true)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="pokeball" size={28} color={COLORS.primary} />
        <Text style={styles.title}>Pokédex</Text>
      </View>

      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {(filteredPokemon?.length ?? 0) === 0 ? (
        <EmptyState
          title="Nenhum Pokémon encontrado"
          subtitle="Tente buscar com outro nome"
        />
      ) : (
        <FlatList
          data={filteredPokemon}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          removeClippedSubviews
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 32,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
