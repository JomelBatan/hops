import React from "react";
import SectionHeading from "./SectionHeading";
import { LayoutGrid, Rocket, Sparkles } from "lucide-react";
const steps = [
  {
    icon: LayoutGrid,
    title: "Start with a workspace",
    desc: "Create a dedicated space for every project and keep everything organized from day one.",
  },
  {
    icon: Sparkles,
    title: "Plan with confidence",
    desc: "Break projects into manageable tasks, assign priorities, and stay focused on what matters.",
  },
  {
    icon: Rocket,
    title: "Achieve your goals",
    desc: "Collaborate effortlessly, monitor progress, and bring every project across the finish line.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow="How it works"
        title="From goal to shipped in three steps"
      />
      <div className="relative mt-14">
        {/* connector path linking the three steps (desktop) */}
        <div className="pointer-events-none absolute inset-x-[16%] top-15 hidden h-px bg-linear-to-r from-transparent via-brand-300/60 to-transparent md:block" />

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-(--shadow-card) transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-soft)"
            >
              {/* ghost step number */}
              <span className="pointer-events-none absolute -right-2 -top-4 select-none font-display text-[104px] font-bold leading-none text-brand-50 transition-colors duration-300 group-hover:text-brand-100/70">
                {i + 1}
              </span>

              <div className="relative">
                <div className="brand-gradient flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-(--shadow-brand) transition-transform duration-300 group-hover:scale-[1.06]">
                  <s.icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/60">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1.5 font-display text-lg text-black font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
