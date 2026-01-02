import type { NextPage } from "next";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

import PublicLayout from "../components/layout/PublicLayout";

const Login: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const result = await signIn("credentials", {
      redirect: true,
      callbackUrl: "/app/search",
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Access your legal research workspace.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Login
          </button>
        </form>
        <div className="mt-6 flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-slate-500 hover:text-slate-900">
            Forgot password?
          </Link>
          <Link href="/signup" className="font-semibold text-slate-900">
            Create account
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;
