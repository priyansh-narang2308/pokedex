"use client";

import { usePokemons } from "@/hooks/usePokemons";
import { PokemonGrid } from "@/components/pokemon/pokemon-grid";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

export default function Home() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = usePokemons();

  const allPokemons = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.results);
  }, [data]);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Explore Pokémon</h1>
        <p className="text-muted-foreground">
          Search and filter through the complete Pokédex.
        </p>
      </div>

      {isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
          <h3 className="font-semibold">Oops! Something went wrong.</h3>
          <p className="text-sm mt-1">
            Failed to load Pokémon. Please try again later.
          </p>
        </div>
      ) : (
        <>
          <PokemonGrid
            pokemons={allPokemons}
            isLoading={isLoading}
            skeletonCount={20}
          />

          {hasNextPage && (
            <div className="mt-8 flex justify-center pb-8">
              <Button
                variant="outline"
                size="lg"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage || isLoading}
                className="w-full cursor-pointer rounded-full px-12 sm:w-auto font-medium"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Pokémon"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
