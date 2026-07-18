import { assets } from "@/constant";
import Image from "next/image";
import Link from "next/link";
import React from "react";
const columns = [
  {
    heading: "Product",
    links: [
      ["Features", "#features"],
      ["How it works", "#how-it-works"],
      ["Built-in AI", "#ai"],
    ],
  },
  {
    heading: "Get started",
    links: [
      ["Log in", "/(auth)/login"],
      ["Create account", "/register"],
      ["Live demo", "/(auth)/login"],
    ],
  },
];

const isRoute = (href: string) => href.startsWith("/");
export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-semibold">
              <Image
                src={assets.logo}
                height={30}
                width={30}
                alt="lepus-logo"
              />

              <span className="text-lg font-bold tracking-tight text-primary">
                Lepus
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              The AI-native Kanban that turns goals into shipped work — planning
              less so your team ships more.
            </p>
          </div>

          {/* link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    {isRoute(href) ? (
                      <Link
                        href={href}
                        className="text-sm text-muted transition-colors hover:text-ink"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="text-sm text-muted transition-colors hover:text-ink"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Lepus. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
