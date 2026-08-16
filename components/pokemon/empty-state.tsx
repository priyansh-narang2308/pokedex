"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchX, HeartOff, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  type?: "search" | "favorites" | "filter" | "error";
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  type = "search",
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const getDefaults = () => {
    switch (type) {
      case "favorites":
        return {
          icon: HeartOff,
          title: title || "No favorites yet",
          description:
            description ||
            "You haven't saved any Pokémon to your favorites. Click the heart icon on any card to add them here!",
          actionText: actionText || "Explore Pokédex",
          actionHref: actionHref || "/",
          iconColor: "text-red-500",
          glowColor: "rgba(239, 68, 68, 0.15)",
        };
      case "filter":
        return {
          icon: SearchX,
          title: title || "No Pokémon found",
          description:
            description ||
            "No Pokémon match the selected type and search filters. Try adjusting your search criteria.",
          actionText: actionText || "Clear Filters",
          actionHref: actionHref || "/",
          iconColor: "text-amber-500",
          glowColor: "rgba(245, 158, 11, 0.15)",
        };
      case "error":
        return {
          icon: RefreshCw,
          title: title || "Oops! Something went wrong",
          description:
            description ||
            "We had trouble fetching the Pokémon data from the PokéAPI. Please check your connection and try again.",
          actionText: actionText || "Retry",
          iconColor: "text-destructive",
          glowColor: "rgba(239, 68, 68, 0.15)",
        };
      case "search":
      default:
        return {
          icon: SearchX,
          title: title || "No Pokémon matched your search",
          description:
            description ||
            "We couldn't find any Pokémon matching your search. Check the spelling or try searching by Pokédex number.",
          actionText: actionText || "View All Pokémon",
          actionHref: actionHref || "/",
          iconColor: "text-blue-500",
          glowColor: "rgba(59, 130, 246, 0.15)",
        };
    }
  };

  const config = getDefaults();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(
        "relative mt-8 flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/20 bg-white/10 p-10 text-center shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-black/20 md:p-16",
        className,
      )}
    >
      {/* Ambient Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 m-auto h-48 w-48 rounded-full blur-[70px]"
        style={{ backgroundColor: config.glowColor }}
      />

      {/* Floating Animated Icon */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-white/15 shadow-inner backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
      >
        <Icon className={cn("h-10 w-10", config.iconColor)} />
      </motion.div>

      {/* Texts */}
      <h3 className="relative z-10 text-2xl font-black tracking-tight sm:text-3xl">
        {config.title}
      </h3>
      <p className="relative z-10 mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
        {config.description}
      </p>

      {/* Action Button */}
      <div className="relative z-10 mt-8">
        {actionHref ? (
          <Link href={actionHref}>
            <Button
              size="lg"
              className="cursor-pointer rounded-full font-bold shadow-lg transition-transform hover:scale-105"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {config.actionText}
            </Button>
          </Link>
        ) : onAction ? (
          <Button
            size="lg"
            onClick={onAction}
            className="cursor-pointer rounded-full font-bold shadow-lg transition-transform hover:scale-105"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {config.actionText}
          </Button>
        ) : null}
      </div>
    </motion.div>
  );
}
