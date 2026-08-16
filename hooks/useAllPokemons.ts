import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { PokemonListResponse } from "./usePokemons";

export function useAllPokemons() {
  return useQuery({
    queryKey: ["pokemons", "all"],
    queryFn: () => fetchApi<PokemonListResponse>("/pokemon?limit=1302"),
    staleTime: 1000 * 60 * 60 * 24,
  });
}
