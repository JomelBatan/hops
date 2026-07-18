import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
const avatars = ["JB", "AC", "SK", "SD"];

export default function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="relative overflow-hidden rounded-4xl border border-line bg-surface px-6 py-16 text-center  sm:py-20">
        {/* soft brand wash + faint geometry */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_22rem_at_50%_-20%,rgba(47,129,89,0.14),transparent_70%)]
"
        />

        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rotate-12 rounded-4xl border border-line" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rotate-6 rounded-3xl border border-line" />

        <div className="relative">
          <span className="inline-flex items-center text-primary gap-2 rounded-full border border-primary bg-primary/10 px-3.5 py-1.5 text-xs font-semibold ">
            <Sparkles className="h-3.5 w-3.5" /> Start in seconds
          </span>
          <h2 className="mx-auto text-black mt-6 max-w-2xl font-display text-[clamp(30px,4.5vw,50px)] font-semibold leading-[1.05] tracking-tight">
            Ready to <span className="text-gradient">ship faster?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Join teams turning goals into shipped work with an AI-native Kanban.
            Free to start.
          </p>
          <div className="mt-9 flex items-center justify-center gap-3">
            <Link href="/register">
              <button className="brand-gradient inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white shadow-(--shadow-brand) transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
                Start for free <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>

          {/* social proof */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="flex -space-x-2.5">
              {avatars.map((initials) => (
                <span
                  key={initials}
                  className="brand-gradient grid h-8 w-8 place-items-center rounded-full text-[11px] font-semibold text-white ring-2 ring-surface"
                >
                  {initials}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted">
              Loved by <span className="font-semibold text-ink">2,500+</span>{" "}
              teams
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
