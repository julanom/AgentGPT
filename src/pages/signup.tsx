import type { NextPage } from "next";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

import PublicLayout from "../components/layout/PublicLayout";

const Signup: NextPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const payload = (await response.json()) as { message?: string };
      setError(payload.message ?? "Unable to create account.");
      return;
    }

    await signIn("credentials", {
      redirect: true,
      callbackUrl: "/app/search",
      email,
      password,
    });
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Start free trial</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create an account to access OQanoon Research.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700">Full name</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Create account
          </button>
        </form>
        <div className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-slate-900">
            Login
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Signup;
