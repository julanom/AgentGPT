import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import AppLayout from "../../../components/layout/AppLayout";
import { requireAuth } from "../../../server/requireAuth";

const NewChat: NextPage = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [contextType, setContextType] = useState("global");
  const [contextIds, setContextIds] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        contextType,
        contextIds: contextIds
          ? contextIds.split(",").map((id) => id.trim())
          : [],
      }),
    });

    const data = (await response.json()) as { thread?: { id: string } };
    setLoading(false);

    if (data.thread?.id) {
      await router.push(`/app/chat/${data.thread.id}`);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Start a new chat</h1>
          <p className="mt-2 text-sm text-slate-600">
            Provide optional context to make the discussion more specific.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="text-sm font-medium text-slate-700">Context type</label>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={contextType}
              onChange={(event) => setContextType(event.target.value)}
            >
              <option value="global">Global</option>
              <option value="article">Article</option>
              <option value="regulation">Regulation</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Linked provision IDs</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              value={contextIds}
              onChange={(event) => setContextIds(event.target.value)}
              placeholder="Optional: comma-separated provision IDs"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Message</label>
            <textarea
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm"
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask a question about the provision or regulation."
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {loading ? "Starting..." : "Start chat"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default NewChat;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const auth = await requireAuth(ctx);
  if ("redirect" in auth) {
    return auth;
  }
  return { props: {} };
};
