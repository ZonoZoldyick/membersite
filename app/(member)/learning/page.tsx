import { PageIntro } from "@/components/layout/PageIntro";
import { Card } from "@/components/ui/Card";

const courses = [
  {
    access: "Normal",
    title: "Community Basics",
    type: "Documents + Lessons",
  },
  {
    access: "Gold",
    title: "Growth Systems",
    type: "Video Course",
  },
  {
    access: "Platinum",
    title: "Strategic Partnerships",
    type: "Advanced Program",
  },
];

export default function LearningPage() {
  return (
    <div>
      <PageIntro
        title="Learning"
        description="Educational content organized for tier-based access, with room for future course and lesson expansion."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.title}>
            <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]">
              {course.access}
            </span>
            <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
              {course.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{course.type}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

