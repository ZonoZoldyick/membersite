"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type AuthActionState } from "../actions";

const initialState: AuthActionState = {
  error: "",
  success: "",
};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Display name
        </span>
        <input
          required
          name="displayName"
          type="text"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
        />
      </label>
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
          minLength={8}
          name="password"
          type="password"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-rose-600">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {pending ? "Creating account..." : "Sign up"}
      </button>
      <p className="text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-slate-900">
          Login
        </Link>
      </p>
    </form>
  );
}
