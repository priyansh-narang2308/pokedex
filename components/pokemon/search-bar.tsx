"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [query, setQuery] = useState(initialSearch);
  const debouncedQuery = useDebounce(query, 500);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (debouncedQuery !== currentSearch) {
      router.push(
        `${pathname}?${createQueryString("search", debouncedQuery)}`,
        {
          scroll: false,
        },
      );
    }
  }, [debouncedQuery, pathname, router, createQueryString, searchParams]);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (currentSearch !== query) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(currentSearch);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <Input
        type="text"
        placeholder="Search Pokémon by name or ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-12 w-full rounded-full border-white/20 bg-white/10 pl-10 pr-10 text-sm shadow-sm backdrop-blur-xl transition-all placeholder:text-muted-foreground/70 hover:bg-white/20 focus-visible:ring-primary dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1.5 text-muted-foreground backdrop-blur-md transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </div>
  );
}
