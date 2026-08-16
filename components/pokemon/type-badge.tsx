import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const normalizedType = type.toLowerCase();

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 border-transparent text-white shadow-sm",
        className,
      )}
      style={{ backgroundColor: `var(--color-type-${normalizedType})` }}
    >
      {type}
    </Badge>
  );
}
