import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";

import AppLayout from "../../components/layout/AppLayout";
import { requireAuth } from "../../server/requireAuth";

type Subscription = {
  status: string;
  trialEndsAt: string | null;
  plan: { name: string; billingCycle: string } | null;
};

const Billing: NextPage = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      const response = await fetch("/api/billing/status");
      const data = (await response.json()) as { subscription: Subscription | null };
      setSubscription(data.subscription ?? null);
    };
    void loadStatus();
  }, []);

  const handleCheckout = async (plan: "monthly" | "yearly") => {
    setLoading(true);
    const response = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = (await response.json()) as { url?: string };
    if (data.url) {
      window.location.href = data.url;
    }
    setLoading(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Subscription & billing</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage your trial and subscription status.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Current status</h2>
          <div className="mt-4 text-sm text-slate-600">
            <p>Status: {subscription?.status ?? "No subscription"}</p>
            <p>Plan: {subscription?.plan?.name ?? "Trial"}</p>
            {subscription?.trialEndsAt && (
              <p>Trial ends: {new Date(subscription.trialEndsAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Monthly</h3>
            <p className="mt-2 text-sm text-slate-600">
              Keep ongoing research access with monthly billing.
            </p>
            <button
              onClick={() => handleCheckout("monthly")}
              className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              {loading ? "Redirecting..." : "Subscribe monthly"}
            </button>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Yearly</h3>
            <p className="mt-2 text-sm text-slate-600">
              Save with annual billing and priority support.
            </p>
            <button
              onClick={() => handleCheckout("yearly")}
              className="mt-4 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {loading ? "Redirecting..." : "Subscribe yearly"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Billing;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireAuth(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  return { props: {} };
};
