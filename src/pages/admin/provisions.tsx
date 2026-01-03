import type { GetServerSideProps, NextPage } from "next";

import AppLayout from "../../components/layout/AppLayout";
import { requireAdmin } from "../../server/requireAdmin";

const Provisions: NextPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Provisions</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage articles, sections, and clauses with hierarchical numbering.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase text-slate-500">Provision list</h2>
            <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Add provision
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Use the auto-structure tool to detect “Article (1)” or “المادة (١)” numbering.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Provisions;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireAdmin(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  return { props: {} };
};
