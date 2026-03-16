import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  className?: string;
};

export function Badge({ children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground)] ${className}`.trim()}
    >
      {children}
    </span>
  );
}

