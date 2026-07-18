import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center bg-white">
      <p className="font-display text-8xl font-bold tracking-tight tabular text-gradient">
        404
      </p>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-black">
        Page not found
      </h1>
      <p className="max-w-sm text-muted">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <Link href="/dashboard">
        <button className="brand-gradient inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white shadow-[var(--shadow-brand)] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
          Back to Dashboard
        </button>
      </Link>
    </div>
  );
}
