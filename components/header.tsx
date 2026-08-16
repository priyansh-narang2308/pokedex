/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { Scale } from "lucide-react";
import { usePokemonStore } from "@/hooks/usePokemonStore";
import { useEffect, useState } from "react";

export const navLinks = [
  {
    label: "Explore",
    href: "/",
  },
  {
    label: "Favorites",
    href: "/?tab=favorites",
  },
];

export function Header() {
  const scrolled = useScroll(10);
  const compareQueue = usePokemonStore((state) => state.compareQueue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-5xl border-transparent border-b md:rounded-b-2xl md:border md:transition-all md:ease-out",
        {
          "border-border bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/50 md:top-2 md:shadow-sm":
            scrolled,
        },
      )}
    >
      <nav
        className={cn(
          "flex h-16 w-full items-center justify-between px-4 md:h-14 md:transition-all md:ease-out",
          {
            "md:px-4": scrolled,
          },
        )}
      >
        <Link
          className="rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50 transition-colors"
          href="/"
        >
          <Logo />
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-1 mr-2">
            {navLinks.map((link) => (
              <Button key={link.label} size="sm" variant="ghost">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>

          <Button size="sm" variant="outline" className="gap-2 relative">
            <Scale className="h-4 w-4" />
            Compare
            {mounted && compareQueue.length > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {compareQueue.length}
              </span>
            )}
          </Button>

          <ModeToggle />
        </div>
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
