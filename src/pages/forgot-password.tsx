import type { NextPage } from "next";
import Link from "next/link";
import { useState } from "react";

import PublicLayout from "../components/layout/PublicLayout";

const ForgotPassword: NextPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <PublicLayout>
      <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Reset password</h1>
        <p className="mt-2 text-sm text-slate-600">
          We'll email you a secure reset link.
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
          <button
            type="submit"
            className="w-full rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Send reset link
          </button>
        </form>
        {sent && (
          <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
            If an account exists for {email}, you'll receive a reset email shortly.
          </p>
        )}
        <div className="mt-6 text-sm text-slate-600">
          Return to{" "}
          <Link href="/login" className="font-semibold text-slate-900">
            login
          </Link>
          .
        </div>
      </div>
    </PublicLayout>
  );
};

export default ForgotPassword;
