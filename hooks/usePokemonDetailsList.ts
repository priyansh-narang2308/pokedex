import { useQueries } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";
import { PokemonDetail } from "./usePokemonDetail";

export function usePokemonDetailsList(names: string[]) {
  return useQueries({
    queries: names.map((name) => ({
      queryKey: ["pokemon", name],
      queryFn: () => fetchApi<PokemonDetail>(`/pokemon/${name}`),
      staleTime: 1000 * 60 * 60 * 24,
    })),
  });
}
