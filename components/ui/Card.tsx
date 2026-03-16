import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  description?: string;
  title?: string;
};

export function Card({ children, className = "", description, title }: CardProps) {
  return (
    <section
      className={`rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-[var(--shadow)] ${className}`.trim()}
    >
      {title ? (
        <header className="mb-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

