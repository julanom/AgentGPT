import type { GetServerSideProps, NextPage } from "next";

import AppLayout from "../../components/layout/AppLayout";
import { requireAdmin } from "../../server/requireAdmin";

const AdminHome: NextPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin overview</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage legal content ingestion, mapping, and publishing workflows.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase text-slate-500">Content ingest</h2>
            <p className="mt-2 text-sm text-slate-600">
              Upload PDFs, images, or direct text with OCR review workflows.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase text-slate-500">Mapping editor</h2>
            <p className="mt-2 text-sm text-slate-600">
              Link law articles to executive regulation clauses with relation tags.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase text-slate-500">Publishing</h2>
            <p className="mt-2 text-sm text-slate-600">
              Review OCR drafts, approve structured provisions, and publish updates.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminHome;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireAdmin(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  return { props: {} };
};
