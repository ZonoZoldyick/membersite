export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          membersite
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900">
          Initial project scaffold
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          This repository is prepared with Next.js, TypeScript, TailwindCSS,
          and the feature-based folder structure described in AGENTS.md.
        </p>
      </section>
    </main>
  );
}

