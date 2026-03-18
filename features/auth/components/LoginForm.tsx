"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);
  const redirectedFrom = searchParams.get("redirectedFrom");
  const destination =
    redirectedFrom && redirectedFrom.startsWith("/")
      ? redirectedFrom
      : "/dashboard";
  const error = searchParams.get("error");

  return (
    <form
      action="/api/auth/login"
      className="space-y-4"
      method="post"
      onSubmit={() => {
        setPending(true);
      }}
    >
      <input type="hidden" name="redirectTo" value={destination} />
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </span>
        <input
          required
          name="email"
          type="email"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Password
        </span>
        <input
          required
          name="password"
          type="password"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
        />
      </label>
      {error ? (
        <p className="text-sm text-rose-600">{decodeURIComponent(error)}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {pending ? "Signing in..." : "Login"}
      </button>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <Link href="/signup" className="hover:text-slate-900">
          Create account
        </Link>
        <Link href="/reset-password" className="hover:text-slate-900">
          Reset password
        </Link>
      </div>
    </form>
  );
}
