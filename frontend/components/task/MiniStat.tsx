interface MiniStatProps {
  icon: React.ElementType;
  label: string;
  value: number;
  tint: string;
}

export default function MiniStat({
  icon: Icon,
  label,
  value,
  tint,
}: MiniStatProps) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-5 shadow-(--shadow-card) transition-shadow duration-300 hover:shadow-(--shadow-soft)">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-muted">
          {label}
        </span>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${tint}1a`, color: tint }}
        >
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      <p className="font-display text-4xl font-semibold tracking-tight tabular text-ink">
        {value}
      </p>
    </div>
  );
}
