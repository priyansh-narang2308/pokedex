"use client";

import { usePokemons } from "@/hooks/usePokemons";
import { useAllPokemons } from "@/hooks/useAllPokemons";
import { PokemonGrid } from "@/components/pokemon/pokemon-grid";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMemo, Suspense } from "react";
import { SearchBar } from "@/components/pokemon/search-bar";
import { useSearchParams } from "next/navigation";

function ExplorerContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase().trim() || "";

  const {
    data: paginatedData,
    isLoading: isPaginatedLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError: isPaginatedError,
  } = usePokemons();

  const {
    data: allNamesData,
    isLoading: isAllNamesLoading,
    isError: isAllNamesError,
  } = useAllPokemons();

  const allPokemons = useMemo(() => {
    if (!paginatedData) return [];
    return paginatedData.pages.flatMap((page) => page.results);
  }, [paginatedData]);

  if (search) {
    if (isAllNamesLoading) {
      return (
        <div className="mt-8">
          <PokemonGrid pokemons={[]} isLoading={true} skeletonCount={8} />
        </div>
      );
    }

    if (isAllNamesError || !allNamesData) {
      return (
        <div className="mt-8 rounded-[2rem] border border-destructive/20 bg-destructive/10 p-12 text-center text-destructive backdrop-blur-xl">
          <h3 className="text-xl font-bold">Oops! Something went wrong.</h3>
          <p className="mt-2 text-sm">
            Failed to search Pokémon. Please try again later.
          </p>
        </div>
      );
    }

    // Filter the full list by the search string
    const matches = allNamesData.results.filter(
      (p) =>
        p.name.includes(search) ||
        p.url.split("/").filter(Boolean).pop() === search, // support ID search too
    );

    // Limit to 50 so we don't render/fetch too many cards at once
    const limitedMatches = matches.slice(0, 50);

    if (limitedMatches.length === 0) {
      return (
        <div className="mt-8 rounded-[2rem] border border-destructive/20 bg-destructive/10 p-12 text-center text-destructive backdrop-blur-xl">
          <h3 className="text-xl font-bold">Pokémon not found</h3>
          <p className="mt-2 text-muted-foreground">
            We couldn&apos;t find a Pokémon matching &quot;{search}&quot;. Try
            searching for another one!
          </p>
        </div>
      );
    }

    // Success state for search
    return (
      <div className="mt-8">
        <PokemonGrid pokemons={limitedMatches} isLoading={false} />
      </div>
    );
  }

  // Normal grid
  if (isPaginatedError) {
    return (
      <div className="mt-8 rounded-[2rem] border border-destructive/20 bg-destructive/10 p-12 text-center text-destructive backdrop-blur-xl">
        <h3 className="text-xl font-bold">Oops! Something went wrong.</h3>
        <p className="mt-2 text-sm">
          Failed to load Pokémon. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8">
        <PokemonGrid
          pokemons={allPokemons}
          isLoading={isPaginatedLoading}
          skeletonCount={20}
        />
      </div>

      {hasNextPage && (
        <div className="mt-12 flex justify-center pb-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage || isPaginatedLoading}
            className="w-full rounded-full cursor-pointer border-white/20 bg-white/5 px-12 font-bold shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white/10 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30 sm:w-auto"
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
  );
}

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
          Explore Pokémon
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Search and filter through the complete Pokédex. Find your favorites,
          check their stats, and build your dream team.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-14 w-full max-w-md animate-pulse rounded-full border border-white/20 bg-white/10 backdrop-blur-xl" />
        }
      >
        <div className="relative z-20 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar />
          {/* Type Filter will go here */}
        </div>
        <ExplorerContent />
      </Suspense>
    </div>
  );
}
