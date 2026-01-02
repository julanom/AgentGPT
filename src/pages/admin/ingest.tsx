import type { GetServerSideProps, NextPage } from "next";

import AppLayout from "../../components/layout/AppLayout";
import { requireAdmin } from "../../server/requireAdmin";

const Ingest: NextPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Ingest legal content</h1>
          <p className="mt-2 text-sm text-slate-600">
            Upload legal instruments via text, PDF, or images. OCR output is marked as draft until reviewed.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase text-slate-500">Direct text input</h2>
            <textarea
              className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              rows={10}
              placeholder="Paste legal text or upload DOCX/TXT/HTML files."
            />
            <button className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Save draft
            </button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase text-slate-500">PDF / image upload</h2>
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              Drag & drop files to extract text. Scanned documents will use OCR and require review.
            </div>
            <button className="mt-4 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
              Upload file
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase text-slate-500">Review & structure</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-100 p-4 text-sm text-slate-500">
              Original PDF/image preview (placeholder)
            </div>
            <div className="rounded-xl border border-slate-100 p-4 text-sm text-slate-500">
              Extracted editable text with auto-structure suggestions (placeholder)
            </div>
          </div>
          <button className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Approve & publish
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Ingest;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireAdmin(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  return { props: {} };
};
