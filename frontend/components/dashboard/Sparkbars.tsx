interface SparkbarsProps {
  data: number[];
  featured: boolean;
}

export default function Sparkbars({ data, featured }: SparkbarsProps) {
  const bars = data.slice(-11);
  const max = Math.max(1, ...bars);
  const peak = Math.max(...bars);
  return (
    <div className="flex h-10 items-end gap-0.75" aria-hidden="true">
      {bars.map((v, i) => (
        <span
          key={i}
          className={`w-1.5 rounded-full
            ${
              featured
                ? "bg-white/45"
                : v === peak
                  ? "bg-brand-500"
                  : "bg-brand-300"
            }`}
          style={{ height: `${Math.max((v / max) * 100, 14)}%` }}
        />
      ))}
    </div>
  );
}
