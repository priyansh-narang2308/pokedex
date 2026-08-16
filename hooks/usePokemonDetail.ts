import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience?: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  moves?: {
    move: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
}

export function usePokemonDetail(nameOrId: string | number | undefined) {
  return useQuery({
    queryKey: ["pokemon", nameOrId],
    queryFn: () => fetchApi<PokemonDetail>(`/pokemon/${nameOrId}`),
    enabled: !!nameOrId,
  });
}
