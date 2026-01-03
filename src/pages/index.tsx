import type { NextPage } from "next";
import Link from "next/link";

import PublicLayout from "../components/layout/PublicLayout";

const Home: NextPage = () => {
  return (
    <PublicLayout>
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-200 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Legal Research & Interpretation System
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            OQanoon Research brings authoritative legal texts, regulations, and
            AI-assisted summaries together in one trusted workspace.
          </h1>
          <p className="text-lg text-slate-600">
            Search official laws, follow every executive regulation link, and
            generate structured explanations that remain strictly educational
            and citation-based.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/signup"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
            >
              Start Free Trial
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700"
            >
              Login
            </Link>
          </div>
          <div className="grid gap-6 pt-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Verified legal sources</h3>
              <p className="mt-2 text-sm text-slate-600">
                Official texts are stored verbatim with audit-ready citations.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Structured explanations</h3>
              <p className="mt-2 text-sm text-slate-600">
                Plain-meaning summaries and obligations with inline citations.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold">Conversation history</h3>
              <p className="mt-2 text-sm text-slate-600">
                Maintain searchable, exportable chat logs per provision.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="mt-4 space-y-4 text-sm text-slate-600">
            <li>
              <span className="font-semibold text-slate-800">1.</span> Admins
              ingest laws and regulations via text, PDF, or OCR pipelines.
            </li>
            <li>
              <span className="font-semibold text-slate-800">2.</span> Every
              article is linked to executive regulations and related instruments.
            </li>
            <li>
              <span className="font-semibold text-slate-800">3.</span> Users
              generate structured explanations and chat with citations.
            </li>
          </ol>
          <div className="mt-6 rounded-2xl bg-slate-900 p-4 text-white">
            <h3 className="text-sm font-semibold">Compliance first</h3>
            <p className="mt-2 text-sm text-slate-200">
              The platform never provides legal advice and always encourages
              consultation with licensed counsel for case-specific matters.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default Home;
