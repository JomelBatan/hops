"use client";
import AuthSide from "@/components/auth/AuthSide";
import Button from "@/components/ui/Button";
import { Input, PasswordInput } from "@/components/ui/Input";
import { assets } from "@/constant";
import { useAuth } from "@/context/AuthContext";
import { RegisterPayload } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const { register, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<RegisterPayload>({
    name: "",
    email: "",
    password: "",
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    try {
      await register(form);
    } catch {}
  }
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full items-center justify-center px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-sm animate-in">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2.5 font-semibold"
          >
            <Image src={assets.logo} height={30} width={30} alt="lepus-logo" />

            <span className="text-lg font-bold tracking-tight text-primary">
              Lepus
            </span>
          </Link>

          <div className="card rounded-3xl p-8 shadow-(--shadow-soft)">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-black">
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Start managing projects with AI.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <Input
                id="name"
                label="Full name"
                placeholder="John Doe"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <PasswordInput
                id="password"
                label="Password"
                placeholder="At least 6 characters"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={loading}
              >
                Create account
              </Button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-600 hover:text-brand-500"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
      <AuthSide
        title="Start shipping with AI"
        subtitle="Join 2,500+ teams turning one-line goals into shipped work."
      />
    </div>
  );
}
