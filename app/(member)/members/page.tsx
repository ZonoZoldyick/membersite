import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/Card";

const members = [
  {
    bio: "Product strategist focused on member-led launch programs.",
    name: "Airi Nakamura",
    skills: "Go-to-market, workshops",
  },
  {
    bio: "Community operator helping founders build repeatable engagement loops.",
    name: "Daichi Kondo",
    skills: "Community design, ops",
  },
  {
    bio: "Designer creating clear product stories for collaborative teams.",
    name: "Yuna Lee",
    skills: "Brand, product design",
  },
];

export default function MembersPage() {
  return (
    <div>
      <PageIntro
        title="Members"
        description="Browse the member directory and discover collaboration opportunities across the community."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {members.map((member) => (
          <Card key={member.name}>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)]">
              {member.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
              {member.name}
            </h2>
            <p className="mt-2 text-sm font-medium text-[var(--muted)]">{member.skills}</p>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{member.bio}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

