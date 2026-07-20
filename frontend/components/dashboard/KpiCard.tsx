import { ArrowUpRight } from "lucide-react";
import Sparkbars from "./Sparkbars";

interface KpiCardProps {
  label?: string;
  value?: number;
  hint?: string;
  featured?: boolean;
  trend?: number[];
  icon: React.ElementType;
}

export default function KpiCard({
  label,
  value,
  hint,
  featured = false,
  trend,
  icon: Icon,
}: KpiCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl p-5 transition-shadow duration-300
       ${
         featured
           ? "brand-gradient text-white shadow-(--shadow-brand)"
           : "border border-line bg-surface text-ink hover:shadow-(--shadow-soft)"
       }`}
    >
      {featured && (
        <>
          <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/15 blur-xl" />
          <div className="absolute -bottom-12 -left-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        </>
      )}
      <div className="relative">
        <div className="mb-7 flex items-start justify-between gap-2">
          <span
            className={`  text-[15px] font-medium
              ${featured ? "text-white/90" : "text-ink"}`}
          >
            {label}
          </span>
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl transition-colors duration-200
              ${
                featured
                  ? "bg-white/20 text-white"
                  : "bg-primary/20 text-primary/90 group-hover:bg-primary/40"
              }`}
          >
            {!!Icon ? (
              <Icon className="h-4.5 w-4.5" />
            ) : (
              <ArrowUpRight className="h-4.5 w-4.5" />
            )}
          </span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p
              className={`font-display text-[40px] font-semibold leading-none tracking-tight ${featured ? "text-white" : "text-black"}`}
            >
              {value}
            </p>
            {hint && (
              <p
                className={`mt-3 text-xs ${featured ? "text-white/75" : "text-muted"}`}
              >
                {hint}
              </p>
            )}
          </div>
          {trend && trend.length >= 2 && (
            <Sparkbars data={trend} featured={featured} />
          )}
        </div>
      </div>
    </div>
  );
}
