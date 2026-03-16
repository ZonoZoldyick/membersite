"use client";

import { useTransition } from "react";
import { logout } from "../actions";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await logout();
        });
      }}
      className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}

