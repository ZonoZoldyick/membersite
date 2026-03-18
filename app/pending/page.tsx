import Link from "next/link";

type PendingPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

const statusCopy: Record<
  string,
  {
    description: string;
    title: string;
  }
> = {
  missing_profile: {
    description:
      "Your account exists, but the member profile setup is incomplete. Please contact an administrator.",
    title: "Profile setup incomplete",
  },
  missing_rbac: {
    description:
      "Your account is missing role or membership settings. Please contact an administrator or team leader.",
    title: "Account setup incomplete",
  },
  pending: {
    description:
      "Your account has been created, but access to the member area will open after approval by an administrator or team leader.",
    title: "Account pending approval",
  },
  suspended: {
    description:
      "Your member access is currently suspended. Please contact the community administrator for support.",
    title: "Account suspended",
  },
};

export default async function PendingPage({ searchParams }: PendingPageProps) {
  const resolvedSearchParams = await searchParams;
  const status = resolvedSearchParams?.status ?? "pending";
  const copy = statusCopy[status] ?? statusCopy.pending;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-xl rounded-[28px] border border-[var(--border)] bg-[var(--surface-strong)] p-8 shadow-[var(--shadow)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          membersite
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--foreground)]">
          {copy.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          {copy.description}
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
