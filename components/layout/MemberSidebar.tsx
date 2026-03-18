"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAdmin, isLeader } from "@/lib/rbac/guards";

type MemberSidebarProps = {
  role: string;
};

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: "DG" },
  { href: "/community", label: "Community", icon: "CM" },
  { href: "/products", label: "Products", icon: "PR" },
  { href: "/events", label: "Events", icon: "EV" },
  { href: "/learning", label: "Learning", icon: "LE" },
  { href: "/members", label: "Members", icon: "MB" },
  { href: "/profile", label: "Profile", icon: "PF" },
] as const;

export function MemberSidebar({ role }: MemberSidebarProps) {
  const currentPath = usePathname();
  const showAdmin = isAdmin(role);
  const showApprovals = isLeader(role);

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 border-r border-[var(--border)] bg-[rgba(251,252,248,0.92)] px-5 py-6 backdrop-blur md:block">
      <div className="flex h-full flex-col">
        <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow)]">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            membersite
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Community Hub
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Collaboration, learning, and member activity in one place.
          </p>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive =
                currentPath === item.href || currentPath.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg"
                        : "text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl text-xs font-semibold ${
                        isActive
                          ? "bg-white/16 text-[var(--primary-foreground)]"
                          : "bg-[var(--secondary)] text-[var(--foreground)]"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            {showAdmin ? (
              <li>
                <Link
                  href="/dashboard/admin"
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    currentPath === "/dashboard/admin" ||
                    currentPath.startsWith("/dashboard/admin/")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg"
                      : "text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--secondary)] text-xs font-semibold text-[var(--foreground)]">
                    AD
                  </span>
                  <span>Admin</span>
                </Link>
              </li>
            ) : null}
            {showApprovals ? (
              <li>
                <Link
                  href="/members/approvals"
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    currentPath === "/members/approvals" ||
                    currentPath.startsWith("/members/approvals/")
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg"
                      : "text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--secondary)] text-xs font-semibold text-[var(--foreground)]">
                    AP
                  </span>
                  <span>Approvals</span>
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
