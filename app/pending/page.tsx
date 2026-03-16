import Link from "next/link";

export default function PendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-xl rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-8 shadow-[var(--shadow)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          membersite
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">
          Account pending approval
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          Your account has been created, but access to the member area will open
          after approval by an administrator or team leader.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)]"
        >
          Back to login
        </Link>
      </section>
    </main>
  );
}
