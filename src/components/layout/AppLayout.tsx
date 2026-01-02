import Link from "next/link";
import { useSession } from "next-auth/react";

import LegalDisclaimer from "../LegalDisclaimer";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <LegalDisclaimer />
      <div className="flex min-h-[calc(100vh-48px)]">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white p-6 lg:flex">
          <Link href="/app/search" className="text-lg font-semibold">
            OQanoon Research
          </Link>
          <div className="mt-6 space-y-3 text-sm">
            <Link href="/app/search" className="block text-slate-700 hover:text-slate-900">
              Search
            </Link>
            <Link href="/app/chat" className="block text-slate-700 hover:text-slate-900">
              Chat & Discussions
            </Link>
            <Link href="/app/billing" className="block text-slate-700 hover:text-slate-900">
              Subscription
            </Link>
            {session?.user?.role === "ADMIN" && (
              <>
                <div className="pt-4 text-xs font-semibold uppercase text-slate-400">
                  Admin
                </div>
                <Link href="/admin" className="block text-slate-700 hover:text-slate-900">
                  Overview
                </Link>
                <Link href="/admin/ingest" className="block text-slate-700 hover:text-slate-900">
                  Ingest Content
                </Link>
                <Link
                  href="/admin/instruments"
                  className="block text-slate-700 hover:text-slate-900"
                >
                  Instruments
                </Link>
                <Link
                  href="/admin/provisions"
                  className="block text-slate-700 hover:text-slate-900"
                >
                  Provisions
                </Link>
                <Link href="/admin/mappings" className="block text-slate-700 hover:text-slate-900">
                  Mappings
                </Link>
                <Link href="/admin/import" className="block text-slate-700 hover:text-slate-900">
                  Import
                </Link>
              </>
            )}
          </div>
        </aside>
        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <div>
                <p className="text-sm text-slate-500">Welcome back</p>
                <p className="text-lg font-semibold">
                  {session?.user?.name ?? session?.user?.email ?? "Researcher"}
                </p>
              </div>
              <div className="text-xs text-slate-500">Role: {session?.user?.role ?? "USER"}</div>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
