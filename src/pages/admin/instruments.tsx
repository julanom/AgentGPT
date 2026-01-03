import type { GetServerSideProps, NextPage } from "next";

import AppLayout from "../../components/layout/AppLayout";
import { requireAdmin } from "../../server/requireAdmin";

const Instruments: NextPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Instruments</h1>
          <p className="mt-2 text-sm text-slate-600">
            Create and manage laws, regulations, and decisions.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase text-slate-500">Instrument list</h2>
            <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Add instrument
            </button>
          </div>
          <div className="mt-4 text-sm text-slate-500">
            Use the import tool or manual entry to manage instruments.
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Instruments;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireAdmin(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  return { props: {} };
};
