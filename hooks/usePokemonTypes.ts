import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

export interface PokemonTypeResult {
  name: string;
  url: string;
}

export interface PokemonTypesResponse {
  count: number;
  results: PokemonTypeResult[];
}

export function usePokemonTypes() {
  return useQuery({
    queryKey: ["pokemonTypes"],
    queryFn: async () => {
      const data = await fetchApi<PokemonTypesResponse>("/type?limit=50");

      return data.results.filter(
        (type) => type.name !== "unknown" && type.name !== "stellar",
      );
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}
