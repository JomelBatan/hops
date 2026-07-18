import React from "react";

interface SectionHeading {
  eyebrow: string;
  title: string;
  sub?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  sub,
}: SectionHeading) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-[11px] text-primary font-semibold uppercase tracking-[0.18em] text-brand-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-[clamp(28px,4vw,44px)] text-black font-semibold leading-[1.08] tracking-tight">
        {title}
      </h2>
      {sub && <p className="mt-4 text-lg leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}
