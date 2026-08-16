import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { PokemonDetail } from "@/hooks/usePokemonDetail";
import { TypeBadge } from "@/components/pokemon/type-badge";
import { getPokemonColor, getStatColor } from "@/lib/colors";

async function getPokemon(name: string) {
  try {
    return await fetchApi<PokemonDetail>(`/pokemon/${name.toLowerCase()}`);
  } catch {
    return null;
  }
}

export default async function PokemonPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const pokemon = await getPokemon(resolvedParams.name);

  if (!pokemon) {
    notFound();
  }

  const primaryType = pokemon.types[0].type.name;
  const mainColor = getPokemonColor(primaryType);
  const formattedId = `#${pokemon.id.toString().padStart(3, "0")}`;
  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  return (
    <div className="relative min-h-screen pb-20">
      <div
        className="fixed inset-0 z-0 opacity-20 blur-[120px] transition-colors duration-1000"
        style={{ backgroundColor: mainColor }}
      />

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-md transition-colors hover:bg-white/10 dark:hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Pokédex
        </Link>

        <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col items-center justify-center rounded-[3rem] border border-white/20 bg-white/10 p-12 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20">
            <h1 className="text-center text-5xl font-black capitalize tracking-tight drop-shadow-sm sm:text-6xl">
              {pokemon.name}
            </h1>
            <span className="mt-4 font-mono text-xl font-bold text-muted-foreground">
              {formattedId}
            </span>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {pokemon.types.map((t) => (
                <TypeBadge
                  key={t.type.name}
                  type={t.type.name}
                  className="px-4 py-1.5 text-sm shadow-sm"
                />
              ))}
            </div>

            <div className="relative mt-12 flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
              <div
                className="absolute inset-0 m-auto h-[70%] w-[70%] rounded-full opacity-30 blur-3xl transition-colors duration-500"
                style={{ backgroundColor: mainColor }}
              />
              <Image
                src={imageUrl}
                alt={pokemon.name}
                fill
                className="relative z-20 object-contain drop-shadow-2xl transition-transform hover:scale-105"
                unoptimized
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="rounded-[2.5rem] border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20">
              <h3 className="mb-4 text-lg font-black uppercase tracking-wider">
                Abilities
              </h3>
              <div className="flex flex-wrap gap-3">
                {pokemon.abilities.map((a) => (
                  <div
                    key={a.ability.name}
                    className={`flex items-center rounded-2xl px-4 py-2 font-bold capitalize shadow-sm ${
                      a.is_hidden
                        ? "border border-dashed border-foreground/30 bg-transparent text-foreground/70"
                        : "bg-white/20 text-foreground dark:bg-white/10"
                    }`}
                  >
                    {a.ability.name.replace("-", " ")}
                    {a.is_hidden && (
                      <span className="ml-2 text-xs font-semibold opacity-70">
                        (Hidden)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20">
              <h3 className="mb-6 text-lg font-black uppercase tracking-wider">
                Base Stats
              </h3>
              <div className="flex flex-col gap-5">
                {pokemon.stats.map((s) => {
                  const statName = s.stat.name.replace("special-", "Sp. ");
                  const percentage = Math.min(100, (s.base_stat / 255) * 100);

                  return (
                    <div key={s.stat.name} className="flex items-center gap-4">
                      <span className="w-24 shrink-0 text-xs font-black uppercase tracking-wider text-muted-foreground">
                        {statName}
                      </span>
                      <span className="w-8 shrink-0 text-right font-mono font-bold">
                        {s.base_stat}
                      </span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-black/10 shadow-inner dark:bg-white/10">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: getStatColor(s.stat.name),
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
