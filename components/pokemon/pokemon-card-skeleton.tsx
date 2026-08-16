import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface PokemonCardSkeletonProps {
  className?: string;
}

export function PokemonCardSkeleton({ className }: PokemonCardSkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border bg-card p-5 shadow-sm",
        className,
      )}
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-28 rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12 rounded-md" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex aspect-square items-center justify-center p-4">
        <Skeleton className="absolute inset-0 m-auto h-[80%] w-[80%] rounded-full opacity-50" />
      </div>

      <div className="mt-2 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}
