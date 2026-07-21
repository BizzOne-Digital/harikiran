"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });
      if (error) {
        toast.error(error.message || "Invalid credentials");
        return;
      }
      toast.success("Welcome back");
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Sign in failed — check server/API",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-slate-900 shadow-xl">
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-semibold text-slate-900">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          TopAdvice4U content management
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-slate-300 bg-white text-slate-900 caret-slate-900"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-slate-300 bg-white text-slate-900 caret-slate-900"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-slate-900 text-white hover:bg-slate-800"
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
