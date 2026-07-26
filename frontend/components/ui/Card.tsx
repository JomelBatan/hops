import React from "react";

interface CardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function Card({ title, description, children }: CardProps) {
  return (
    <section className="rounded-3xl border border-line bg-surface p-6 shadow-(--shadow-card)">
      <h3 className="font-display text-black text-sm font-semibold tracking-tight">
        {title}
      </h3>
      {description && <p className="mt-1 text-xs text-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
