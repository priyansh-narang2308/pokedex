import { PokemonCard } from "./pokemon-card";
import { PokemonCardSkeleton } from "./pokemon-card-skeleton";

interface PokemonGridProps {
  pokemons: { name: string }[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export function PokemonGrid({
  pokemons,
  isLoading,
  skeletonCount = 12,
}: PokemonGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
      {pokemons.map((p) => (
        <PokemonCard key={p.name} name={p.name} />
      ))}

      {isLoading &&
        Array.from({ length: skeletonCount }).map((_, i) => (
          <PokemonCardSkeleton key={`skeleton-${i}`} />
        ))}
    </div>
  );
}
