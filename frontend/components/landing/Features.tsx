import React from "react";
import DrawIcon from "./DrawIcon";
import {
  FolderKanban,
  CheckSquare,
  Users,
  CalendarDays,
  Bell,
  Sparkles,
} from "lucide-react";
import SectionHeading from "./SectionHeading";
const flagship = {
  icon: Sparkles,
  title: "AI Task Generation",
  desc: "Describe a goal in one line and watch a prioritized, ready-to-refine backlog appear in seconds.",
};

const features = [
  {
    icon: FolderKanban,
    title: "Project Workspaces",
    desc: "Organize projects into dedicated workspaces with everything in one place.",
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    desc: "Create tasks, assign responsibilities, and track progress with ease.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Work together seamlessly with shared boards, comments, and updates.",
  },
  {
    icon: CalendarDays,
    title: "Deadlines & Planning",
    desc: "Stay on schedule with due dates, milestones, and project timelines.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Receive timely updates so you never miss important changes or deadlines.",
  },
];

// mock tasks shown inside the flagship tile
const genTasks = [
  ["Set up referral rewards", "#0ea5e9"],
  ["Build the invite flow", "#2f8159"],
  ["Track conversions", "#d97706"],
];
export default function Features() {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow="Features"
        title="Bring every project together"
        sub="Manage tasks, collaborate with your team, and keep every project moving without the clutter."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-fr">
        {/* ── flagship tile ─────────────────────────────────────────────── */}
        <div className="brand-gradient group relative flex flex-col overflow-hidden rounded-3xl p-8 text-white shadow-(--shadow-lift) sm:col-span-2 lg:row-span-2">
          {/* ambient glows */}
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex h-full flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Built-in AI
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 ring-1 ring-inset ring-white/20">
                <DrawIcon
                  icon={flagship.icon}
                  className="h-5.5 w-5.5"
                  baseClassName="text-white/35"
                />
              </span>
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                {flagship.title}
              </h3>
            </div>
            <p className="mt-4 max-w-md leading-relaxed text-white/80">
              {flagship.desc}
            </p>

            {/* live mock — goal → generated tasks */}
            <div className="mt-auto pt-8">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/10 px-3 py-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-white/80" />

                  <span className="flex-1 truncate text-sm text-white/90">
                    Launch a referral program
                  </span>
                  <span className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-primary">
                    Generate
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {genTasks.map(([title, color], i) => (
                    <div
                      key={title}
                      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.07] px-3 py-2.5"
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="flex-1 truncate text-sm text-white/90">
                        {title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── supporting cards ──────────────────────────────────────────── */}
        {features.map((f, i) => (
          <div
            key={f.title}
            className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-7 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[var(--shadow-soft)]"
          >
            {/* glow that blooms from behind the icon on hover */}
            <div className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-brand-500/[0.08] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary/50 ring-1 ring-inset ring-primary/60">
                <DrawIcon icon={f.icon} className="h-5.5 w-5.5" />
              </div>
              <h3 className="font-display text-base font-semibold tracking-tight text-black">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
