import type { GetServerSideProps, NextPage } from "next";

import AppLayout from "../../components/layout/AppLayout";
import { requireAdmin } from "../../server/requireAdmin";

const Mappings: NextPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Mappings</h1>
          <p className="mt-2 text-sm text-slate-600">
            Link law articles to regulation clauses with relation types.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase text-slate-500">Mapping editor</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-100 p-4 text-sm text-slate-500">
              Select source law article (placeholder)
            </div>
            <div className="rounded-xl border border-slate-100 p-4 text-sm text-slate-500">
              Select target regulation clause (placeholder)
            </div>
          </div>
          <button className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Save mapping
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Mappings;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireAdmin(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  return { props: {} };
};
