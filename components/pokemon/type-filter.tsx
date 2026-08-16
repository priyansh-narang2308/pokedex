"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { POKEMON_TYPE_COLORS, getPokemonColor } from "@/lib/colors";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useSelectContext,
} from "@/components/motion/select";
import { useEffect, useRef } from "react";

const types = Object.keys(POKEMON_TYPE_COLORS);

function ScrollContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  const ctx = useSelectContext("ScrollContainer");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ctx.open && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [ctx.open]);

  return (
    <div ref={scrollRef} className={className}>
      {children}
    </div>
  );
}

export function TypeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type")?.toLowerCase() || "all";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  const onValueChange = (value: string) => {
    router.push(`${pathname}?${createQueryString("type", value)}`, {
      scroll: false,
    });
  };

  return (
    <div className="w-full xl:w-52">
      <Select value={currentType} onValueChange={onValueChange}>
        <SelectTrigger className="h-12 w-full cursor-pointer rounded-full border-white/20 bg-white/10 pl-5 pr-5 text-sm font-bold capitalize tracking-wide shadow-sm backdrop-blur-xl transition-all hover:bg-white/20 focus-visible:ring-primary dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent className="rounded-[1.5rem] border border-white/20 bg-background/80 p-2 shadow-2xl backdrop-blur-3xl dark:border-white/10 dark:bg-black/80">
          <ScrollContainer className="flex max-h-60 flex-col gap-1 overflow-y-auto overscroll-contain pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20">
            <SelectItem
              value="all"
              className="cursor-pointer rounded-xl px-4 py-3 font-bold transition-all hover:bg-white/10 dark:hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-foreground/30 shadow-sm" />
                <span className="text-foreground">All Types</span>
              </div>
            </SelectItem>
            {types.map((type) => {
              const color = getPokemonColor(type);
              return (
                <SelectItem
                  key={type}
                  value={type}
                  className="cursor-pointer rounded-xl px-4 py-3 font-bold capitalize transition-all hover:bg-white/10 dark:hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span style={{ color }}>{type}</span>
                  </div>
                </SelectItem>
              );
            })}
          </ScrollContainer>
        </SelectContent>
      </Select>
    </div>
  );
}
