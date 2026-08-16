"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";

export const SORT_OPTIONS = [
  { value: "id-asc", label: "Lowest Number (First)" },
  { value: "id-desc", label: "Highest Number (First)" },
  { value: "name-asc", label: "A-Z" },
  { value: "name-desc", label: "Z-A" },
  { value: "attack-desc", label: "Highest Attack" },
  { value: "speed-desc", label: "Highest Speed" },
  { value: "hp-desc", label: "Highest HP" },
];

export function SortFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "id-asc";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "id-asc") {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  const onValueChange = (value: string) => {
    router.push(`${pathname}?${createQueryString("sort", value)}`, {
      scroll: false,
    });
  };

  return (
    <div className="w-full xl:w-56">
      <Select value={currentSort} onValueChange={onValueChange}>
        <SelectTrigger className="h-12 w-full cursor-pointer rounded-full border-white/20 bg-white/10 pl-5 pr-5 text-sm font-bold tracking-wide shadow-sm backdrop-blur-xl transition-all hover:bg-white/20 focus-visible:ring-primary dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent className="rounded-[1.5rem] border border-white/20 bg-background/80 p-2 shadow-2xl backdrop-blur-3xl dark:border-white/10 dark:bg-black/80">
          <div className="flex max-h-60 flex-col gap-1 overflow-y-auto overscroll-contain pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/20">
            {SORT_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer rounded-xl px-4 py-3 font-bold transition-all hover:bg-white/10 dark:hover:bg-white/10"
              >
                {option.label}
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
