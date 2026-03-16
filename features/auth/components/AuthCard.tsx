import type { ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export function AuthCard({ children, description, title }: AuthCardProps) {
  return (
    <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
        membersite
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

