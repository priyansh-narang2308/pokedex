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
import { getPokemonColor } from "@/lib/colors";

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
  const mainColor = getPokemonColor(mainType);
  const formattedId = `#${pokemon.id.toString().padStart(3, "0")}`;
  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    "/placeholder.svg";

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative h-full"
    >
      <Link href={`/?pokemon=${pokemon.name}`} scroll={false}>
        <div className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-5 sm:p-6 shadow-xl backdrop-blur-2xl transition-all duration-300 hover:shadow-2xl hover:bg-white/20 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30">
          <div
            className="absolute inset-x-0 -bottom-10 m-auto h-40 w-40 rounded-full opacity-30 blur-[60px] transition-all duration-500 group-hover:scale-150 group-hover:opacity-50"
            style={{ backgroundColor: mainColor }}
          />

          <div className="relative z-10 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl sm:text-2xl font-black capitalize tracking-tight text-foreground drop-shadow-sm">
                {pokemon.name}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs font-semibold text-muted-foreground/80">
                  {formattedId}
                </span>
                <button
                  className={cn(
                    "relative z-20 flex h-6 w-6 items-center justify-center rounded-full backdrop-blur-md transition-all cursor-pointer hover:scale-110",
                    isFavorite
                      ? "border border-red-500/30 bg-red-500/20 text-red-500"
                      : "border border-black/5 bg-black/5 text-muted-foreground dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10",
                  )}
                  onClick={handleFavoriteClick}
                >
                  <Heart
                    className={cn("h-3 w-3", isFavorite && "fill-current")}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="relative z-10 my-6 flex flex-1 items-center justify-center min-h-30">
            <div
              className="absolute inset-0 m-auto h-25 w-25 rounded-full opacity-15 transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundColor: mainColor }}
            />
            <Image
              src={imageUrl}
              alt={pokemon.name}
              width={140}
              height={140}
              className="relative z-20 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
              unoptimized
            />
          </div>

          <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-2">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
