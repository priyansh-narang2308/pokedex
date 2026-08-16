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
import { useToast } from "@/components/toast-provider";

export const navLinks = [
  {
    label: "Explore",
    href: "/",
  },
  {
    label: "Favorites",
    href: "/?tab=favorites",
  },
  {
    label: "Compare",
    href: "/compare",
    icon: Scale,
  },
];

export function Header() {
  const scrolled = useScroll(10);
  const compareQueue = usePokemonStore((state) => state.compareQueue);
  const [mounted, setMounted] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (
    e: React.MouseEvent<HTMLAnchorElement>,
    linkLabel: string,
  ) => {
    if (linkLabel === "Compare" && compareQueue.length < 2) {
      e.preventDefault();

      showToast({
        status: "error",
        title: "Cannot compare yet",
        description: "Add at least two Pokémon before comparing.",
      });
    }
  };

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
        {/* Logo */}
        <Link
          className="rounded-md p-2 transition-colors hover:bg-muted dark:hover:bg-muted/50"
          href="/"
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-1 rounded-xl border bg-muted/30 p-1">
            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavigation(e, link.label)}
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    className="relative cursor-pointer gap-2 rounded-lg px-3 transition-all hover:bg-background hover:shadow-sm"
                  >
                    {Icon && <Icon className="h-4 w-4" />}

                    {link.label}

                    {link.label === "Compare" &&
                      mounted &&
                      compareQueue.length > 0 && (
                        <span className="ml-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                          {compareQueue.length}
                        </span>
                      )}
                  </Button>
                </Link>
              );
            })}
          </div>

          <ModeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
