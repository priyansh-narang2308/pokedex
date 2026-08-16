"use client";

import { usePokemonStore } from "@/hooks/usePokemonStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPokemonColor } from "@/lib/colors";
import { usePathname } from "next/navigation";

export function CompareDock() {
  const compareQueue = usePokemonStore((state) => state.compareQueue);
  const removeFromCompare = usePokemonStore((state) => state.removeFromCompare);
  const clearCompare = usePokemonStore((state) => state.clearCompare);
  const pathname = usePathname();

  if (pathname === "/compare") return null;

  return (
    <AnimatePresence>
      {compareQueue.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-0 right-0 z-50 mx-auto w-full max-w-lg px-4"
        >
          <div className="flex items-center justify-between rounded-full border border-white/20 bg-background/80 p-3 shadow-2xl backdrop-blur-3xl dark:border-white/10 dark:bg-black/80">
            <div className="flex items-center gap-3 pl-2">
              {compareQueue.map((p) => {
                const color = getPokemonColor(p.types[0]);
                return (
                  <div key={p.id} className="relative group">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 shadow-inner backdrop-blur-md transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `${color}30` }}
                    >
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={40}
                        height={40}
                        className="object-contain drop-shadow-md"
                        unoptimized
                      />
                    </div>
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="absolute cursor-pointer -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
              {compareQueue.length === 1 && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-muted-foreground/30 bg-muted/10">
                  <span className="text-xs font-semibold text-muted-foreground opacity-70">
                    Add 1
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pr-1">
              <button
                onClick={clearCompare}
                className="rounded-full cursor-pointer px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
              >
                Clear
              </button>
              <Link href="/compare">
                <Button
                  disabled={compareQueue.length < 2}
                  className="rounded-full cursor-pointer font-bold shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                >
                  <Scale className="mr-2 h-4 w-4" />
                  Compare
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
