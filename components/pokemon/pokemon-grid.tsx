"use client";

import { useMemo } from "react";
import { PokemonCard } from "./pokemon-card";
import { PokemonCardSkeleton } from "./pokemon-card-skeleton";
import { usePokemonDetailsList } from "@/hooks/usePokemonDetailsList";
import { useSearchParams } from "next/navigation";

interface PokemonGridProps {
  pokemons: { name: string; url?: string; id?: number }[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export function PokemonGrid({
  pokemons,
  isLoading,
  skeletonCount = 12,
}: PokemonGridProps) {
  const searchParams = useSearchParams();
  const sortParam = searchParams.get("sort") || "id-asc";

  const needsStats =
    sortParam.includes("attack") ||
    sortParam.includes("speed") ||
    sortParam.includes("hp");

  const names = useMemo(() => {
    return needsStats ? pokemons.map((p) => p.name) : [];
  }, [pokemons, needsStats]);

  const detailsQueries = usePokemonDetailsList(names);
  const isDetailsLoading = detailsQueries.some((q) => q.isLoading);

  const sortedPokemons = useMemo(() => {
    if (pokemons.length === 0) return [];
    const list = [...pokemons];

    const getPokemonId = (p: { name: string; url?: string; id?: number }) => {
      if (p.id) return p.id;
      if (p.url) {
        const parts = p.url.split("/").filter(Boolean);
        return parseInt(parts[parts.length - 1], 10);
      }
      return 0;
    };

    if (sortParam === "id-asc") {
      list.sort((a, b) => getPokemonId(a) - getPokemonId(b));
    } else if (sortParam === "id-desc") {
      list.sort((a, b) => getPokemonId(b) - getPokemonId(a));
    } else if (sortParam === "name-asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortParam === "name-desc") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (needsStats) {
      if (isDetailsLoading) return list;

      const statsMap = new Map<string, number>();
      detailsQueries.forEach((q) => {
        if (q.data) {
          const statName = sortParam.split("-")[0];
          const statVal =
            q.data.stats.find((s) => s.stat.name === statName)?.base_stat || 0;
          statsMap.set(q.data.name, statVal);
        }
      });

      list.sort((a, b) => {
        const valA = statsMap.get(a.name) || 0;
        const valB = statsMap.get(b.name) || 0;
        return valB - valA;
      });
    }

    return list;
  }, [pokemons, sortParam, needsStats, isDetailsLoading, detailsQueries]);

  const showLoading = isLoading || (needsStats && isDetailsLoading);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
      {!showLoading &&
        sortedPokemons.map((p) => <PokemonCard key={p.name} name={p.name} />)}

      {showLoading &&
        Array.from({ length: skeletonCount }).map((_, i) => (
          <PokemonCardSkeleton key={`skeleton-${i}`} />
        ))}
    </div>
  );
}
