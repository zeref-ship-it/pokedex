import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FavoriteCard from '@/components/FavoriteCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import { COLORS, SPACING } from '@/constants/theme';
import { useFavorites } from '@/context/FavoritesContext';
import { FavoritePokemon } from '@/types/pokemon';

export default function FavoritesScreen() {
  const { favorites, isLoading, error, removeFavorite } = useFavorites();

  const handleDelete = useCallback(
    (fav: FavoritePokemon) => {
      const name = (fav?.name ?? '').charAt(0).toUpperCase() + (fav?.name ?? '').slice(1);

      if (Platform.OS === 'web') {
        if (window?.confirm?.(`Remover ${name} dos favoritos?`)) {
          removeFavorite?.(fav?.id ?? '');
        }
      } else {
        Alert.alert(
          'Remover Favorito',
          `Deseja remover ${name} dos favoritos?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            {
              text: 'Remover',
              style: 'destructive',
              onPress: () => removeFavorite?.(fav?.id ?? ''),
            },
          ]
        );
      }
    },
    [removeFavorite]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: FavoritePokemon; index: number }) => (
      <FavoriteCard
        favorite={item}
        index={index}
        onPress={() => router.push(`/pokemon/${item?.pokemonId}`)}
        onEdit={() => router.push(`/favorite/${item?.id}/edit`)}
        onDelete={() => handleDelete(item)}
      />
    ),
    [handleDelete]
  );

  const keyExtractor = useCallback((item: FavoritePokemon) => item?.id ?? String(Math.random()), []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Text style={styles.title}>Meus Favoritos</Text>
        <LoadingSpinner message="Carregando favoritos..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Text style={styles.title}>Meus Favoritos</Text>
        <ErrorState message={error} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Text style={styles.title}>Meus Favoritos</Text>

      {(favorites?.length ?? 0) === 0 ? (
        <EmptyState
          title="Nenhum favorito ainda"
          subtitle="Explore a Pokédex e adicione seus Pokémon favoritos!"
        />
      ) : (
        <FlatList
          data={favorites ?? []}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
  listContent: {
    paddingBottom: 32,
    paddingTop: 8,
  },
});
