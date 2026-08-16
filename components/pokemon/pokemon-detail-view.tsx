"use client";

import { PokemonDetail } from "@/hooks/usePokemonDetail";
import { TypeBadge } from "@/components/pokemon/type-badge";
import { getPokemonColor, getStatColor } from "@/lib/colors";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Heart, Scale } from "lucide-react";
import { usePokemonStore } from "@/hooks/usePokemonStore";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/toast-provider";

interface PokemonDetailViewProps {
  pokemon: PokemonDetail;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 22,
    },
  },
};

export function PokemonDetailView({ pokemon }: PokemonDetailViewProps) {
  const favorites = usePokemonStore((state) => state.favorites);
  const toggleFavorite = usePokemonStore((state) => state.toggleFavorite);
  const compareQueue = usePokemonStore((state) => state.compareQueue);
  const addToCompare = usePokemonStore((state) => state.addToCompare);
  const removeFromCompare = usePokemonStore((state) => state.removeFromCompare);
  const { showToast } = useToast() || {};

  const isFavorite = !!favorites[pokemon.id];
  const isInCompare = compareQueue.some((p) => p.id === pokemon.id);

  const primaryType = pokemon.types[0]?.type.name || "normal";
  const mainColor = getPokemonColor(primaryType);
  const formattedId = `#${pokemon.id.toString().padStart(3, "0")}`;
  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default ||
    "/placeholder.svg";

  const handleFavoriteToggle = () => {
    toggleFavorite({
      id: pokemon.id,
      name: pokemon.name,
      image: imageUrl,
      types: pokemon.types.map((t) => t.type.name),
    });
    if (showToast) {
      showToast({
        status: isFavorite ? "info" : "success",
        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} ${isFavorite ? "removed from" : "added to"} your collection.`,
      });
    }
  };

  const handleCompareToggle = () => {
    if (isInCompare) {
      removeFromCompare(pokemon.id);
      if (showToast) {
        showToast({
          status: "info",
          title: "Removed from Compare",
          description: `${pokemon.name} removed from comparison queue.`,
        });
      }
    } else {
      if (compareQueue.length >= 2) {
        if (showToast) {
          showToast({
            status: "error",
            title: "Comparison limit reached",
            description:
              "You can only compare 2 Pokémon at a time. Remove one first.",
          });
        }
        return;
      }
      addToCompare({
        id: pokemon.id,
        name: pokemon.name,
        image: imageUrl,
        types: pokemon.types.map((t) => t.type.name),
      });
      if (showToast) {
        showToast({
          status: "success",
          title: "Added to Compare",
          description: `${pokemon.name} added to comparison queue (${compareQueue.length + 1}/2).`,
        });
      }
    }
  };

  const topMoves = pokemon.moves?.slice(0, 12) || [];

  return (
    <div className="relative -mt-4 pb-20">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-25 blur-[140px] transition-colors duration-1000"
        style={{ backgroundColor: mainColor }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl pt-0">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col gap-5"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleFavoriteToggle}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-md transition-all hover:scale-105 cursor-pointer",
                  isFavorite
                    ? "border-red-500/40 bg-red-500/20 text-red-500"
                    : "border-white/20 bg-white/10 text-foreground hover:bg-white/20 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30",
                )}
              >
                <Heart
                  className={cn("h-4 w-4", isFavorite && "fill-current")}
                />
                <span>{isFavorite ? "Favorited" : "Favorite"}</span>
              </button>

              <button
                onClick={handleCompareToggle}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-md transition-all hover:scale-105 cursor-pointer",
                  isInCompare
                    ? "border-blue-500/40 bg-blue-500/20 text-blue-500"
                    : "border-white/20 bg-white/10 text-foreground hover:bg-white/20 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30",
                )}
              >
                <Scale className="h-4 w-4" />
                <span>{isInCompare ? "Queued" : "Compare"}</span>
              </button>
            </div>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-12 md:gap-6">
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center rounded-[3rem] border border-white/20 bg-white/10 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20 md:col-span-5"
            >
              <div className="flex flex-col items-center text-center">
                <span className="font-mono text-sm font-bold tracking-widest text-muted-foreground">
                  {formattedId}
                </span>
                <h1 className="mt-1 text-4xl sm:text-5xl font-black capitalize tracking-tight drop-shadow-sm">
                  {pokemon.name}
                </h1>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {pokemon.types.map((t) => (
                    <TypeBadge
                      key={t.type.name}
                      type={t.type.name}
                      className="px-4 py-1.5 text-sm shadow-sm"
                    />
                  ))}
                </div>
              </div>

              <div className="relative my-auto flex h-72 w-72 items-center justify-center py-6 sm:h-84 sm:w-84">
                <div
                  className="absolute inset-0 m-auto h-[85%] w-[85%] rounded-full opacity-35 blur-3xl transition-colors duration-500"
                  style={{ backgroundColor: mainColor }}
                />
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 18,
                    delay: 0.15,
                  }}
                  className="relative z-20 h-full w-full"
                >
                  <Image
                    src={imageUrl}
                    alt={pokemon.name}
                    fill
                    priority
                    className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-105"
                    unoptimized
                  />
                </motion.div>
              </div>
            </motion.div>

            <div className="flex flex-col gap-6 md:col-span-7">
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Height
                  </p>
                  <p className="mt-1 text-3xl font-black">
                    {pokemon.height / 10} m
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Weight
                  </p>
                  <p className="mt-1 text-3xl font-black">
                    {pokemon.weight / 10} kg
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="rounded-[2.5rem] border border-white/20 bg-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20"
              >
                <div className="mb-4 flex items-center gap-2">
                  <h3 className="text-sm font-black uppercase tracking-wider">
                    Abilities
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {pokemon.abilities.map((a) => (
                    <div
                      key={a.ability.name}
                      className={cn(
                        "flex items-center rounded-2xl px-4 py-2 text-sm font-bold capitalize shadow-sm transition-transform hover:scale-105",
                        a.is_hidden
                          ? "border border-dashed border-foreground/30 bg-transparent text-foreground/80"
                          : "bg-white/20 text-foreground dark:bg-white/10",
                      )}
                    >
                      {a.ability.name.replace("-", " ")}
                      {a.is_hidden && (
                        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider opacity-70">
                          (Hidden)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="rounded-[2.5rem] border border-white/20 bg-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black uppercase tracking-wider">
                      Base Stats
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">
                    Total:{" "}
                    {pokemon.stats.reduce(
                      (acc, curr) => acc + curr.base_stat,
                      0,
                    )}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {pokemon.stats.map((s, index) => {
                    const statName = s.stat.name.replace("special-", "Sp. ");
                    const percentage = Math.min(100, (s.base_stat / 255) * 100);
                    const color = getStatColor(s.stat.name);

                    return (
                      <div
                        key={s.stat.name}
                        className="flex items-center gap-4"
                      >
                        <span className="w-24 shrink-0 text-xs font-black uppercase tracking-wider text-muted-foreground">
                          {statName}
                        </span>
                        <span className="w-8 shrink-0 text-right font-mono text-sm font-bold">
                          {s.base_stat}
                        </span>
                        <div className="h-3 flex-1 overflow-hidden rounded-full bg-black/10 shadow-inner dark:bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{
                              duration: 0.8,
                              delay: 0.2 + index * 0.08,
                              ease: [0.25, 1, 0.5, 1],
                            }}
                            className="h-full rounded-full shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {topMoves.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="rounded-[2.5rem] border border-white/20 bg-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black uppercase tracking-wider">
                        Top Moves
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">
                      {pokemon.moves?.length || 0} moves available
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topMoves.map((m) => (
                      <span
                        key={m.move.name}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold capitalize text-foreground/90 backdrop-blur-sm dark:border-white/5 dark:bg-white/5"
                      >
                        {m.move.name.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
