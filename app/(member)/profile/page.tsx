import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  return (
    <div>
      <PageIntro
        title="Profile"
        description="Manage your personal information, products, and event activity from one place."
      />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card title="Profile Information" description="Core member details and editable personal data.">
          <div className="space-y-4 text-sm text-[var(--muted)]">
            <div className="rounded-2xl bg-[var(--secondary)] px-4 py-3">
              Name, bio, and account fields will be connected here.
            </div>
            <div className="rounded-2xl bg-[var(--secondary)] px-4 py-3">
              Role-aware profile controls can be added later.
            </div>
          </div>
        </Card>
        <div className="grid gap-6">
          <Card title="Products" description="Your submitted product items.">
            <p className="text-sm text-[var(--muted)]">No products connected yet.</p>
          </Card>
          <Card title="Events" description="Your upcoming events and participation history.">
            <p className="text-sm text-[var(--muted)]">No events connected yet.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

