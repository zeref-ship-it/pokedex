import { PokemonDetail, PokemonListResponse } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (
  offset: number = 0,
  limit: number = 20
): Promise<PokemonListResponse> => {
  const url = new URL(`/api/v2/pokemon?offset=${offset}&limit=${limit}`, 'https://pokeapi.co').toString();
  const response = await fetch(url);
  if (!response?.ok) {
    throw new Error('Erro ao carregar lista de Pokémon');
  }
  return response.json();
};

export const fetchPokemonDetail = async (idOrName: string | number): Promise<PokemonDetail> => {
  const url = new URL(`/api/v2/pokemon/${idOrName}`, 'https://pokeapi.co').toString();
  const response = await fetch(url);
  if (!response?.ok) {
    throw new Error(`Erro ao carregar Pokémon ${idOrName}`);
  }
  return response.json();
};

export const getPokemonImageUrl = (pokemon: PokemonDetail | null | undefined): string => {
  const artwork = pokemon?.sprites?.other?.['official-artwork']?.front_default;
  const fallback = pokemon?.sprites?.front_default;
  return artwork ?? fallback ?? '';
};

export const formatPokemonId = (id: number | undefined): string => {
  if (id == null) return '#000';
  return `#${String(id).padStart(3, '0')}`;
};
