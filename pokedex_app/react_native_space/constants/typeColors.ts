export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A29E',
  fire: '#F97316',
  water: '#3B82F6',
  electric: '#FACC15',
  grass: '#22C55E',
  ice: '#67E8F9',
  fighting: '#B91C1C',
  poison: '#A855F7',
  ground: '#D97706',
  flying: '#93C5FD',
  psychic: '#EC4899',
  bug: '#84CC16',
  rock: '#A3A3A3',
  ghost: '#7C3AED',
  dragon: '#7C3AED',
  dark: '#57534E',
  steel: '#94A3B8',
  fairy: '#F9A8D4',
};

// Types that need dark text for accessibility
export const DARK_TEXT_TYPES = ['electric', 'ice', 'fairy', 'flying', 'normal', 'rock'];

export const getTypeColor = (type: string): string => {
  return TYPE_COLORS[type?.toLowerCase?.()] ?? '#A8A29E';
};

export const getTypeTextColor = (type: string): string => {
  return DARK_TEXT_TYPES.includes(type?.toLowerCase?.()) ? '#1A1A1A' : '#FFFFFF';
};
