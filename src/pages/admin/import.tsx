import type { GetServerSideProps, NextPage } from "next";

import AppLayout from "../../components/layout/AppLayout";
import { requireAdmin } from "../../server/requireAdmin";

const Import: NextPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Bulk import</h1>
          <p className="mt-2 text-sm text-slate-600">
            Import instruments and provisions using CSV or JSON templates.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase text-slate-500">Upload files</h2>
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
            Drop CSV/JSON files here for bulk import.
          </div>
          <button className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Process import
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Import;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireAdmin(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  return { props: {} };
};
