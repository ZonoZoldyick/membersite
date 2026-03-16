import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Input({ className = "", label, ...props }: InputProps) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block text-sm font-medium text-[var(--foreground)]">
          {label}
        </span>
      ) : null}
      <input
        className={`w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 ${className}`.trim()}
        {...props}
      />
    </label>
  );
}

export function Textarea({ className = "", label, ...props }: TextareaProps) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-2 block text-sm font-medium text-[var(--foreground)]">
          {label}
        </span>
      ) : null}
      <textarea
        className={`min-h-32 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm leading-7 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 ${className}`.trim()}
        {...props}
      />
    </label>
  );
}

