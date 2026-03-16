type AvatarProps = {
  imageUrl?: string | null;
  name: string;
  size?: "lg" | "md" | "sm";
};

const sizeClasses = {
  lg: "h-14 w-14 text-base rounded-2xl",
  md: "h-11 w-11 text-sm rounded-2xl",
  sm: "h-9 w-9 text-xs rounded-xl",
} as const;

export function Avatar({ imageUrl, name, size = "md" }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClasses[size]} object-cover`}
      />
    );
  }

  return (
    <div
      aria-label={name}
      className={`inline-flex items-center justify-center bg-[var(--primary)] font-semibold text-[var(--primary-foreground)] ${sizeClasses[size]}`}
    >
      {initials || "MS"}
    </div>
  );
}

