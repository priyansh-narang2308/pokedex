export const POKEMON_TYPE_COLORS: Record<string, string> = {
  normal: "#A8A29E",
  fire: "#F97316",
  water: "#3B82F6",
  grass: "#22C55E",
  electric: "#EAB308",
  ice: "#06B6D4",
  fighting: "#EF4444",
  poison: "#A855F7",
  ground: "#D97706",
  flying: "#818CF8",
  psychic: "#EC4899",
  bug: "#84CC16",
  rock: "#78716C",
  ghost: "#6366F1",
  dragon: "#8B5CF6",
  dark: "#1E293B",
  steel: "#94A3B8",
  fairy: "#F472B6",
};

export function getPokemonColor(type: string): string {
  return POKEMON_TYPE_COLORS[type.toLowerCase()] || POKEMON_TYPE_COLORS.normal;
}
