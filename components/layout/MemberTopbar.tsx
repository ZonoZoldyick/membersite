import { LogoutButton } from "@/features/auth/components/LogoutButton";

type MemberTopbarProps = {
  displayName: string;
  email: string | null;
};

export function MemberTopbar({ displayName, email }: MemberTopbarProps) {
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-10 mb-8 rounded-[28px] border border-[var(--border)] bg-[rgba(251,252,248,0.92)] p-4 shadow-[var(--shadow)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3">
          <span className="text-sm font-medium text-[var(--muted)]">Search</span>
          <input
            type="search"
            placeholder="Search members, products, events..."
            className="w-full min-w-0 border-none bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
          />
        </label>

        <div className="flex items-center gap-3 self-end lg:self-auto">
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] text-sm font-semibold text-[var(--foreground)]"
            aria-label="Notifications"
          >
            3
          </button>
          <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)]">
              {initials || "MS"}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                {displayName}
              </p>
              <p className="truncate text-xs text-[var(--muted)]">{email ?? "Member"}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}

