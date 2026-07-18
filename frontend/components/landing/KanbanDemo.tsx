"use client";
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
const CARDS: Record<number, Task> = {
  1: { id: 1, title: "Design checkout UI", color: "#0ea5e9" },
  2: { id: 2, title: "Integrate Stripe payments", color: "#d97706" },
  3: { id: 3, title: "Real-time presence", color: "#e11d48" },
  4: { id: 4, title: "Ship sprint summary", color: "#2f8159" },
  5: { id: 5, title: "Write API tests", color: "#8b5cf6" },
  6: { id: 6, title: "Auth & onboarding", color: "#0ea5e9" },
};

const COLUMNS = ["Todo", "In progress", "Done"];

const initialBoard = {
  Todo: [3, 6],
  "In progress": [1, 2],
  Done: [4, 5],
};

const themes = {
  dark: {
    column: "bg-white/[0.08] ring-1 ring-inset ring-white/10 backdrop-blur-sm",
    header: "text-white/85",
    count: "bg-white/15 text-white/75",
  },
  light: {
    column: "bg-surface-2 ring-1 ring-inset ring-line",
    header: "text-ink",
    count: "bg-elevated text-muted",
  },
};

interface KanbanDemoProps {
  className: string;
  theme?: "light" | "dark";
}

type Column = (typeof COLUMNS)[number];

interface Task {
  id: number;
  title: string;
  color: string;
}

type Board = Record<Column, number[]>;
export default function KanbanDemo({
  className = "",
  theme = "dark",
}: KanbanDemoProps) {
  const t = themes[theme] ?? themes.dark;
  const [board, setBoard] = useState<Board>(initialBoard);
  const [movingId, setMovingId] = useState<number | null>(null);
  const boardRef = useRef<Board>(initialBoard);
  const sourceRef = useRef<number>(0);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  useEffect(() => {
    if (movingId == null) return undefined;
    const t = setTimeout(() => setMovingId(null), 700);
    return () => clearTimeout(t);
  }, [movingId]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const prev: Board = boardRef.current;

      let sourceIndex = sourceRef.current;
      let guard = 0;

      while (
        prev[COLUMNS[sourceIndex]].length === 0 &&
        guard < COLUMNS.length
      ) {
        sourceIndex = (sourceIndex + 1) % COLUMNS.length;
        guard++;
      }

      const sourceColumn = COLUMNS[sourceIndex];

      if (prev[sourceColumn].length === 0) return;

      const destinationColumn = COLUMNS[(sourceIndex + 1) % COLUMNS.length];

      const movingTask = prev[sourceColumn][0];

      const next: Board = {
        ...prev,
        [sourceColumn]: prev[sourceColumn].slice(1),
        [destinationColumn]: [...prev[destinationColumn], movingTask],
      };

      sourceRef.current = (sourceIndex + 1) % COLUMNS.length;
      boardRef.current = next;

      setBoard(next);
      setMovingId(movingTask);
    }, 2200);

    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    if (movingId == null) return;

    const card = cardRefs.current[movingId];

    if (!card) return;

    gsap.killTweensOf(card);

    gsap.fromTo(
      card,
      {
        scale: 0.9,
        y: 20,
        opacity: 0.7,
        rotate: -2,
        zIndex: 20,
      },
      {
        scale: 1,
        y: 0,
        opacity: 1,
        rotate: 0,
        duration: 0.65,
        ease: "back.out(2)",
      },
    );

    gsap.fromTo(
      card,
      {
        boxShadow: "0 0 0 rgba(0,0,0,0)",
      },
      {
        boxShadow: "0 24px 60px rgba(0,0,0,.22)",
        duration: 0.4,
        yoyo: true,
        repeat: 1,
      },
    );
    gsap
      .timeline()
      .to(card, {
        scale: 1.06,
        y: -12,
        rotate: -3,
        duration: 0.18,
        ease: "power2.out",
      })
      .to(card, {
        scale: 1,
        y: 0,
        rotate: 0,
        duration: 0.45,
        ease: "bounce.out",
      });
  }, [movingId]);
  return (
    <div>
      <div className={`grid grid-cols-3 gap-3.5 ${className}`}>
        {COLUMNS.map((col) => (
          <div key={col} className={`rounded-2xl p-3 ${t.column}`}>
            <div className="mb-2.5 flex items-center justify-between px-1.5 pt-0.5">
              <span className={`text-xs font-semibold ${t.header}`}>{col}</span>
              <span
                className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-semibold ${t.count}`}
              >
                {board[col].length}
              </span>
            </div>
            <div className="flex h-94 flex-col gap-2.5">
              {board[col].map((id) => {
                const card = CARDS[id];
                const isMoving = id === movingId;
                return (
                  <div key={id}>
                    <div
                      ref={(el) => {
                        cardRefs.current[id] = el;
                      }}
                      className={`rounded-xl border border-line bg-surface p-3 text-left ${
                        isMoving
                          ? "relative z-10 shadow-(--shadow-lift) ring-2 ring-brand-300"
                          : "shadow-(--shadow-card)"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className="mt-1 h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: card.color }}
                        />
                        <span className="line-clamp-2 text-[13px] font-medium leading-snug text-ink text-black">
                          {card.title}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="h-1.5 w-10 rounded-full bg-light-blue/30" />
                        <span className="brand-gradient h-5 w-5 rounded-full ring-2 ring-surface" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
