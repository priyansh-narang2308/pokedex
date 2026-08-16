import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import type { PokemonListItem } from "./usePokemons";

export interface TypeDetailResponse {
  pokemon: {
    pokemon: PokemonListItem;
    slot: number;
  }[];
}

export function usePokemonByType(type: string | null) {
  return useQuery({
    queryKey: ["pokemons", "type", type],
    queryFn: async () => {
      const data = await fetchApi<TypeDetailResponse>(`/type/${type}`);
      return data.pokemon.map((p) => p.pokemon);
    },
    enabled: !!type,
  });
}
