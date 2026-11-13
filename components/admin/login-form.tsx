"use client";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (!result?.ok) {
        setError("The email or password is incorrect. Please try again.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("We could not sign you in. Please check your connection and try again.");
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-4xl bg-white p-5 sm:p-8 shadow-soft">
      <span className="eyebrow">Practice administration</span>
      <h1 className="display-title mt-4 text-4xl">Welcome back</h1>
      <p className="mt-3 text-sm text-ink/55">Sign in to manage appointment requests and website content.</p>
      <label className="mt-8 block text-sm font-bold">
        Email
        <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required className="focus-ring mt-2 h-14 w-full rounded-2xl border border-ink/10 px-4 font-normal" />
      </label>
      <label className="mt-4 block text-sm font-bold">
        Password
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="focus-ring mt-2 h-14 w-full rounded-2xl border border-ink/10 px-4 font-normal" />
      </label>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
      <Button type="submit" className="mt-6 w-full" disabled={loading}>
        {loading && <Loader2 size={18} className="mr-2 animate-spin" />} Sign in
      </Button>
    </form>
  );
}
