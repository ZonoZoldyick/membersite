import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <AuthCard
        title="Login"
        description="Sign in with your email and password to access the member community."
      >
        <LoginForm />
      </AuthCard>
    </main>
  );
}

