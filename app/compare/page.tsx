"use client";

import { usePokemonStore } from "@/hooks/usePokemonStore";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getPokemonColor } from "@/lib/colors";
import { TypeBadge } from "@/components/pokemon/type-badge";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export default function ComparePage() {
  const compareQueue = usePokemonStore((state) => state.compareQueue);
  const router = useRouter();

  useEffect(() => {
    if (compareQueue.length < 2) {
      router.push("/");
    }
  }, [compareQueue, router]);

  const p1Name = compareQueue[0]?.name;
  const p2Name = compareQueue[1]?.name;

  const { data: p1, isLoading: loading1 } = usePokemonDetail(p1Name || "");
  const { data: p2, isLoading: loading2 } = usePokemonDetail(p2Name || "");

  if (compareQueue.length < 2) return null;

  if (loading1 || loading2) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  if (!p1 || !p2) return null;

  const c1 = getPokemonColor(p1.types[0].type.name);
  const c2 = getPokemonColor(p2.types[0].type.name);

  const img1 =
    p1.sprites.other["official-artwork"].front_default ||
    p1.sprites.front_default;
  const img2 =
    p2.sprites.other["official-artwork"].front_default ||
    p2.sprites.front_default;

  const stats = p1.stats.map((s1, index) => {
    const s2 = p2.stats[index];
    const statName = s1.stat.name.replace("special-", "Sp. ");

    let winner = 0; // 0 tie, 1 left, 2 right
    if (s1.base_stat > s2.base_stat) winner = 1;
    else if (s2.base_stat > s1.base_stat) winner = 2;

    const maxStat = Math.max(s1.base_stat, s2.base_stat, 150);
    const p1Pct = (s1.base_stat / maxStat) * 100;
    const p2Pct = (s2.base_stat / maxStat) * 100;

    return {
      name: statName,
      key: s1.stat.name,
      val1: s1.base_stat,
      val2: s2.base_stat,
      p1Pct,
      p2Pct,
      winner,
    };
  });

  return (
    <div className="relative -mt-4 pb-20">
      <div className="fixed inset-0 z-0 flex">
        <div
          className="h-full w-1/2 opacity-20 blur-[120px] transition-colors duration-1000"
          style={{ backgroundColor: c1 }}
        />
        <div
          className="h-full w-1/2 opacity-20 blur-[120px] transition-colors duration-1000"
          style={{ backgroundColor: c2 }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl pt-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-md transition-colors hover:bg-white/10 dark:hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Pokédex
        </Link>

        <div className="mt-8 grid grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col items-center justify-center rounded-[3rem] border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20">
            <h2 className="text-3xl font-black capitalize tracking-tight sm:text-5xl">
              {p1.name}
            </h2>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {p1.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </div>
            <div className="relative mt-8 flex h-40 w-40 items-center justify-center sm:h-64 sm:w-64">
              <Image
                src={img1}
                alt={p1.name}
                fill
                className="object-contain drop-shadow-2xl"
                unoptimized
              />
            </div>
            <div className="mt-6 flex gap-6 text-sm font-bold text-muted-foreground">
              <span>{p1.height / 10}m</span>
              <span>{p1.weight / 10}kg</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-[3rem] border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20">
            <h2 className="text-3xl font-black capitalize tracking-tight sm:text-5xl">
              {p2.name}
            </h2>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {p2.types.map((t) => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </div>
            <div className="relative mt-8 flex h-40 w-40 items-center justify-center sm:h-64 sm:w-64">
              <Image
                src={img2}
                alt={p2.name}
                fill
                className="object-contain drop-shadow-2xl"
                unoptimized
              />
            </div>
            <div className="mt-6 flex gap-6 text-sm font-bold text-muted-foreground">
              <span>{p2.height / 10}m</span>
              <span>{p2.weight / 10}kg</span>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-80 -translate-x-1/2 -translate-y-1/2 z-20 flex h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-foreground text-xl font-black italic text-background shadow-2xl md:h-20 md:w-20 md:text-3xl">
          VS
        </div>

        <div className="mt-12 rounded-[2.5rem] border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20 md:p-12">
          <h3 className="mb-10 text-center text-2xl font-black uppercase tracking-wider">
            Head to Head Stats
          </h3>
          <div className="flex flex-col gap-8">
            {stats.map((stat) => (
              <div key={stat.key} className="flex items-center gap-4">
                <div className="flex flex-1 items-center justify-end gap-3">
                  <span
                    className={cn(
                      "font-mono font-bold transition-all",
                      stat.winner === 1
                        ? "text-xl text-foreground"
                        : "text-sm text-muted-foreground",
                    )}
                  >
                    {stat.val1}
                  </span>
                  <div className="flex h-4 w-full max-w-50 justify-end overflow-hidden rounded-full bg-black/10 shadow-inner dark:bg-white/10 sm:max-w-75">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${stat.p1Pct}%`,
                        backgroundColor: stat.winner === 1 ? c1 : "#52525b",
                      }}
                    />
                  </div>
                </div>

                <div className="w-24 shrink-0 text-center text-xs font-black uppercase tracking-wider text-muted-foreground md:w-32 md:text-sm">
                  {stat.name}
                </div>

                <div className="flex flex-1 items-center justify-start gap-3">
                  <div className="flex h-4 w-full max-w-50 justify-start overflow-hidden rounded-full bg-black/10 shadow-inner dark:bg-white/10 sm:max-w-75">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${stat.p2Pct}%`,
                        backgroundColor: stat.winner === 2 ? c2 : "#52525b",
                      }}
                    />
                  </div>
                  <span
                    className={cn(
                      "font-mono font-bold transition-all",
                      stat.winner === 2
                        ? "text-xl text-foreground"
                        : "text-sm text-muted-foreground",
                    )}
                  >
                    {stat.val2}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
