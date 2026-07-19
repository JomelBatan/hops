import React, { ElementType } from "react";

interface SectionTitleProps {
  icon: ElementType;
  children?: React.ReactNode;
  hint?: string;
}

export default function SectionTitle({
  icon: Icon,
  children,
  hint = "",
}: SectionTitleProps) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-500">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <h3 className="font-display text-sm font-semibold tracking-tight">
          {children}
        </h3>
        {hint && <p className="truncate text-[11px] text-faint">{hint}</p>}
      </div>
    </div>
  );
}
