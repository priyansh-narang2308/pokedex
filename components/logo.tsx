import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-bold text-xl tracking-tight", className)}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 text-red-500"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
        <path d="M2 12h8" />
        <path d="M14 12h8" />
      </svg>
      <span>PokéExplorer</span>
    </div>
  );
}
