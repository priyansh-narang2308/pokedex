"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  value: number;
  type: string;
  maxValue?: number;
  className?: string;
}

export function StatBar({
  label,
  value,
  type,
  maxValue = 255,
  className,
}: StatBarProps) {
  const [progress, setProgress] = useState(0);
  const normalizedType = type.toLowerCase();

  useEffect(() => {
    const timer = setTimeout(() => {
      const percentage = Math.min((value / maxValue) * 100, 100);
      setProgress(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [value, maxValue]);

  return (
    <div className={cn("flex items-center gap-3 text-sm", className)}>
      <span
        className="w-16 sm:w-20 font-medium capitalize text-muted-foreground truncate"
        title={label}
      >
        {label}
      </span>
      <span className="w-8 text-right font-bold tabular-nums">{value}</span>
      <div className="h-2 w-full flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: `var(--color-type-${normalizedType})`,
          }}
        />
      </div>
    </div>
  );
}
