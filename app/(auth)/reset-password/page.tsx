import { AuthCard } from "@/features/auth/components/AuthCard";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <AuthCard
        title="Reset password"
        description="Request a reset email or set a new password after opening the reset link."
      >
        <ResetPasswordForm />
      </AuthCard>
    </main>
  );
}

