import { cn } from "@/lib/utils";
import { getPokemonColor } from "@/lib/colors";

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const bgColor = getPokemonColor(type);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md transition-transform hover:scale-105",
        className,
      )}
      style={{
        backgroundColor: bgColor,
        border: `1px solid rgba(255, 255, 255, 0.25)`,
        textShadow: "0px 1px 2px rgba(0,0,0,0.5)",
      }}
    >
      {type}
    </span>
  );
}
