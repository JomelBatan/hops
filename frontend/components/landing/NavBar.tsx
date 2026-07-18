"use client";
import { assets } from "@/constant";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { title: "Features", href: "#features" },
  { title: "How it works", href: "#how-it-works" },
  { title: "AI", href: "#ai" },
];
export default function NavBar() {
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ease-spring ${
        scrolled ? "px-3 pt-3 sm:px-4" : "glass"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-300 ease-spring ${
          scrolled
            ? "glass mt-3 max-w-5xl rounded-full border border-line px-5 py-2.5 "
            : "max-w-6xl px-6 py-3.5"
        }`}
      >
        <Link href={"/"} className="flex items-center gap-2.5 font-semibold">
          <Image src={assets.logo} height={30} width={0} alt="lepus-logo" />

          <span className="text-lg font-bold tracking-tight text-primary">
            Lepus
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((nav) => (
            <a
              key={nav.href}
              href={nav.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
            >
              {nav.title}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={"/login"}>
            <button
              className="rounded-full px-3.5 py-2 text-sm font-medium cursor-pointer
            text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
            >
              Login
            </button>
          </Link>

          <Link href={"/register"}>
            <button className="cursor-pointer rounded-full px-3.5 py-2 text-sm font-medium text-white bg-linear-120 from-midnight-blue via-blue to-light-blue  ">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
