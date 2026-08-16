import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/portal";
import { navLinks } from "@/components/header";
import { XIcon, MenuIcon, Scale } from "lucide-react";
import Link from "next/link";
import { usePokemonStore } from "@/hooks/usePokemonStore";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const compareQueue = usePokemonStore((state) => state.compareQueue);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        {open ? (
          <XIcon className="h-5 w-5" />
        ) : (
          <MenuIcon className="h-5 w-5" />
        )}
      </Button>
      {open && (
        <Portal className="top-16" id="mobile-menu">
          <PortalBackdrop />
          <div
            className={cn(
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
              "size-full p-4 bg-background",
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="grid gap-y-2">
              {navLinks.map((link) => (
                <Button
                  className="justify-start"
                  key={link.label}
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setOpen(false)}
              >
                <Scale className="h-4 w-4" />
                Compare{" "}
                {mounted && compareQueue.length > 0
                  ? `(${compareQueue.length})`
                  : ""}
              </Button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
