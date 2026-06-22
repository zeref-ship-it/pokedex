import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { FavoritePokemon } from '@/types/pokemon';

interface FavoritesContextType {
  favorites: FavoritePokemon[];
  isLoading: boolean;
  error: string | null;
  isFavorite: (pokemonId: number) => boolean;
  getFavoriteByPokemonId: (pokemonId: number) => FavoritePokemon | undefined;
  addFavorite: (pokemon: Omit<FavoritePokemon, 'id' | 'createdAt'>) => Promise<void>;
  removeFavorite: (docId: string) => Promise<void>;
  updateFavorite: (docId: string, data: { nickname?: string; notes?: string }) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    try {
      const colRef = collection(db, 'favorites');
      unsubRef.current = onSnapshot(
        colRef,
        (snapshot) => {
          const items: FavoritePokemon[] = (snapshot?.docs ?? []).map((d) => {
            const data = d?.data?.() ?? {};
            return {
              id: d.id,
              pokemonId: data.pokemonId ?? 0,
              name: data.name ?? '',
              imageUrl: data.imageUrl ?? '',
              types: data.types ?? [],
              nickname: data.nickname ?? undefined,
              notes: data.notes ?? undefined,
              createdAt: data.createdAt?.toDate?.() ?? new Date(),
            };
          });
          setFavorites(items);
          setIsLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Firestore snapshot error:', err);
          setError('Erro ao carregar favoritos');
          setIsLoading(false);
        }
      );
    } catch (err) {
      console.error('Firestore init error:', err);
      setError('Erro ao conectar com o banco de dados');
      setIsLoading(false);
    }

    return () => {
      unsubRef.current?.();
    };
  }, []);

  const isFavorite = useCallback(
    (pokemonId: number) => favorites?.some?.((f) => f?.pokemonId === pokemonId) ?? false,
    [favorites]
  );

  const getFavoriteByPokemonId = useCallback(
    (pokemonId: number) => favorites?.find?.((f) => f?.pokemonId === pokemonId),
    [favorites]
  );

  const addFavorite = useCallback(async (pokemon: Omit<FavoritePokemon, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'favorites'), {
        pokemonId: pokemon?.pokemonId ?? 0,
        name: pokemon?.name ?? '',
        imageUrl: pokemon?.imageUrl ?? '',
        types: pokemon?.types ?? [],
        nickname: pokemon?.nickname ?? '',
        notes: pokemon?.notes ?? '',
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error adding favorite:', err);
      throw err;
    }
  }, []);

  const removeFavorite = useCallback(async (docId: string) => {
    try {
      await deleteDoc(doc(db, 'favorites', docId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      throw err;
    }
  }, []);

  const updateFavorite = useCallback(
    async (docId: string, data: { nickname?: string; notes?: string }) => {
      try {
        await updateDoc(doc(db, 'favorites', docId), {
          ...(data?.nickname != null ? { nickname: data.nickname } : {}),
          ...(data?.notes != null ? { notes: data.notes } : {}),
        });
      } catch (err) {
        console.error('Error updating favorite:', err);
        throw err;
      }
    },
    []
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        error,
        isFavorite,
        getFavoriteByPokemonId,
        addFavorite,
        removeFavorite,
        updateFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return ctx;
};
