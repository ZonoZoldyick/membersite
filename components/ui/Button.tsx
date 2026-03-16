import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "ghost" | "outline" | "primary" | "secondary";
type ButtonSize = "md" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  ghost:
    "bg-transparent text-[var(--muted)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]",
  outline:
    "border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--foreground)] hover:bg-[var(--secondary)]",
  primary:
    "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-95",
  secondary:
    "bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[#dde7d8]",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-4 py-3 text-sm",
  sm: "px-3 py-2 text-xs",
};

export function Button({
  children,
  className = "",
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-2xl font-medium transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

