import type { NextPage } from "next";
import Link from "next/link";

import PublicLayout from "../components/layout/PublicLayout";

const Pricing: NextPage = () => {
  return (
    <PublicLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Pricing</h1>
          <p className="mt-2 text-slate-600">
            Start with a free trial, then choose a plan that fits your research
            workload.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Monthly</h2>
            <p className="mt-2 text-3xl font-semibold">$49</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>✔ Unlimited legal search</li>
              <li>✔ 50 AI explanations per month</li>
              <li>✔ 200 chat messages per month</li>
              <li>✔ Conversation history export</li>
            </ul>
            <Link
              href="/signup"
              className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
            >
              Start Trial
            </Link>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Yearly</h2>
            <p className="mt-2 text-3xl font-semibold">$499</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>✔ Priority ingestion support</li>
              <li>✔ 600 AI explanations per year</li>
              <li>✔ 2,400 chat messages per year</li>
              <li>✔ Dedicated compliance review</li>
            </ul>
            <Link
              href="/signup"
              className="mt-6 inline-flex rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700"
            >
              Start Trial
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Pricing;
