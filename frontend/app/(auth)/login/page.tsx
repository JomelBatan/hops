"use client";
import AuthSide from "@/components/auth/AuthSide";
import Button from "@/components/ui/Button";
import { Input, PasswordInput } from "@/components/ui/Input";
import { assets } from "@/constant";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";

interface FormProps {
  email: string;
  password: string;
}
export default function Login() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<FormProps>({ email: "", password: "" });

  const fillDemo = () =>
    setForm({ email: "jomelbatan6@hops.com", password: "Test@1234" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await login(form);
    } catch {}
  }
  return (
    <div className="flex min-h-screen bg-white">
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
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              Log in to your workspace.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
                placeholder="••••••••"
                autoComplete="current-password"
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
                Log in
              </Button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-muted">
            New here?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-brand-500"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
      <AuthSide
        title="Welcome back to Flowboard"
        subtitle="Log in and pick up right where you and your team left off."
      />
    </div>
  );
}
