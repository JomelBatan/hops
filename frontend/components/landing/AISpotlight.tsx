import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
const aiPoints = [
  "Plan every project from start to finish",
  "Stay organized with tasks, deadlines, and priorities",
  "Collaborate seamlessly and keep work moving forward",
];

const mockTasks = [
  { title: "Define project goals", tag: "High", color: "#ea580c" },
  { title: "Assign team members", tag: "Urgent", color: "#e11d48" },
  { title: "Review project timeline", tag: "Medium", color: "#d97706" },
  { title: "Prepare final report", tag: "Low", color: "#00FF00" },
];
export default function AISpotlight() {
  return (
    <section id="ai" className="scroll-mt-24">
      <div className="brand-gradient animate-gradient-pan relative overflow-hidden py-20 text-white sm:py-28">
        {/* drifting ambient glows */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          {/* copy */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Built-in AI
            </p>
            <h2 className="mt-3 font-display text-[clamp(26px,3.4vw,40px)] font-semibold leading-[1.08] tracking-tight">
              Let AI handle the details
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-white/80">
              Generate project plans, organize tasks, and create progress
              summaries automatically while you stay focused on achieving your
              goals.
            </p>
            <ul className="mt-7 space-y-3.5">
              {aiPoints.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/15">
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="text-[15px] text-white/90">{p}</span>
                </li>
              ))}
            </ul>
            <Link href="/register" className="mt-8 inline-block">
              <button className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-primary/70 shadow-[var(--shadow-card)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.97]">
                Try it free <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>

          {/* mock UI */}
          <div className="relative">
            <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 p-2.5">
                <Sparkles className="h-4 w-4 shrink-0 text-white/80" />
                <span className="flex-1 truncate text-sm text-white/90">
                  Build an e-commerce checkout flow
                </span>
                <span className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-primary/70">
                  Generate
                </span>
              </div>
              <p className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/55">
                Generated tasks
              </p>
              <div className="space-y-2">
                {mockTasks.map((t, i) => (
                  <div
                    key={t.title}
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2.5"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="flex-1 truncate text-sm text-white/90">
                      {t.title}
                    </span>
                    <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70">
                      {t.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
