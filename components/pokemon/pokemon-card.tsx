"use client";

import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { PokemonCardSkeleton } from "./pokemon-card-skeleton";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { TypeBadge } from "./type-badge";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePokemonStore } from "@/hooks/usePokemonStore";
import { cn } from "@/lib/utils";

interface PokemonCardProps {
  name: string;
}

export function PokemonCard({ name }: PokemonCardProps) {
  const { data: pokemon, isLoading, isError } = usePokemonDetail(name);
  const favorites = usePokemonStore((state) => state.favorites);
  const toggleFavorite = usePokemonStore((state) => state.toggleFavorite);

  if (isLoading) {
    return <PokemonCardSkeleton />;
  }

  if (isError || !pokemon) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl border bg-destructive/10 p-4 text-center text-destructive shadow-sm">
        <p className="text-sm font-medium">Failed to load {name}</p>
      </div>
    );
  }

  const isFavorite = !!favorites[pokemon.id];

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      id: pokemon.id,
      name: pokemon.name,
      image:
        pokemon.sprites.other["official-artwork"].front_default ||
        "/placeholder.svg",
      types: pokemon.types.map((t) => t.type.name),
    });
  };

  const mainType = pokemon.types[0]?.type.name || "normal";
  const formattedId = `#${pokemon.id.toString().padStart(3, "0")}`;
  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    "/placeholder.svg";

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative h-full"
    >
      <Link href={`/?pokemon=${pokemon.name}`} scroll={false}>
        <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
          <div
            className="absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
            style={{ backgroundColor: `var(--color-type-${mainType})` }}
          />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold capitalize tracking-tight text-foreground">
                {pokemon.name}
              </h2>
              <span className="font-mono text-sm font-medium text-muted-foreground">
                {formattedId}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-colors",
                isFavorite
                  ? "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={handleFavoriteClick}
            >
              <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
            </Button>
          </div>

          <div className="relative z-10 mt-4 flex aspect-square items-center justify-center">
            <div
              className="absolute inset-0 m-auto h-[80%] w-[80%] rounded-full opacity-10 transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundColor: `var(--color-type-${mainType})` }}
            />
            <Image
              src={imageUrl}
              alt={pokemon.name}
              width={200}
              height={200}
              className="relative z-20 object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
              unoptimized
            />
          </div>

          <div className="relative z-10 mt-auto pt-4 flex gap-2">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
