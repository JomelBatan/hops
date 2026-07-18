import { assets } from "@/constant";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import KanbanDemo from "../landing/KanbanDemo";

interface AuthAsideProps {
  title: string;
  subtitle: string;
}

export default function AuthSide({ title, subtitle }: AuthAsideProps) {
  return (
    <aside className="brand-gradient animate-gradient-pan relative hidden w-1/2 overflow-hidden lg:flex">
      {/* aurora mesh waves */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen">
        <div
          className="absolute left-[-15%] top-[8%] h-72 w-[70%] rounded-[50%] blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(124,214,164,0.7), transparent)",
          }}
        />
        <div
          className="absolute right-[-15%] top-[34%] h-80 w-[72%] rounded-[50%] blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(150,236,186,0.55), transparent)",
          }}
        />
        <div
          className="absolute bottom-[6%] left-1/4 h-64 w-[55%] rounded-[50%] blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(196,250,216,0.5), transparent)",
          }}
        />
      </div>

      {/* darkening tint so the white cards pop */}
      <div className="pointer-events-none absolute inset-0 bg-[#0b1f13]/10" />

      {/* soft depth glows */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-white/[0.07] blur-3xl" />

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-8 text-white">
        {/* live kanban board */}
        <KanbanDemo className="w-full max-w-2xl" />

        {/* AI chip */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" /> AI is prioritizing your backlog
        </div>

        {/* copy */}
        <div className="mt-10 max-w-sm text-center">
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight">
            {title}
          </h2>
          <p className="mt-3 leading-relaxed text-white/75">{subtitle}</p>
        </div>
      </div>
    </aside>
  );
}
