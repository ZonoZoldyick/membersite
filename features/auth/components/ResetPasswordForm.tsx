"use client";

import { useActionState } from "react";
import {
  requestPasswordReset,
  updatePassword,
  type AuthActionState,
} from "../actions";
import { useAuth } from "../hooks/useAuth";

const initialState: AuthActionState = {
  error: "",
  success: "",
};

export function ResetPasswordForm() {
  const { session } = useAuth();
  const [requestState, requestFormAction, requestPending] = useActionState(
    requestPasswordReset,
    initialState,
  );
  const [updateState, updateFormAction, updatePending] = useActionState(
    updatePassword,
    initialState,
  );
  const state = session ? updateState : requestState;
  const formAction = session ? updateFormAction : requestFormAction;
  const pending = session ? updatePending : requestPending;

  return (
    <form action={formAction} className="space-y-4">
      {!session ? (
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
      ) : (
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">
            New password
          </span>
          <input
            required
            minLength={8}
            name="password"
            type="password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
        </label>
      )}
      {state.error ? (
        <p className="text-sm text-rose-600">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-emerald-600">{state.success}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {pending
          ? "Submitting..."
          : session
            ? "Update password"
            : "Send reset email"}
      </button>
    </form>
  );
}
