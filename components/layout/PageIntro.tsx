type PageIntroProps = {
  description: string;
  eyebrow?: string;
  title: string;
};

export function PageIntro({
  description,
  eyebrow = "membersite",
  title,
}: PageIntroProps) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)] md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] md:text-base">
        {description}
      </p>
    </div>
  );
}

