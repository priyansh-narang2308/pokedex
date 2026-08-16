import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export function usePokemons() {
  return useInfiniteQuery({
    queryKey: ["pokemons", "list"],
    queryFn: async ({ pageParam }) => {
      return fetchApi<PokemonListResponse>(
        `/pokemon?limit=20&offset=${pageParam}`,
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * 20;
    },
  });
}
