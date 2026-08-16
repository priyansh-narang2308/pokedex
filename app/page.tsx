"use client";

import { usePokemons } from "@/hooks/usePokemons";
import { SortFilter } from "@/components/pokemon/sort-filter";
import { useAllPokemons } from "@/hooks/useAllPokemons";
import { usePokemonByType } from "@/hooks/usePokemonByType";
import { PokemonGrid } from "@/components/pokemon/pokemon-grid";
import { EmptyState } from "@/components/pokemon/empty-state";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, Sparkles } from "lucide-react";
import { useMemo, Suspense } from "react";
import { SearchBar } from "@/components/pokemon/search-bar";
import { TypeFilter } from "@/components/pokemon/type-filter";
import { useSearchParams } from "next/navigation";
import { usePokemonStore } from "@/hooks/usePokemonStore";
import Link from "next/link";

function ExplorerContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase().trim() || "";
  const typeParam = searchParams.get("type")?.toLowerCase().trim() || "";
  const tabParam = searchParams.get("tab")?.toLowerCase().trim() || "";

  const favorites = usePokemonStore((state) => state.favorites);
  const favoriteList = useMemo(() => Object.values(favorites), [favorites]);

  // 1. Normal paginated fetching
  const {
    data: paginatedData,
    isLoading: isPaginatedLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError: isPaginatedError,
    refetch: refetchPaginated,
  } = usePokemons();

  // 2. Fetch lightweight list of all pokemon names for instant partial search
  const {
    data: allNamesData,
    isLoading: isAllNamesLoading,
    isError: isAllNamesError,
    refetch: refetchAllNames,
  } = useAllPokemons();

  // 3. Fetch list of pokemon by type
  const {
    data: typeData,
    isLoading: isTypeLoading,
    isError: isTypeError,
    refetch: refetchType,
  } = usePokemonByType(typeParam);

  const allPokemons = useMemo(() => {
    if (!paginatedData) return [];
    return paginatedData.pages.flatMap((page) => page.results);
  }, [paginatedData]);

  // SCENARIO 0: FAVORITES TAB ACTIVE
  if (tabParam === "favorites") {
    if (favoriteList.length === 0) {
      return <EmptyState type="favorites" />;
    }

    let filteredFavorites = favoriteList;

    // Apply search filter if active
    if (search) {
      filteredFavorites = filteredFavorites.filter(
        (p) =>
          p.name.toLowerCase().includes(search) || p.id.toString() === search,
      );
    }

    // Apply type filter if active
    if (typeParam) {
      filteredFavorites = filteredFavorites.filter((p) =>
        p.types.includes(typeParam),
      );
    }

    if (filteredFavorites.length === 0) {
      return (
        <EmptyState
          type="filter"
          title="No favorites match your filter"
          description={`None of your ${favoriteList.length} favorite Pokémon match your current search or type filter.`}
          actionText="Clear Filters"
          actionHref="/?tab=favorites"
        />
      );
    }

    return (
      <div className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            <h2 className="text-xl font-black">
              Your Favorites ({filteredFavorites.length})
            </h2>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to All Pokémon
          </Link>
        </div>
        <PokemonGrid pokemons={filteredFavorites} isLoading={false} />
      </div>
    );
  }

  // SCENARIO A: Type Filter is Active (Search may or may not be active)
  if (typeParam) {
    if (isTypeLoading) {
      return (
        <div className="mt-8">
          <PokemonGrid pokemons={[]} isLoading={true} skeletonCount={20} />
        </div>
      );
    }

    if (isTypeError || !typeData) {
      return (
        <EmptyState
          type="error"
          title={`Failed to load ${typeParam}-type Pokémon`}
          onAction={() => refetchType()}
        />
      );
    }

    // If search is also present, filter the typedata by search
    let matches = typeData;
    if (search) {
      matches = typeData.filter(
        (p) =>
          p.name.includes(search) ||
          p.url.split("/").filter(Boolean).pop() === search,
      );
    }

    const limitedMatches = matches.slice(0, 60);

    if (limitedMatches.length === 0) {
      return (
        <EmptyState
          type="filter"
          title="Pokémon not found"
          description={`We couldn't find any ${typeParam}-type Pokémon matching "${search}".`}
          actionText="Clear Filters"
          actionHref="/"
        />
      );
    }

    return (
      <div className="mt-8">
        <PokemonGrid pokemons={limitedMatches} isLoading={false} />
      </div>
    );
  }

  // SCENARIO B: ONLY Search is Active (No Type Filter)
  if (search) {
    if (isAllNamesLoading) {
      return (
        <div className="mt-8">
          <PokemonGrid pokemons={[]} isLoading={true} skeletonCount={12} />
        </div>
      );
    }

    if (isAllNamesError || !allNamesData) {
      return (
        <EmptyState
          type="error"
          title="Search Failed"
          description="Failed to search Pokémon. Please check your internet connection."
          onAction={() => refetchAllNames()}
        />
      );
    }

    const matches = allNamesData.results.filter(
      (p) =>
        p.name.includes(search) ||
        p.url.split("/").filter(Boolean).pop() === search,
    );

    const limitedMatches = matches.slice(0, 60);

    if (limitedMatches.length === 0) {
      return (
        <EmptyState
          type="search"
          title="Pokémon not found"
          description={`We couldn't find any Pokémon matching "${search}". Try searching for another name or number!`}
          actionText="View All Pokémon"
          actionHref="/"
        />
      );
    }

    return (
      <div className="mt-8">
        <PokemonGrid pokemons={limitedMatches} isLoading={false} />
      </div>
    );
  }

  // SCENARIO C: Default Paginated Grid
  if (isPaginatedError) {
    return (
      <EmptyState
        type="error"
        title="Failed to load Pokédex"
        onAction={() => refetchPaginated()}
      />
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
            className="w-full cursor-pointer rounded-full border-white/20 bg-white/5 px-12 font-bold shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white/10 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30 sm:w-auto"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading Pokémon...
              </>
            ) : (
              <>
                Load More Pokémon
              </>
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
        <div className="relative z-20 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <SearchBar />
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <TypeFilter />
            <SortFilter />
          </div>
        </div>
        <ExplorerContent />
      </Suspense>
    </div>
  );
}
