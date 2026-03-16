import { AuthCard } from "@/features/auth/components/AuthCard";
import { SignupForm } from "@/features/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
      <AuthCard
        title="Create your account"
        description="Register with email and password. New accounts start in pending status until approved."
      >
        <SignupForm />
      </AuthCard>
    </main>
  );
}

